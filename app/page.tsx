'use client';
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

export default function Page() {
  const [currentChatId, setCurrentChatId] = useState<string>('1');

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setCurrentChatId(newId);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  return (
    <div className="app-container">
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
      />
      <ChatWindow chatId={currentChatId} />
    </div>
  );
}
