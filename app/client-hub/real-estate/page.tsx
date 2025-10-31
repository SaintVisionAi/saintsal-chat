'use client';
import React from 'react';
import Link from 'next/link';
import { Home, Key, TrendingUp, CheckCircle, ArrowLeft, Building2, Search, FileText } from 'lucide-react';
import GHLContactForm from '../../../components/client-hub/GHLContactForm';

export default function RealEstatePage() {
  const services = [
    {
      title: 'Residential Sales',
      description: 'Buy or sell your home with expert guidance and market insights',
      icon: Home,
      features: ['Market analysis', 'Negotiation', 'Full-service support']
    },
    {
      title: 'Commercial Properties',
      description: 'Office, retail, industrial, and mixed-use commercial real estate',
      icon: Building2,
      features: ['Investment analysis', 'Due diligence', 'Portfolio growth']
    },
    {
      title: 'Property Search',
      description: 'Find your perfect property with our extensive network',
      icon: Search,
      features: ['MLS access', 'Off-market deals', 'Custom searches']
    },
    {
      title: 'Financing Solutions',
      description: 'Competitive rates and fast approvals for all property types',
      icon: FileText,
      features: ['Multiple lenders', 'Best rates', 'Quick closings']
    }
  ];

  return (
    <div className="service-page real-estate-page">
      <div className="service-header">
        <Link href="/client-hub" className="back-link">
          <ArrowLeft size={20} />
          <span>Back to Client Hub</span>
        </Link>

        <div className="header-content">
          <div className="header-icon">
            <Home size={48} />
          </div>
          <h1 className="page-title">Real Estate Services</h1>
          <p className="page-subtitle">Buy, sell, and finance properties with confidence</p>
        </div>
      </div>

      <div className="service-content">
        <section className="products-section">
          <h2 className="section-title">Our Real Estate Services</h2>
          <div className="products-grid">
            {services.map((service, index) => (
              <div key={index} className="product-card">
                <div className="product-icon">
                  <service.icon size={28} />
                </div>
                <h3 className="product-title">{service.title}</h3>
                <p className="product-description">{service.description}</p>
                <ul className="product-features">
                  {service.features.map((feature, i) => (
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

        <section className="application-section">
          <div className="application-header">
            <Key size={32} />
            <div>
              <h2>Start Your Real Estate Journey</h2>
              <p>Whether buying, selling, or financing - we're here to help</p>
            </div>
          </div>

          <GHLContactForm
            service="real-estate"
            title="Tell Us About Your Property Needs"
            subtitle="Our real estate experts will contact you within 24 hours"
            tags={['real-estate', 'property']}
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
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          padding: 24px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #3b82f6;
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
          background: rgba(59, 130, 246, 0.2);
          border: 2px solid #3b82f6;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #3b82f6;
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
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
        }

        .product-card:hover {
          transform: translateY(-4px);
          border-color: #3b82f6;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
        }

        .product-icon {
          width: 56px;
          height: 56px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3b82f6;
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
          color: #3b82f6;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .application-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 24px;
          padding: 48px;
        }

        .application-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
          color: #3b82f6;
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
