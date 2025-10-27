'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function WorkstationPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setSearchResults([
      {
        type: 'Agent',
        title: 'SAINT SAL™ Business Intelligence',
        description: 'Enterprise AI agent for complex business analysis and strategic decision-making.',
        category: 'Business Intelligence',
        lastUpdated: '2 hours ago',
        status: 'Active'
      },
      {
        type: 'Workflow',
        title: 'Customer Onboarding Automation',
        description: 'Automated workflow for new customer registration, verification, and account setup.',
        category: 'CRM Automation',
        lastUpdated: '1 day ago',
        status: 'Active'
      },
      {
        type: 'Template',
        title: 'Financial Report Generator',
        description: 'AI-powered template for generating comprehensive financial reports and analysis.',
        category: 'Finance',
        lastUpdated: '3 days ago',
        status: 'Draft'
      },
      {
        type: 'Integration',
        title: 'Salesforce HACP™ Connector',
        description: 'Direct integration between Salesforce CRM and HACP™ protocol for enhanced lead scoring.',
        category: 'CRM Integration',
        lastUpdated: '1 week ago',
        status: 'Active'
      }
    ])
    setIsSearching(false)
  }

  const quickActions = [
    { icon: '🤖', title: 'Create Agent', description: 'Build custom AI agent', action: () => router.push('/agents') },
    { icon: '⚡', title: 'New Workflow', description: 'Design automation workflow', action: () => router.push('/playground') },
    { icon: '📊', title: 'Analytics', description: 'View performance metrics', action: () => router.push('/crm') },
    { icon: '🔧', title: 'Integrations', description: 'Connect external systems', action: () => router.push('/enterprise') }
  ]

  const recentWork = [
    { type: 'Agent', name: 'Customer Support Bot', modified: '2 hours ago', status: 'Active' },
    { type: 'Workflow', name: 'Invoice Processing', modified: '4 hours ago', status: 'Testing' },
    { type: 'Template', name: 'Sales Report', modified: '1 day ago', status: 'Published' },
    { type: 'Integration', name: 'HubSpot Sync', modified: '2 days ago', status: 'Active' }
  ]

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/LATENIGHT.png"
            alt="AI Workstation"  
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              AI <span className="text-gradient-yellow">Workstation</span>
            </h1>
            <p className="text-gray-400 mb-6">
              Search, discover, and deploy AI solutions across your enterprise ecosystem.
            </p>

            <div className="hacp-active mb-6">
              <div className="hacp-dot" />
              <span className="text-xs tracking-[0.3em] text-saint-yellow-500 font-medium">WORKSTATION ACTIVE</span>
              <div className="hacp-dot" />
            </div>
          </div>

          {/* Search Interface */}
          <div className="glass rounded-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search agents, workflows, templates, integrations..."
                  className="w-full p-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-saint-yellow-500"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="btn-primary disabled:opacity-50"
              >
                {isSearching ? '🔍 Searching...' : '🔍 Search Enterprise'}
              </button>
            </div>

            {/* Search Filters */}
            <div className="flex flex-wrap gap-2">
              {['all', 'agents', 'workflows', 'templates', 'integrations'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeFilter === filter
                      ? 'bg-saint-yellow-500 text-black'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Search Results</h3>
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div key={index} className="glass rounded-lg p-4 hover:bg-white/5 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.type === 'Agent' ? 'bg-yellow-500/20 text-yellow-400' :
                            result.type === 'Workflow' ? 'bg-blue-500/20 text-blue-400' :
                            result.type === 'Template' ? 'bg-green-500/20 text-green-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {result.type}
                          </span>
                          <h4 className="text-white font-semibold">{result.title}</h4>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{result.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Category: {result.category}</span>
                          <span>Updated: {result.lastUpdated}</span>
                          <span className={`${
                            result.status === 'Active' ? 'text-green-400' :
                            result.status === 'Draft' ? 'text-yellow-400' :
                            'text-gray-400'
                          }`}>
                            {result.status}
                          </span>
                        </div>
                      </div>
                      <button className="text-saint-yellow-500 hover:underline text-sm ml-4">
                        Deploy →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="enterprise-card text-center hover:scale-105"
              >
                <div className="text-4xl mb-4">{action.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </button>
            ))}
          </div>

          {/* Recent Work */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Work</h3>
              <div className="space-y-3">
                {recentWork.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/5 transition">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'Agent' ? 'bg-yellow-500/20 text-yellow-400' :
                          item.type === 'Workflow' ? 'bg-blue-500/20 text-blue-400' :
                          item.type === 'Template' ? 'bg-green-500/20 text-green-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                      <div className="text-gray-400 text-sm">{item.modified}</div>
                    </div>
                    <span className={`text-xs font-medium ${
                      item.status === 'Active' ? 'text-green-400' :
                      item.status === 'Testing' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 glass-yellow rounded-lg">
                  <div>
                    <div className="text-white font-medium">HACP™ Protocol</div>
                    <div className="text-gray-400 text-sm">Core AI processing engine</div>
                  </div>
                  <span className="text-green-400 text-sm">OPERATIONAL</span>
                </div>

                <div className="flex items-center justify-between p-3 glass-blue rounded-lg">
                  <div>
                    <div className="text-white font-medium">Enterprise APIs</div>
                    <div className="text-gray-400 text-sm">External system connections</div>
                  </div>
                  <span className="text-green-400 text-sm">OPERATIONAL</span>
                </div>

                <div className="flex items-center justify-between p-3 glass rounded-lg">
                  <div>
                    <div className="text-white font-medium">AI Model Pool</div>
                    <div className="text-gray-400 text-sm">GPT-5, Claude 4, Custom models</div>
                  </div>
                  <span className="text-green-400 text-sm">OPERATIONAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}