'use client'

import { useRouter } from 'next/navigation'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function TermsPage() {
  const router = useRouter()

  return (
    <>
      <EnterpriseHeader />
      
      <div className="min-h-screen bg-black text-white pt-20">
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-gradient-yellow">Terms</span> of Service
              </h1>
              <p className="text-gray-400">
                Last updated: January 2024
              </p>
              <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <span className="text-sm text-blue-400">⚖️ Enterprise Grade Terms</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Service Agreement</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    Welcome to SaintVision AI™. These Terms of Service ("Terms") govern your use of our 
                    enterprise artificial intelligence platform, including all software, services, and 
                    technologies provided by SaintVision AI, Inc.
                  </p>
                  
                  <div className="glass-yellow rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">🙏 Faith-Guided Service</h3>
                    <p className="text-gray-300 text-sm">
                      Our services are built on principles of integrity, service, and genuine care for 
                      human flourishing. We commit to serving our enterprise customers with the highest 
                      standards of excellence and ethical conduct.
                    </p>
                  </div>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Enterprise License</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Full access to SaintVision AI platform and HACP™ protocol</li>
                    <li>Unlimited AI agent deployments within subscription tier</li>
                    <li>Enterprise-grade security and compliance features</li>
                    <li>Priority support and account management</li>
                    <li>Custom integration and white-label options</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Acceptable Use Policy</h2>
                <div className="text-gray-300 space-y-4">
                  <h3 className="text-lg font-medium text-saint-yellow-500">Permitted Uses</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Business automation and intelligent workflow processing</li>
                    <li>Customer service enhancement and support optimization</li>
                    <li>Data analysis and business intelligence generation</li>
                    <li>Educational content creation and training programs</li>
                    <li>Healthcare support and therapeutic assistance (where licensed)</li>
                    <li>Research and development for responsible AI advancement</li>
                  </ul>

                  <div className="glass-blue rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">🛡️ Responsible AI Commitment</h3>
                    <p className="text-gray-300 text-sm">
                      All AI interactions are guided by our HACP™ protocol, ensuring ethical, 
                      responsible, and human-centered artificial intelligence deployment.
                    </p>
                  </div>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Prohibited Uses</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Illegal, harmful, or malicious activities of any kind</li>
                    <li>Generation of false, misleading, or deceptive content</li>
                    <li>Harassment, discrimination, or harmful targeting of individuals</li>
                    <li>Violation of intellectual property or privacy rights</li>
                    <li>Attempts to reverse engineer or compromise system security</li>
                    <li>Uses that conflict with our faith-guided principles</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Enterprise Subscriptions</h2>
                <div className="text-gray-300 space-y-4">
                  <h3 className="text-lg font-medium text-saint-yellow-500">Billing Terms</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Enterprise subscriptions billed monthly or annually in advance</li>
                    <li>Usage overages calculated and billed monthly</li>
                    <li>All payments processed through secure, PCI-compliant systems</li>
                    <li>Enterprise discounts available for annual commitments</li>
                    <li>Custom pricing for Fortune 500 and government deployments</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Refund Policy</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>30-day money-back guarantee for new enterprise customers</li>
                    <li>Pro-rated refunds for subscription downgrades</li>
                    <li>Full refund for verified service level agreement breaches</li>
                    <li>Custom refund terms available for enterprise contracts</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Service Level Agreement</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>99.9% platform uptime guarantee with automatic credits</li>
                    <li>Response time SLAs based on subscription tier</li>
                    <li>Enterprise customers receive priority support queuing</li>
                    <li>Dedicated account management for enterprise accounts</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
                <div className="text-gray-300 space-y-4">
                  <div className="glass rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">🔐 HACP™ Patent Protection</h3>
                    <p className="text-gray-300 text-sm">
                      Our Human-AI Connection Protocol (U.S. Patent 10,290,222) and related technologies 
                      are protected intellectual property of SaintVision AI, Inc.
                    </p>
                  </div>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Platform Rights</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>SaintVision AI retains all rights to platform technology and algorithms</li>
                    <li>Enterprise customers receive usage rights, not ownership</li>
                    <li>Custom model training creates joint intellectual property</li>
                    <li>White-label deployments include limited branding rights</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Customer Data Rights</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Customers retain full ownership of their input data and content</li>
                    <li>Generated outputs belong to the customer under enterprise terms</li>
                    <li>SaintVision AI claims no ownership over customer business data</li>
                    <li>Data portability guaranteed for all enterprise customers</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security & Compliance</h2>
                <div className="text-gray-300 space-y-4">
                  <div className="glass-yellow rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">🛡️ Enterprise Security Commitment</h3>
                    <p className="text-gray-300 text-sm">
                      We maintain military-grade security standards, SOC 2 certification, and compliance 
                      with GDPR, CCPA, HIPAA (where applicable), and other regulatory frameworks.
                    </p>
                  </div>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Security Measures</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>AES-256 encryption for all data at rest and in transit</li>
                    <li>Zero-trust network architecture and access controls</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>24/7 security monitoring and incident response</li>
                    <li>Employee background checks and security training</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Compliance Standards</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>SOC 2 Type II certified security and availability controls</li>
                    <li>GDPR compliance for European Union customers</li>
                    <li>CCPA compliance for California customers</li>
                    <li>HIPAA compliance available for healthcare deployments</li>
                    <li>Custom compliance frameworks for enterprise requirements</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    While we strive for perfection in our service delivery, enterprise customers 
                    acknowledge the following limitations:
                  </p>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Service Limitations</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>AI responses are generated and may require human verification</li>
                    <li>Platform availability subject to maintenance and updates</li>
                    <li>Third-party integration dependencies may affect performance</li>
                    <li>Enterprise customers responsible for proper use case implementation</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Liability Caps</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Total liability limited to 12 months of subscription fees</li>
                    <li>No liability for indirect, consequential, or punitive damages</li>
                    <li>Enterprise contracts may include higher liability limits</li>
                    <li>Insurance coverage available for critical enterprise deployments</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
                <div className="text-gray-300 space-y-4">
                  <h3 className="text-lg font-medium text-saint-yellow-500">Customer Termination Rights</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Cancel subscription anytime with 30-day notice</li>
                    <li>Data export available for 90 days after termination</li>
                    <li>Pro-rated refunds for unused subscription periods</li>
                    <li>Enterprise contracts may have different termination terms</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Service Termination</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>We may terminate for material breach with 30-day cure period</li>
                    <li>Immediate termination for illegal or harmful use</li>
                    <li>60-day notice for service discontinuation</li>
                    <li>Data protection and migration assistance during transitions</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Contact & Dispute Resolution</h2>
                <div className="text-gray-300 space-y-4">
                  <div className="glass rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2">📞 Enterprise Legal Contact</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> <a href="mailto:legal@saintvisionai.com" className="text-saint-yellow-500 hover:underline">legal@saintvisionai.com</a></p>
                      <p><strong>Address:</strong> SaintVision AI Legal Department, San Francisco, CA</p>
                      <p><strong>Enterprise Contracts:</strong> <a href="mailto:contracts@saintvisionai.com" className="text-saint-blue-500 hover:underline">contracts@saintvisionai.com</a></p>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Dispute Resolution</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Good faith negotiation required before formal proceedings</li>
                    <li>Mediation through American Arbitration Association</li>
                    <li>Binding arbitration for disputes under $100,000</li>
                    <li>Delaware courts for enterprise contract disputes</li>
                    <li>Fee shifting for frivolous claims</li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-white/10 pt-8 mt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <p className="text-gray-400 text-sm mb-4 sm:mb-0">
                    🙏 These terms are crafted with integrity and faithfulness to serve our enterprise customers with excellence.
                  </p>
                  <button
                    onClick={() => window.location.href = 'mailto:ryan@cookinknowledge.com?subject=Terms of Service Question'}
                    className="btn-outline"
                  >
                    Legal Questions?
                  </button>
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