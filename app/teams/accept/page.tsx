'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, Check, X, Loader2 } from 'lucide-react';

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
    if (!token) {
      setError('Invalid invitation link');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/teams/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        setAccepted(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(data.error || 'Failed to accept invitation');
      }
    } catch (err) {
      setError('Failed to accept invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Invitation</h1>
          <p className="text-gray-400 mb-6">This invitation link is not valid.</p>
          <button onClick={() => router.push('/splash')} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4 animate-bounce">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to the Team!</h1>
          <p className="text-gray-400 mb-6">You've successfully joined the team. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Invitation Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3">
            <button onClick={() => router.push('/splash')} className="flex-1 btn-secondary">
              Go to Home
            </button>
            <button onClick={() => setError('')} className="flex-1 btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Mobile-optimized card */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-purple-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 border-2 border-yellow-500/30 mb-6">
            <Users className="w-10 h-10 text-yellow-500" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">Team Invitation</h1>
          <p className="text-lg text-gray-300 mb-8">
            You've been invited to join a team on SaintSal™
          </p>

          {/* Large, touch-friendly accept button */}
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full btn-primary text-lg py-4 mb-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Accepting...
              </>
            ) : (
              <>
                <Check className="w-6 h-6" />
                Accept Invitation
              </>
            )}
          </button>

          <button
            onClick={() => router.push('/splash')}
            disabled={loading}
            className="w-full btn-secondary py-3"
          >
            Maybe Later
          </button>
        </div>

        {/* Info section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            By accepting, you'll join the team and get access to shared resources and features.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
