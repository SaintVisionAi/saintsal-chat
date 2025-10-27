'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    role: '',
    plan: 'professional'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic
    router.push('/playground')
  }

  return (
    <>
      <EnterpriseHeader />
      
      <div className="min-h-screen bg-black text-white pt-20">
        <section className="py-20 px-8">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-12">
              <Image
                src="/logos/THE BEST MAIN LOGO + COOKIN.png"
                alt="SAINTVISIONAI"
                width={150}
                height={75}
                className="mx-auto object-contain mb-6"
              />
              <h1 className="text-4xl font-bold mb-4">
                Start Your <span className="text-gradient-yellow">AI Journey</span>
              </h1>
              <p className="text-gray-400">
                Join thousands of businesses using SaintVision AI to transform their operations.
              </p>
            </div>

            <div className="glass rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                    placeholder="Your Company"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="ceo">CEO/Founder</option>
                    <option value="cto">CTO/Tech Lead</option>
                    <option value="manager">Manager</option>
                    <option value="developer">Developer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                    placeholder="Create secure password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                    placeholder="Confirm password"
                    required
                  />
                </div>

                <div className="glass-yellow rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Professional Plan</span>
                    <span className="text-saint-yellow-400 font-bold">$97/month</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Unlimited AI conversations, HACP™ protocol, priority support, and enterprise integrations.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  🚀 Start Free Trial (14 Days)
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By signing up, you agree to our{' '}
                  <button onClick={() => router.push('/terms')} className="text-saint-yellow-500 hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button onClick={() => router.push('/privacy')} className="text-saint-yellow-500 hover:underline">
                    Privacy Policy
                  </button>
                </p>
              </form>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Already have an account?{' '}
                <button 
                  onClick={() => router.push('/signin')}
                  className="text-saint-yellow-500 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}