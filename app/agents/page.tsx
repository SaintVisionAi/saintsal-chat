'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function AgentsPage() {
  const router = useRouter()

  return (
    <>
      <EnterpriseHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden pt-20">
        {/* Parallax Background */}
        <div className="parallax-bg">
          <Image
            src="/backgrounds/AIGUY.png"
            alt="AI Agents"  
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
            <span className="text-xs tracking-wider text-green-400 font-medium">AGENTS ACTIVE</span>
          </div>
          <div className="hacp-active">
            <div className="hacp-dot" />
            <span className="text-xs tracking-[0.3em] text-saint-yellow-500 font-medium">HACP™ PROTOCOL</span>
            <div className="hacp-dot" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center pt-20">
          <h1 className="heading-hero animate-fade-in">
            <span className="block text-white">Enterprise</span>
            <span className="block text-gradient-yellow">AI Agents</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 animate-slide-up">
            Deploy intelligent agents that think, learn, and evolve with your business. 
            Powered by HACP™ protocol for adaptive enterprise automation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in">
            <button
              onClick={() => router.push('/playground')}
              className="btn-primary"
            >
              🚀 Create Agent
            </button>
            <button
              onClick={() => router.push('/warroom')}
              className="btn-secondary"
            >
              🎯 WarRoom
            </button>
          </div>
        </div>
      </section>

      {/* Agent Types */}
      <section className="py-24 px-8 bg-saint-gray-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-section">
              Intelligent <span className="text-gradient-yellow">Agent Types</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="enterprise-card">
              <div className="text-4xl mb-6">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-4">SaintSal™</h3>
              <p className="text-gray-400 text-sm mb-4">
                Primary AI workhorse powered by GPT-5. Handles complex business logic, 
                strategic decisions, and enterprise automation.
              </p>
              <div className="text-saint-yellow-500 text-sm font-semibold">
                GPT-5 Powered
              </div>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">💚</div>
              <h3 className="text-xl font-semibold text-white mb-4">Athena.ai</h3>
              <p className="text-gray-400 text-sm mb-4">
                Emotional intelligence agent for healthcare, therapy, and human-centered 
                interactions. HACP™ calibrated for empathy.
              </p>
              <div className="text-green-500 text-sm font-semibold">
                Healthcare Certified
              </div>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">🎓</div>
              <h3 className="text-xl font-semibold text-white mb-4">SVTTeach.ai</h3>
              <p className="text-gray-400 text-sm mb-4">
                Educational agent for training, onboarding, and knowledge transfer. 
                Adaptive learning paths for enterprise teams.
              </p>
              <div className="text-saint-blue-500 text-sm font-semibold">
                Educational Focus
              </div>
            </div>

            <div className="enterprise-card">
              <div className="text-4xl mb-6">⚖️</div>
              <h3 className="text-xl font-semibold text-white mb-4">SVTLegal.ai</h3>
              <p className="text-gray-400 text-sm mb-4">
                Legal compliance and contract analysis agent. Ensures regulatory 
                adherence and risk management across operations.
              </p>
              <div className="text-purple-500 text-sm font-semibold">
                Legal Compliance
              </div>
            </div>

            <div className="enterprise-card">
              <div className="text-4xl mb-6">🔧</div>
              <h3 className="text-xl font-semibold text-white mb-4">PartnerTech.ai</h3>
              <p className="text-gray-400 text-sm mb-4">
                Business operations agent for CRM, lead management, and workflow 
                automation. Integrates with existing enterprise systems.
              </p>
              <div className="text-orange-500 text-sm font-semibold">
                Business Operations
              </div>
            </div>

            <div className="enterprise-card">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-4">Custom Agents</h3>
              <p className="text-gray-400 text-sm mb-4">
                Build specialized agents for your unique business needs. Full API access 
                and custom training on your proprietary data.
              </p>
              <div className="text-cyan-500 text-sm font-semibold">
                Fully Customizable
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}