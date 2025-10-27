'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import EnterpriseHeader from '@/components/layout/EnterpriseHeader'
import EnterpriseFooter from '@/components/layout/EnterpriseFooter'

export default function BlogPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Posts', count: 42 },
    { id: 'ai-research', name: 'AI Research', count: 15 },
    { id: 'enterprise', name: 'Enterprise', count: 12 },
    { id: 'technology', name: 'Technology', count: 8 },
    { id: 'company', name: 'Company News', count: 7 }
  ]

  const featuredPost = {
    title: 'The Future of Enterprise AI: HACP™ Protocol in Production',
    excerpt: 'How our patented Human-AI Connection Protocol is transforming Fortune 500 companies through responsible artificial intelligence deployment at scale.',
    author: 'Dr. Marcus Vision',
    date: 'January 15, 2024',
    readTime: '8 min read',
    category: 'AI Research',
    image: '/backgrounds/FUTURESV.png',
    featured: true
  }

  const posts = [
    {
      title: 'Enterprise AI Security: Best Practices for 2024',
      excerpt: 'Comprehensive guide to implementing military-grade security in enterprise AI deployments.',
      author: 'Sarah Chen',
      date: 'January 12, 2024',
      readTime: '6 min read',
      category: 'Enterprise',
      tags: ['Security', 'Enterprise', 'Best Practices']
    },
    {
      title: 'Building Responsible AI: Lessons from 500+ Deployments',
      excerpt: 'Key insights from enterprise AI implementations across healthcare, finance, and education.',
      author: 'Dr. James Wisdom',
      date: 'January 10, 2024',
      readTime: '5 min read',
      category: 'AI Research',
      tags: ['Responsible AI', 'Case Studies', 'Enterprise']
    },
    {
      title: 'SaintVision AI Raises $150M Series C for Global Expansion',
      excerpt: 'Funding round led by Andreessen Horowitz to accelerate international growth and R&D.',
      author: 'Alexandra Saint',
      date: 'January 8, 2024',
      readTime: '3 min read',
      category: 'Company News',
      tags: ['Funding', 'Growth', 'Series C']
    },
    {
      title: 'The Science Behind Emotional AI: HACP™ Technical Deep Dive',
      excerpt: 'Understanding the neural networks and algorithms that enable human-centric AI interactions.',
      author: 'Dr. Marcus Vision',
      date: 'January 5, 2024',
      readTime: '12 min read',
      category: 'Technology',
      tags: ['HACP', 'Technical', 'Machine Learning']
    },
    {
      title: 'Enterprise AI ROI: Fortune 500 Case Study Analysis',
      excerpt: 'Quantifying the business impact of AI automation across industries and use cases.',
      author: 'Michael Analytics',
      date: 'January 3, 2024',
      readTime: '7 min read',
      category: 'Enterprise',
      tags: ['ROI', 'Case Study', 'Business Impact']
    },
    {
      title: 'AI Ethics Framework: Building Trust in Enterprise Systems',
      excerpt: 'Our comprehensive approach to ethical AI development and responsible deployment practices.',
      author: 'Dr. James Wisdom',
      date: 'December 28, 2023',
      readTime: '9 min read',
      category: 'AI Research',
      tags: ['Ethics', 'Trust', 'Framework']
    }
  ]

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === categories.find(c => c.id === selectedCategory)?.name)

  return (
    <>
      <EnterpriseHeader />
      
      <section className="relative min-h-screen px-8 pt-20">
        <div className="parallax-bg">
          <Image
            src="/backgrounds/eyeontheprize.png"
            alt="Enterprise AI Blog"  
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="parallax-overlay" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-8">
          <div className="text-center mb-16">
            <h1 className="heading-hero animate-fade-in">
              <span className="block text-white">Enterprise AI</span>
              <span className="block text-gradient-yellow">Knowledge Hub</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
              Stay ahead of the enterprise AI revolution with insights from our research team, 
              case studies from Fortune 500 deployments, and the latest in responsible AI development.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="glass-yellow rounded-full px-4 py-2">
                <span className="text-sm text-yellow-400">📊 42 Research Articles</span>
              </div>
              <div className="glass-blue rounded-full px-4 py-2">
                <span className="text-sm text-blue-400">🏢 Enterprise Case Studies</span>
              </div>
              <div className="glass rounded-full px-4 py-2">
                <span className="text-sm text-green-400">🔬 Weekly Updates</span>
              </div>
            </div>
          </div>

          {/* Featured Article */}
          <section className="mb-20">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-saint-yellow-500/20 text-saint-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                    <span className="text-gray-400 text-sm">{featuredPost.category}</span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-300 mb-6">{featuredPost.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-saint-yellow-500 to-saint-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-black text-sm font-bold">{featuredPost.author.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{featuredPost.author}</div>
                        <div className="text-gray-400 text-xs">{featuredPost.date} • {featuredPost.readTime}</div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="btn-primary">
                    Read Full Article →
                  </button>
                </div>
                
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Category Filter */}
          <section className="mb-12">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full transition ${
                    selectedCategory === category.id
                      ? 'bg-saint-yellow-500 text-black font-semibold'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </section>

          {/* Articles Grid */}
          <section className="mb-20">
            <div className="grid lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article key={index} className="enterprise-card group cursor-pointer hover:scale-105 transition-transform">
                  <div className="mb-4">
                    <span className="bg-white/10 text-gray-300 px-2 py-1 rounded text-xs">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-saint-yellow-400 transition">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-black/30 text-gray-400 px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-saint-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{post.author.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="text-gray-400">{post.author}</span>
                    </div>
                    <div className="text-gray-500">{post.readTime}</div>
                  </div>
                  
                  <div className="text-gray-500 text-xs mt-2">{post.date}</div>
                </article>
              ))}
            </div>
          </section>

          {/* Newsletter Signup */}
          <section className="mb-20">
            <div className="glass-yellow rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                📧 Enterprise AI Newsletter
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get the latest enterprise AI insights, case studies, and research delivered to your inbox. 
                Join 10,000+ technology leaders staying ahead of the AI revolution.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your business email"
                  className="flex-1 p-3 bg-black/50 border border-white/20 rounded-lg text-white focus:outline-none focus:border-saint-yellow-500"
                />
                <button className="btn-primary whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              
              <p className="text-xs text-gray-400 mt-4">
                Weekly insights • No spam • Enterprise-focused content • Unsubscribe anytime
              </p>
            </div>
          </section>

          {/* Research Reports */}
          <section>
            <h2 className="heading-section text-center mb-12">
              Research <span className="text-gradient-yellow">Reports</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="enterprise-card">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-white mb-3">2024 Enterprise AI State Report</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Comprehensive analysis of AI adoption across Fortune 500 companies.
                </p>
                <button className="btn-outline w-full">
                  Download PDF
                </button>
              </div>

              <div className="enterprise-card">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-lg font-semibold text-white mb-3">AI Security Best Practices</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Essential security frameworks for enterprise AI deployments.
                </p>
                <button className="btn-outline w-full">
                  Download PDF
                </button>
              </div>

              <div className="enterprise-card">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-3">ROI Calculator Toolkit</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Calculate potential returns from enterprise AI investments.
                </p>
                <button className="btn-outline w-full">
                  Download Toolkit
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>

      <EnterpriseFooter />
    </>
  )
}