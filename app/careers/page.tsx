'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function CareersPage() {
  const router = useRouter()
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const departments = [
    { id: 'all', name: 'All Positions', count: 23 },
    { id: 'engineering', name: 'Engineering', count: 8 },
    { id: 'research', name: 'AI Research', count: 5 },
    { id: 'enterprise', name: 'Enterprise Sales', count: 4 },
    { id: 'product', name: 'Product', count: 3 },
    { id: 'operations', name: 'Operations', count: 3 }
  ]

  const positions = [
    {
      title: 'Senior AI Research Scientist',
      department: 'AI Research',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Lead breakthrough AI research in human-computer interaction and emotional intelligence systems.',
      requirements: ['PhD in Computer Science, AI, or related field', '5+ years in AI research', 'Published papers in top-tier conferences'],
      salary: '$200K - $300K',
      remote: true
    },
    {
      title: 'Enterprise Solutions Architect',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Design and implement large-scale AI solutions for Fortune 500 clients.',
      requirements: ['8+ years enterprise software development', 'Cloud architecture expertise', 'AI/ML deployment experience'],
      salary: '$180K - $250K',
      remote: true
    },
    {
      title: 'Director of Enterprise Sales',
      department: 'Enterprise Sales',
      location: 'Multiple Locations',
      type: 'Full-time',
      experience: 'Executive',
      description: 'Lead enterprise sales strategy and build relationships with Fortune 500 decision makers.',
      requirements: ['10+ years enterprise B2B sales', 'AI/SaaS industry experience', 'Proven track record of $10M+ ARR'],
      salary: '$200K - $400K + equity',
      remote: false
    },
    {
      title: 'Full Stack Engineer - AI Platform',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Build scalable web applications and APIs for our enterprise AI platform.',
      requirements: ['3+ years full-stack development', 'React, Node.js, Python experience', 'Cloud deployment knowledge'],
      salary: '$130K - $180K',
      remote: true
    },
    {
      title: 'Product Manager - Enterprise AI',
      department: 'Product',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Drive product strategy for enterprise AI features and customer workflows.',
      requirements: ['5+ years product management', 'Enterprise software experience', 'Technical background preferred'],
      salary: '$150K - $220K',
      remote: true
    },
    {
      title: 'DevOps Engineer - AI Infrastructure',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-level',
      description: 'Maintain and scale our AI model serving infrastructure across multiple cloud providers.',
      requirements: ['4+ years DevOps/SRE experience', 'Kubernetes, Docker expertise', 'ML model deployment experience'],
      salary: '$140K - $190K',
      remote: true
    }
  ]

  const benefits = [
    {
      category: 'Health & Wellness',
      items: [
        'Premium health, dental, and vision insurance',
        'Mental health and wellness programs',
        'Flexible PTO and sabbatical options',
        'On-site fitness center and wellness stipend'
      ],
      icon: '🏥'
    },
    {
      category: 'Financial',
      items: [
        'Competitive salary and equity packages',
        '401(k) with company matching',
        'Stock option programs for all employees',
        'Performance bonuses and profit sharing'
      ],
      icon: '💰'
    },
    {
      category: 'Professional Growth',
      items: [
        '$5,000 annual learning and development budget',
        'Conference attendance and speaking opportunities',
        'Internal mentorship and coaching programs',
        'Leadership development tracks'
      ],
      icon: '📚'
    },
    {
      category: 'Work-Life Balance',
      items: [
        'Flexible remote work options',
        'Unlimited PTO policy',
        'Family leave and parental support',
        'Flexible working hours and time zones'
      ],
      icon: '⚖️'
    }
  ]

  const values = [
    {
      title: 'Responsible Innovation',
      description: 'We build AI technology that serves humanity and operates with ethical principles.',
      icon: '💚'
    },
    {
      title: 'Continuous Learning',
      description: 'We foster a culture of growth, curiosity, and intellectual excellence.',
      icon: '🧠'
    },
    {
      title: 'Collaborative Excellence',
      description: 'We achieve extraordinary results through teamwork and mutual support.',
      icon: '🤝'
    },
    {
      title: 'Faith-Guided Purpose',
      description: 'Our work is guided by principles of service, integrity, and human flourishing.',
      icon: '✨'
    }
  ]

  const filteredPositions = selectedDepartment === 'all' 
    ? positions 
    : positions.filter(position => position.department === departments.find(d => d.id === selectedDepartment)?.name)

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/saintgotyoback.png"
            alt="Careers at SaintVision AI"  
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="text-center mb-16">
            <h1 className="heading-hero animate-fade-in">
              <span className="block text-white">Join Our</span>
              <span className="block text-gradient-yellow">Mission</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
              Help us build the future of responsible artificial intelligence. Join a team of world-class 
              researchers, engineers, and innovators shaping how AI serves humanity.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass-yellow rounded-full px-4 py-2">
                <span className="text-sm text-yellow-400">💼 23 Open Positions</span>
              </div>
              <div className="glass-blue rounded-full px-4 py-2">
                <span className="text-sm text-blue-400">🌍 Remote-First Culture</span>
              </div>
              <div className="glass rounded-full px-4 py-2">
                <span className="text-sm text-green-400">🚀 Series C Growth Stage</span>
              </div>
            </div>
          </div>

          {/* Company Culture */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Our <span className="text-gradient-yellow">Culture</span>
            </h2>
            
            <div className="glass rounded-2xl p-8 mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">Building the Future Together</h3>
                <p className="text-gray-300 max-w-3xl mx-auto">
                  At SaintVision AI, we're not just building technology—we're crafting the future of human-AI 
                  collaboration. Our team combines cutting-edge research with practical enterprise solutions, 
                  all guided by principles of responsibility, excellence, and purpose.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-3">{value.icon}</div>
                    <h4 className="text-lg font-semibold text-white mb-2">{value.title}</h4>
                    <p className="text-gray-400 text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits & Perks */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Benefits & <span className="text-gradient-yellow">Perks</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="enterprise-card">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{benefit.icon}</span>
                    <h3 className="text-xl font-semibold text-white">{benefit.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {benefit.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <span className="text-saint-yellow-400 mt-1">•</span>
                        <span className="text-gray-400 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Open Positions */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Open <span className="text-gradient-yellow">Positions</span>
            </h2>

            {/* Department Filter */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              {departments.map((department) => (
                <button
                  key={department.id}
                  onClick={() => setSelectedDepartment(department.id)}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedDepartment === department.id
                      ? 'bg-saint-yellow-500 text-black font-semibold'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {department.name} ({department.count})
                </button>
              ))}
            </div>

            {/* Positions List */}
            <div className="space-y-6">
              {filteredPositions.map((position, index) => (
                <div key={index} className="glass rounded-2xl p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-saint-yellow-500/20 text-saint-yellow-400 px-2 py-1 rounded text-xs font-medium">
                          {position.department}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {position.type}
                        </span>
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                          {position.experience}
                        </span>
                        {position.remote && (
                          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                            Remote OK
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2">{position.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{position.description}</p>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-saint-yellow-500">Key Requirements:</h4>
                        <ul className="space-y-1">
                          {position.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start space-x-2">
                              <span className="text-gray-400 mt-1">•</span>
                              <span className="text-gray-400 text-sm">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Location</h4>
                        <p className="text-white">{position.location}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Salary Range</h4>
                        <p className="text-saint-yellow-400 font-semibold">{position.salary}</p>
                      </div>

                      <button className="btn-primary w-full">
                        Apply Now →
                      </button>

                      <button className="btn-outline w-full">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Diversity & Inclusion */}
          <section className="mb-20">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-6">
                🌈 Diversity & Inclusion Commitment
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Our Commitment</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    SaintVision AI is an equal opportunity employer committed to diversity and inclusion. 
                    We believe that diverse perspectives drive innovation and create better AI solutions 
                    for everyone.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Equal opportunity regardless of race, gender, religion, or background</li>
                    <li>• Inclusive hiring practices and bias-free recruitment</li>
                    <li>• Employee resource groups and mentorship programs</li>
                    <li>• Accessibility accommodations and support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Current Diversity Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gender Diversity</span>
                      <span className="text-white">45% Women, 55% Men</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Underrepresented Groups</span>
                      <span className="text-white">38% of workforce</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">International Team</span>
                      <span className="text-white">25+ countries</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Leadership Diversity</span>
                      <span className="text-white">50% diverse leaders</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Application Process */}
          <section className="mb-20">
            <h2 className="heading-section text-center mb-12">
              Application <span className="text-gradient-yellow">Process</span>
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-saint-yellow-500 to-saint-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Apply Online</h3>
                <p className="text-gray-400 text-sm">Submit your application through our portal</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-saint-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Phone Screen</h3>
                <p className="text-gray-400 text-sm">Initial conversation with our recruiting team</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Technical Round</h3>
                <p className="text-gray-400 text-sm">Skills assessment and technical interviews</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">4</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Final Interview</h3>
                <p className="text-gray-400 text-sm">Meet the team and culture fit evaluation</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to <span className="text-gradient-yellow">Join Us?</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Don't see the perfect role? We're always looking for exceptional talent. 
                Send us your resume and let's start a conversation about your future with SaintVision AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="btn-primary">
                  💼 View All Positions
                </button>
                <button className="btn-secondary">
                  📧 General Application
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