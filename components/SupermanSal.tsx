'use client';
import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Zap,
  Send,
  Maximize2,
  Minimize2,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Search,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Eye,
  Camera,
  MonitorPlay,
  MonitorStop
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export default function SupermanSal() {
  const [url, setUrl] = useState('https://www.example.com');
  const [currentUrl, setCurrentUrl] = useState('https://www.example.com');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: '🦸‍♂️ SUPERMAN SAL MODE ACTIVATED! I can see what you\'re working on and help you in real-time. Load up a website, Word doc, or any project you want me to see. LFG!',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [splitRatio, setSplitRatio] = useState(50); // 50% split by default
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const screenCaptureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url.trim();

    // Add https:// if no protocol
    if (!finalUrl.match(/^https?:\/\//i)) {
      finalUrl = 'https://' + finalUrl;
    }

    setCurrentUrl(finalUrl);
    setIframeError(false);

    // Add context message
    setMessages(prev => [...prev, {
      role: 'system',
      content: `📍 Now viewing: ${finalUrl}`,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    setIsLoading(true);

    try {
      // Send message with context about the URL being viewed
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[SUPERMAN SAL CONTEXT: User is currently viewing ${currentUrl}]\n\nUser: ${userMessage}`,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API failed');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let assistantMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      const messageIndex = messages.length + 1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[messageIndex] = {
                    ...newMessages[messageIndex],
                    content: '❌ ' + parsed.error
                  };
                  return newMessages;
                });
                break;
              }

              if (parsed.done) {
                break;
              }

              if (parsed.token) {
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[messageIndex] = {
                    ...newMessages[messageIndex],
                    content: newMessages[messageIndex].content + parsed.token
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Failed to get response. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleWebSearch = async () => {
    const searchQuery = prompt('What do you want me to search for?');
    if (!searchQuery) return;

    setIsLoading(true);
    setMessages(prev => [...prev, {
      role: 'user',
      content: `🔍 Search the web for: "${searchQuery}"`,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch('/api/superman/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();

      if (data.success) {
        // Display search results in chat
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `🌐 **Web Search Results:**\n\n${data.results}\n\n💡 You can also view full results: ${data.searchUrl}`,
          timestamp: new Date()
        }]);

        // Optionally load Google search in iframe
        const loadInViewer = confirm('Load full search results in viewer?');
        if (loadInViewer) {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
          setUrl(searchUrl);
          setCurrentUrl(searchUrl);
        }
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (err) {
      console.error('Web search error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Search failed: ${err instanceof Error ? err.message : String(err)}\n\nYou can still search manually: https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScreenshotUpload = () => {
    screenshotInputRef.current?.click();
  };

  const handleScreenshotSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessages(prev => [...prev, {
      role: 'user',
      content: `📸 Analyzing screenshot: ${file.name}`,
      timestamp: new Date()
    }]);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('prompt', `Analyze this screenshot in detail. Describe what you see, including any text, UI elements, layout, colors, and notable features. Also mention what kind of website or application this appears to be.`);

      const response = await fetch('/api/superman/vision', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `👁️ **Vision Analysis:**\n\n${data.analysis}`,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.error || 'Vision analysis failed');
      }
    } catch (err) {
      console.error('Screenshot analysis error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Failed to analyze screenshot: ${err instanceof Error ? err.message : String(err)}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      // Reset file input
      if (screenshotInputRef.current) {
        screenshotInputRef.current.value = '';
      }
    }
  };

  const handleAnalyzePage = async () => {
    setInputMessage(`Analyze the page I'm viewing: ${currentUrl}\n\nWhat can you tell me about this website? What is it for?`);
  };

  const captureAndAnalyzeScreen = async () => {
    if (!screenVideoRef.current || !isScreenSharing) return;

    try {
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      const video = screenVideoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Draw current frame
      ctx.drawImage(video, 0, 0);

      // Convert to base64
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);

      console.log('[SCREEN-SHARE] Capturing frame for analysis...');

      // Send to vision API
      const response = await fetch('/api/superman/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          prompt: 'Briefly describe what you see on this screen. Focus on the main content, any text, UI elements, and what the user appears to be working on. Keep it concise (2-3 sentences).'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `👁️ **Watching:** ${data.analysis}`,
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      console.error('[SCREEN-SHARE] Capture error:', err);
    }
  };

  const startScreenSharing = async () => {
    try {
      // Request screen sharing
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      setScreenStream(stream);
      setIsScreenSharing(true);

      // Attach to hidden video element
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
        screenVideoRef.current.play();
      }

      setMessages(prev => [...prev, {
        role: 'system',
        content: '🖥️ **LIVE SCREEN SHARING ACTIVATED!** Superman Sal is now watching your screen in real-time. He\'ll comment on what you\'re working on every few seconds. LFG!',
        timestamp: new Date()
      }]);

      // Capture and analyze every 8 seconds
      const interval = setInterval(captureAndAnalyzeScreen, 8000);
      screenCaptureIntervalRef.current = interval;

      // Initial capture after 2 seconds
      setTimeout(captureAndAnalyzeScreen, 2000);

      // Handle stream end
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenSharing();
      });

    } catch (err) {
      console.error('[SCREEN-SHARE] Error:', err);
      alert('Screen sharing failed. Make sure you grant permission to share your screen.');
      setIsScreenSharing(false);
    }
  };

  const stopScreenSharing = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }

    if (screenCaptureIntervalRef.current) {
      clearInterval(screenCaptureIntervalRef.current);
      screenCaptureIntervalRef.current = null;
    }

    setIsScreenSharing(false);

    setMessages(prev => [...prev, {
      role: 'system',
      content: '⏹️ Screen sharing stopped. Superman Sal is no longer watching.',
      timestamp: new Date()
    }]);
  };

  const toggleScreenSharing = () => {
    if (isScreenSharing) {
      stopScreenSharing();
    } else {
      startScreenSharing();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      if (screenCaptureIntervalRef.current) {
        clearInterval(screenCaptureIntervalRef.current);
      }
    };
  }, [screenStream]);

  return (
    <div className="superman-sal-container">
      {/* EPIC HEADER WITH BETA BADGE */}
      <div className="superman-sal-header">
        <div className="superman-sal-branding">
          <div className="superman-icon-wrapper">
            <Zap className="superman-icon pulse-glow" size={32} />
          </div>
          <div>
            <div className="superman-title-row">
              <h1 className="superman-title">SUPERMAN SAL™</h1>
              <span className="beta-badge">
                <Sparkles size={14} />
                BETA
              </span>
              <span className="lfg-badge">LFG!</span>
            </div>
            <p className="superman-subtitle">Real-time AI companion for anything you're working on</p>
          </div>
        </div>

        <div className="superman-actions">
          <button
            onClick={toggleScreenSharing}
            className={`superman-action-btn ${isScreenSharing ? 'superman-sharing-active' : 'superman-share-btn'}`}
            title={isScreenSharing ? "Stop Screen Sharing" : "Share Your Screen LIVE"}
          >
            {isScreenSharing ? <MonitorStop size={18} /> : <MonitorPlay size={18} />}
            <span>{isScreenSharing ? 'Stop Sharing' : 'SHARE SCREEN'}</span>
            {isScreenSharing && <span className="live-indicator">● LIVE</span>}
          </button>
          <button
            onClick={handleWebSearch}
            className="superman-action-btn"
            title="Web Search"
          >
            <Search size={18} />
            <span>Search Web</span>
          </button>
          <button
            onClick={handleScreenshotUpload}
            className="superman-action-btn superman-vision-btn"
            title="Upload Screenshot for Vision Analysis"
          >
            <Camera size={18} />
            <span>See Screenshot</span>
          </button>
          <button
            onClick={handleAnalyzePage}
            className="superman-action-btn"
            title="Analyze Page"
          >
            <Eye size={18} />
            <span>Analyze URL</span>
          </button>
        </div>

        {/* Hidden file input for screenshots */}
        <input
          ref={screenshotInputRef}
          type="file"
          accept="image/*"
          onChange={handleScreenshotSelected}
          style={{ display: 'none' }}
        />

        {/* Hidden video element for screen capture */}
        <video
          ref={screenVideoRef}
          style={{ display: 'none' }}
          playsInline
          muted
        />
      </div>

      {/* SPLIT VIEW CONTAINER */}
      <div className="superman-split-view">
        {/* LEFT PANEL: WEB VIEWER */}
        <div
          className="superman-viewer-panel"
          style={{ width: `${splitRatio}%` }}
        >
          <div className="viewer-controls">
            <div className="viewer-nav-controls">
              <button className="viewer-control-btn" title="Back">
                <ArrowLeft size={16} />
              </button>
              <button className="viewer-control-btn" title="Forward">
                <ArrowRight size={16} />
              </button>
              <button className="viewer-control-btn" onClick={handleRefresh} title="Refresh">
                <RefreshCw size={16} />
              </button>
            </div>

            <form onSubmit={handleUrlSubmit} className="url-input-form">
              <Globe size={16} className="url-icon" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL or paste project link..."
                className="url-input"
              />
              <button type="submit" className="url-go-btn">
                Go
              </button>
            </form>

            <button
              className="viewer-control-btn"
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          <div className="viewer-content">
            {iframeError ? (
              <div className="iframe-error">
                <Globe size={64} className="error-icon" />
                <h3>Cannot Load Page</h3>
                <p>This website doesn't allow embedding. Try a different URL.</p>
                <button onClick={() => window.open(currentUrl, '_blank')} className="open-external-btn">
                  Open in New Tab
                </button>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={currentUrl}
                className="viewer-iframe"
                title="Web Viewer"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                onError={() => setIframeError(true)}
              />
            )}
          </div>
        </div>

        {/* RESIZE HANDLE */}
        <div
          className="superman-resize-handle"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startRatio = splitRatio;

            const handleMouseMove = (e: MouseEvent) => {
              const container = document.querySelector('.superman-split-view') as HTMLElement;
              if (!container) return;

              const containerWidth = container.offsetWidth;
              const deltaX = e.clientX - startX;
              const deltaPercent = (deltaX / containerWidth) * 100;
              const newRatio = Math.min(Math.max(startRatio + deltaPercent, 20), 80);
              setSplitRatio(newRatio);
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />

        {/* RIGHT PANEL: CHAT */}
        <div
          className="superman-chat-panel"
          style={{ width: `${100 - splitRatio}%` }}
        >
          <div className="superman-chat-header">
            <h3 className="chat-panel-title">💬 SaintSal™ is watching...</h3>
          </div>

          <div className="superman-messages" ref={chatContainerRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`superman-message ${msg.role}`}>
                <div className="message-content">
                  <div className="message-role-badge">
                    {msg.role === 'user' ? '👤' : msg.role === 'assistant' ? '🦸‍♂️' : '⚡'}
                    <span>{msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'Superman Sal' : 'System'}</span>
                  </div>
                  <p className="message-text">{msg.content}</p>
                  <span className="message-time">{msg.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="superman-message assistant">
                <div className="message-content">
                  <div className="message-role-badge">
                    <Zap className="spin" size={14} />
                    <span>Superman Sal</span>
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="superman-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Superman Sal anything about what you're viewing..."
              className="superman-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="superman-send-btn"
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
