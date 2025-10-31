'use client'

import { useRouter } from 'next/navigation'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <>
      <EnterpriseHeader />
      
      <div className="min-h-screen bg-black text-white pt-20">
        <section className="py-20 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-gradient-yellow">Privacy</span> Policy
              </h1>
              <p className="text-gray-400">
                Last updated: January 2024
              </p>
              <div className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                <span className="text-sm text-green-400">🔒 GDPR & CCPA Compliant</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                <div className="text-gray-300 space-y-4">
                  <h3 className="text-lg font-medium text-saint-yellow-500">Enterprise Account Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Business contact information (name, email, company, role)</li>
                    <li>Account credentials and authentication data</li>
                    <li>Billing and payment information (processed by certified third parties)</li>
                    <li>Enterprise configuration and customization preferences</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Usage and Performance Data</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>AI interaction logs and conversation data (enterprise-encrypted)</li>
                    <li>System performance metrics and usage analytics</li>
                    <li>Feature utilization and workflow optimization data</li>
                    <li>Error logs and diagnostic information for system improvement</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Enterprise Integration Data</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>API connection metadata (not content)</li>
                    <li>Integration configuration settings</li>
                    <li>System compatibility and performance benchmarks</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                <div className="text-gray-300 space-y-4">
                  <h3 className="text-lg font-medium text-saint-yellow-500">Service Delivery</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Provide and maintain SaintVision AI platform services</li>
                    <li>Process AI requests through our HACP™ protocol</li>
                    <li>Deliver enterprise-grade support and account management</li>
                    <li>Enable custom integrations and workflow automation</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Platform Improvement</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Enhance AI model performance and accuracy</li>
                    <li>Develop new enterprise features and capabilities</li>
                    <li>Optimize system performance and reliability</li>
                    <li>Conduct security monitoring and threat detection</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Business Operations</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Process billing and manage enterprise subscriptions</li>
                    <li>Provide customer support and technical assistance</li>
                    <li>Send important service updates and security notifications</li>
                    <li>Comply with legal obligations and regulatory requirements</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Enterprise Data Security</h2>
                <div className="glass-yellow rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-medium text-white mb-3">🛡️ Military-Grade Security</h3>
                  <div className="text-gray-300 space-y-2">
                    <p>• AES-256 encryption for all data at rest and in transit</p>
                    <p>• SOC 2 Type II certified security controls</p>
                    <p>• Zero-trust network architecture</p>
                    <p>• Regular third-party security audits and penetration testing</p>
                  </div>
                </div>

                <div className="text-gray-300 space-y-4">
                  <h3 className="text-lg font-medium text-saint-yellow-500">Data Protection Measures</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Multi-factor authentication and role-based access controls</li>
                    <li>Regular automated backups with geographic distribution</li>
                    <li>24/7 security monitoring and incident response team</li>
                    <li>Employee background checks and security training</li>
                    <li>Secure development lifecycle and code review processes</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Enterprise Data Residency</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Choose data storage location (US, EU, APAC)</li>
                    <li>Compliance with local data sovereignty requirements</li>
                    <li>Optional on-premises deployment for sensitive workloads</li>
                    <li>Custom data retention and deletion policies</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing and Third Parties</h2>
                <div className="text-gray-300 space-y-4">
                  <div className="glass-blue rounded-lg p-4 mb-4">
                    <p className="text-white font-medium">
                      🔒 We NEVER sell or rent your enterprise data to third parties.
                    </p>
                  </div>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Limited Sharing Scenarios</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li><strong>Service Providers:</strong> Certified cloud infrastructure partners (AWS, Azure) under strict data processing agreements</li>
                    <li><strong>Legal Compliance:</strong> Only when required by law or to protect our rights and safety</li>
                    <li><strong>Business Continuity:</strong> In the event of merger or acquisition, with equivalent privacy protections</li>
                    <li><strong>Enterprise Integrations:</strong> With your explicit consent for authorized system connections</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">AI Model Training</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Enterprise customer data is NEVER used for general AI model training</li>
                    <li>Custom model training only with explicit enterprise agreements</li>
                    <li>All training data is anonymized and aggregated when permitted</li>
                    <li>Complete opt-out controls available for all enterprise customers</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Your Privacy Rights</h2>
                <div className="text-gray-300 space-y-4">
                  <h3 className="text-lg font-medium text-saint-yellow-500">GDPR Rights (EU Customers)</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li><strong>Access:</strong> Request copies of your personal data</li>
                    <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                    <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                    <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                    <li><strong>Restriction:</strong> Limit how we process your data</li>
                    <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">CCPA Rights (California Customers)</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li><strong>Know:</strong> Right to know what personal information is collected</li>
                    <li><strong>Delete:</strong> Right to delete personal information</li>
                    <li><strong>Opt-Out:</strong> Right to opt-out of sale (note: we don't sell data)</li>
                    <li><strong>Non-Discrimination:</strong> Equal service regardless of privacy choices</li>
                  </ul>

                  <h3 className="text-lg font-medium text-saint-yellow-500">Enterprise Controls</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Real-time data deletion through enterprise dashboard</li>
                    <li>Granular privacy controls for different data types</li>
                    <li>Audit logs of all data access and processing activities</li>
                    <li>Dedicated privacy liaison for enterprise customers</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Information</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    For privacy-related questions, requests, or concerns, contact our Data Protection Team:
                  </p>
                  
                  <div className="glass rounded-lg p-4">
                    <div className="space-y-2">
                      <p><strong>Email:</strong> <a href="mailto:privacy@saintvisionai.com" className="text-saint-yellow-500 hover:underline">privacy@saintvisionai.com</a></p>
                      <p><strong>Phone:</strong> <a href="tel:+1-555-PRIVACY" className="text-saint-blue-500 hover:underline">+1 (555) PRIVACY</a></p>
                      <p><strong>Address:</strong> SaintVision AI Privacy Office, San Francisco, CA</p>
                      <p><strong>EU Representative:</strong> privacy-eu@saintvisionai.com</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400">
                    We will respond to all privacy requests within 30 days (or sooner as required by applicable law).
                    Enterprise customers receive priority handling within 5 business days.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Updates to This Policy</h2>
                <div className="text-gray-300 space-y-4">
                  <p>
                    We may update this Privacy Policy to reflect changes in our practices, technology, 
                    legal requirements, or other factors. When we make material changes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>We will notify enterprise customers via email and platform notifications</li>
                    <li>We will post the updated policy with a new "Last Updated" date</li>
                    <li>We will provide a summary of material changes</li>
                    <li>Enterprise customers will have 30 days to review and accept changes</li>
                  </ul>
                </div>
              </section>

              <div className="border-t border-white/10 pt-8 mt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <p className="text-gray-400 text-sm mb-4 sm:mb-0">
                    This policy is effective as of January 2024 and governs the SaintVision AI enterprise platform.
                  </p>
                  <button
                    onClick={() => window.location.href = 'mailto:ryan@cookinknowledge.com?subject=Privacy Policy Question'}
                    className="btn-outline"
                  >
                    Privacy Questions?
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