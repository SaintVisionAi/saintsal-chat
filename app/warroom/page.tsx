'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'

export default function WarRoomPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <>
      <EnterpriseHeader />
      
      <div className="min-h-screen bg-black text-white pt-20 flex">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-16'} glass border-r border-white/10`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-bold text-white ${sidebarOpen ? 'block' : 'hidden'}`}>
                WarRoom Command
              </h2>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Status Indicators */}
            {sidebarOpen && (
              <div className="space-y-3 mb-6">
                <div className="hacp-active">
                  <div className="hacp-dot" />
                  <span className="text-xs tracking-[0.3em] text-saint-yellow-500 font-medium">HACP™ ACTIVE</span>
                  <div className="hacp-dot" />
                </div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs tracking-wider text-green-400 font-medium">SYSTEMS OPERATIONAL</span>
                </div>
              </div>
            )}

            {/* Productive Business Tools */}
            {sidebarOpen && (
              <div className="space-y-2 mb-8">
                <div className="text-xs tracking-[0.3em] text-gray-600 mb-3">PRODUCTIVE TOOLS</div>
                
                <button className="w-full text-left p-3 rounded-lg transition flex items-center space-x-3 glass hover:bg-white/10">
                  <span className="text-lg">📊</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">Business Analytics</div>
                    <div className="text-xs text-gray-500">KPI Dashboard & Reports</div>
                  </div>
                </button>

                <button className="w-full text-left p-3 rounded-lg transition flex items-center space-x-3 glass hover:bg-white/10">
                  <span className="text-lg">💰</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">Financial Modeling</div>
                    <div className="text-xs text-gray-500">Revenue Projections</div>
                  </div>
                </button>

                <button className="w-full text-left p-3 rounded-lg transition flex items-center space-x-3 glass hover:bg-white/10">
                  <span className="text-lg">⚖️</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">Legal Documents</div>
                    <div className="text-xs text-gray-500">Contract Analysis</div>
                  </div>
                </button>

                <button className="w-full text-left p-3 rounded-lg transition flex items-center space-x-3 glass hover:bg-white/10">
                  <span className="text-lg">🚀</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">Growth Strategy</div>
                    <div className="text-xs text-gray-500">Market Expansion</div>
                  </div>
                </button>

                <button className="w-full text-left p-3 rounded-lg transition flex items-center space-x-3 glass hover:bg-white/10">
                  <span className="text-lg">🤝</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white">CRM Automation</div>
                    <div className="text-xs text-gray-500">Lead Management</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Center Area */}
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4">
                  Enterprise <span className="text-gradient-yellow">WarRoom</span>
                </h1>
                <p className="text-gray-400">
                  Command center for AI-powered business operations
                </p>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <button 
                  onClick={() => router.push('/agents')}
                  className="enterprise-card text-center hover:scale-105"
                >
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Deploy Agent</h3>
                  <p className="text-gray-400 text-sm">Launch new AI agent</p>
                </button>

                <button 
                  onClick={() => router.push('/crm')}
                  className="enterprise-card text-center hover:scale-105"
                >
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold text-white mb-2">CRM Dashboard</h3>
                  <p className="text-gray-400 text-sm">Manage customer data</p>
                </button>

                <button 
                  onClick={() => router.push('/analytics')}
                  className="enterprise-card text-center hover:scale-105"
                >
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
                  <p className="text-gray-400 text-sm">Business intelligence</p>
                </button>
              </div>

              {/* Active Operations */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Operations</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm text-white">SAINT SAL™ Processing Leads</span>
                    </div>
                    <span className="text-xs text-green-400">ACTIVE</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-sm text-white">Athena.ai Patient Monitoring</span>
                    </div>
                    <span className="text-xs text-blue-400">ACTIVE</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      <span className="text-sm text-white">SVTTeach.ai Training Module</span>
                    </div>
                    <span className="text-xs text-purple-400">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-80 glass border-l border-white/10 p-4">
            <h3 className="text-lg font-semibold text-white mb-4">LLM Intelligence</h3>
            
            <div className="space-y-4 mb-6">
              <div className="glass-yellow rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">GPT-5 Turbo</span>
                  <span className="text-xs text-green-400">ACTIVE</span>
                </div>
                <div className="text-xs text-gray-400">Main AI workhorse for complex reasoning</div>
              </div>

              <div className="glass-blue rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">Claude 4 Sonnet</span>
                  <span className="text-xs text-green-400">ACTIVE</span>
                </div>
                <div className="text-xs text-gray-400">Emotional intelligence & analysis</div>
              </div>

              <div className="glass rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">SAINTSAL™ RAG</span>
                  <span className="text-xs text-green-400">ACTIVE</span>
                </div>
                <div className="text-xs text-gray-400">Custom enterprise knowledge base</div>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-white mb-3">SaintVision Tech Stack</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div>• HACP™ Protocol (Patent #10,290,222)</div>
              <div>• Azure Cognitive Services</div>
              <div>• Real-time emotional calibration</div>
              <div>• Enterprise API integrations</div>
              <div>• Custom model training</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}