'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    message: '',
    inquiryType: 'enterprise'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert('Thank you! Our enterprise team will contact you within 24 hours.')
  }

  const contactOptions = [
    {
      type: 'Enterprise Sales',
      description: 'Fortune 500 solutions and custom deployments',
      contact: 'enterprise@saintvisionai.com',
      phone: '+1 (555) 123-4567',
      icon: '🏢'
    },
    {
      type: 'Technical Support',
      description: 'API integration and technical assistance',
      contact: 'support@saintvisionai.com',
      phone: '+1 (555) 123-4568',
      icon: '🔧'
    },
    {
      type: 'Partnership',
      description: 'Reseller programs and strategic alliances',
      contact: 'partners@saintvisionai.com',
      phone: '+1 (555) 123-4569',
      icon: '🤝'
    },
    {
      type: 'Research',
      description: 'Academic collaboration and research partnerships',
      contact: 'research@saintvisionai.com',
      phone: '+1 (555) 123-4570',
      icon: '🎓'
    }
  ]

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/Wallst.png"
            alt="Contact Enterprise Sales"  
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="text-center mb-16">
            <h1 className="heading-hero animate-fade-in">
              <span className="block text-white">Contact</span>
              <span className="block text-gradient-yellow">Enterprise Sales</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8 animate-slide-up">
              Ready to transform your business with enterprise AI? Our team of experts is standing by 
              to design a custom solution for your organization.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass-yellow rounded-full px-4 py-2">
                <span className="text-sm text-yellow-400">🚀 24-hour response time</span>
              </div>
              <div className="glass-blue rounded-full px-4 py-2">
                <span className="text-sm text-blue-400">💼 Enterprise specialists</span>
              </div>
              <div className="glass rounded-full px-4 py-2">
                <span className="text-sm text-green-400">🔒 SOC 2 certified secure</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Schedule Enterprise Demo</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Business Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                      placeholder="john@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                      placeholder="Acme Corporation"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                      required
                    >
                      <option value="">Select role</option>
                      <option value="ceo">CEO/President</option>
                      <option value="cto">CTO/Tech Lead</option>
                      <option value="vp">VP/Director</option>
                      <option value="manager">Manager</option>
                      <option value="procurement">Procurement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Inquiry Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['enterprise', 'partnership', 'technical', 'research'].map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="inquiryType"
                          value={type}
                          checked={formData.inquiryType === type}
                          onChange={(e) => setFormData({...formData, inquiryType: e.target.value})}
                          className="text-saint-yellow-500"
                        />
                        <span className="text-white text-sm capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500 resize-none"
                    placeholder="Tell us about your AI requirements and business goals..."
                    required
                  />
                </div>

                <button type="submit" className="w-full btn-primary">
                  🚀 Schedule Enterprise Demo
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Our enterprise team will contact you within 24 hours to schedule your personalized demo.
                </p>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Direct Contact</h3>
                <div className="space-y-4">
                  {contactOptions.map((option, index) => (
                    <div key={index} className="glass rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">{option.type}</h4>
                          <p className="text-gray-400 text-sm mb-2">{option.description}</p>
                          <div className="space-y-1">
                            <a 
                              href={`mailto:${option.contact}`}
                              className="text-saint-yellow-500 hover:underline text-sm block"
                            >
                              {option.contact}
                            </a>
                            <a 
                              href={`tel:${option.phone}`}
                              className="text-saint-blue-500 hover:underline text-sm block"
                            >
                              {option.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Enterprise Support</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white text-sm">24/7 dedicated account manager</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white text-sm">Custom integration support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white text-sm">Priority technical assistance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white text-sm">White-label deployment options</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-white text-sm">Enterprise SLA guarantees</span>
                  </div>
                </div>
              </div>

              <div className="glass-yellow rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Emergency Support</h3>
                <p className="text-gray-300 text-sm mb-4">
                  For critical enterprise issues requiring immediate attention:
                </p>
                <div className="space-y-2">
                  <a 
                    href="tel:+1-555-EMERGENCY"
                    className="text-saint-yellow-400 hover:underline font-semibold block"
                  >
                    📞 +1 (555) EMERGENCY
                  </a>
                  <a 
                    href="mailto:emergency@saintvisionai.com"
                    className="text-saint-yellow-400 hover:underline block"
                  >
                    📧 emergency@saintvisionai.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Office Locations */}
          <div className="glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-8">Global Offices</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🇺🇸 United States HQ</h3>
                <p className="text-gray-400 text-sm">
                  San Francisco, CA<br />
                  Delaware LP Structure<br />
                  Patent Holdings Separated
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🇪🇺 European Operations</h3>
                <p className="text-gray-400 text-sm">
                  London, UK<br />
                  GDPR Compliance Center<br />
                  EU Data Residency
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🌏 Asia Pacific</h3>
                <p className="text-gray-400 text-sm">
                  Singapore<br />
                  APAC Business Hub<br />
                  Regional Support Center
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}