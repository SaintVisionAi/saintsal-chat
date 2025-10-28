'use client';
import React, { useState, useEffect, useRef } from 'react';

function MessageBubble({ role, text }: { role: 'user'|'assistant', text: string }) {
  return (
    <div className={`message ${role === 'assistant' ? 'assistant' : ''}`}>
      <div style={{ fontSize: 13, opacity: 0.85 }}>{role === 'assistant' ? 'SaintSal' : 'You'}</div>
      <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{text}</div>
    </div>
  );
}

export default function Page() {
  const [messages, setMessages] = useState<{role:'user'|'assistant', text:string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages(m => [...m, {role:'user', text: userText}]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: userText })
      });

      if (!resp.ok) {
        const txt = await resp.text();
        setMessages(m => [...m, {role:'assistant', text: 'Error from server: ' + txt }]);
        setLoading(false);
        return;
      }

      const json = await resp.json();
      setMessages(m => [...m, {role:'assistant', text: json.text || 'No response'}]);
    } catch (e:any) {
      setMessages(m => [...m, {role:'assistant', text: 'Connection error: ' + (e?.message || String(e))}]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="chat-body">
        <div className="messages">
          {messages.map((m, i) => <MessageBubble key={i} role={m.role} text={m.text} />)}
          <div ref={endRef} />
        </div>
      </div>

      <div className="composer">
        <input
          className="input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask SaintSal..."
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button className="btn" onClick={sendMessage} disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
