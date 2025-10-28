'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  Volume2,
  Code2,
  StopCircle,
  Image as ImageIcon,
  Globe,
  Sparkles,
  Calculator,
  Database
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  timestamp?: Date;
  code?: {
    language: string;
    content: string;
  };
}

interface ChatWindowProps {
  chatId?: string;
}

export default function ChatWindowEnhanced({ chatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  // Clear messages when chatId changes (New Chat functionality)
  useEffect(() => {
    setMessages([]);
    setInput('');
  }, [chatId]);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'current-user'); // Replace with actual user ID

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessages((m) => [
          ...m,
          {
            role: 'user',
            text: `Uploaded file: ${data.fileName}`,
            timestamp: new Date(),
          },
          {
            role: 'assistant',
            text: `File uploaded successfully!\n\n${data.extractedText}`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error('File upload error:', err);
    }
  };

  // Voice Recording (STT)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const response = await fetch('/api/voice/stt', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          if (data.success) {
            setInput(data.text);
          }
        } catch (err) {
          console.error('STT error:', err);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Text-to-Speech
  const speakMessage = async (text: string) => {
    try {
      setIsSpeaking(true);
      const response = await fetch('/api/elevenlabs/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  // Check for special tool commands
  const checkForImageCommand = (text: string): boolean => {
    const imageKeywords = [
      'generate an image',
      'create an image',
      'make an image',
      'draw an image',
      'generate image of',
    ];
    return imageKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword)
    );
  };

  const checkForSearchCommand = (text: string): boolean => {
    const searchKeywords = [
      'search the web',
      'search for',
      'google',
      'find information about',
      'look up',
    ];
    return searchKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword)
    );
  };

  const checkForGitHubCommand = (text: string): boolean => {
    return text.toLowerCase().includes('github.com') ||
           text.toLowerCase().includes('analyze repo');
  };

  const checkForCodeCommand = (text: string): boolean => {
    const codeKeywords = [
      '/code',
      'generate code',
      'write code',
      'create a function',
      'write a script',
    ];
    return codeKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword)
    );
  };

  // Handle tool calls
  const handleImageGeneration = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch('/api/tools/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.success) {
        return `I've generated an image for you!\n\n![Generated Image](${data.imageUrl})\n\n**Revised Prompt:** ${data.revisedPrompt}`;
      } else {
        return `Sorry, I couldn't generate the image: ${data.error}`;
      }
    } catch (error) {
      return 'Sorry, image generation failed. Please try again.';
    }
  };

  const handleWebSearch = async (query: string): Promise<string> => {
    try {
      const response = await fetch('/api/tools/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (data.success) {
        let result = `I found these results for "${query}":\n\n`;
        data.results.forEach((item: any, i: number) => {
          result += `${i + 1}. **${item.title}**\n   ${item.snippet}\n   [${item.link}](${item.link})\n\n`;
        });
        return result;
      } else {
        return `Web search unavailable: ${data.error}`;
      }
    } catch (error) {
      return 'Sorry, web search failed. Please try again.';
    }
  };

  // 🔥 STREAMING CHAT FUNCTION
  async function sendMessage() {
    if (!input.trim() || isStreaming) return;

    const userText = input.trim();
    const userMessage: Message = {
      role: 'user',
      text: userText,
      timestamp: new Date(),
    };

    setMessages((m) => [...m, userMessage]);
    setInput('');
    setIsStreaming(true);

    // Check for tool commands and handle them
    if (checkForImageCommand(userText)) {
      const result = await handleImageGeneration(userText);
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: result,
          timestamp: new Date(),
        },
      ]);
      setIsStreaming(false);
      return;
    }

    if (checkForSearchCommand(userText)) {
      const result = await handleWebSearch(userText);
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: result,
          timestamp: new Date(),
        },
      ]);
      setIsStreaming(false);
      return;
    }

    // Create placeholder for assistant message
    const assistantMessageIndex = messages.length + 1;
    setMessages((m) => [
      ...m,
      {
        role: 'assistant',
        text: '',
        timestamp: new Date(),
      },
    ]);

    try {
      abortControllerRef.current = new AbortController();

      // ⚡ SERVER-SENT EVENTS STREAMING
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          stream: true, // Enable streaming
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // Decode the chunk
        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);

              if (parsed.error) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[assistantMessageIndex] = {
                    role: 'assistant',
                    text: parsed.error,
                    timestamp: new Date(),
                  };
                  return newMessages;
                });
                break;
              }

              if (parsed.done) {
                // Streaming complete - trigger TTS if enabled
                if (fullResponse && isSpeaking) {
                  await speakMessage(fullResponse);
                }
                break;
              }

              if (parsed.token) {
                fullResponse += parsed.token;

                // Append token to assistant message
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[assistantMessageIndex] = {
                    ...newMessages[assistantMessageIndex],
                    text: newMessages[assistantMessageIndex].text + parsed.token,
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
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Chat error:', error);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[assistantMessageIndex] = {
            role: 'assistant',
            text: 'Sorry, something went wrong. Please try again.',
            timestamp: new Date(),
          };
          return newMessages;
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }

  // Stop streaming
  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="chat-window">
      {/* Messages Area */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <img
              src="https://i.imgur.com/ganVqpV.png"
              alt="SaintSal Logo"
              width={120}
              height={120}
              className="welcome-logo-img"
            />
            <h1 className="welcome-title">Welcome to SaintSal</h1>
            <p className="welcome-subtitle">
              Your divine AI co-founder with Code Agent, Voice, and File Processing
            </p>
            <div className="welcome-suggestions">
              <button
                className="suggestion-btn"
                onClick={() => setInput('Generate code for a React component')}
              >
                <Code2 size={16} /> Generate Code
              </button>
              <button
                className="suggestion-btn"
                onClick={() => setInput('What can you help me with?')}
              >
                What can you do?
              </button>
              <button
                className="suggestion-btn"
                onClick={() => setInput('Help me build an API')}
              >
                Help me build something
              </button>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, i) => (
              <div key={i} className={`message-row ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'assistant' ? (
                    <div className="avatar-assistant" />
                  ) : (
                    <div className="avatar-user">You</div>
                  )}
                </div>
                <div className="message-content">
                  <div className="message-text">{msg.text}</div>

                  {msg.code && (
                    <div className="message-code-block">
                      <div className="code-block-header">
                        <span className="code-language">{msg.code.language}</span>
                        <button
                          className="code-copy-btn"
                          onClick={() => navigator.clipboard.writeText(msg.code!.content)}
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="code-content">
                        <code>{msg.code.content}</code>
                      </pre>
                    </div>
                  )}

                  {msg.role === 'assistant' && (
                    <button
                      className="message-action-btn"
                      onClick={() => speakMessage(msg.text)}
                      disabled={isSpeaking}
                      title="Speak this message"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && messages[messages.length - 1]?.text === '' && (
              <div className="message-row assistant">
                <div className="message-avatar">
                  <div className="avatar-assistant" />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chat-input-container">
        {/* Tools Bar */}
        <div className="chat-tools-bar">
          <button
            className="tool-btn"
            onClick={() => setInput('/code ')}
            title="Code Generation"
          >
            <Code2 size={16} />
            <span>Code</span>
          </button>
          <button
            className="tool-btn"
            onClick={() => setInput('Generate an image of ')}
            title="Image Generation"
          >
            <ImageIcon size={16} />
            <span>Image</span>
          </button>
          <button
            className="tool-btn"
            onClick={() => setInput('Search the web for ')}
            title="Web Search"
          >
            <Globe size={16} />
            <span>Search</span>
          </button>
          <button
            className="tool-btn"
            onClick={() => setInput('Analyze data: ')}
            title="Data Analysis"
          >
            <Database size={16} />
            <span>Data</span>
          </button>
          <button
            className="tool-btn"
            onClick={() => setInput('Calculate: ')}
            title="Calculator"
          >
            <Calculator size={16} />
            <span>Calculate</span>
          </button>
          <button
            className="tool-btn"
            onClick={() => setInput('Create ')}
            title="AI Assistant"
          >
            <Sparkles size={16} />
            <span>Create</span>
          </button>
        </div>

        <div className="chat-input-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept=".pdf,.png,.jpg,.jpeg,.txt,.json,.csv"
          />

          <button
            className="input-icon-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload file"
          >
            <Paperclip size={20} />
          </button>

          <textarea
            ref={textareaRef}
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message SaintSal... (try '/code' for code generation)"
            rows={1}
            disabled={isStreaming}
          />

          <button
            className={`input-icon-btn ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            title={isRecording ? 'Stop recording' : 'Voice input'}
            disabled={isStreaming}
          >
            {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>

          {isStreaming ? (
            <button
              className="send-btn stop-btn"
              onClick={stopStreaming}
              title="Stop generating"
            >
              <StopCircle size={20} />
            </button>
          ) : (
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!input.trim()}
            >
              <Send size={20} />
            </button>
          )}
        </div>
        <div className="input-footer">
          SaintSal can make mistakes. Please verify important information.
        </div>
      </div>
    </div>
  );
}
