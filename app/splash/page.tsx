'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        if (data.authenticated) {
          // User is logged in, redirect to chat
          router.push('/');
        }
      } catch (err) {
        console.log('Not authenticated');
      }
    };

    checkAuth();
    setTimeout(() => setIsLoaded(true), 300);
  }, [router]);

  return (
    <div className="splash-container">
      {/* Animated Background */}
      <div className="splash-background">
        <div className="splash-gradient"></div>
        <div className="splash-particles"></div>
      </div>

      {/* Main Content */}
      <div className={`splash-content ${isLoaded ? 'loaded' : ''}`}>
        {/* Logo Container - Centered Animation */}
        <div className="splash-logo-container">
          {/* Placeholder for user's animated logo */}
          <div className="splash-logo-wrapper">
            {/* This will be replaced with user's animation file */}
            <div className="splash-logo-placeholder">
              <Sparkles className="splash-icon" size={80} />
            </div>
          </div>

          <h1 className="splash-title">
            SaintSal<span className="trademark">™</span>
          </h1>
          <p className="splash-subtitle">
            IQ 157 Intelligence Platform
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="splash-actions">
          <button
            className="splash-btn primary"
            onClick={() => router.push('/auth/signup')}
          >
            <span>Get Started</span>
            <ArrowRight size={20} />
          </button>

          <button
            className="splash-btn secondary"
            onClick={() => router.push('/auth/login')}
          >
            Sign In
          </button>
        </div>

        {/* Features Preview */}
        <div className="splash-features">
          <div className="splash-feature">
            <div className="feature-icon">🧠</div>
            <p>Multi-Model AI</p>
          </div>
          <div className="splash-feature">
            <div className="feature-icon">🎙️</div>
            <p>Voice Integration</p>
          </div>
          <div className="splash-feature">
            <div className="feature-icon">⚡</div>
            <p>Real-time Streaming</p>
          </div>
          <div className="splash-feature">
            <div className="feature-icon">🔐</div>
            <p>Enterprise Security</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="splash-footer">
        <p>© 2025 SaintSal™. All rights reserved.</p>
      </footer>
    </div>
  );
}
