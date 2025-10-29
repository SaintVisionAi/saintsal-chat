'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export default function SplashPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

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
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Clean Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img
              src="https://files.catbox.moe/i3mlno.png"
              alt="SaintSal Logo"
              className="w-12 h-12 object-contain opacity-80"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-yellow-400 font-light text-sm tracking-[0.3em] uppercase opacity-60">
              COOKIN' KNOWLEDGE
            </div>
          </div>
          <div className="text-xs text-white/40 font-light tracking-wider">
            EST. 2023
          </div>
        </div>
      </div>

      {/* Main Content - CLEAN & MINIMAL */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">

          {/* Hero Title */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-7xl md:text-8xl font-light tracking-tight mb-8 leading-[0.9]">
              <span className="block text-white">
                Responsible
              </span>
              <span className="block text-yellow-400 font-semibold">
                Intelligence
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-xl md:text-2xl text-white/90 mb-16 max-w-3xl mx-auto leading-relaxed">
              IQ 157 Intelligence Platform with{" "}
              <span className="text-yellow-400 font-semibold">multi-model AI</span>
              , real-time streaming, and enterprise-grade solutions that transform businesses.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => router.push('/auth/signup')}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-2xl px-12 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-4"
              >
                <span className="tracking-wide">Start Cookin</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="text-xl px-12 py-4 rounded-2xl border-2 border-blue-500 text-blue-500 hover:bg-blue-500/10 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                <Play className="w-6 h-6" />
                Sign In
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Essential Content Below Hero */}
      <div className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">IQ 157</div>
              <div className="text-sm text-white/60">Intelligence Level</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-white/60">Always Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-sm text-white/60">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">Multi-AI</div>
              <div className="text-sm text-white/60">GPT-4 + Claude</div>
            </div>
          </div>

          {/* Quick Access Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/pricing" className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 transition-all duration-300 text-center">
              <div className="text-2xl mb-2">💳</div>
              <div className="text-sm font-medium text-white">Pricing</div>
            </Link>
            <Link href="/" className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all duration-300 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-medium text-white">Chat</div>
            </Link>
            <Link href="/auth/signup" className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 text-center">
              <div className="text-2xl mb-2">👤</div>
              <div className="text-sm font-medium text-white">Sign Up</div>
            </Link>
            <Link href="/contact" className="group p-6 rounded-xl bg-white/5 border border-white/10 hover:border-green-400/50 transition-all duration-300 text-center">
              <div className="text-2xl mb-2">📧</div>
              <div className="text-sm font-medium text-white">Contact</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Brand */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-center text-sm text-white/50">
          <span>Powered by</span>
          <span className="text-yellow-400 font-bold mx-2">SAINTSAL™</span>
          <span>• Responsible Intelligence - Cookin' Knowledge</span>
        </div>
      </div>
    </div>
  );
}
