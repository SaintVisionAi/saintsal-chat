'use client';
import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    // Simulate sending reset email
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="auth-container">
      {/* Background */}
      <div className="auth-background"></div>

      {/* Auth Card */}
      <div className="auth-card">
        {/* Back Button */}
        <Link href="/auth/login" className="auth-back">
          <ArrowLeft size={20} />
          <span>Back to Login</span>
        </Link>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="auth-header">
              <h1 className="auth-title">Reset password</h1>
              <p className="auth-subtitle">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="auth-header">
              <div className="mb-4 text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-green-500" size={32} />
                </div>
              </div>
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-subtitle">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Didn't receive an email? Check your spam folder or{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-gold hover:text-gold-hover underline"
                >
                  try again
                </button>
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/auth/login"
                className="block w-full text-center py-3 px-4 rounded-lg bg-glass border border-glass-border hover:bg-glass-hover transition-all"
              >
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
