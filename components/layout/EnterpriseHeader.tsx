'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function EnterpriseHeader() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full glass z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logos/SVTLOGO.png"
              alt="SaintVisionAI"
              width={36}
              height={36}
              className="object-contain"
            />
            <div>
              <div className="font-bold text-white text-lg">SAINTVISIONAI</div>
              <div className="text-xs text-gray-500 tracking-wider">COOKIN' KNOWLEDGE</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/playground" className="nav-link">
              Playground
            </Link>
            <Link href="/agents" className="nav-link">
              Agents
            </Link>
            <Link href="/why" className="nav-link">
              Why
            </Link>
            <Link href="/pricing" className="nav-link">
              Pricing
            </Link>
            <Link href="/demo" className="nav-link">
              Demo
            </Link>
            <Link href="/help" className="nav-link">
              Help
            </Link>
            <Link href="/enterprise" className="nav-link">
              Enterprise
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              href="/signin" 
              className="nav-link"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="px-4 py-2 bg-saint-yellow-500 text-black font-bold rounded-lg hover:bg-saint-yellow-400 transition"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link href="/playground" className="nav-link">
                Playground
              </Link>
              <Link href="/agents" className="nav-link">
                Agents
              </Link>
              <Link href="/why" className="nav-link">
                Why
              </Link>
              <Link href="/pricing" className="nav-link">
                Pricing
              </Link>
              <Link href="/demo" className="nav-link">
                Demo
              </Link>
              <Link href="/help" className="nav-link">
                Help
              </Link>
              <Link href="/enterprise" className="nav-link">
                Enterprise
              </Link>
              <hr className="border-white/10" />
              <Link href="/signin" className="nav-link">
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="px-4 py-2 bg-saint-yellow-500 text-black font-bold rounded-lg hover:bg-saint-yellow-400 transition w-fit"
              >
                Start Free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}