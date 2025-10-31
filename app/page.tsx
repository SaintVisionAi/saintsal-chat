'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import ChatWindowEnhanced from '../components/ChatWindowEnhanced';
import Playground from '../components/Playground';
import WalkieTalkie from '../components/WalkieTalkie';
import SupermanSal from '../components/SupermanSal';

type ViewType = 'chat' | 'playground' | 'walkie' | 'superman';

export default function Page() {
  const router = useRouter();
  const [currentChatId, setCurrentChatId] = useState<string>('1');
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        if (!data.authenticated) {
          // Not authenticated, redirect to splash
          router.push('/splash');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/splash');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading SaintSal™...</p>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

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
      {currentView === 'superman' && <SupermanSal />}
    </div>
  );
}
