'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Successfully signed in, redirect to main app
        router.push('/')
      } else {
        setError(data.error || 'Invalid email or password')
      }
    } catch (err) {
      console.error('Sign in error:', err)
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
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <Image
                src="/logos/THE BEST MAIN LOGO + COOKIN.png"
                alt="SAINTVISIONAI"
                width={150}
                height={75}
                className="mx-auto object-contain mb-6"
              />
              <h1 className="text-4xl font-bold mb-4">
                Welcome <span className="text-gradient-yellow">Back</span>
              </h1>
              <p className="text-gray-400">
                Continue your AI transformation journey.
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
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-saint-yellow-500 bg-black border-gray-600 rounded focus:ring-saint-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-400">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => router.push('/reset-password')}
                    className="text-sm text-saint-yellow-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : '🚀 Sign In to SaintVision AI'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-white/20 rounded-lg bg-black/50 text-sm font-medium text-white hover:bg-white/5">
                    <span>Google</span>
                  </button>
                  <button className="w-full inline-flex justify-center py-2 px-4 border border-white/20 rounded-lg bg-black/50 text-sm font-medium text-white hover:bg-white/5">
                    <span>Microsoft</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => router.push('/signup')}
                  className="text-saint-yellow-500 hover:underline"
                >
                  Start free trial
                </button>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
