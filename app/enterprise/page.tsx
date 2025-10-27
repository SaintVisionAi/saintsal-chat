'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function EnterprisePage() {
  const router = useRouter()

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen flex items-center justify-center px-8 overflow-hidden pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/Wallst.png"
            alt="Enterprise Solutions"  
            fill
            className="object-cover"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center pt-20">
          <h1 className="heading-hero animate-fade-in">
            <span className="block text-white">Enterprise</span>
            <span className="block text-gradient-yellow">AI Solutions</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 animate-slide-up">
            Deploy AI at enterprise scale. White-label solutions, custom integrations, 
            and dedicated support for Fortune 500 companies.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in">
            <button
              onClick={() => router.push('/contact')}
              className="btn-primary"
            >
              🤝 Schedule Demo
            </button>
            <button
              onClick={() => router.push('/pricing')}
              className="btn-secondary"
            >
              💼 View Enterprise Pricing
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 bg-saint-gray-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="enterprise-card">
              <div className="text-4xl mb-6">🏢</div>
              <h3 className="text-xl font-semibold text-white mb-4">White-Label Solutions</h3>
              <p className="text-gray-400 text-sm">
                Complete white-label AI platform with your branding, custom domains, 
                and client management capabilities.
              </p>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">🔧</div>
              <h3 className="text-xl font-semibold text-white mb-4">Custom Integrations</h3>
              <p className="text-gray-400 text-sm">
                Seamless integration with existing enterprise systems, databases, 
                and workflows. API-first architecture.
              </p>
            </div>
            
            <div className="enterprise-card">
              <div className="text-4xl mb-6">👨‍💼</div>
              <h3 className="text-xl font-semibold text-white mb-4">Dedicated Support</h3>
              <p className="text-gray-400 text-sm">
                24/7 dedicated account management, custom training programs, 
                and enterprise SLA guarantees.
              </p>
            </div>
          </div>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}