'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function CommunityPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  const communityStats = [
    { label: 'Active Members', value: '12,500+', icon: '👥' },
    { label: 'Enterprise Partners', value: '500+', icon: '🏢' },
    { label: 'Research Papers', value: '150+', icon: '📄' },
    { label: 'Events per Month', value: '25+', icon: '📅' }
  ]

  const upcomingEvents = [
    {
      title: 'Enterprise AI Summit 2024',
      date: 'March 15-17, 2024',
      location: 'San Francisco, CA',
      type: 'Conference',
      attendees: '2000+',
      description: 'The premier gathering of enterprise AI leaders, featuring keynotes from Fortune 500 CTOs.',
      featured: true
    },
    {
      title: 'HACP™ Developer Workshop',
      date: 'February 28, 2024',
      location: 'Virtual',
      type: 'Workshop',
      attendees: '500',
      description: 'Deep-dive technical session on implementing HACP™ protocol in enterprise environments.'
    },
    {
      title: 'AI Ethics & Governance Roundtable',
      date: 'February 22, 2024',
      location: 'London, UK',
      type: 'Roundtable',
      attendees: '50',
      description: 'Intimate discussion on responsible AI development with industry thought leaders.'
    },
    {
      title: 'Enterprise Customer Success Webinar',
      date: 'February 15, 2024',
      location: 'Virtual',
      type: 'Webinar',
      attendees: '1000',
      description: 'Best practices for AI implementation featuring customer success stories.'
    }
  ]

  const communityPrograms = [
    {
      title: 'Enterprise Partner Network',
      description: 'Exclusive community for Fortune 500 companies deploying SaintVision AI technology.',
      benefits: [
        'Quarterly executive briefings',
        'Early access to new features',
        'Direct line to product development',
        'Peer networking opportunities'
      ],
      icon: '🤝',
      memberCount: '500+',
      access: 'Enterprise Only'
    },
    {
      title: 'Developer Community',
      description: 'Technical community for engineers building with our APIs and HACP™ protocol.',
      benefits: [
        'Technical documentation access',
        'Developer support forums',
        'API early access programs',
        'Open source contributions'
      ],
      icon: '💻',
      memberCount: '8,000+',
      access: 'Free & Open'
    },
    {
      title: 'Research Consortium',
      description: 'Academic and research community advancing the science of responsible AI.',
      benefits: [
        'Research collaboration opportunities',
        'Grant funding programs',
        'Academic conference sponsorships',
        'Publication and citation support'
      ],
      icon: '🎓',
      memberCount: '1,200+',
      access: 'Academic'
    },
    {
      title: 'AI Ethics Council',
      description: 'Advisory group of ethicists, policymakers, and industry leaders shaping AI governance.',
      benefits: [
        'Policy development input',
        'Ethics framework collaboration',
        'Regulatory guidance sessions',
        'White paper contributions'
      ],
      icon: '⚖️',
      memberCount: '150+',
      access: 'Invitation Only'
    }
  ]

  const resources = [
    {
      category: 'Documentation',
      items: [
        { title: 'API Reference Guide', type: 'Technical', downloads: '25K+' },
        { title: 'HACP™ Implementation Guide', type: 'Technical', downloads: '15K+' },
        { title: 'Enterprise Deployment Handbook', type: 'Guide', downloads: '8K+' },
        { title: 'Security Best Practices', type: 'Guide', downloads: '12K+' }
      ]
    },
    {
      category: 'Code Samples',
      items: [
        { title: 'Python SDK Examples', type: 'Code', downloads: '18K+' },
        { title: 'JavaScript Integration', type: 'Code', downloads: '22K+' },
        { title: 'Enterprise Templates', type: 'Code', downloads: '5K+' },
        { title: 'Mobile App Examples', type: 'Code', downloads: '9K+' }
      ]
    },
    {
      category: 'Research Papers',
      items: [
        { title: 'Emotional AI in Enterprise Systems', type: 'Research', downloads: '3K+' },
        { title: 'HACP™ Protocol Whitepaper', type: 'Research', downloads: '7K+' },
        { title: 'AI Safety in Production Environments', type: 'Research', downloads: '4K+' },
        { title: 'Human-AI Collaboration Studies', type: 'Research', downloads: '6K+' }
      ]
    }
  ]

  const testimonials = [
    {
      quote: "The SaintVision AI community has been instrumental in our successful enterprise deployment. The peer learning and direct access to the development team is unmatched.",
      author: "Sarah Johnson",
      title: "CTO, Fortune 100 Financial Services",
      company: "Global Bank Corp"
    },
    {
      quote: "As a researcher, the academic consortium provides incredible opportunities for collaboration and funding. We've published 3 papers thanks to this community.",
      author: "Dr. Michael Chen",
      title: "AI Research Director",
      company: "Stanford University"
    },
    {
      quote: "The developer community forums are incredibly active and helpful. I've gone from zero to production deployment in just 3 months.",
      author: "Alex Rodriguez",
      title: "Senior Engineer",
      company: "Tech Startup Inc"
    }
  ]

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/eyeontheprize.png"
            alt="SaintVision AI Community"  
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="text-center mb-16">
            <h1 className="heading-hero animate-fade-in">
              <span className="block text-white">Join Our</span>
              <span className="block text-gradient-yellow">Community</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
              Connect with thousands of enterprises, developers, researchers, and AI leaders 
              building the future of responsible artificial intelligence together.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass-yellow rounded-full px-4 py-2">
                <span className="text-sm text-yellow-400">👥 12,500+ Members</span>
              </div>
              <div className="glass-blue rounded-full px-4 py-2">
                <span className="text-sm text-blue-400">🏢 500+ Enterprise Partners</span>
              </div>
              <div className="glass rounded-full px-4 py-2">
                <span className="text-sm text-green-400">🌍 Global Network</span>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <section className="mb-20">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Community Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {communityStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-2xl font-bold text-saint-yellow-400 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'programs', label: 'Programs' },
              { id: 'events', label: 'Events' },
              { id: 'resources', label: 'Resources' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-saint-yellow-500 text-black font-semibold'
                    : 'glass text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-20">
              {/* Community Programs Overview */}
              <section>
                <h2 className="heading-section text-center mb-12">
                  Community <span className="text-gradient-yellow">Programs</span>
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {communityPrograms.map((program, index) => (
                    <div key={index} className="enterprise-card">
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-3xl">{program.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{program.title}</h3>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-saint-yellow-400">{program.memberCount} members</span>
                            <span className="text-gray-400">{program.access}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4">{program.description}</p>
                      
                      <ul className="space-y-2 mb-6">
                        {program.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start space-x-2">
                            <span className="text-saint-yellow-400 mt-1">✓</span>
                            <span className="text-gray-300 text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button className="btn-outline w-full">
                        Learn More
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Testimonials */}
              <section>
                <h2 className="heading-section text-center mb-12">
                  Member <span className="text-gradient-yellow">Testimonials</span>
                </h2>
                
                <div className="grid lg:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="enterprise-card">
                      <p className="text-gray-300 text-sm mb-6 italic">"{testimonial.quote}"</p>
                      <div className="border-t border-white/10 pt-4">
                        <div className="font-semibold text-white">{testimonial.author}</div>
                        <div className="text-saint-yellow-400 text-sm">{testimonial.title}</div>
                        <div className="text-gray-400 text-sm">{testimonial.company}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'programs' && (
            <section>
              <h2 className="heading-section text-center mb-12">
                Community <span className="text-gradient-yellow">Programs</span>
              </h2>
              
              <div className="space-y-8">
                {communityPrograms.map((program, index) => (
                  <div key={index} className="glass rounded-2xl p-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <div className="flex items-center space-x-4 mb-6">
                          <span className="text-4xl">{program.icon}</span>
                          <div>
                            <h3 className="text-2xl font-bold text-white">{program.title}</h3>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-saint-yellow-400 font-semibold">{program.memberCount} members</span>
                              <span className="bg-white/10 text-gray-300 px-2 py-1 rounded">{program.access}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 mb-6">{program.description}</p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          {program.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-start space-x-2">
                              <span className="text-saint-yellow-400 mt-1">✓</span>
                              <span className="text-gray-300 text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="glass rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">Program Benefits</h4>
                          <p className="text-gray-400 text-sm">
                            Access exclusive content, networking opportunities, and direct engagement with our team.
                          </p>
                        </div>
                        
                        <button className="btn-primary w-full">
                          Join Program
                        </button>
                        
                        <button className="btn-outline w-full">
                          Program Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'events' && (
            <section>
              <h2 className="heading-section text-center mb-12">
                Upcoming <span className="text-gradient-yellow">Events</span>
              </h2>
              
              <div className="space-y-8">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className={`rounded-2xl p-8 ${event.featured ? 'glass-yellow' : 'glass'}`}>
                    <div className="grid lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          {event.featured && (
                            <span className="bg-saint-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                              Featured Event
                            </span>
                          )}
                          <span className="bg-white/20 text-white px-2 py-1 rounded text-sm">
                            {event.type}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {event.attendees} expected
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3">{event.title}</h3>
                        <p className="text-gray-300 mb-4">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-saint-yellow-400">📅</span>
                            <span className="text-white">{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-saint-blue-400">📍</span>
                            <span className="text-white">{event.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="glass rounded-lg p-4">
                          <h4 className="text-white font-semibold mb-2">Event Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Type:</span>
                              <span className="text-white">{event.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Attendees:</span>
                              <span className="text-white">{event.attendees}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Registration:</span>
                              <span className="text-green-400">Open</span>
                            </div>
                          </div>
                        </div>
                        
                        <button className="btn-primary w-full">
                          Register Now
                        </button>
                        
                        <button className="btn-outline w-full">
                          Event Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'resources' && (
            <section>
              <h2 className="heading-section text-center mb-12">
                Community <span className="text-gradient-yellow">Resources</span>
              </h2>
              
              <div className="space-y-12">
                {resources.map((resourceCategory, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold text-white mb-6">{resourceCategory.category}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {resourceCategory.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="enterprise-card text-center">
                          <div className="text-2xl mb-3">
                            {item.type === 'Technical' && '📖'}
                            {item.type === 'Guide' && '📋'}
                            {item.type === 'Code' && '💻'}
                            {item.type === 'Research' && '🔬'}
                          </div>
                          <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                          <div className="flex items-center justify-between text-sm mb-4">
                            <span className="bg-white/10 text-gray-300 px-2 py-1 rounded">{item.type}</span>
                            <span className="text-gray-400">{item.downloads}</span>
                          </div>
                          <button className="btn-outline w-full text-sm">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <section className="text-center mt-20">
            <div className="glass rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to <span className="text-gradient-yellow">Connect?</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of AI professionals, researchers, and enterprise leaders 
                building the future of responsible artificial intelligence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="btn-primary">
                  🚀 Join Community
                </button>
                <button className="btn-secondary">
                  📧 Subscribe to Updates
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