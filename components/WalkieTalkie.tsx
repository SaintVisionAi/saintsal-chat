'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Loader2, Radio } from 'lucide-react';
import VoiceVisualizer from './VoiceVisualizer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function WalkieTalkie() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Setup audio context for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start visualization
      visualizeAudio();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoice(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const animate = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255); // Normalize to 0-1

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const processVoice = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Step 1: Speech-to-Text
      console.log('🎤 [WALKIE] Starting speech-to-text...');
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioFile);

      const sttResponse = await fetch('/api/voice/stt', {
        method: 'POST',
        body: formData,
      });

      const sttData = await sttResponse.json();

      if (!sttData.success) {
        throw new Error('Speech-to-text failed');
      }

      const userText = sttData.text;
      console.log('✅ [WALKIE] STT complete:', userText);

      // Add user message and get the new index
      let assistantMessageIndex = 0;
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          {
            role: 'user' as const,
            content: userText,
            timestamp: new Date(),
          },
          {
            role: 'assistant' as const,
            content: '',
            timestamp: new Date(),
          },
        ];
        assistantMessageIndex = newMessages.length - 1;
        return newMessages;
      });

      // Step 2: Get streaming AI response
      console.log('💬 [WALKIE] Starting chat streaming...');
      setIsProcessing(false);
      setIsPlaying(true);

      // Stream response from chat API
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          stream: true,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('Chat API failed');
      }

      const reader = chatResponse.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                console.error('❌ [WALKIE] Chat error:', parsed.error);
                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (newMessages[assistantMessageIndex]) {
                    newMessages[assistantMessageIndex] = {
                      ...newMessages[assistantMessageIndex],
                      content: parsed.error,
                    };
                  }
                  return newMessages;
                });
                setIsPlaying(false);
                return;
              }

              if (parsed.done) {
                console.log('✅ [WALKIE] Streaming complete, playing TTS...');
                // Streaming complete - play TTS
                if (fullResponse) {
                  await playResponse(fullResponse);
                }
                setIsPlaying(false);
                return;
              }

              if (parsed.token) {
                fullResponse += parsed.token;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (newMessages[assistantMessageIndex]) {
                    newMessages[assistantMessageIndex] = {
                      ...newMessages[assistantMessageIndex],
                      content: (newMessages[assistantMessageIndex].content || '') + parsed.token,
                    };
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('❌ [WALKIE] Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('❌ [WALKIE] Voice processing error:', err);
      alert(`Failed to process voice: ${err}`);
      setIsProcessing(false);
      setIsPlaying(false);
    }
  };

  const playResponse = async (text: string) => {
    console.log('[WALKIE-TTS] 🎤 Starting TTS for text:', text.substring(0, 50) + '...');
    try {
      // Get TTS audio from ElevenLabs
      console.log('[WALKIE-TTS] 📡 Calling /api/elevenlabs/tts...');
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      console.log('[WALKIE-TTS] 📊 API response status:', response.status);
      console.log('[WALKIE-TTS] 📋 Content-Type:', response.headers.get('Content-Type'));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[WALKIE-TTS] ❌ API error:', errorText);
        throw new Error('TTS API failed: ' + errorText);
      }

      const audioBlob = await response.blob();
      console.log('[WALKIE-TTS] 🎵 Audio blob received - Size:', audioBlob.size, 'bytes, Type:', audioBlob.type);

      if (audioBlob.size === 0) {
        throw new Error('Received empty audio blob');
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('[WALKIE-TTS] 🔗 Audio URL created:', audioUrl.substring(0, 50));

      // Play audio
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;
      console.log('[WALKIE-TTS] 🔊 Audio element created');

      audio.onended = () => {
        console.log('[WALKIE-TTS] ✅ Audio playback ended');
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.error('[WALKIE-TTS] ❌ Audio element error:', e);
        alert('Audio playback error - check console for details');
        setIsPlaying(false);
      };

      console.log('[WALKIE-TTS] ▶️ Attempting to play audio...');
      await audio.play();
      console.log('[WALKIE-TTS] 🎉 Audio playback started successfully!');
    } catch (err) {
      console.error('[WALKIE-TTS] 💥 Audio playback error:', err);
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert('TTS Error: ' + errorMsg + '\n\nCheck browser console for details.');
      setIsPlaying(false);
    }
  };

  const handlePressStart = () => {
    if (!isProcessing && !isPlaying) {
      startRecording();
    }
  };

  const handlePressEnd = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  return (
    <div className="walkie-talkie-container">
      <div className="walkie-talkie-header">
        <Radio className="text-gold" size={28} />
        <div>
          <h2 className="walkie-talkie-title">SaintSal™ Walkie Talkie</h2>
          <p className="walkie-talkie-subtitle">Press and hold to talk</p>
        </div>
      </div>

      {/* Conversation History */}
      <div className="walkie-talkie-messages">
        {messages.length === 0 ? (
          <div className="walkie-talkie-empty">
            <Mic className="text-gold" size={48} />
            <p className="empty-text">Press the button below to start talking</p>
            <p className="empty-hint">Real-time voice-to-voice AI conversation</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`walkie-message ${msg.role}`}>
              <div className="walkie-message-icon">
                {msg.role === 'user' ? <Mic size={16} /> : <Volume2 size={16} />}
              </div>
              <div className="walkie-message-content">
                <span className="walkie-message-role">{msg.role === 'user' ? 'You' : 'SaintSal™'}</span>
                <p className="walkie-message-text">{msg.content}</p>
                <span className="walkie-message-time">{msg.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Status Indicator */}
      <div className="walkie-talkie-status">
        {isRecording && (
          <div className="status-indicator recording">
            <div className="status-dot pulse"></div>
            <span>Recording...</span>
          </div>
        )}
        {isProcessing && (
          <div className="status-indicator processing">
            <Loader2 className="spin" size={16} />
            <span>Processing...</span>
          </div>
        )}
        {isPlaying && (
          <div className="status-indicator playing">
            <Volume2 size={16} />
            <span>Playing response...</span>
          </div>
        )}
      </div>

      {/* Walkie Talkie Button */}
      <div className="walkie-talkie-button-container">
        {/* Voice Visualizer - Pulsating Wave Animation */}
        <VoiceVisualizer
          isActive={isRecording || isProcessing || isPlaying}
          type={isRecording ? 'recording' : isPlaying ? 'listening' : 'processing'}
        />

        {/* Audio Level Visualization */}
        {isRecording && (
          <div className="audio-level-ring" style={{ opacity: audioLevel }}>
            <div className="level-ring ring-1"></div>
            <div className="level-ring ring-2"></div>
            <div className="level-ring ring-3"></div>
          </div>
        )}

        {/* Cookin' Knowledge Logo Pulsating Animation - When AI is Thinking/Speaking */}
        {(isProcessing || isPlaying) && (
          <div className="cookin-logo-pulse">
            <img
              src="https://image2url.com/images/1761721248098-5fa26a0f-2749-420e-9c93-982f257e4b9e.png"
              alt="Cookin' Knowledge"
              className="cookin-logo-animated"
            />
          </div>
        )}

        <button
          className={`walkie-talkie-button ${isRecording ? 'recording' : ''} ${isProcessing || isPlaying ? 'disabled' : ''}`}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          disabled={isProcessing || isPlaying}
        >
          {isRecording ? (
            <>
              <Mic size={48} />
              <span className="button-text">Release to Send</span>
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="spin" size={48} />
              <span className="button-text">Cookin' Your Answer...</span>
            </>
          ) : isPlaying ? (
            <>
              <Volume2 size={48} />
              <span className="button-text">Listening...</span>
            </>
          ) : (
            <>
              <Radio size={48} />
              <span className="button-text">Hold to Talk</span>
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="walkie-talkie-instructions">
        <div className="instruction-item">
          <span className="instruction-number">1</span>
          <span>Press and hold the button</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-number">2</span>
          <span>Speak your message</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-number">3</span>
          <span>Release to send and hear response</span>
        </div>
      </div>
    </div>
  );
}
