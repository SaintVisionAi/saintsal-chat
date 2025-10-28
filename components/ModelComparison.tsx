'use client';
import React, { useState } from 'react';
import { Brain, Zap, Sparkles, Code2, TrendingUp, Clock, Zap as TokenIcon, Copy, Download } from 'lucide-react';

interface ComparisonResult {
  model: string;
  response: string;
  tokens: number;
  duration: number;
  error?: string;
}

interface ComparisonData {
  success: boolean;
  prompt: string;
  results: ComparisonResult[];
  winner: string;
  timestamp: string;
}

export default function ModelComparison() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-5-core', 'claude-sonnet-4', 'grok-3']);

  const availableModels = [
    { id: 'gpt-5-core', name: 'GPT-5 Core', icon: Brain, color: 'text-blue-400' },
    { id: 'gpt-5-fast', name: 'GPT-5 Fast', icon: Zap, color: 'text-green-400' },
    { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', icon: Sparkles, color: 'text-purple-400' },
    { id: 'grok-3', name: 'Grok-3', icon: Code2, color: 'text-orange-400' },
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

  return (
    <div className="model-comparison-container">
      {/* Header */}
      <div className="comparison-header">
        <div className="comparison-header-content">
          <TrendingUp className="text-gold" size={28} />
          <div>
            <h2 className="comparison-title">SaintSal™ Model Comparison</h2>
            <p className="comparison-subtitle">Run the same prompt across multiple AI models</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="comparison-input-section">
        <form onSubmit={handleCompare} className="comparison-form">
          <div className="comparison-prompt-area">
            <label className="comparison-label">Your Prompt</label>
            <textarea
              className="comparison-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt to test across multiple models..."
              rows={5}
              disabled={loading}
            />
          </div>

          <div className="comparison-model-selector">
            <label className="comparison-label">Select Models (min 2)</label>
            <div className="comparison-model-grid">
              {availableModels.map((model) => {
                const Icon = model.icon;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => toggleModel(model.id)}
                    className={`comparison-model-card ${selectedModels.includes(model.id) ? 'active' : ''}`}
                  >
                    <Icon className={model.color} size={20} />
                    <span className="comparison-model-name">{model.name}</span>
                    {selectedModels.includes(model.id) && (
                      <span className="comparison-checkmark">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="comparison-submit-btn"
            disabled={loading || !prompt.trim() || selectedModels.length < 2}
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                <span>Running Comparison...</span>
              </>
            ) : (
              <>
                <TrendingUp size={20} />
                <span>Compare Models</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {comparison && (
        <div className="comparison-results-section">
          <div className="comparison-results-header">
            <h3 className="comparison-results-title">Comparison Results</h3>
            <div className="comparison-results-actions">
              <span className="comparison-winner-badge">
                Winner: <strong>{comparison.winner}</strong>
              </span>
              <button onClick={exportComparison} className="comparison-export-btn">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="comparison-results-grid">
            {comparison.results.map((result, index) => {
              const Icon = getModelIcon(result.model);
              const color = getModelColor(result.model);
              const isWinner = result.model === comparison.winner;

              return (
                <div
                  key={index}
                  className={`comparison-result-card ${isWinner ? 'winner' : ''} ${result.error ? 'error' : ''}`}
                >
                  <div className="comparison-result-header">
                    <div className="comparison-result-model">
                      <Icon className={color} size={22} />
                      <span className="comparison-result-model-name">{result.model}</span>
                      {isWinner && <span className="winner-crown">👑</span>}
                    </div>
                    <button
                      onClick={() => copyResult(result.response)}
                      className="comparison-copy-btn"
                      title="Copy response"
                    >
                      <Copy size={16} />
                    </button>
                  </div>

                  <div className="comparison-result-stats">
                    <div className="comparison-stat">
                      <Clock size={14} />
                      <span>{result.duration}ms</span>
                    </div>
                    <div className="comparison-stat">
                      <TokenIcon size={14} />
                      <span>{result.tokens} tokens</span>
                    </div>
                  </div>

                  <div className="comparison-result-content">
                    {result.error ? (
                      <div className="comparison-error">
                        <span className="error-icon">⚠️</span>
                        <span>{result.error}</span>
                      </div>
                    ) : (
                      <p>{result.response}</p>
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
        <div className="comparison-empty-state">
          <TrendingUp className="text-gold" size={64} />
          <h3 className="comparison-empty-title">Ready to Compare</h3>
          <p className="comparison-empty-text">
            Select at least 2 models and enter a prompt to see side-by-side responses
          </p>
        </div>
      )}
    </div>
  );
}
