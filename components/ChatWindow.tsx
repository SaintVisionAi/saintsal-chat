'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: Date;
}

interface ChatWindowProps {
  chatId?: string;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const newMessage: Message = { role: 'user', text: userText, timestamp: new Date() };

    setMessages((m) => [...m, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        setMessages((m) => [
          ...m,
          { role: 'assistant', text: 'Error from server: ' + txt, timestamp: new Date() },
        ]);
        setLoading(false);
        return;
      }

      const json = await resp.json();
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: json.text || 'No response', timestamp: new Date() },
      ]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: 'Connection error: ' + (e?.message || String(e)), timestamp: new Date() },
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
            <div className="welcome-logo" />
            <h1 className="welcome-title">Welcome to SaintSal</h1>
            <p className="welcome-subtitle">
              Your divine AI co-founder. Ask me anything or start a conversation.
            </p>
            <div className="welcome-suggestions">
              <button className="suggestion-btn" onClick={() => setInput("What can you help me with?")}>
                What can you help me with?
              </button>
              <button className="suggestion-btn" onClick={() => setInput("Tell me about your capabilities")}>
                Tell me about your capabilities
              </button>
              <button className="suggestion-btn" onClick={() => setInput("Help me build something")}>
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
          <button className="input-icon-btn" title="Attach file">
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message SaintSal..."
            rows={1}
            disabled={loading}
          />

          <button className="input-icon-btn" title="Voice input">
            <Mic size={20} />
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
