'use client';
import React, { useState } from 'react';
import { Download, FileText, FileJson, File } from 'lucide-react';

interface Message {
  role: string;
  content: string;
  timestamp?: Date;
}

interface ExportChatProps {
  chatId: string;
  messages: Message[];
  title?: string;
}

export default function ExportChat({ chatId, messages, title }: ExportChatProps) {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: 'markdown' | 'json' | 'text') => {
    setLoading(true);
    setShowMenu(false);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId,
          format,
          messages,
          title: title || `SaintSal™ Chat - ${new Date().toLocaleDateString()}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `saintsal-chat-${chatId}.${format === 'markdown' ? 'md' : format === 'json' ? 'json' : 'txt'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export chat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="export-chat-container">
      <button
        className="export-chat-btn"
        onClick={() => setShowMenu(!showMenu)}
        disabled={loading || messages.length === 0}
        title="Export conversation"
      >
        <Download size={18} />
        <span>Export</span>
      </button>

      {showMenu && (
        <>
          <div className="export-menu-overlay" onClick={() => setShowMenu(false)} />
          <div className="export-menu">
            <div className="export-menu-header">
              <h4 className="export-menu-title">Export Format</h4>
              <p className="export-menu-subtitle">Choose how to save your conversation</p>
            </div>

            <div className="export-options">
              <button
                className="export-option"
                onClick={() => handleExport('markdown')}
                disabled={loading}
              >
                <FileText className="text-blue-400" size={24} />
                <div className="export-option-info">
                  <span className="export-option-name">Markdown</span>
                  <span className="export-option-desc">Formatted text with styling</span>
                </div>
              </button>

              <button
                className="export-option"
                onClick={() => handleExport('json')}
                disabled={loading}
              >
                <FileJson className="text-green-400" size={24} />
                <div className="export-option-info">
                  <span className="export-option-name">JSON</span>
                  <span className="export-option-desc">Structured data format</span>
                </div>
              </button>

              <button
                className="export-option"
                onClick={() => handleExport('text')}
                disabled={loading}
              >
                <File className="text-purple-400" size={24} />
                <div className="export-option-info">
                  <span className="export-option-name">Plain Text</span>
                  <span className="export-option-desc">Simple .txt file</span>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
