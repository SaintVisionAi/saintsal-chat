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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          role: formData.role,
          name: formData.companyName // Use company name as user name
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Successfully signed up, redirect to main app
        router.push('/')
      } else {
        setError(data.error || 'Signup failed. Please try again.')
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
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
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    placeholder="Create secure password (min 8 characters)"
                    required
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>

                <div className="glass-yellow rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-semibold">Free Plan</span>
                    <span className="text-saint-yellow-400 font-bold">$0/month</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Start with 50 messages/month, 10 voice minutes, and basic features. Upgrade anytime!
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : '🚀 Create Free Account'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By signing up, you agree to our{' '}
                  <button type="button" onClick={() => router.push('/terms')} className="text-saint-yellow-500 hover:underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" onClick={() => router.push('/privacy')} className="text-saint-yellow-500 hover:underline">
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
