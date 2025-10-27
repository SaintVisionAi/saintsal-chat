'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function DocsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'api-reference', name: 'API Reference', icon: '📚' },
    { id: 'hacp-protocol', name: 'HACP™ Protocol', icon: '🔐' },
    { id: 'enterprise', name: 'Enterprise', icon: '🏢' },
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'integration', name: 'Integration', icon: '🔗' },
    { id: 'best-practices', name: 'Best Practices', icon: '⭐' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' }
  ]

  const docSections = {
    'getting-started': [
      {
        title: 'Quick Start Guide',
        description: 'Get up and running with SaintVision AI in under 10 minutes',
        readTime: '10 min',
        difficulty: 'Beginner',
        topics: ['Account setup', 'First API call', 'Authentication', 'Basic concepts']
      },
      {
        title: 'Platform Overview',
        description: 'Understanding the SaintVision AI ecosystem and core components',
        readTime: '15 min',
        difficulty: 'Beginner',
        topics: ['Architecture', 'Core features', 'Pricing models', 'Use cases']
      },
      {
        title: 'Authentication Setup',
        description: 'Configure secure authentication for your applications',
        readTime: '12 min',
        difficulty: 'Intermediate',
        topics: ['API keys', 'OAuth 2.0', 'JWT tokens', 'Enterprise SSO']
      },
      {
        title: 'First Integration',
        description: 'Build your first AI-powered application with our platform',
        readTime: '25 min',
        difficulty: 'Intermediate',
        topics: ['SDK installation', 'Code examples', 'Error handling', 'Testing']
      }
    ],
    'api-reference': [
      {
        title: 'REST API Endpoints',
        description: 'Complete reference for all REST API endpoints and parameters',
        readTime: '30 min',
        difficulty: 'Intermediate',
        topics: ['HTTP methods', 'Request/response formats', 'Rate limiting', 'Pagination']
      },
      {
        title: 'GraphQL API',
        description: 'Flexible data querying with our GraphQL interface',
        readTime: '20 min',
        difficulty: 'Advanced',
        topics: ['Schema definition', 'Queries', 'Mutations', 'Subscriptions']
      },
      {
        title: 'WebSocket Real-time API',
        description: 'Real-time communication for interactive AI applications',
        readTime: '18 min',
        difficulty: 'Advanced',
        topics: ['Connection management', 'Event handling', 'Streaming responses', 'Error recovery']
      },
      {
        title: 'SDK Documentation',
        description: 'Language-specific SDKs and code examples',
        readTime: '45 min',
        difficulty: 'Intermediate',
        topics: ['Python SDK', 'JavaScript SDK', 'Java SDK', 'C# SDK']
      }
    ],
    'hacp-protocol': [
      {
        title: 'HACP™ Protocol Overview',
        description: 'Understanding our patented Human-AI Connection Protocol',
        readTime: '20 min',
        difficulty: 'Intermediate',
        topics: ['Protocol principles', 'Emotional intelligence', 'Adaptive responses', 'Use cases']
      },
      {
        title: 'Implementation Guide',
        description: 'Step-by-step guide to implementing HACP™ in your applications',
        readTime: '35 min',
        difficulty: 'Advanced',
        topics: ['Configuration', 'Calibration', 'Testing', 'Optimization']
      },
      {
        title: 'Emotional Intelligence Features',
        description: 'Leveraging AI emotional intelligence for better user experiences',
        readTime: '25 min',
        difficulty: 'Intermediate',
        topics: ['Emotion detection', 'Response adaptation', 'Context awareness', 'Learning']
      },
      {
        title: 'Advanced Configuration',
        description: 'Fine-tuning HACP™ for specific enterprise use cases',
        readTime: '40 min',
        difficulty: 'Expert',
        topics: ['Custom models', 'Domain adaptation', 'Performance tuning', 'Monitoring']
      }
    ],
    'enterprise': [
      {
        title: 'Enterprise Deployment',
        description: 'Large-scale deployment strategies for enterprise environments',
        readTime: '30 min',
        difficulty: 'Advanced',
        topics: ['Architecture patterns', 'Scalability', 'Load balancing', 'High availability']
      },
      {
        title: 'Security & Compliance',
        description: 'Meeting enterprise security and regulatory requirements',
        readTime: '35 min',
        difficulty: 'Advanced',
        topics: ['SOC 2 compliance', 'GDPR compliance', 'Data encryption', 'Access controls']
      },
      {
        title: 'White-label Solutions',
        description: 'Customizing the platform for white-label deployments',
        readTime: '25 min',
        difficulty: 'Advanced',
        topics: ['Branding customization', 'Custom domains', 'UI theming', 'Feature flags']
      },
      {
        title: 'Monitoring & Analytics',
        description: 'Enterprise-grade monitoring and business intelligence',
        readTime: '28 min',
        difficulty: 'Intermediate',
        topics: ['Metrics dashboard', 'Custom analytics', 'Alerting', 'Reporting']
      }
    ],
    'security': [
      {
        title: 'Security Overview',
        description: 'Comprehensive security measures and best practices',
        readTime: '22 min',
        difficulty: 'Intermediate',
        topics: ['Encryption', 'Authentication', 'Authorization', 'Audit logging']
      },
      {
        title: 'Data Protection',
        description: 'Protecting sensitive data in AI workflows',
        readTime: '18 min',
        difficulty: 'Intermediate',
        topics: ['Data classification', 'PII handling', 'Data residency', 'Retention policies']
      },
      {
        title: 'Network Security',
        description: 'Securing network communications and infrastructure',
        readTime: '20 min',
        difficulty: 'Advanced',
        topics: ['VPN setup', 'Firewall configuration', 'IP whitelisting', 'TLS/SSL']
      },
      {
        title: 'Incident Response',
        description: 'Security incident response procedures and protocols',
        readTime: '15 min',
        difficulty: 'Advanced',
        topics: ['Incident detection', 'Response procedures', 'Recovery protocols', 'Post-incident analysis']
      }
    ],
    'integration': [
      {
        title: 'Third-party Integrations',
        description: 'Connecting SaintVision AI with popular enterprise tools',
        readTime: '25 min',
        difficulty: 'Intermediate',
        topics: ['Salesforce', 'Microsoft Teams', 'Slack', 'Zapier']
      },
      {
        title: 'Webhook Configuration',
        description: 'Setting up webhooks for real-time event notifications',
        readTime: '15 min',
        difficulty: 'Intermediate',
        topics: ['Webhook setup', 'Event types', 'Payload formats', 'Security']
      },
      {
        title: 'Custom Connectors',
        description: 'Building custom integrations for unique enterprise needs',
        readTime: '40 min',
        difficulty: 'Advanced',
        topics: ['Connector framework', 'Authentication flows', 'Data mapping', 'Error handling']
      },
      {
        title: 'Migration Tools',
        description: 'Tools and strategies for migrating from other AI platforms',
        readTime: '30 min',
        difficulty: 'Advanced',
        topics: ['Data migration', 'Model porting', 'Configuration mapping', 'Testing strategies']
      }
    ],
    'best-practices': [
      {
        title: 'AI Ethics & Governance',
        description: 'Implementing responsible AI practices in your organization',
        readTime: '35 min',
        difficulty: 'Intermediate',
        topics: ['Ethics frameworks', 'Bias detection', 'Transparency', 'Accountability']
      },
      {
        title: 'Performance Optimization',
        description: 'Optimizing AI model performance and response times',
        readTime: '28 min',
        difficulty: 'Advanced',
        topics: ['Model selection', 'Caching strategies', 'Request optimization', 'Monitoring']
      },
      {
        title: 'Cost Management',
        description: 'Strategies for managing and optimizing AI platform costs',
        readTime: '20 min',
        difficulty: 'Intermediate',
        topics: ['Usage monitoring', 'Cost allocation', 'Resource optimization', 'Budgeting']
      },
      {
        title: 'User Experience Design',
        description: 'Designing exceptional AI-powered user experiences',
        readTime: '25 min',
        difficulty: 'Intermediate',
        topics: ['UX principles', 'Interaction patterns', 'Feedback systems', 'Accessibility']
      }
    ],
    'troubleshooting': [
      {
        title: 'Common Issues',
        description: 'Solutions to frequently encountered problems',
        readTime: '20 min',
        difficulty: 'Beginner',
        topics: ['API errors', 'Authentication issues', 'Rate limiting', 'Timeout problems']
      },
      {
        title: 'Error Codes Reference',
        description: 'Complete reference for all API error codes and solutions',
        readTime: '15 min',
        difficulty: 'Intermediate',
        topics: ['HTTP status codes', 'Custom error codes', 'Error messages', 'Resolution steps']
      },
      {
        title: 'Performance Issues',
        description: 'Diagnosing and resolving performance-related problems',
        readTime: '25 min',
        difficulty: 'Advanced',
        topics: ['Latency troubleshooting', 'Throughput optimization', 'Resource monitoring', 'Profiling']
      },
      {
        title: 'Support Resources',
        description: 'How to get help when you need additional assistance',
        readTime: '10 min',
        difficulty: 'Beginner',
        topics: ['Support channels', 'Ticket submission', 'Community forums', 'Emergency contacts']
      }
    ]
  }

  const popularDocs = [
    { title: 'Quick Start Guide', category: 'Getting Started', views: '45K+' },
    { title: 'HACP™ Protocol Overview', category: 'HACP™ Protocol', views: '32K+' },
    { title: 'REST API Endpoints', category: 'API Reference', views: '28K+' },
    { title: 'Enterprise Deployment', category: 'Enterprise', views: '22K+' },
    { title: 'Security Overview', category: 'Security', views: '18K+' }
  ]

  const currentDocs = docSections[selectedCategory as keyof typeof docSections] || []

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/FUTURESV.png"
            alt="SaintVision AI Documentation"  
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="text-center mb-16">
            <h1 className="heading-hero animate-fade-in">
              <span className="block text-white">Developer</span>
              <span className="block text-gradient-yellow">Documentation</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
              Comprehensive guides, API references, and best practices to help you build 
              exceptional AI-powered applications with SaintVision AI platform.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass-yellow rounded-full px-4 py-2">
                <span className="text-sm text-yellow-400">📖 150+ Guides</span>
              </div>
              <div className="glass-blue rounded-full px-4 py-2">
                <span className="text-sm text-blue-400">🔍 Advanced Search</span>
              </div>
              <div className="glass rounded-full px-4 py-2">
                <span className="text-sm text-green-400">⚡ Always Updated</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full p-4 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500 pl-12"
              />
              <span className="absolute left-4 top-4 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-white mb-4">Documentation</h3>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition flex items-center space-x-3 ${
                        selectedCategory === category.id
                          ? 'bg-saint-yellow-500 text-black font-semibold'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-white font-medium mb-3">Popular Docs</h4>
                  <div className="space-y-2">
                    {popularDocs.map((doc, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-saint-yellow-400 hover:underline cursor-pointer">{doc.title}</div>
                        <div className="text-gray-500 text-xs">{doc.views} views</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {categories.find(c => c.id === selectedCategory)?.icon} {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-400">
                  {selectedCategory === 'getting-started' && 'Everything you need to get started with SaintVision AI platform'}
                  {selectedCategory === 'api-reference' && 'Complete API documentation and technical references'}
                  {selectedCategory === 'hacp-protocol' && 'Documentation for our patented Human-AI Connection Protocol'}
                  {selectedCategory === 'enterprise' && 'Enterprise deployment guides and advanced configurations'}
                  {selectedCategory === 'security' && 'Security best practices and compliance guidelines'}
                  {selectedCategory === 'integration' && 'Integration guides for third-party tools and services'}
                  {selectedCategory === 'best-practices' && 'Best practices for AI development and deployment'}
                  {selectedCategory === 'troubleshooting' && 'Common issues and troubleshooting guides'}
                </p>
              </div>

              <div className="space-y-6">
                {currentDocs.map((doc, index) => (
                  <div key={index} className="enterprise-card hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white group-hover:text-saint-yellow-400 transition">
                        {doc.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          doc.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          doc.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          doc.difficulty === 'Advanced' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {doc.difficulty}
                        </span>
                        <span className="text-gray-400 text-xs">{doc.readTime}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-4">{doc.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doc.topics.map((topic, topicIndex) => (
                        <span key={topicIndex} className="bg-black/30 text-gray-400 px-2 py-1 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button className="text-saint-yellow-400 hover:underline text-sm font-medium">
                        Read Documentation →
                      </button>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>📄 Guide</span>
                        <span>•</span>
                        <span>Updated 2 days ago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-12 glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Access</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <button className="btn-outline text-left p-4">
                    <div className="text-2xl mb-2">🚀</div>
                    <div className="text-white font-medium">Quick Start</div>
                    <div className="text-gray-400 text-sm">Get started in 10 minutes</div>
                  </button>
                  
                  <button className="btn-outline text-left p-4">
                    <div className="text-2xl mb-2">📚</div>
                    <div className="text-white font-medium">API Reference</div>
                    <div className="text-gray-400 text-sm">Complete API documentation</div>
                  </button>
                  
                  <button className="btn-outline text-left p-4">
                    <div className="text-2xl mb-2">💬</div>
                    <div className="text-white font-medium">Support</div>
                    <div className="text-gray-400 text-sm">Get help from our team</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <section className="mt-20">
            <div className="glass rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Need Additional Help?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Can't find what you're looking for? Our support team and developer community 
                are here to help you succeed with SaintVision AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => router.push('/contact')}
                  className="btn-primary"
                >
                  💬 Contact Support
                </button>
                <button 
                  onClick={() => router.push('/community')}
                  className="btn-secondary"
                >
                  👥 Join Community
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}