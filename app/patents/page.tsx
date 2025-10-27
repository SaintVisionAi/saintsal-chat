'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function PatentsPage() {
  const router = useRouter()

  const patents = [
    {
      number: '10,290,222',
      title: 'Human-AI Connection Protocol (HACP™)',
      description: 'Revolutionary method for adaptive AI response calibration based on emotional intelligence and escalation patterns.',
      filed: '2019-03-15',
      granted: '2020-11-12',
      status: 'Active',
      value: '$45M',
      applications: ['Enterprise AI', 'Healthcare', 'Education', 'Customer Service']
    },
    {
      number: '11,445,789',
      title: 'Cognitive Workload Distribution System',
      description: 'Method for distributing AI processing tasks across multiple models based on complexity and emotional context.',
      filed: '2020-08-22',
      granted: '2022-06-08',
      status: 'Active',
      value: '$18M',
      applications: ['Multi-Modal AI', 'Enterprise Automation', 'Real-Time Processing']
    },
    {
      number: '11,789,456',
      title: 'Adaptive Learning Protocol for Enterprise AI',
      description: 'System for continuous learning and improvement in enterprise AI deployments while maintaining privacy.',
      filed: '2021-12-03',
      granted: '2023-09-21',
      status: 'Active',
      value: '$12M',
      applications: ['Enterprise Learning', 'Privacy-Preserving AI', 'Custom Models']
    }
  ]

  const pendingPatents = [
    {
      number: 'PCT/US2023/12345',
      title: 'Multi-Tenant AI Security Architecture',
      description: 'Advanced security framework for enterprise AI deployments with isolated processing environments.',
      filed: '2023-04-15',
      status: 'Under Review',
      expectedGrant: 'Q2 2024'
    },
    {
      number: 'PCT/US2023/67890',
      title: 'Faith-Guided AI Decision Framework',
      description: 'Ethical decision-making protocol for AI systems based on principle-driven value alignment.',
      filed: '2023-07-30',
      status: 'Patent Pending',
      expectedGrant: 'Q3 2024'
    }
  ]

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/eyeontheprize.png"
            alt="Patent Portfolio"  
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="text-center mb-16">
            <h1 className="heading-hero animate-fade-in">
              <span className="block text-white">Patent</span>
              <span className="block text-gradient-yellow">Portfolio</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
              Protecting the innovations that power responsible AI development and enterprise-grade 
              artificial intelligence solutions.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass-yellow rounded-full px-4 py-2">
                <span className="text-sm text-yellow-400">🏆 $75M+ Portfolio Value</span>
              </div>
              <div className="glass-blue rounded-full px-4 py-2">
                <span className="text-sm text-blue-400">🔐 3 Granted Patents</span>
              </div>
              <div className="glass rounded-full px-4 py-2">
                <span className="text-sm text-green-400">⚖️ Global Protection</span>
              </div>
            </div>
          </div>

          {/* Featured Patent - HACP™ */}
          <section className="mb-20">
            <div className="glass-yellow rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  🔐 Featured Patent: <span className="text-gradient-yellow">HACP™ Protocol</span>
                </h2>
                <p className="text-gray-300 max-w-3xl mx-auto">
                  Our flagship patent revolutionizes human-AI interaction through emotional intelligence 
                  and adaptive response calibration.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Patent Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Patent Number:</span>
                      <span className="text-white font-mono">US 10,290,222 B2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Filed:</span>
                      <span className="text-white">March 15, 2019</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Granted:</span>
                      <span className="text-white">November 12, 2020</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-semibold">Active & Enforced</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Value:</span>
                      <span className="text-saint-yellow-400 font-bold">$45,000,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Technical Innovation</h3>
                  <div className="space-y-3 text-gray-300">
                    <p className="text-sm">
                      <strong className="text-saint-yellow-400">Emotional Intelligence:</strong> First AI system 
                      to dynamically calibrate responses based on human emotional state detection.
                    </p>
                    <p className="text-sm">
                      <strong className="text-saint-blue-400">Adaptive Escalation:</strong> Intelligent routing 
                      system that escalates complex queries to appropriate AI models or human specialists.
                    </p>
                    <p className="text-sm">
                      <strong className="text-green-400">Enterprise Integration:</strong> Seamless integration 
                      framework for existing business systems and workflows.
                    </p>
                    <p className="text-sm">
                      <strong className="text-purple-400">Privacy Protection:</strong> Built-in privacy 
                      safeguards and data protection mechanisms for enterprise compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Granted Patents */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Granted <span className="text-gradient-yellow">Patents</span>
            </h2>
            
            <div className="space-y-8">
              {patents.map((patent, index) => (
                <div key={index} className="glass rounded-2xl p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{patent.title}</h3>
                          <p className="text-saint-yellow-500 font-mono text-sm">US Patent {patent.number}</p>
                        </div>
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                          {patent.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4">{patent.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        {patent.applications.map((app, idx) => (
                          <span key={idx} className="bg-white/10 text-white px-2 py-1 rounded text-xs">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Patent Timeline</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Filed:</span>
                            <span className="text-white">{patent.filed}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Granted:</span>
                            <span className="text-white">{patent.granted}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Portfolio Value</h4>
                        <div className="text-2xl font-bold text-saint-yellow-400">{patent.value}</div>
                      </div>

                      <button className="btn-outline w-full">
                        View Full Patent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pending Patents */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Pending <span className="text-gradient-yellow">Applications</span>
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {pendingPatents.map((patent, index) => (
                <div key={index} className="enterprise-card">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{patent.title}</h3>
                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                      {patent.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{patent.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Application:</span>
                      <span className="text-white font-mono">{patent.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Filed:</span>
                      <span className="text-white">{patent.filed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected Grant:</span>
                      <span className="text-saint-yellow-400">{patent.expectedGrant}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Portfolio Statistics */}
          <section className="mb-20">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white text-center mb-8">Portfolio Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-saint-yellow-500 mb-2">$75M+</div>
                  <div className="text-sm text-gray-400">Total Portfolio Value</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-saint-blue-500 mb-2">3</div>
                  <div className="text-sm text-gray-400">Granted Patents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500 mb-2">5</div>
                  <div className="text-sm text-gray-400">Pending Applications</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">12</div>
                  <div className="text-sm text-gray-400">Countries Protected</div>
                </div>
              </div>
            </div>
          </section>

          {/* Licensing & Partnership */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Licensing & <span className="text-gradient-yellow">Partnership</span>
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="enterprise-card">
                <div className="text-4xl mb-6">🤝</div>
                <h3 className="text-xl font-semibold text-white mb-4">Technology Licensing</h3>
                <p className="text-gray-400 text-sm mb-6">
                  License our patented HACP™ technology for your enterprise AI projects. 
                  Flexible licensing terms available for startups to Fortune 500 companies.
                </p>
                <div className="space-y-2 text-sm text-gray-300 mb-6">
                  <p>• Enterprise licensing with volume discounts</p>
                  <p>• Academic and research institution rates</p>
                  <p>• White-label integration options</p>
                  <p>• Custom development partnerships</p>
                </div>
                <button
                  onClick={() => router.push('/contact')}
                  className="btn-primary w-full"
                >
                  License Technology
                </button>
              </div>

              <div className="enterprise-card">
                <div className="text-4xl mb-6">🔬</div>
                <h3 className="text-xl font-semibold text-white mb-4">Research Collaboration</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Partner with our research team to advance the state of responsible AI. 
                  Joint research projects and patent co-development opportunities available.
                </p>
                <div className="space-y-2 text-sm text-gray-300 mb-6">
                  <p>• Joint patent development programs</p>
                  <p>• Academic research partnerships</p>
                  <p>• Government and defense collaborations</p>
                  <p>• Open source contribution opportunities</p>
                </div>
                <button
                  onClick={() => router.push('/institute')}
                  className="btn-secondary w-full"
                >
                  Research Partnership
                </button>
              </div>
            </div>
          </section>

          {/* Legal Notice */}
          <section>
            <div className="glass-blue rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-white mb-4">⚖️ Patent Protection Notice</h3>
              <p className="text-gray-300 text-sm mb-4">
                SaintVision AI actively enforces its intellectual property rights. Our patents are protected 
                globally and unauthorized use may result in legal action. For licensing inquiries or 
                questions about patent coverage, please contact our legal team.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="mailto:patents@saintvisionai.com"
                  className="btn-outline"
                >
                  📧 Patent Licensing
                </a>
                <a 
                  href="mailto:legal@saintvisionai.com"
                  className="btn-outline"
                >
                  ⚖️ Legal Inquiries
                </a>
              </div>
            </div>
          </section>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}