'use client';
import React, { useState, useRef } from 'react';
import { Brain, Zap, Sparkles, Code2, TrendingUp, Clock, Zap as TokenIcon, Copy, Download, Mic2, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';

interface ComparisonResult {
  model: string;
  response: string;
  tokens: number;
  duration: number;
  error?: string;
  hasArtifacts?: boolean;
  artifacts?: Artifact[];
}

interface Artifact {
  type: 'code' | 'image' | 'document';
  content: string;
  language?: string;
  title?: string;
}

interface ComparisonData {
  success: boolean;
  prompt: string;
  results: ComparisonResult[];
  winner: string;
  timestamp: string;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  data: string;
}

export default function ModelComparison() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-5-core', 'claude-sonnet-4', 'grok-3']);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // WHITELABELED SAINTSAL™ MODELS - Branded by function!
  const availableModels = [
    { id: 'gpt-5-core', name: 'SaintSal™ Knowledge', icon: Brain, color: 'text-blue-400', description: 'Research & Analysis' },
    { id: 'gpt-5-fast', name: 'SaintSal™ Speed', icon: Zap, color: 'text-green-400', description: 'Fast Responses' },
    { id: 'claude-sonnet-4', name: 'SaintSal™ Business', icon: Sparkles, color: 'text-purple-400', description: 'Business Strategy' },
    { id: 'grok-3', name: 'SaintSal™ Code', icon: Code2, color: 'text-orange-400', description: 'Code Generation' },
    { id: 'saintsal-voice', name: 'SaintSal™ Voice', icon: Mic2, color: 'text-yellow-400', description: 'Voice Intelligence' },
  ];

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || selectedModels.length < 2) return;

    setLoading(true);
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          models: selectedModels,
          files: uploadedFiles,
        }),
      });

      const data = await response.json();
      setComparison(data);
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((m) => m !== modelId) : [...prev, modelId]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      await new Promise((resolve) => {
        reader.onload = (event) => {
          const data = event.target?.result as string;
          newFiles.push({
            name: file.name,
            size: file.size,
            type: file.type,
            data: data,
          });
          resolve(null);
        };

        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsText(file);
        }
      });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportComparison = () => {
    if (!comparison) return;
    const markdown = `# SaintSal™ Model Comparison\n\n**Prompt:** ${comparison.prompt}\n\n**Timestamp:** ${new Date(comparison.timestamp).toLocaleString()}\n\n**Winner:** ${comparison.winner}\n\n---\n\n${comparison.results.map((r) => `## ${r.model}\n\n**Duration:** ${r.duration}ms | **Tokens:** ${r.tokens}\n\n${r.response}\n\n---\n`).join('\n')}`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saintsal-comparison-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getModelIcon = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId);
    return model ? model.icon : Brain;
  };

  const getModelColor = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId);
    return model ? model.color : 'text-blue-400';
  };

  const getModelName = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId);
    return model ? model.name : modelId;
  };

  // Auto-detect and render image URLs in text
  const renderTextWithImages = (text: string) => {
    const imageUrlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi;
    const parts = text.split(imageUrlRegex);

    return parts.map((part, index) => {
      if (imageUrlRegex.test(part)) {
        return (
          <div key={index} className="my-3">
            <img
              src={part}
              alt="Generated content"
              className="max-w-full h-auto rounded-lg border border-gray-700"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderArtifact = (artifact: Artifact, index: number) => {
    if (artifact.type === 'code') {
      return (
        <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border-b border-gray-700">
            <Code2 size={16} className="text-orange-400" />
            <span className="text-sm font-medium text-white">{artifact.title || 'Code'}</span>
            <span className="ml-auto text-xs text-gray-500">{artifact.language || 'text'}</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm text-gray-300">
            <code>{artifact.content}</code>
          </pre>
        </div>
      );
    }

    if (artifact.type === 'image') {
      return (
        <div key={index} className="my-3">
          <img
            src={artifact.content}
            alt={artifact.title || 'Generated image'}
            className="max-w-full h-auto rounded-lg border border-gray-700"
          />
        </div>
      );
    }

    return (
      <div key={index} className="flex items-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg">
        <FileText size={16} className="text-blue-400" />
        <span className="text-sm text-white">{artifact.title || 'Document'}</span>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="chat-window">
      {/* Full Screen Container */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-yellow-500" size={28} />
            <div>
              <h2 className="text-xl font-bold text-white">SaintSal™ Model Comparison</h2>
              <p className="text-sm text-gray-400">Compare AI capabilities side-by-side</p>
            </div>
          </div>
          {comparison && (
            <button onClick={exportComparison} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 hover:bg-yellow-500/20 transition">
              <Download size={16} />
              <span>Export</span>
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Input Section */}
          <form onSubmit={handleCompare} className="space-y-4">
            {/* Model Selection */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select SaintSal™ Capabilities (min 2, max 5)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {availableModels.map((model) => {
                  const Icon = model.icon;
                  const isSelected = selectedModels.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => toggleModel(model.id)}
                      className={`relative p-4 rounded-lg border-2 transition ${
                        isSelected
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <Icon className={model.color} size={24} />
                      <div className="mt-2 text-sm font-medium text-white">{model.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{model.description}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-300 mb-3">Your Prompt</label>
              <textarea
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt to compare across SaintSal™ capabilities..."
                rows={4}
                disabled={loading}
              />

              {/* File Upload Section */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.txt,.pdf,.doc,.docx,.json,.csv"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition"
                    disabled={loading}
                  >
                    <Paperclip size={18} />
                    <span>Attach Files</span>
                  </button>
                  <span className="text-xs text-gray-500">
                    Images, documents, code files
                  </span>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                      >
                        {file.type.startsWith('image/') ? (
                          <ImageIcon size={16} className="text-blue-400" />
                        ) : (
                          <FileText size={16} className="text-green-400" />
                        )}
                        <span className="text-sm text-white truncate max-w-[150px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-2 text-gray-400 hover:text-red-500 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading || !prompt.trim() || selectedModels.length < 2}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Comparing...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={20} />
                    <span>Compare {selectedModels.length} Capabilities</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Section */}
          {comparison && (
            <div className="space-y-4">
              {/* Winner Badge */}
              <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
                <span className="text-2xl">👑</span>
                <span className="text-lg font-bold text-white">
                  Best Result: {getModelName(comparison.winner)}
                </span>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {comparison.results.map((result, index) => {
                  const Icon = getModelIcon(result.model);
                  const color = getModelColor(result.model);
                  const name = getModelName(result.model);
                  const isWinner = result.model === comparison.winner;

                  return (
                    <div
                      key={index}
                      className={`bg-gray-900/50 border rounded-lg p-4 ${
                        isWinner ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' : 'border-gray-800'
                      } ${result.error ? 'border-red-500' : ''}`}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className={color} size={22} />
                          <span className="font-semibold text-white">{name}</span>
                          {isWinner && <span className="text-2xl">👑</span>}
                        </div>
                        <button
                          onClick={() => copyResult(result.response)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"
                          title="Copy response"
                        >
                          <Copy size={16} />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{result.duration}ms</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TokenIcon size={14} />
                          <span>{result.tokens} tokens</span>
                        </div>
                      </div>

                      {/* Response */}
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        {result.error ? (
                          <div className="flex items-center gap-2 text-red-500">
                            <span className="text-xl">⚠️</span>
                            <span>{result.error}</span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                              {renderTextWithImages(result.response)}
                            </div>
                            {/* Artifacts */}
                            {result.hasArtifacts && result.artifacts && (
                              <div className="space-y-2 mt-4">
                                {result.artifacts.map((artifact, idx) => renderArtifact(artifact, idx))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!comparison && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <TrendingUp className="text-yellow-500 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-white mb-2">Ready to Compare</h3>
              <p className="text-gray-400 max-w-md">
                Select at least 2 SaintSal™ capabilities, enter your prompt, and optionally attach files to see side-by-side results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
