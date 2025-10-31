'use client';
import React, { useState } from 'react';
import { Send, Settings, Zap, Brain, Sparkles, Code2 } from 'lucide-react';

interface PlaygroundMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function Playground() {
  const [model, setModel] = useState('saintsal');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [systemPrompt, setSystemPrompt] = useState('You are SaintSal™, an advanced AI assistant powered by cutting-edge technology. You are helpful, insightful, and empowering.');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const models = [
    { id: 'saintsal', name: 'SaintSal™ AI', icon: Brain, color: 'text-yellow-400' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMsg: PlaygroundMessage = {
      role: 'user',
      content: userInput,
    };

    setMessages((m) => [...m, newUserMsg]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/playground', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          temperature,
          maxTokens,
          systemPrompt,
          messages: [...messages, newUserMsg],
        }),
      });

      const data = await response.json();

      const assistantMsg: PlaygroundMessage = {
        role: 'assistant',
        content: data.response || 'No response',
      };

      setMessages((m) => [...m, assistantMsg]);
    } catch (err) {
      console.error('Playground error:', err);
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Error: Failed to get response' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const SelectedModelIcon = models.find((m) => m.id === model)?.icon || Brain;
  const selectedModelColor = models.find((m) => m.id === model)?.color || 'text-blue-400';

  return (
    <div className="playground-container">
      {/* Left Panel - Settings */}
      <div className={`playground-sidebar ${showSettings ? 'show' : ''}`}>
        <div className="playground-sidebar-header">
          <h3 className="playground-sidebar-title">Playground Settings</h3>
          <button
            className="playground-close-btn"
            onClick={() => setShowSettings(false)}
          >
            ✕
          </button>
        </div>

        <div className="playground-sidebar-content">
          {/* Model Selector */}
          <div className="setting-group">
            <label className="setting-label">Model</label>
            <div className="model-grid">
              {models.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setModel(m.id)}
                    className={`model-card ${model === m.id ? 'active' : ''}`}
                  >
                    <Icon className={`model-icon ${m.color}`} size={20} />
                    <span className="model-name">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Prompt */}
          <div className="setting-group">
            <label className="setting-label">System Prompt</label>
            <textarea
              className="setting-textarea"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              placeholder="System instructions for the AI..."
            />
          </div>

          {/* Temperature */}
          <div className="setting-group">
            <label className="setting-label">
              Temperature: <span className="setting-value">{temperature}</span>
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="setting-slider"
            />
            <div className="setting-hint">
              Lower = more focused, Higher = more creative
            </div>
          </div>

          {/* Max Tokens */}
          <div className="setting-group">
            <label className="setting-label">
              Max Tokens: <span className="setting-value">{maxTokens}</span>
            </label>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="setting-slider"
            />
            <div className="setting-hint">
              Maximum length of the response
            </div>
          </div>

          {/* Reset Button */}
          <button
            className="reset-btn"
            onClick={() => {
              setMessages([]);
              setSystemPrompt('You are SaintSal, a helpful AI assistant.');
              setTemperature(0.7);
              setMaxTokens(1000);
            }}
          >
            Reset Conversation
          </button>
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="playground-chat">
        {/* Header */}
        <div className="playground-header">
          <div className="playground-header-left">
            <SelectedModelIcon className={selectedModelColor} size={24} />
            <h2 className="playground-title">
              {models.find((m) => m.id === model)?.name}
            </h2>
          </div>
          <button
            className="settings-toggle"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="playground-messages">
          {messages.length === 0 ? (
            <div className="playground-empty">
              <SelectedModelIcon className={selectedModelColor} size={48} />
              <h3 className="empty-title">Start Testing</h3>
              <p className="empty-subtitle">
                Send a message to test {models.find((m) => m.id === model)?.name}
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`playground-message ${msg.role}`}>
                <div className="message-role">
                  {msg.role === 'system'
                    ? 'System'
                    : msg.role === 'user'
                    ? 'You'
                    : 'Assistant'}
                </div>
                <div className="message-content-playground">{msg.content}</div>
              </div>
            ))
          )}
          {loading && (
            <div className="playground-message assistant">
              <div className="message-role">Assistant</div>
              <div className="message-content-playground">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="playground-input-container">
          <form onSubmit={handleSubmit} className="playground-input-form">
            <textarea
              className="playground-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Type your message..."
              rows={3}
              disabled={loading}
            />
            <button
              type="submit"
              className="playground-send-btn"
              disabled={!userInput.trim() || loading}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
