'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function ProPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')

  const partnerMetrics = [
    { metric: 'Total Revenue', value: '$1.2M', change: '+23%', period: 'This Month' },
    { metric: 'Active Clients', value: '347', change: '+12%', period: 'This Week' },
    { metric: 'Conversion Rate', value: '34.7%', change: '+8%', period: 'This Quarter' },
    { metric: 'Avg Deal Size', value: '$3.4K', change: '+15%', period: 'This Month' }
  ]

  const recentDeals = [
    { client: 'TechCorp Solutions', value: '$15,000', status: 'Closed', date: '2 hours ago' },
    { client: 'Global Dynamics', value: '$8,500', status: 'Pending', date: '4 hours ago' },
    { client: 'Innovation Labs', value: '$12,000', status: 'Closed', date: '1 day ago' }
  ]

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/BATCAVEWORKIN.png"
            alt="PartnerTech Dashboard"  
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src="/logos/THE BEST MAIN LOGO + COOKIN.png"
                alt="PartnerTech"
                width={60}
                height={30}
                className="object-contain"
              />
              <div>
                <h1 className="text-4xl font-bold">
                  <span className="text-gradient-yellow">PartnerTech</span> Dashboard
                </h1>
                <p className="text-gray-400">
                  Complete business intelligence and partner management platform
                </p>
              </div>
            </div>

            <div className="hacp-active mb-6">
              <div className="hacp-dot" />
              <span className="text-xs tracking-[0.3em] text-saint-yellow-500 font-medium">PARTNERTECH™ OPERATIONAL</span>
              <div className="hacp-dot" />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 overflow-x-auto">
            {['dashboard', 'clients', 'revenue', 'analytics', 'tools'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-saint-yellow-500 text-black'
                    : 'glass text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {partnerMetrics.map((metric, index) => (
                  <div key={index} className="enterprise-card text-center">
                    <div className="text-2xl font-bold text-saint-yellow-500 mb-2">
                      {metric.value}
                    </div>
                    <div className="text-white font-semibold mb-1">{metric.metric}</div>
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className="text-green-400">{metric.change}</span>
                      <span className="text-gray-500">{metric.period}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Deals</h3>
                  <div className="space-y-3">
                    {recentDeals.map((deal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                        <div>
                          <div className="text-white font-medium">{deal.client}</div>
                          <div className="text-gray-400 text-sm">{deal.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-saint-yellow-500 font-bold">{deal.value}</div>
                          <div className={`text-xs ${
                            deal.status === 'Closed' ? 'text-green-400' : 'text-yellow-400'
                          }`}>
                            {deal.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Automation Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 glass-yellow rounded-lg">
                      <div>
                        <div className="text-white font-medium">Lead Generation AI</div>
                        <div className="text-gray-400 text-sm">SAINT SAL™ processing 24/7</div>
                      </div>
                      <span className="text-green-400 text-sm">ACTIVE</span>
                    </div>

                    <div className="flex items-center justify-between p-3 glass-blue rounded-lg">
                      <div>
                        <div className="text-white font-medium">Email Automation</div>
                        <div className="text-gray-400 text-sm">Personalized campaigns</div>
                      </div>
                      <span className="text-green-400 text-sm">ACTIVE</span>
                    </div>

                    <div className="flex items-center justify-between p-3 glass rounded-lg">
                      <div>
                        <div className="text-white font-medium">CRM Sync</div>
                        <div className="text-gray-400 text-sm">Real-time data flow</div>
                      </div>
                      <span className="text-green-400 text-sm">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-6">
                <button 
                  onClick={() => router.push('/crm')}
                  className="enterprise-card text-center hover:scale-105"
                >
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Launch CRM</h3>
                  <p className="text-gray-400 text-sm">Manage customer relationships</p>
                </button>

                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="enterprise-card text-center hover:scale-105"
                >
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-white mb-2">View Analytics</h3>
                  <p className="text-gray-400 text-sm">Business intelligence reports</p>
                </button>

                <button 
                  onClick={() => router.push('/agents')}
                  className="enterprise-card text-center hover:scale-105"
                >
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Deploy Agent</h3>
                  <p className="text-gray-400 text-sm">Launch AI automation</p>
                </button>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Business Analytics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="enterprise-card text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Growth Rate</h3>
                  <div className="text-3xl font-bold text-green-500 mb-2">127%</div>
                  <p className="text-gray-400 text-sm">Year over year</p>
                </div>
                
                <div className="enterprise-card text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Monthly Recurring Revenue</h3>
                  <div className="text-3xl font-bold text-saint-yellow-500 mb-2">$847K</div>
                  <p className="text-gray-400 text-sm">+34% this quarter</p>
                </div>
                
                <div className="enterprise-card text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Client Retention</h3>
                  <div className="text-3xl font-bold text-saint-blue-500 mb-2">96.8%</div>
                  <p className="text-gray-400 text-sm">Industry leading</p>
                </div>
              </div>
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Partner Tools</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="enterprise-card">
                  <div className="text-4xl mb-4">🔧</div>
                  <h3 className="text-lg font-semibold text-white mb-4">API Integration</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Connect PartnerTech with your existing business systems and workflows.
                  </p>
                  <button className="btn-outline">Configure APIs</button>
                </div>

                <div className="enterprise-card">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold text-white mb-4">Custom Reports</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Generate custom business intelligence reports and dashboards.
                  </p>
                  <button className="btn-outline">Create Report</button>
                </div>

                <div className="enterprise-card">
                  <div className="text-4xl mb-4">🎓</div>
                  <h3 className="text-lg font-semibold text-white mb-4">Training Hub</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Access training materials and certification programs for your team.
                  </p>
                  <button className="btn-outline">Start Training</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}