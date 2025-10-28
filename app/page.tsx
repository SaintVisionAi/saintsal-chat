'use client';
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindowEnhanced from '../components/ChatWindowEnhanced';
import Playground from '../components/Playground';
import WalkieTalkie from '../components/WalkieTalkie';
import ModelComparison from '../components/ModelComparison';

type ViewType = 'chat' | 'playground' | 'walkie' | 'compare';

export default function Page() {
  const [currentChatId, setCurrentChatId] = useState<string>('1');
  const [currentView, setCurrentView] = useState<ViewType>('chat');

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setCurrentChatId(newId);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <div className="app-container">
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onViewChange={handleViewChange}
        currentChatId={currentChatId}
        currentView={currentView}
      />
      {currentView === 'chat' && <ChatWindowEnhanced chatId={currentChatId} />}
      {currentView === 'playground' && <Playground />}
      {currentView === 'walkie' && <WalkieTalkie />}
      {currentView === 'compare' && <ModelComparison />}
    </div>
  );
}
