'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Mic, Volume2, Code2, StopCircle } from 'lucide-react';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: Date;
  code?: {
    language: string;
    content: string;
  };
}

interface ChatWindowProps {
  chatId?: string;
}

export default function ChatWindowEnhanced({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'current-user'); // Replace with actual user ID

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessages((m) => [
          ...m,
          {
            role: 'user',
            text: `Uploaded file: ${data.fileName}`,
            timestamp: new Date(),
          },
          {
            role: 'assistant',
            text: `File uploaded successfully!\n\n${data.extractedText}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error('File upload error:', err);
    }
  };

  // Voice Recording (STT)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const response = await fetch('/api/voice/stt', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          if (data.success) {
            setInput(data.text);
          }
        } catch (err) {
          console.error('STT error:', err);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Text-to-Speech
  const speakMessage = async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  // Check for code generation commands
  const checkForCodeCommand = (text: string): boolean => {
    const codeKeywords = [
      '/code',
      'generate code',
      'write code',
      'create a function',
      'write a script',
    ];
    return codeKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword)
    );
  };

  // Send Message
  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMessage: Message = {
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((m) => [...m, newMessage]);
    setInput('');
    setLoading(true);

    try {
      // Check if it's a code generation request
      if (checkForCodeCommand(userText)) {
        const codeResponse = await fetch('/api/tools/code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate',
            prompt: userText,
            language: 'javascript',
          }),
        });

        const codeData = await codeResponse.json();

        if (codeData.success) {
          setMessages((m) => [
            ...m,
            {
              role: 'assistant',
              text: 'Here\'s the code I generated:',
              code: {
                language: codeData.language,
                content: codeData.code,
              },
              timestamp: new Date(),
            },
          ]);
          setLoading(false);
          return;
        }
      }

      // Regular chat
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            text: 'Error from server: ' + txt,
            timestamp: new Date(),
          },
        ]);
        setLoading(false);
        return;
      }

      const json = await resp.json();
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: json.text || 'No response',
          timestamp: new Date(),
        },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'Connection error: ' + (e?.message || String(e)),
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-window">
      {/* Messages Area */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <Image
              src="https://i.imgur.com/ganVqpV.png"
              alt="SaintSal Logo"
              width={120}
              height={120}
              className="welcome-logo-img"
            />
            <h1 className="welcome-title">Welcome to SaintSal</h1>
            <p className="welcome-subtitle">
              Your divine AI co-founder with Code Agent, Voice, and File Processing
            </p>
            <div className="welcome-suggestions">
              <button
                className="suggestion-btn"
                onClick={() => setInput('Generate code for a React component')}
              >
                <Code2 size={16} /> Generate Code
              </button>
              <button
                className="suggestion-btn"
                onClick={() => setInput('What can you help me with?')}
              >
                What can you do?
              </button>
              <button
                className="suggestion-btn"
                onClick={() => setInput('Help me build an API')}
              >
                Help me build something
              </button>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'assistant' ? (
                    <div className="avatar-assistant" />
                  ) : (
                    <div className="avatar-user">You</div>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>

                  {msg.code && (
                    <div className="message-code-block">
                      <div className="code-block-header">
                        <span className="code-language">{msg.code.language}</span>
                        <button
                          className="code-copy-btn"
                          onClick={() => navigator.clipboard.writeText(msg.code!.content)}
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="code-content">
                        <code>{msg.code.content}</code>
                      </pre>
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <button
                      className="message-action-btn"
                      onClick={() => speakMessage(msg.text)}
                      disabled={isSpeaking}
                      title="Speak this message"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message-row assistant">
                <div className="message-avatar">
                  <div className="avatar-assistant" />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept=".pdf,.png,.jpg,.jpeg,.txt,.json,.csv"
          />

          <button
            className="input-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload file"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message SaintSal... (try '/code' for code generation)"
            rows={1}
            disabled={loading}
          />

          <button
            className={`input-icon-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>

          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="input-footer">
          SaintSal can make mistakes. Please verify important information.
        </div>
      </div>
    </div>
  );
}
