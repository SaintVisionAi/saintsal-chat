'use client';
import React from 'react';
import Link from 'next/link';
import { DollarSign, TrendingUp, Clock, CheckCircle, ArrowLeft, Building, CreditCard, Home as HomeIcon, Briefcase } from 'lucide-react';
import GHLContactForm from '../../../components/client-hub/GHLContactForm';

export default function LendingPage() {
  const lendingProducts = [
    {
      title: 'Business Loans',
      description: 'Working capital and growth financing for businesses of all sizes',
      icon: Briefcase,
      features: ['Up to $5M', 'Fast approval', 'Flexible terms']
    },
    {
      title: 'Real Estate Financing',
      description: 'Residential, commercial, and mixed-use property loans',
      icon: HomeIcon,
      features: ['Competitive rates', 'Quick closings', 'Expert guidance']
    },
    {
      title: 'Merchant Cash Advances',
      description: 'Fast access to capital based on future sales',
      icon: CreditCard,
      features: ['24-48hr funding', 'No collateral', 'Bad credit OK']
    },
    {
      title: 'Lines of Credit',
      description: 'Revolving credit lines for ongoing business needs',
      icon: TrendingUp,
      features: ['Draw as needed', 'Low rates', 'Easy access']
    },
    {
      title: 'Bridge Loans',
      description: 'Short-term financing for time-sensitive opportunities',
      icon: Building,
      features: ['Fast close', 'Flexible terms', 'Up to 80% LTV']
    },
    {
      title: 'Construction Loans',
      description: 'Financing for ground-up development and renovations',
      icon: Building,
      features: ['Draw schedules', 'Competitive rates', 'Expert support']
    }
  ];

  const benefits = [
    'Fast approval process (24-72 hours)',
    'Competitive interest rates',
    'Flexible repayment terms',
    'No prepayment penalties',
    'Dedicated loan specialist',
    'Expert financial guidance'
  ];

  return (
    <div className="service-page lending-page">
      {/* Header */}
      <div className="service-header">
        <Link href="/client-hub" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Client Hub</span>
        </Link>

        <div className="header-content">
          <div className="header-icon">
            <DollarSign size={48} />
          </div>
          <h1 className="page-title">Lending Solutions</h1>
          <p className="page-subtitle">Fast, flexible financing for your business and real estate needs</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="service-content">
        {/* Products Grid */}
        <section className="products-section">
          <h2 className="section-title">Our Lending Products</h2>
          <div className="products-grid">
            {lendingProducts.map((product, index) => (
              <div key={index} className="product-card">
                <div className="product-icon">
                  <product.icon size={28} />
                </div>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-description">{product.description}</p>
                <ul className="product-features">
                  {product.features.map((feature, i) => (
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

        {/* Benefits Section */}
        <section className="benefits-section">
          <h2 className="section-title">Why Choose Saint Vision Group?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <CheckCircle size={20} className="benefit-icon" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="application-section">
          <div className="application-header">
            <Clock size={32} />
            <div>
              <h2>Apply Now</h2>
              <p>Get a response within 24-72 hours</p>
            </div>
          </div>

          <GHLContactForm
            service="lending"
            title="Start Your Lending Application"
            subtitle="Tell us about your financing needs and we'll get back to you within 24 hours"
            tags={['lending', 'loan-application']}
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
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
          border-bottom: 1px solid rgba(16, 185, 129, 0.2);
          padding: 24px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #10b981;
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
          background: rgba(16, 185, 129, 0.2);
          border: 2px solid #10b981;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #10b981;
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

        .section-title {
          font-size: 32px;
          font-weight: 700;
          color: white;
          text-align: center;
          margin-bottom: 40px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: #10b981;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
        }

        .product-icon {
          width: 56px;
          height: 56px;
          background: rgba(16, 185, 129, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #10b981;
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
          color: #10b981;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .benefits-section {
          margin-bottom: 64px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 15px;
        }

        .benefit-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .application-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: 24px;
          padding: 48px;
        }

        .application-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
          color: #10b981;
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

          .products-grid {
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
