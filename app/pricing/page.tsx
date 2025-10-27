'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function PricingPage() {
  const router = useRouter()
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: 'Starter',
      price: billing === 'monthly' ? 0 : 0,
      description: 'Perfect for individuals and small teams',
      features: [
        '10 AI conversations/day',
        'Basic HACP™ protocol',
        'Email support',
        'Community access',
        'Standard analytics'
      ],
      cta: 'Start Free',
      popular: false,
      color: 'blue'
    },
    {
      name: 'Professional',
      price: billing === 'monthly' ? 97 : 970,
      description: 'For growing businesses and teams',
      features: [
        'Unlimited AI conversations',
        'Full HACP™ protocol access',
        'Priority support',
        'CRM integration',
        'Advanced analytics',
        'Custom workflows',
        'API access'
      ],
      cta: 'Go Pro',
      popular: true,
      color: 'yellow'
    },
    {
      name: 'Enterprise',
      price: billing === 'monthly' ? 297 : 2970,
      description: 'Scale without limits',
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Dedicated account manager',
        'Custom AI training',
        'Advanced integrations',
        'SLA guarantee',
        'White-label options'
      ],
      cta: 'Contact Sales',
      popular: false,
      color: 'green'
    }
  ]

  return (
    <>
      <EnterpriseHeader />
      
      <div className="min-h-screen bg-black text-white pt-20">
        <section className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="heading-hero">
                <span className="block text-white">Simple, Transparent</span>
                <span className="block text-gradient-yellow">Pricing</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                Choose the plan that fits your business needs. All plans include our patented HACP™ technology.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4 mb-12">
                <span className={`text-sm ${billing === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
                <button
                  onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-saint-yellow-500 focus:ring-offset-2"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billing === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${billing === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
                  Yearly <span className="text-saint-yellow-500 font-semibold">(Save 20%)</span>
                </span>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {plans.map((plan, index) => (
                <div
                  key={plan.name}
                  className={`enterprise-card relative ${
                    plan.popular ? 'ring-2 ring-saint-yellow-500 bg-saint-yellow-500/5' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-saint-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-400">
                        /{billing === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>

                    <ul className="space-y-3 mb-8 text-left">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-sm text-gray-300">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => plan.name === 'Enterprise' ? router.push('/contact') : router.push('/signup')}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                        plan.popular
                          ? 'bg-saint-yellow-500 text-black hover:bg-saint-yellow-400'
                          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Enterprise Features */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-8">All Plans Include</h3>
              <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-400">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>99.9% uptime SLA</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>SOC 2 certified security</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>GDPR & CCPA compliant</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>24/7 monitoring</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>30-day money back</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <EnterpriseFooter />
    </>
  )
}