'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function PlaygroundPage() {
  const router = useRouter()

  return (
    <>
      <EnterpriseHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden pt-20">
        {/* Parallax Background */}
        <div className="parallax-bg">
          <Image
            src="/backgrounds/BATCAVEWORKIN.png"
            alt="AI Playground"  
            fill
            className="object-cover"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        {/* Status Indicators */}
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-4 z-10">
          <div className="hacp-active">
            <div className="hacp-dot" />
            <span className="text-xs tracking-[0.3em] text-saint-yellow-500 font-medium">PLAYGROUND MODE</span>
            <div className="hacp-dot" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center pt-20">
          <h1 className="heading-hero animate-fade-in">
            <span className="block text-white">AI</span>
            <span className="block text-gradient-yellow">Playground</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 animate-slide-up">
            Experiment with enterprise-grade AI agents. Test HACP™ protocol responses, 
            build custom workflows, and deploy intelligent automation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in">
            <button
              onClick={() => router.push('/agents')}
              className="btn-primary"
            >
              🤖 Launch Agent Console
            </button>
            <button
              onClick={() => router.push('/demo')}
              className="btn-secondary"
            >
              📺 Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-8 bg-saint-gray-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-section">
              Enterprise <span className="text-gradient-yellow">Testing Environment</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="enterprise-card">
              <div className="text-4xl mb-6">🧪</div>
              <h3 className="text-xl font-semibold text-white mb-4">AI Agent Testing</h3>
              <p className="text-gray-400 text-sm">
                Test custom AI agents with real business scenarios. HACP™ protocol provides 
                intelligent escalation and emotional calibration.
              </p>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-4">Live Data Integration</h3>
              <p className="text-gray-400 text-sm">
                Connect real business data streams. Test API integrations, CRM connections, 
                and database queries in safe environment.
              </p>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-xl font-semibold text-white mb-4">Performance Analytics</h3>
              <p className="text-gray-400 text-sm">
                Real-time metrics on AI performance, response times, and business impact. 
                Optimize before deploying to production.
              </p>
            </div>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}