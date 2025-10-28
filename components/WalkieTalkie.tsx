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
      // Convert blob to file
      const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });

      const formData = new FormData();
      formData.append('audio', audioFile);
      formData.append('context', JSON.stringify(messages.map((m) => ({ role: m.role, content: m.content }))));

      // Send to voice stream API
      const response = await fetch('/api/voice/stream', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Add user message
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            content: data.userText,
            timestamp: new Date(),
          },
        ]);

        // Add AI message
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.aiResponse,
            timestamp: new Date(),
          },
        ]);

        // Play AI response
        await playResponse(data.aiResponse);
      }
    } catch (err) {
      console.error('Voice processing error:', err);
      alert('Failed to process voice');
    } finally {
      setIsProcessing(false);
    }
  };

  const playResponse = async (text: string) => {
    setIsPlaying(true);

    try {
      // Get TTS stream from ElevenLabs
      const response = await fetch(`/api/voice/stream?text=${encodeURIComponent(text)}`);

      if (!response.ok) {
        throw new Error('TTS failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err) {
      console.error('Audio playback error:', err);
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
              <span className="button-text">Processing...</span>
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
