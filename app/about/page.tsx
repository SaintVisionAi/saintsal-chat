'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function AboutPage() {
  const router = useRouter()

  const milestones = [
    { year: '2019', title: 'Foundation', description: 'SaintVision AI founded with mission of responsible AI development' },
    { year: '2020', title: 'HACP™ Patent', description: 'Patent #10,290,222 awarded for Human-AI Connection Protocol' },
    { year: '2021', title: 'Enterprise Launch', description: 'First Fortune 500 deployment of HACP™ technology' },
    { year: '2022', title: 'Global Expansion', description: 'International offices opened in London and Singapore' },
    { year: '2023', title: 'AI Institute', description: 'Research institute established for advancing responsible AI' },
    { year: '2024', title: 'Platform Evolution', description: 'Complete enterprise AI platform with 25+ integrated tools' }
  ]

  const leadership = [
    {
      name: 'Alexandra Saint',
      title: 'Founder & CEO',
      bio: 'Visionary leader with 15+ years in AI research and enterprise technology. Former MIT AI Lab researcher.',
      image: '👩‍💼'
    },
    {
      name: 'Dr. Marcus Vision',
      title: 'Chief Technology Officer',
      bio: 'AI architecture expert and lead inventor of HACP™ protocol. PhD in Computer Science from Stanford.',
      image: '👨‍💻'
    },
    {
      name: 'Sarah Chen',
      title: 'Chief Operating Officer',
      bio: 'Enterprise operations specialist with track record of scaling tech companies from startup to IPO.',
      image: '👩‍💼'
    },
    {
      name: 'Dr. James Wisdom',
      title: 'Head of Research',
      bio: 'Leading researcher in AI ethics and responsible technology development. 50+ publications.',
      image: '👨‍🔬'
    }
  ]

  const values = [
    {
      title: 'Responsible Innovation',
      description: 'Every AI system we build prioritizes human welfare, ethical considerations, and societal benefit.',
      icon: '💚'
    },
    {
      title: 'Enterprise Excellence',
      description: 'Delivering enterprise-grade solutions with military-level security and Fortune 500 reliability.',
      icon: '🏢'
    },
    {
      title: 'Faith-Guided Purpose',
      description: 'Technology development guided by principles of service, integrity, and genuine care for human flourishing.',
      icon: '✨'
    },
    {
      title: 'Continuous Learning',
      description: 'Constant innovation, research, and improvement to stay at the forefront of AI advancement.',
      icon: '📚'
    }
  ]

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/saintgotyoback.png"
            alt="About SaintVision AI"  
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="heading-hero animate-fade-in">
              <span className="block text-white">About</span>
              <span className="block text-gradient-yellow">SaintVision AI™</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
              We're building the future of responsible artificial intelligence, where technology serves 
              humanity and enterprise solutions are guided by purpose and ethical innovation.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass-yellow rounded-full px-4 py-2">
                <span className="text-sm text-yellow-400">🏆 Industry Leader</span>
              </div>
              <div className="glass-blue rounded-full px-4 py-2">
                <span className="text-sm text-blue-400">🔬 Research Driven</span>
              </div>
              <div className="glass rounded-full px-4 py-2">
                <span className="text-sm text-green-400">💚 Purpose Built</span>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <section className="mb-20">
            <div className="glass rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                To democratize enterprise artificial intelligence while maintaining the highest standards 
                of ethical development, security, and human-centered design. We believe AI should amplify 
                human potential, not replace human value.
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Enterprise Focus</h3>
                  <p className="text-gray-400 text-sm">
                    Built specifically for Fortune 500 companies and enterprise-scale deployments.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🔐</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Patented Technology</h3>
                  <p className="text-gray-400 text-sm">
                    Our HACP™ protocol (Patent #10,290,222) provides unique emotional intelligence capabilities.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🌍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Global Impact</h3>
                  <p className="text-gray-400 text-sm">
                    Serving clients across healthcare, education, finance, and enterprise automation.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Company Timeline */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Our <span className="text-gradient-yellow">Journey</span>
            </h2>
            
            <div className="glass rounded-2xl p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-saint-yellow-500 to-saint-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold">{milestone.year}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{milestone.title}</h3>
                      <p className="text-gray-400 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Leadership Team */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Leadership <span className="text-gradient-yellow">Team</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {leadership.map((leader, index) => (
                <div key={index} className="enterprise-card text-center">
                  <div className="text-6xl mb-4">{leader.image}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{leader.name}</h3>
                  <p className="text-saint-yellow-500 text-sm mb-4">{leader.title}</p>
                  <p className="text-gray-400 text-sm">{leader.bio}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Company Values */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Our <span className="text-gradient-yellow">Values</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="enterprise-card">
                  <div className="flex items-start space-x-4">
                    <span className="text-4xl">{value.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                      <p className="text-gray-400 text-sm">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Company Stats */}
          <section className="mb-20">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white text-center mb-8">By the Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-saint-yellow-500 mb-2">$75M+</div>
                  <div className="text-sm text-gray-400">Patent Portfolio Value</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-saint-blue-500 mb-2">500+</div>
                  <div className="text-sm text-gray-400">Enterprise Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-500 mb-2">99.9%</div>
                  <div className="text-sm text-gray-400">Platform Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-500 mb-2">150+</div>
                  <div className="text-sm text-gray-400">Team Members</div>
                </div>
              </div>
            </div>
          </section>

          {/* Awards & Recognition */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Awards & <span className="text-gradient-yellow">Recognition</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="enterprise-card text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Innovation Award 2024</h3>
                <p className="text-gray-400 text-sm">
                  Recognized for breakthrough HACP™ protocol and enterprise AI deployment.
                </p>
              </div>

              <div className="enterprise-card text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-lg font-semibold text-white mb-2">SOC 2 Certification</h3>
                <p className="text-gray-400 text-sm">
                  Highest level enterprise security and compliance certification achieved.
                </p>
              </div>

              <div className="enterprise-card text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-lg font-semibold text-white mb-2">Top AI Company 2024</h3>
                <p className="text-gray-400 text-sm">
                  Named in Forbes list of most innovative AI companies transforming business.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Join Our <span className="text-gradient-yellow">Mission</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Whether you're looking to transform your enterprise with AI, join our research efforts, 
                or become part of our growing team, we invite you to be part of the responsible AI revolution.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => router.push('/contact')}
                  className="btn-primary"
                >
                  🤝 Partner With Us
                </button>
                <button
                  onClick={() => router.push('/careers')}
                  className="btn-secondary"
                >
                  💼 Join Our Team
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