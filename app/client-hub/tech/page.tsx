'use client';
import React from 'react';
import Link from 'next/link';
import { Cpu, Brain, BarChart3, CheckCircle, ArrowLeft, Zap, Shield, TrendingUp, Award } from 'lucide-react';
import GHLContactForm from '../../../components/client-hub/GHLContactForm';

export default function TechPage() {
  const features = [
    {
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning for market insights and predictive modeling',
      icon: Brain,
      features: ['Real-time data', 'Predictive models', 'Custom reports']
    },
    {
      title: 'Property Valuation',
      description: 'Accurate automated valuations using AI and comprehensive data',
      icon: TrendingUp,
      features: ['Instant estimates', 'Market comparisons', 'Trend analysis']
    },
    {
      title: 'Portfolio Optimization',
      description: 'Smart tools to maximize returns and minimize risk in your investments',
      icon: BarChart3,
      features: ['Risk assessment', 'Diversification', 'Performance tracking']
    },
    {
      title: 'Financial Planning',
      description: 'Comprehensive planning tools with AI-driven recommendations',
      icon: Shield,
      features: ['Goal setting', 'Scenario modeling', 'Tax strategies']
    }
  ];

  return (
    <div className="service-page tech-page">
      <div className="service-header">
        <Link href="/client-hub" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Client Hub</span>
        </Link>

        <div className="header-content">
          <div className="header-icon">
            <Cpu size={48} />
          </div>
          <h1 className="page-title">SaintVision Tech™</h1>
          <p className="page-subtitle">AI-powered platform for intelligent financial decisions</p>

          <div className="patent-badge">
            <Award size={20} />
            <span>Patent #10,290,222 | Proprietary AI Framework</span>
          </div>
        </div>
      </div>

      <div className="service-content">
        {/* Platform Overview */}
        <section className="overview-section">
          <h2 className="section-title">Platform Capabilities</h2>
          <div className="overview-content">
            <div className="overview-text">
              <p>
                SaintVision Tech™ represents the cutting edge of financial technology,
                combining artificial intelligence, machine learning, and big data analytics
                to deliver unparalleled insights for investors, lenders, and real estate professionals.
              </p>
              <p>
                Our proprietary AI framework (Patent #10,290,222) automates complex financial
                processes, provides real-time market intelligence, and enables data-driven
                decision-making at scale.
              </p>
            </div>

            <div className="overview-features">
              <div className="overview-feature">
                <Zap size={24} />
                <div>
                  <h4>Real-Time Intelligence</h4>
                  <p>Live market data and instant analysis</p>
                </div>
              </div>
              <div className="overview-feature">
                <Brain size={24} />
                <div>
                  <h4>Machine Learning</h4>
                  <p>Predictive models that learn and improve</p>
                </div>
              </div>
              <div className="overview-feature">
                <Shield size={24} />
                <div>
                  <h4>Enterprise Security</h4>
                  <p>Bank-level encryption and compliance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="products-section">
          <h2 className="section-title">Core Features</h2>
          <div className="products-grid">
            {features.map((feature, index) => (
              <div key={index} className="product-card">
                <div className="product-icon">
                  <feature.icon size={28} />
                </div>
                <h3 className="product-title">{feature.title}</h3>
                <p className="product-description">{feature.description}</p>
                <ul className="product-features">
                  {feature.features.map((item, i) => (
                    <li key={i}>
                      <CheckCircle size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Platform Access Form */}
        <section className="application-section">
          <div className="application-header">
            <Zap size={32} />
            <div>
              <h2>Request Platform Access</h2>
              <p>Get started with SaintVision Tech™ today</p>
            </div>
          </div>

          <GHLContactForm
            service="tech"
            title="Platform Access Request"
            subtitle="Tell us about your needs and we'll set up your account"
            tags={['tech', 'platform-access']}
          />
        </section>
      </div>

      <style jsx>{`
        .service-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          color: white;
        }

        .service-header {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%);
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
          padding: 24px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #8b5cf6;
          font-weight: 600;
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          gap: 12px;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .header-icon {
          width: 96px;
          height: 96px;
          background: rgba(139, 92, 246, 0.2);
          border: 2px solid #8b5cf6;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #8b5cf6;
        }

        .page-title {
          font-size: 48px;
          font-weight: 800;
          color: white;
          margin-bottom: 12px;
        }

        .page-subtitle {
          font-size: 20px;
          color: #999;
          margin-bottom: 16px;
        }

        .patent-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(139, 92, 246, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.4);
          padding: 8px 16px;
          border-radius: 24px;
          color: #8b5cf6;
          font-size: 14px;
          font-weight: 600;
        }

        .service-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .overview-section {
          margin-bottom: 64px;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: white;
          text-align: center;
          margin-bottom: 40px;
        }

        .overview-content {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          padding: 40px;
        }

        .overview-text {
          margin-bottom: 32px;
        }

        .overview-text p {
          font-size: 16px;
          line-height: 1.7;
          color: #ccc;
          margin-bottom: 16px;
        }

        .overview-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .overview-feature {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          color: #8b5cf6;
        }

        .overview-feature h4 {
          font-size: 16px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .overview-feature p {
          font-size: 14px;
          color: #999;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: #8b5cf6;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
        }

        .product-icon {
          width: 56px;
          height: 56px;
          background: rgba(139, 92, 246, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
          margin-bottom: 16px;
        }

        .product-title {
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .product-description {
          font-size: 15px;
          color: #999;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .product-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .product-features li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #8b5cf6;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .application-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 24px;
          padding: 48px;
        }

        .application-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
          color: #8b5cf6;
        }

        .application-header h2 {
          font-size: 32px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .application-header p {
          font-size: 16px;
          color: #999;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 36px;
          }

          .products-grid, .overview-features {
            grid-template-columns: 1fr;
          }

          .application-section, .overview-content {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}
