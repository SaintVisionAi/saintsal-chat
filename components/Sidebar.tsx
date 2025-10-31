'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  MessageSquare,
  FileText,
  Code2,
  Wrench,
  Box,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Mic,
  LogOut,
  Zap
} from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

type ViewType = 'chat' | 'playground' | 'walkie' | 'superman';

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onViewChange: (view: ViewType) => void;
  currentChatId?: string;
  currentView?: ViewType;
}

export default function Sidebar({
  onNewChat,
  onSelectChat,
  onViewChange,
  currentChatId,
  currentView = 'chat'
}: SidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'files' | 'artifacts' | 'code'>('chats');

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      // Redirect to splash page
      router.push('/splash');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Mock chat history - replace with actual data from MongoDB
  const [chats, setChats] = useState<Chat[]>([
    { id: '1', title: 'Welcome to SaintSal', timestamp: new Date() },
  ]);

  const tools = [
    {
      name: 'SUPERMAN SAL 🦸‍♂️',
      icon: Zap,
      action: () => onViewChange('superman'),
      special: true // Mark as special/featured
    },
    {
      name: 'Chat',
      icon: MessageSquare,
      action: () => onViewChange('chat')
    },
    {
      name: 'Voice Assistant',
      icon: Mic,
      action: () => onViewChange('walkie')
    },
    {
      name: 'Playground',
      icon: Code2,
      action: () => onViewChange('playground')
    },
  ];

  if (isCollapsed) {
    return (
      <div className="sidebar-collapsed">
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight size={20} />
        </button>
        <button className="new-chat-btn-collapsed" onClick={onNewChat}>
          <Plus size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar">
      {/* Brand Logo */}
      <div className="sidebar-brand">
        <img
          src="https://files.catbox.moe/c0zaok.png"
          alt="SaintSal"
          className="sidebar-logo"
        />
        <h2 className="sidebar-brand-text">
          SaintSal<span className="trademark-small">™</span>
        </h2>
      </div>

      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={18} />
          <span>New Chat</span>
        </button>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* View Navigation */}
      <div className="sidebar-views">
        <button
          className={`view-btn ${currentView === 'superman' ? 'active' : ''}`}
          onClick={() => onViewChange('superman')}
          style={{ background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: '#000', fontWeight: 'bold' }}
        >
          <Zap size={16} />
          <span>SUPERMAN SAL 🦸‍♂️</span>
        </button>
        <button
          className={`view-btn ${currentView === 'chat' ? 'active' : ''}`}
          onClick={() => onViewChange('chat')}
        >
          <MessageSquare size={16} />
          <span>Chat</span>
        </button>
        <button
          className={`view-btn ${currentView === 'playground' ? 'active' : ''}`}
          onClick={() => onViewChange('playground')}
        >
          <Code2 size={16} />
          <span>Playground</span>
        </button>
        <button
          className={`view-btn ${currentView === 'walkie' ? 'active' : ''}`}
          onClick={() => onViewChange('walkie')}
        >
          <Mic size={16} />
          <span>Walkie Talkie</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === 'chats' ? 'active' : ''}`}
          onClick={() => setActiveTab('chats')}
        >
          <MessageSquare size={16} />
          <span>Chats</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          <FileText size={16} />
          <span>Files</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'artifacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('artifacts')}
        >
          <Box size={16} />
          <span>Artifacts</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          <Code2 size={16} />
          <span>Code</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="sidebar-content">
        {activeTab === 'chats' && (
          <div className="chat-list">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare size={16} />
                <span className="chat-title">{chat.title}</span>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="files-panel">
            <p className="panel-empty">No files uploaded yet</p>
          </div>
        )}

        {activeTab === 'artifacts' && (
          <div className="artifacts-panel">
            <p className="panel-empty">No artifacts created yet</p>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="code-panel">
            <p className="panel-empty">No code snippets saved</p>
          </div>
        )}
      </div>

      {/* Tools Section */}
      <div className="sidebar-tools">
        <div className="tools-header">Quick Tools</div>
        <div className="tools-list">
          {tools.map((tool) => (
            <button
              key={tool.name}
              className="tool-item"
              onClick={tool.action}
            >
              <tool.icon size={16} />
              <span>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="sidebar-integrations">
        <div className="integrations-header">Integrations</div>
        <div className="integrations-list">
          <a href="/api/auth/oauth/github" className="integration-btn github">
            <Code2 size={16} />
            <span>Connect GitHub</span>
          </a>
          <button className="integration-btn google" onClick={() => alert('Google OAuth coming soon!')}>
            <FileText size={16} />
            <span>Connect Google</span>
          </button>
          <button className="integration-btn microsoft" onClick={() => alert('Microsoft OAuth coming soon!')}>
            <Wrench size={16} />
            <span>Connect Microsoft</span>
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="sidebar-footer">
        <a href="/admin" className="console-link">
          <Terminal size={16} />
          <span>Admin Dashboard</span>
        </a>
        <a href="https://cookin.io" target="_blank" rel="noopener noreferrer" className="console-link">
          <Terminal size={16} />
          <span>Open Console</span>
        </a>
        <button onClick={handleLogout} className="console-link" style={{ width: '100%', textAlign: 'left' }}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
