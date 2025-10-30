'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams?.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    // Call verification API
    fetch(`/api/auth/verify?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');

          // Redirect to home page after 3 seconds
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      })
      .catch(error => {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Failed to verify email. Please try again.');
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full mb-4">
            <h1 className="text-2xl font-bold text-black">SAINTSAL™</h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-[rgba(255,215,0,0.1)] to-[rgba(138,43,226,0.1)] border-2 border-[rgba(255,215,0,0.3)] rounded-2xl p-8">

          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              <div className="inline-block w-20 h-20 bg-[rgba(255,215,0,0.2)] border-2 border-[rgba(255,215,0,0.3)] rounded-full flex items-center justify-center mb-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FFD700]"></div>
              </div>
              <h2 className="text-white text-2xl font-bold mb-4">Verifying Your Email</h2>
              <p className="text-gray-400">Please wait while we verify your email address...</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="inline-block w-20 h-20 bg-[rgba(255,215,0,0.2)] border-2 border-[rgba(255,215,0,0.3)] rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-white text-2xl font-bold mb-4">Email Verified!</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              <div className="bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] rounded-lg p-4 mb-6">
                <p className="text-green-400 text-sm">
                  Your account is now fully activated. Redirecting you to the dashboard...
                </p>
              </div>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="inline-block w-20 h-20 bg-[rgba(239,68,68,0.2)] border-2 border-[rgba(239,68,68,0.3)] rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">❌</span>
              </div>
              <h2 className="text-white text-2xl font-bold mb-4">Verification Failed</h2>
              <p className="text-gray-300 mb-6">{message}</p>
              <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">
                  The verification link may have expired or is invalid.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:shadow-lg transition-all"
                >
                  Create New Account
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full py-3 px-6 bg-[rgba(255,255,255,0.1)] text-white font-bold rounded-lg hover:bg-[rgba(255,255,255,0.2)] transition-all"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            © 2024 SaintSal™. Advanced AI Platform.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-block w-20 h-20 bg-[rgba(255,215,0,0.2)] border-2 border-[rgba(255,215,0,0.3)] rounded-full flex items-center justify-center mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FFD700]"></div>
          </div>
          <h2 className="text-white text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
