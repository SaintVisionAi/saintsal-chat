'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function CRMPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('leads')

  const sampleLeads = [
    { id: 1, name: 'Acme Corp', status: 'Hot', value: '$125K', lastContact: '2 hours ago' },
    { id: 2, name: 'TechStart Inc', status: 'Warm', value: '$75K', lastContact: '1 day ago' },
    { id: 3, name: 'Global Systems', status: 'Cold', value: '$200K', lastContact: '1 week ago' },
  ]

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/FINTECH.png"
            alt="CRM Dashboard"  
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Enterprise <span className="text-gradient-yellow">CRM</span>
            </h1>
            <p className="text-gray-400">
              AI-powered customer relationship management with intelligent lead scoring and automation.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8">
            {['leads', 'customers', 'analytics', 'automation'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  activeTab === tab
                    ? 'bg-saint-yellow-500 text-black'
                    : 'glass text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Active Leads</h2>
                <button className="btn-primary">
                  + Add Lead
                </button>
              </div>

              <div className="glass rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="glass-yellow rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-saint-yellow-400">127</div>
                      <div className="text-sm text-gray-400">Hot Leads</div>
                    </div>
                    <div className="glass-blue rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-saint-blue-400">234</div>
                      <div className="text-sm text-gray-400">Warm Leads</div>
                    </div>
                    <div className="glass rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-400">89</div>
                      <div className="text-sm text-gray-400">Cold Leads</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Company</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Value</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Last Contact</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleLeads.map((lead) => (
                          <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-white">{lead.name}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                lead.status === 'Hot' ? 'bg-red-500/20 text-red-400' :
                                lead.status === 'Warm' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-white font-medium">{lead.value}</td>
                            <td className="py-3 px-4 text-gray-400">{lead.lastContact}</td>
                            <td className="py-3 px-4">
                              <button className="text-saint-yellow-500 hover:underline text-sm">
                                Contact
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">CRM Analytics</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="enterprise-card text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Conversion Rate</h3>
                  <div className="text-3xl font-bold text-green-500 mb-2">23.4%</div>
                  <p className="text-gray-400 text-sm">+5.2% this month</p>
                </div>
                
                <div className="enterprise-card text-center">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Pipeline Value</h3>
                  <div className="text-3xl font-bold text-saint-yellow-500 mb-2">$2.4M</div>
                  <p className="text-gray-400 text-sm">+12% this quarter</p>
                </div>
                
                <div className="enterprise-card text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Average Deal Size</h3>
                  <div className="text-3xl font-bold text-saint-blue-500 mb-2">$94K</div>
                  <p className="text-gray-400 text-sm">+8% this month</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">AI Automation</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass-yellow rounded-lg">
                  <div>
                    <h3 className="text-white font-semibold">SAINT SAL™ Lead Qualification</h3>
                    <p className="text-gray-400 text-sm">Automatically scores and qualifies incoming leads</p>
                  </div>
                  <span className="text-green-400 text-sm font-medium">ACTIVE</span>
                </div>
                
                <div className="flex items-center justify-between p-4 glass-blue rounded-lg">
                  <div>
                    <h3 className="text-white font-semibold">Email Campaign Automation</h3>
                    <p className="text-gray-400 text-sm">Personalized follow-up sequences powered by HACP™</p>
                  </div>
                  <span className="text-green-400 text-sm font-medium">ACTIVE</span>
                </div>
                
                <div className="flex items-center justify-between p-4 glass rounded-lg">
                  <div>
                    <h3 className="text-white font-semibold">Meeting Scheduler AI</h3>
                    <p className="text-gray-400 text-sm">Intelligent calendar management and booking</p>
                  </div>
                  <span className="text-yellow-400 text-sm font-medium">SETUP</span>
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