'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function InstitutePage() {
  const router = useRouter()

  const researchAreas = [
    {
      title: 'HACP™ Protocol Research',
      description: 'Advanced studies on Human-AI Connection Protocol and emotional intelligence calibration.',
      publications: 23,
      status: 'Active'
    },
    {
      title: 'Enterprise AI Ethics',
      description: 'Developing frameworks for responsible AI deployment in business environments.',
      publications: 18,
      status: 'Active'
    },
    {
      title: 'Cognitive Automation',
      description: 'Research into AI systems that adapt to human cognitive patterns and workflows.',
      publications: 31,
      status: 'Active'
    }
  ]

  const facultyMembers = [
    {
      name: 'Dr. Sarah Chen',
      title: 'Director of AI Ethics',
      expertise: 'Responsible AI, Machine Learning Ethics',
      publications: 47
    },
    {
      name: 'Prof. Michael Rodriguez',
      title: 'Head of HACP™ Research',
      expertise: 'Human-Computer Interaction, Emotional AI',
      publications: 62
    },
    {
      name: 'Dr. Emily Thompson',
      title: 'Enterprise AI Specialist',
      expertise: 'Business Intelligence, Automation Systems',
      publications: 39
    }
  ]

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/Institute.png"
            alt="SaintVision AI Institute"  
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="text-center mb-16">
            <h1 className="heading-hero animate-fade-in">
              <span className="block text-white">SaintVision AI</span>
              <span className="block text-gradient-yellow">Institute</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
              Advancing the frontier of responsible artificial intelligence through cutting-edge research, 
              academic partnerships, and enterprise innovation.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass-blue rounded-full px-4 py-2">
                <span className="text-sm text-blue-400">🎓 Academic Excellence</span>
              </div>
              <div className="glass-yellow rounded-full px-4 py-2">
                <span className="text-sm text-yellow-400">🔬 Research Innovation</span>
              </div>
              <div className="glass rounded-full px-4 py-2">
                <span className="text-sm text-green-400">🤝 Industry Partnerships</span>
              </div>
            </div>
          </div>

          {/* Research Areas */}
          <section className="mb-16">
            <h2 className="heading-section text-center mb-12">
              Research <span className="text-gradient-yellow">Areas</span>
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {researchAreas.map((area, index) => (
                <div key={index} className="enterprise-card">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{area.title}</h3>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {area.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{area.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-saint-yellow-500 font-semibold">
                      {area.publications} Publications
                    </span>
                    <button className="text-saint-blue-500 hover:underline text-sm">
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Faculty & Researchers */}
          <section className="mb-16">
            <h2 className="heading-section text-center mb-12">
              Faculty & <span className="text-gradient-yellow">Researchers</span>
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {facultyMembers.map((member, index) => (
                <div key={index} className="enterprise-card text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-saint-yellow-500 to-saint-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-black">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-saint-yellow-500 text-sm mb-3">{member.title}</p>
                  <p className="text-gray-400 text-sm mb-4">{member.expertise}</p>
                  <div className="text-saint-blue-500 font-semibold text-sm">
                    {member.publications} Publications
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research Stats */}
          <section className="mb-16">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white text-center mb-8">Research Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-saint-yellow-500 mb-2">147</div>
                  <div className="text-sm text-gray-400">Research Papers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-saint-blue-500 mb-2">23</div>
                  <div className="text-sm text-gray-400">Active Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500 mb-2">89</div>
                  <div className="text-sm text-gray-400">Industry Partners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">$12M</div>
                  <div className="text-sm text-gray-400">Research Funding</div>
                </div>
              </div>
            </div>
          </section>

          {/* Programs */}
          <section className="mb-16">
            <h2 className="heading-section text-center mb-12">
              Academic <span className="text-gradient-yellow">Programs</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="enterprise-card">
                <div className="text-4xl mb-6">🎓</div>
                <h3 className="text-xl font-semibold text-white mb-4">PhD in AI Ethics</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Comprehensive doctoral program focusing on responsible AI development, 
                  ethical frameworks, and enterprise deployment strategies.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-saint-yellow-500 font-semibold">4 Year Program</span>
                  <button className="btn-outline">Apply Now</button>
                </div>
              </div>

              <div className="enterprise-card">
                <div className="text-4xl mb-6">🔬</div>
                <h3 className="text-xl font-semibold text-white mb-4">Research Fellowship</h3>
                <p className="text-gray-400 text-sm mb-6">
                  One-year fellowship program for experienced researchers to work on 
                  HACP™ protocol advancement and enterprise AI applications.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-saint-blue-500 font-semibold">$75K Stipend</span>
                  <button className="btn-outline">Learn More</button>
                </div>
              </div>

              <div className="enterprise-card">
                <div className="text-4xl mb-6">💼</div>
                <h3 className="text-xl font-semibold text-white mb-4">Executive Education</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Short-term programs for business leaders to understand AI strategy, 
                  implementation, and organizational transformation.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-green-500 font-semibold">2-Week Intensive</span>
                  <button className="btn-outline">Enroll</button>
                </div>
              </div>

              <div className="enterprise-card">
                <div className="text-4xl mb-6">🤝</div>
                <h3 className="text-xl font-semibold text-white mb-4">Industry Collaboration</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Partner with our institute for custom research projects, 
                  technology development, and workforce training programs.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-500 font-semibold">Custom Terms</span>
                  <button className="btn-outline">Partner</button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Join the Future of <span className="text-gradient-yellow">AI Research</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Whether you're a researcher, student, or industry leader, the SaintVision AI Institute 
                offers opportunities to shape the responsible development of artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => router.push('/contact')}
                  className="btn-primary"
                >
                  🎓 Apply for Programs
                </button>
                <button
                  onClick={() => router.push('/enterprise')}
                  className="btn-secondary"
                >
                  🤝 Industry Partnership
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