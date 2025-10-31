'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

// Declare the stripe-pricing-table custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'pricing-table-id'?: string;
        'publishable-key'?: string;
      };
    }
  }
}

export default function PricingPage() {
  const router = useRouter()
  const [stripeLoaded, setStripeLoaded] = useState(false)

  return (
    <>
      {/* Load Stripe Pricing Table Script */}
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="lazyOnload"
        onLoad={() => setStripeLoaded(true)}
      />

      <EnterpriseHeader />

      <div className="min-h-screen bg-black text-white pt-20">
        <section className="py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="heading-hero">
                <span className="block text-white">Choose Your</span>
                <span className="block text-gradient-yellow">Plan</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
                Simple, transparent pricing powered by Stripe. Start free, upgrade anytime.
              </p>
            </div>

            {/* Real Stripe Pricing Table */}
            <div className="max-w-5xl mx-auto bg-white/5 rounded-2xl p-8 border border-white/10">
              {stripeLoaded ? (
                <stripe-pricing-table
                  pricing-table-id="prctbl_1SIQItGVzsQbCDmmZ97ubwpM"
                  publishable-key="pk_live_51SGbmHGVzsQbCDmmc3GGBQKTrxEWfXJBw2wCZqPNJITuNcZdBI8uQa04BkWxBloqDq2fJmKuF2Z5o4MFO0o7uAJU009bQ0K6pw"
                />
              ) : (
                <div className="py-12 text-gray-400">
                  <div className="animate-pulse">Loading pricing options...</div>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="text-center mt-16">
              <h3 className="text-xl font-semibold text-white mb-8">Trusted & Secure</h3>
              <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-400">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Secure Stripe payments</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Cancel anytime</span>
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
