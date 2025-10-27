'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function DemoPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const testSAL = async () => {
    setLoading(true)
    setResponse('')
    
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000))
      setResponse(`SAINT SAL™ Response: I understand you're asking about "${message}". As an enterprise AI powered by HACP™ protocol, I can help analyze business scenarios, automate workflows, and provide intelligent insights. This is a demo showing our adaptive response capabilities.`)
    } catch (error) {
      setResponse('Demo error: Please try again.')
    }
    setLoading(false)
  }

  return (
    <>
      <EnterpriseHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden pt-20">
        {/* Parallax Background */}
        <div className="parallax-bg">
          <Image
            src="/backgrounds/LATENIGHT.png"
            alt="Live Demo"  
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
            <span className="text-xs tracking-wider text-green-400 font-medium">DEMO MODE ACTIVE</span>
          </div>
          <div className="hacp-active">
            <div className="hacp-dot" />
            <span className="text-xs tracking-[0.3em] text-saint-yellow-500 font-medium">HACP™ PROTOCOL</span>
            <div className="hacp-dot" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-20">
          <h1 className="heading-hero animate-fade-in">
            <span className="block text-white">SAINT SAL™</span>
            <span className="block text-gradient-yellow">Live Demo</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up">
            Experience the power of HACP™ dual AI intelligence. Test our enterprise-grade 
            agents with real business scenarios.
          </p>

          {/* Demo Interface */}
          <div className="glass rounded-2xl p-8 mb-8 animate-slide-up">
            <div className="mb-6">
              <label className="block text-left text-sm font-semibold mb-3 text-white">
                Ask SAINT SAL™ a Business Question:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Example: How can AI improve our customer service workflow?"
                className="w-full h-24 p-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-saint-yellow-500"
              />
            </div>
            
            <button
              onClick={testSAL}
              disabled={!message.trim() || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '🤖 SAINT SAL™ Thinking...' : '🚀 Ask SAINT SAL™'}
            </button>

            {response && (
              <div className="mt-6 p-4 glass-yellow rounded-lg text-left">
                <div className="text-saint-yellow-400 font-semibold mb-2 text-sm">
                  SAINT SAL™ Enterprise Response:
                </div>
                <div className="text-white text-sm leading-relaxed">
                  {response}
                </div>
              </div>
            )}
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="glass-blue rounded-lg p-4">
              <div className="text-saint-blue-500 font-bold mb-2">✓ GPT-5 Connected</div>
              <div className="text-xs text-gray-400">Primary intelligence active</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-green-500 font-bold mb-2">✓ HACP™ Protocol Active</div>
              <div className="text-xs text-gray-400">Emotional calibration enabled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Features */}
      <section className="py-24 px-8 bg-saint-gray-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-section">
              Demo <span className="text-gradient-yellow">Capabilities</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              This demo showcases a fraction of our enterprise AI capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="enterprise-card">
              <div className="text-4xl mb-6">🧠</div>
              <h3 className="text-xl font-semibold text-white mb-4">Business Intelligence</h3>
              <p className="text-gray-400 text-sm">
                SAINT SAL™ analyzes complex business scenarios and provides actionable insights 
                based on enterprise-grade data processing.
              </p>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">💚</div>
              <h3 className="text-xl font-semibold text-white mb-4">Emotional Calibration</h3>
              <p className="text-gray-400 text-sm">
                HACP™ protocol detects emotional context and adjusts responses for optimal 
                human-AI interaction and business outcomes.
              </p>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-4">Real-Time Processing</h3>
              <p className="text-gray-400 text-sm">
                Millisecond response times with enterprise-grade infrastructure. 
                Scale from startup to Fortune 500 without performance loss.
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => router.push('/signup')}
              className="btn-primary"
            >
              🚀 Start Your Free Trial
            </button>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}