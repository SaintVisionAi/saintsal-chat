'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function HomePage() {
  const router = useRouter()

  return (
    <>
      <EnterpriseHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
        {/* Parallax Background */}
        <div className="parallax-bg">
          <Image
            src="/backgrounds/FUTURESV.png"
            alt="Enterprise AI Intelligence Platform"  
            fill
            className="object-cover"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        {/* Status Indicators */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-4 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs tracking-wider text-green-400 font-medium">SYSTEMS OPERATIONAL</span>
          </div>
          <div className="hacp-active">
            <div className="hacp-dot" />
            <span className="text-xs tracking-[0.3em] text-saint-yellow-500 font-medium">HACP™ PROTOCOL ACTIVE</span>
            <div className="hacp-dot" />
          </div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-saint-blue-500/10 border border-saint-blue-500/30 rounded-full">
            <div className="w-2 h-2 bg-saint-blue-500 rounded-full animate-pulse" />
            <span className="text-xs tracking-wider text-saint-blue-400 font-medium">AI MODELS SYNCHRONIZED</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center pt-20">
          <div className="mb-8">
            <div className="text-lg tracking-[0.5em] text-gray-400 font-light mb-4">
              ENTERPRISE AI INTELLIGENCE PLATFORM
            </div>
          </div>

          <h1 className="heading-hero animate-fade-in">
            <span className="block text-white">Responsible</span>
            <span className="block text-gradient-yellow">Intelligence</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
            The first AI platform that <span className="text-saint-yellow-400">thinks</span>, <span className="text-saint-blue-400">learns</span>, and <span className="text-green-400">evolves</span> with your business
          </p>

          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-12 animate-slide-up">
            Deploy enterprise-grade AI agents in minutes. Scale from startup to Fortune 500. 
            <span className="text-saint-yellow-400 font-semibold"> Patented technology</span> that 
            adapts to your unique workflows and objectives.
          </p>

          <div className="mb-16 animate-slide-up">
            <div className="text-lg tracking-[0.3em] text-saint-yellow-400 font-light">
              WHERE <span className="text-saint-blue-400">INNOVATION</span> MEETS <span className="text-green-400">INTELLIGENCE</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in">
            <button
              onClick={() => router.push('/playground')}
              className="btn-primary"
            >
              Launch Playground →
            </button>
            <button
              onClick={() => router.push('/demo')}
              className="btn-secondary"
            >
              Watch Demo ○
            </button>
            <button
              onClick={() => router.push('/pricing')}
              className="btn-outline"
            >
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-8 bg-saint-gray-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-section">
              Enterprise-Grade <span className="text-gradient-yellow">AI Solutions</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Built for businesses that demand reliability, security, and results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="enterprise-card">
              <div className="text-4xl mb-6">🧠</div>
              <h3 className="text-xl font-semibold text-white mb-4">Adaptive Intelligence</h3>
              <p className="text-gray-400 text-sm mb-6">
                AI agents that learn from every interaction, continuously improving their understanding 
                of your business context and decision-making patterns.
              </p>
              <div className="text-saint-yellow-500 text-sm font-semibold">
                HACP™ Protocol Powered
              </div>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-4">Instant Deployment</h3>
              <p className="text-gray-400 text-sm mb-6">
                Deploy enterprise-ready AI solutions in under 5 minutes. No infrastructure setup, 
                no model training, no technical expertise required.
              </p>
              <div className="text-saint-blue-500 text-sm font-semibold">
                Zero Configuration
              </div>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">🛡️</div>
              <h3 className="text-xl font-semibold text-white mb-4">Enterprise Security</h3>
              <p className="text-gray-400 text-sm mb-6">
                Military-grade encryption, SOC 2 compliance, and zero-trust architecture. 
                Your data never leaves your control.
              </p>
              <div className="text-green-500 text-sm font-semibold">
                SOC 2 Certified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-section">
            Ready to Transform <span className="text-gradient-yellow">Your Business</span>?
          </h2>
          
          <p className="text-lg text-gray-400 mb-12">
            Join industry leaders who've accelerated their growth with SaintVision AI. 
            Start your enterprise AI transformation today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/signup')}
              className="btn-primary"
            >
              🚀 Start Free Trial
            </button>
            <button
              onClick={() => router.push('/enterprise')}
              className="btn-secondary"
            >
              📊 Enterprise Demo
            </button>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}