'use client';
import React from 'react';

interface VoiceVisualizerProps {
  isActive: boolean; // Whether to show animation
  type: 'recording' | 'listening' | 'processing';
}

export default function VoiceVisualizer({ isActive, type }: VoiceVisualizerProps) {
  if (!isActive) return null;

  const color =
    type === 'recording' ? 'var(--gold)' : type === 'listening' ? '#34d399' : '#60a5fa';

  return (
    <div className="voice-visualizer">
      {/* Circular wave bars */}
      <div className="voice-wave-container">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="voice-bar"
            style={{
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${i * 0.1}s`,
              backgroundColor: color,
            }}
          />
        ))}
      </div>

      {/* Center pulse */}
      <div
        className="voice-pulse"
        style={{
          borderColor: color,
        }}
      />
    </div>
  );
}
