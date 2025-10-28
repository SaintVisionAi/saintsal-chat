'use client';
import React, { useState } from 'react';
import { Copy, Check, Download, Code2, FileCode } from 'lucide-react';

interface Artifact {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: Date;
}

interface ArtifactsProps {
  artifacts?: Artifact[];
}

export default function Artifacts({ artifacts = [] }: ArtifactsProps) {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
    artifacts[0] || null
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (selectedArtifact) {
      navigator.clipboard.writeText(selectedArtifact.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (selectedArtifact) {
      const blob = new Blob([selectedArtifact.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedArtifact.title}.${getFileExtension(selectedArtifact.language)}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      rust: 'rs',
      go: 'go',
      ruby: 'rb',
      php: 'php',
      html: 'html',
      css: 'css',
      json: 'json',
      yaml: 'yaml',
      markdown: 'md',
    };
    return extensions[language.toLowerCase()] || 'txt';
  };

  if (artifacts.length === 0) {
    return (
      <div className="artifacts-empty">
        <FileCode size={48} className="artifacts-empty-icon" />
        <h3 className="artifacts-empty-title">No Artifacts Yet</h3>
        <p className="artifacts-empty-subtitle">
          Code snippets and generated content will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="artifacts-container">
      {/* Artifact List */}
      <div className="artifacts-list">
        <div className="artifacts-list-header">
          <Code2 size={16} />
          <span>Artifacts ({artifacts.length})</span>
        </div>
        {artifacts.map((artifact) => (
          <button
            key={artifact.id}
            className={`artifact-item ${
              selectedArtifact?.id === artifact.id ? 'active' : ''
            }`}
            onClick={() => setSelectedArtifact(artifact)}
          >
            <div className="artifact-item-title">{artifact.title}</div>
            <div className="artifact-item-meta">
              {artifact.language} •{' '}
              {new Date(artifact.createdAt).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>

      {/* Artifact Viewer */}
      {selectedArtifact && (
        <div className="artifact-viewer">
          <div className="artifact-viewer-header">
            <div className="artifact-viewer-title">
              {selectedArtifact.title}
            </div>
            <div className="artifact-viewer-actions">
              <button
                className="artifact-action-btn"
                onClick={handleCopy}
                title="Copy code"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
              <button
                className="artifact-action-btn"
                onClick={handleDownload}
                title="Download file"
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className="artifact-viewer-content">
            <pre className="artifact-code">
              <code>{selectedArtifact.code}</code>
            </pre>
          </div>

          <div className="artifact-viewer-footer">
            <span className="artifact-language-badge">
              {selectedArtifact.language}
            </span>
            <span className="artifact-size">
              {selectedArtifact.code.length} characters
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
