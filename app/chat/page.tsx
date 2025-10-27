'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Sparkles, Plus } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages })
      })

      const data = await response.json()
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-black via-saint-gray-950 to-black">
      <div className="w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 p-4">
        <button className="w-full btn-primary mb-6 flex items-center justify-center gap-2">
          <Plus size={20} />
          New Chat
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-16 bg-black/30 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Sparkles className="text-saint-yellow-500" size={24} />
            <h1 className="text-xl font-bold text-white">SAINT SAL™</h1>
          </div>
          
          <div className="hacp-active">
            <div className="hacp-dot" />
            <span className="text-xs tracking-[0.3em] text-saint-yellow-500 font-medium">HACP™ ACTIVE</span>
            <div className="hacp-dot" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="text-saint-yellow-500 mx-auto mb-4" size={48} />
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to SAINT SAL™</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                Your enterprise AI assistant powered by HACP™ protocol.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl rounded-2xl p-4 ${message.role === 'user' ? 'bg-saint-yellow-500 text-black' : 'glass text-white'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="text-saint-yellow-500" size={16} />
                      <span className="text-xs font-semibold text-saint-yellow-500">SAINT SAL™</span>
                    </div>
                  )}
                  <div className="text-sm leading-relaxed">{message.content}</div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="glass rounded-2xl p-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-saint-yellow-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-saint-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-saint-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-black/30 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-2 flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
                placeholder="Ask SAINT SAL™ anything..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none p-3"
                rows={1}
              />
              <button onClick={sendMessage} disabled={!input.trim() || isLoading} className="bg-saint-yellow-500 hover:bg-saint-yellow-600 disabled:opacity-50 p-3 rounded-lg">
                <Send size={20} className="text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
