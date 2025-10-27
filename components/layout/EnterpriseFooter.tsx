'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function EnterpriseFooter() {
  return (
    <footer className="bg-saint-gray-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center space-x-3">
              <Image
                src="/logos/THE BEST MAIN LOGO + COOKIN.png"
                alt="SaintVisionAI"
                width={48}
                height={48}
                className="object-contain"
              />
              <div>
                <div className="text-lg font-light tracking-wider text-white">SAINTVISIONAI</div>
                <div className="text-xs text-gray-600 tracking-widest mt-1">RESPONSIBLE INTELLIGENCE</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              The first AI platform that thinks, learns, and evolves with your business. 
              Patented HACP™ technology for enterprise-grade solutions.
            </p>
            <div className="flex space-x-4">
              <div className="hacp-active">
                <div className="hacp-dot" />
                <span className="text-xs tracking-[0.3em] text-saint-yellow-500 font-medium">HACP™ ACTIVE</span>
                <div className="hacp-dot" />
              </div>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/playground" className="hover:text-white transition">Playground</Link></li>
              <li><Link href="/agents" className="hover:text-white transition">AI Agents</Link></li>
              <li><Link href="/warroom" className="hover:text-white transition">WarRoom</Link></li>
              <li><Link href="/crm" className="hover:text-white transition">CRM</Link></li>
              <li><Link href="/connectivity" className="hover:text-white transition">Connectivity</Link></li>
              <li><Link href="/enterprise" className="hover:text-white transition">Enterprise</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-4">Solutions</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/pro" className="hover:text-white transition">PartnerTech</Link></li>
              <li><Link href="/institute" className="hover:text-white transition">Institute</Link></li>
              <li><Link href="/svg" className="hover:text-white transition">SVG Broker</Link></li>
              <li><Link href="/workstation" className="hover:text-white transition">Workstation</Link></li>
              <li><Link href="/pro/showcase" className="hover:text-white transition">Showcase</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/why" className="hover:text-white transition">Why SaintVision</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-500">
              <p>&copy; 2024 SaintVision AI™. All rights reserved.</p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
                <Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link>
                <Link href="/patents" className="hover:text-white transition">Patents</Link>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              <span>U.S. Patent 10,290,222 • HACP™ Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}