'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function HelpPage() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const askSUPERSAL = async () => {
    setLoading(true)
    try {
      // Simulate SUPERSAL response
      await new Promise(resolve => setTimeout(resolve, 1500))
      setResponse(`SUPERSAL™ Instant Response: I understand you need help with "${question}". Here's what I can assist with immediately:\n\n• Account setup and configuration\n• API integration guidance\n• Troubleshooting common issues\n• Feature explanations and tutorials\n• Billing and subscription questions\n\nFor complex enterprise issues, I'll escalate to our human specialists. How else can I help?`)
    } catch (error) {
      setResponse('SUPERSAL™ is temporarily unavailable. Please try again.')
    }
    setLoading(false)
  }

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/STICKYSAL.png"
            alt="24/7 Help Desk"  
            fill
            className="object-cover"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center pt-20">
          <div className="mb-8">
            <Image
              src="/logos/THE BEST MAIN LOGO + COOKIN.png"
              alt="SAINTVISIONAI"
              width={200}
              height={100}
              className="mx-auto object-contain mb-6"
            />
          </div>

          <h1 className="heading-hero animate-fade-in">
            <span className="block text-white">24/7 Help Desk</span>
            <span className="block text-gradient-yellow">Powered by SUPERSAL™</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 animate-slide-up">
            SUPERSAL™ handles everything. No tickets, no waiting, just instant intelligent support 
            powered by our enterprise AI infrastructure.
          </p>

          {/* Chat Interface */}
          <div className="glass rounded-2xl p-8 mb-8 animate-slide-up">
            <div className="mb-6">
              <label className="block text-left text-lg font-semibold mb-4 text-white">
                🤖 Ask SUPERSAL™ Anything
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="How do I integrate the API? What's included in Pro plan? How does HACP™ work?"
                className="w-full h-24 p-4 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-saint-yellow-500"
              />
            </div>
            
            <button
              onClick={askSUPERSAL}
              disabled={!question.trim() || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {loading ? '🤖 SUPERSAL™ Responding...' : '⚡ Get Instant Help'}
            </button>

            {response && (
              <div className="glass-yellow rounded-lg p-6 text-left">
                <div className="text-saint-yellow-400 font-bold mb-3 text-sm">
                  SUPERSAL™ INSTANT RESPONSE:
                </div>
                <div className="text-white text-sm leading-relaxed whitespace-pre-line">
                  {response}
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 text-sm mb-12">
            <div className="glass rounded-lg p-4">
              <div className="text-green-500 font-bold mb-2">✓ SUPERSAL™ responds instantly 24/7</div>
              <div className="text-gray-400">No wait times, ever</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-blue-500 font-bold mb-2">✓ No tickets</div>
              <div className="text-gray-400">Direct conversation interface</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-purple-500 font-bold mb-2">✓ Just solutions</div>
              <div className="text-gray-400">AI-powered problem solving</div>
            </div>
          </div>

          {/* Enterprise Escalation */}
          <div className="glass-blue rounded-lg p-6 text-center">
            <h3 className="text-white font-semibold mb-2">For critical enterprise issues only:</h3>
            <button
              onClick={() => router.push('/contact')}
              className="btn-outline mb-4"
            >
              🚨 Enterprise Emergency Contact
            </button>
            <p className="text-xs text-gray-400">
              Note: SUPERSAL™ handles 99.9% of all issues instantly. Human support for enterprise emergencies only.
            </p>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}