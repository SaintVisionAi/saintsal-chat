'use client';
import React, { useState } from 'react';
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
  Mic
} from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId?: string;
}

export default function Sidebar({ onNewChat, onSelectChat, currentChatId }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'files' | 'artifacts' | 'code'>('chats');

  // Mock chat history - replace with actual data from MongoDB
  const [chats, setChats] = useState<Chat[]>([
    { id: '1', title: 'Welcome to SaintSal', timestamp: new Date() },
  ]);

  const tools = [
    { name: 'Code Agent', icon: Code2 },
    { name: 'Voice (ElevenLabs)', icon: Mic },
    { name: 'Search', icon: FileText },
    { name: 'Calculator', icon: Wrench },
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
        <div className="tools-header">Tools</div>
        <div className="tools-list">
          {tools.map((tool) => (
            <button key={tool.name} className="tool-item">
              <tool.icon size={16} />
              <span>{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Console Link */}
      <div className="sidebar-footer">
        <a href="https://cookin.io" target="_blank" rel="noopener noreferrer" className="console-link">
          <Terminal size={16} />
          <span>Open Console</span>
        </a>
      </div>
    </div>
  );
}
