'use client';
import React from 'react';
import Link from 'next/link';
import { TrendingUp, DollarSign, Shield, CheckCircle, ArrowLeft, PieChart, Award, Target } from 'lucide-react';
import GHLContactForm from '../../../components/client-hub/GHLContactForm';

export default function InvestmentsPage() {
  const offerings = [
    {
      title: '9-12% Fixed Returns',
      description: 'Consistent income strategies backed by real assets and proven track record',
      icon: Target,
      features: ['Predictable income', 'Low volatility', 'Quarterly distributions']
    },
    {
      title: 'UPREIT & 721 Exchanges',
      description: 'Tax-deferred strategies for real estate investors looking to diversify',
      icon: Shield,
      features: ['Tax advantages', 'No capital gains', 'Portfolio diversity']
    },
    {
      title: 'Lending Syndicate',
      description: 'Participate in our institutional-quality lending fund',
      icon: PieChart,
      features: ['Secured by assets', 'Professional management', 'Monthly returns']
    },
    {
      title: 'Real Estate Portfolio',
      description: 'Diversified real estate investments across multiple asset classes',
      icon: Award,
      features: ['Multi-asset', 'Geographic diversity', 'Growth + income']
    }
  ];

  const highlights = [
    {
      stat: '9-12%',
      label: 'Annual Returns',
      description: 'Consistent performance'
    },
    {
      stat: '$50K',
      label: 'Minimum Investment',
      description: 'Institutional-quality access'
    },
    {
      stat: '100+',
      label: 'Active Investors',
      description: 'Trusted by many'
    }
  ];

  return (
    <div className="service-page investments-page">
      <div className="service-header">
        <Link href="/client-hub" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Client Hub</span>
        </Link>

        <div className="header-content">
          <div className="header-icon">
            <TrendingUp size={48} />
          </div>
          <h1 className="page-title">Investment Opportunities</h1>
          <p className="page-subtitle">Build wealth with our proven fixed-return strategies</p>
        </div>
      </div>

      <div className="service-content">
        {/* Highlights */}
        <section className="highlights-section">
          <div className="highlights-grid">
            {highlights.map((highlight, index) => (
              <div key={index} className="highlight-card">
                <div className="highlight-stat">{highlight.stat}</div>
                <div className="highlight-label">{highlight.label}</div>
                <div className="highlight-description">{highlight.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Investment Offerings */}
        <section className="products-section">
          <h2 className="section-title">Our Investment Strategies</h2>
          <div className="products-grid">
            {offerings.map((offering, index) => (
              <div key={index} className="product-card">
                <div className="product-icon">
                  <offering.icon size={28} />
                </div>
                <h3 className="product-title">{offering.title}</h3>
                <p className="product-description">{offering.description}</p>
                <ul className="product-features">
                  {offering.features.map((feature, i) => (
                    <li key={i}>
                      <CheckCircle size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Investment Form */}
        <section className="application-section">
          <div className="application-header">
            <DollarSign size={32} />
            <div>
              <h2>Start Investing Today</h2>
              <p>Schedule a consultation to discuss your investment goals</p>
            </div>
          </div>

          <GHLContactForm
            service="investments"
            title="Investment Consultation Request"
            subtitle="Our investment specialists will contact you to discuss opportunities"
            tags={['investments', 'consultation']}
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
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
          border-bottom: 1px solid rgba(245, 158, 11, 0.2);
          padding: 24px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #f59e0b;
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
          background: rgba(245, 158, 11, 0.2);
          border: 2px solid #f59e0b;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #f59e0b;
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
        }

        .service-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .highlights-section {
          margin-bottom: 64px;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .highlight-card {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
          border: 2px solid rgba(245, 158, 11, 0.3);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
        }

        .highlight-stat {
          font-size: 48px;
          font-weight: 800;
          color: #f59e0b;
          margin-bottom: 8px;
        }

        .highlight-label {
          font-size: 18px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .highlight-description {
          font-size: 14px;
          color: #999;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: white;
          text-align: center;
          margin-bottom: 40px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: #f59e0b;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.2);
        }

        .product-icon {
          width: 56px;
          height: 56px;
          background: rgba(245, 158, 11, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
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
          color: #f59e0b;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .application-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 24px;
          padding: 48px;
        }

        .application-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
          color: #f59e0b;
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

          .products-grid, .highlights-grid {
            grid-template-columns: 1fr;
          }

          .application-section {
            padding: 32px 24px;
          }
        }
      `}</style>
    </div>
  );
}
