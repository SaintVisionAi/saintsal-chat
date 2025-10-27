'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function WhyPage() {
  const router = useRouter()

  return (
    <>
      <EnterpriseHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden pt-20">
        {/* Parallax Background */}
        <div className="parallax-bg">
          <Image
            src="/backgrounds/SaintSal + You.png"
            alt="SaintSal + You - Enterprise Partnership"  
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center pt-20">
          <h1 className="heading-hero animate-fade-in">
            <span className="block text-white">What Separates</span>
            <span className="block text-gradient-yellow">SaintVision AI™</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 animate-slide-up">
            We're not just building AI. We're building the future of human potential, 
            where technology serves purpose and intelligence serves the heart.
          </p>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
              <span className="text-sm text-blue-400">🔐 Patented HACP™ Technology</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
              <span className="text-sm text-green-400">💚 Faith-Guided Innovation</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
              <span className="text-sm text-yellow-400">👑 Enterprise-Grade Solutions</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <button
              onClick={() => router.push('/demo')}
              className="btn-primary"
            >
              🚀 Experience the Difference
            </button>
            <button
              onClick={() => router.push('/enterprise')}
              className="btn-secondary"
            >
              📖 Learn Our Story
            </button>
          </div>
        </div>
      </section>

      {/* Core Differentiators */}
      <section className="py-24 px-8 bg-saint-gray-950/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="heading-section mb-8">
            We're Doing <span className="text-gradient-yellow">Great Things</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-4xl mx-auto mb-16">
            To Change Lives. Every breakthrough, every innovation, every line of code is written with 
            one purpose: empowering human potential through divine wisdom and cutting-edge technology.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Patented HACP Technology */}
            <div className="enterprise-card text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-500 text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Patented HACP™ Technology</h3>
              <p className="text-gray-400 text-sm mb-6">
                Our Human-AI Connection Protocol (U.S. Patent 10,290,222) is the only AI system that 
                truly adapts to human emotion and escalates intelligently. This isn't just AI—it's 
                emotional intelligence.
              </p>
              <div className="text-yellow-500 text-sm font-semibold">
                Learn about our patent →
              </div>
            </div>

            {/* Faith-Guided Innovation */}
            <div className="enterprise-card text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-500 text-2xl">💚</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Faith-Guided Innovation</h3>
              <p className="text-gray-400 text-sm mb-6">
                Technology with purpose. Every feature we build is guided by principles of service, 
                integrity, and genuine care for human flourishing. AI that serves, not exploits.
              </p>
              <div className="text-blue-500 text-sm font-semibold">
                Discover our mission →
              </div>
            </div>

            {/* Enterprise-Grade Security */}
            <div className="enterprise-card text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-500 text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Enterprise-Grade Security</h3>
              <p className="text-gray-400 text-sm mb-6">
                GDPR, CCPA, SOC 2 compliant with AES-256 encryption. Delaware LP structure with 
                separated IP holdings for maximum protection and investor confidence.
              </p>
              <div className="text-green-500 text-sm font-semibold">
                View our compliance →
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/10 pt-16">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">$75M+</div>
              <div className="text-sm text-gray-500">Patent Portfolio Value</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">99.9%</div>
              <div className="text-sm text-gray-500">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-500 mb-2">25+</div>
              <div className="text-sm text-gray-500">AI Tools & Features</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-500 mb-2">100%</div>
              <div className="text-sm text-gray-500">Purpose-Driven</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Technology Stack */}
      <section className="py-24 px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="heading-section">
            <span className="text-gradient-yellow">Enterprise-Grade</span> Technology Stack
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16">
            Built on Azure Cognitive Services with patented HACP™ protocol and military-grade security.
          </p>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {/* Azure AI */}
            <div className="enterprise-card text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-blue-500 text-2xl">🧠</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-4">Azure AI</h3>
              <p className="text-gray-400 text-sm">
                Microsoft's enterprise AI infrastructure powers our cognitive engine
              </p>
            </div>

            {/* HACP Protocol */}
            <div className="enterprise-card text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-500 text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-4">HACP™ Protocol</h3>
              <p className="text-gray-400 text-sm">
                Patented adaptive escalation technology (US 10,290,222)
              </p>
            </div>

            {/* Real-Time Sync */}
            <div className="enterprise-card text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <span className="text-cyan-500 text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-4">Real-Time Sync</h3>
              <p className="text-gray-400 text-sm">
                Millisecond response times with global edge deployment
              </p>
            </div>

            {/* Multi-Modal AI */}
            <div className="enterprise-card text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-500 text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-4">Multi-Modal AI</h3>
              <p className="text-gray-400 text-sm">
                Text, voice, image, and gesture recognition in one platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-section">
            Ready to Experience the Difference?
          </h2>
          
          <p className="text-lg text-gray-400 mb-12">
            Join thousands of organizations who've discovered what happens when AI 
            meets purpose, when technology serves the heart, and when innovation 
            changes lives.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/demo')}
              className="btn-primary"
            >
              🚀 Start Your Journey
            </button>
            <button
              onClick={() => router.push('/enterprise')}
              className="btn-secondary"
            >
              💚 Learn Our Story
            </button>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}