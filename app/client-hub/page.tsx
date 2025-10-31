'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Home, DollarSign, Cpu, ArrowRight, Phone, Clock, MapPin, Star } from 'lucide-react';
import GHLContactForm from '../../components/client-hub/GHLContactForm';

export default function ClientHubPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<'lending' | 'real-estate' | 'investments' | 'tech' | 'general'>('general');

  const services = [
    {
      id: 'lending' as const,
      title: 'Lending Solutions',
      description: 'Business loans, real estate financing, merchant cash advances, lines of credit',
      icon: DollarSign,
      color: '#10b981',
      link: '/client-hub/lending'
    },
    {
      id: 'real-estate' as const,
      title: 'Real Estate',
      description: 'Buy, sell, finance residential and commercial properties with expert guidance',
      icon: Home,
      color: '#3b82f6',
      link: '/client-hub/real-estate'
    },
    {
      id: 'investments' as const,
      title: 'Investment Opportunities',
      description: '9-12% fixed return strategies, UPREIT & 721 exchanges, portfolio diversification',
      icon: TrendingUp,
      color: '#f59e0b',
      link: '/client-hub/investments'
    },
    {
      id: 'tech' as const,
      title: 'SaintVision Tech™',
      description: 'AI-powered financial platform, market analytics, property valuation services',
      icon: Cpu,
      color: '#8b5cf6',
      link: '/client-hub/tech'
    }
  ];

  const handleServiceSelect = (serviceId: typeof selectedService) => {
    setSelectedService(serviceId);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    // After form submission, redirect to service page
    const service = services.find(s => s.id === selectedService);
    if (service) {
      setTimeout(() => {
        router.push(service.link);
      }, 2000);
    }
  };

  return (
    <div className="client-hub-page">
      {/* Header */}
      <div className="hub-header">
        <div className="header-content">
          <h1 className="hub-title">Saint Vision Group LLC</h1>
          <p className="hub-tagline">Your Partner in Financial Success</p>

          <div className="header-contact">
            <div className="contact-item">
              <Phone size={16} />
              <span>(949) 820-2108</span>
            </div>
            <div className="contact-item">
              <Clock size={16} />
              <span>7:00 AM - 8:00 PM Daily</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Irvine, CA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="hub-content">
        {!showForm ? (
          <>
            {/* Welcome Section */}
            <div className="welcome-section">
              <h2 className="welcome-title">Welcome to Your Client Hub</h2>
              <p className="welcome-text">
                Select a service below to get started. We'll need some basic information to provide you with the best possible experience.
              </p>

              <div className="trust-badges">
                <div className="trust-badge">
                  <Star size={20} fill="#d4af37" color="#d4af37" />
                  <span>Patent #10,290,222</span>
                </div>
                <div className="trust-badge">
                  <Star size={20} fill="#d4af37" color="#d4af37" />
                  <span>9-12% Fixed Returns</span>
                </div>
                <div className="trust-badge">
                  <Star size={20} fill="#d4af37" color="#d4af37" />
                  <span>AI-Powered Platform</span>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="services-grid">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="service-card"
                  onClick={() => handleServiceSelect(service.id)}
                  style={{ borderColor: service.color }}
                >
                  <div className="service-icon" style={{ backgroundColor: `${service.color}20`, color: service.color }}>
                    <service.icon size={32} />
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-cta" style={{ color: service.color }}>
                    <span>Get Started</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="form-section">
            <button
              onClick={() => setShowForm(false)}
              className="back-btn"
            >
              ← Back to Services
            </button>

            <GHLContactForm
              service={selectedService}
              title="Let's Get Started"
              subtitle={`Tell us about your ${selectedService === 'general' ? 'needs' : selectedService.replace('-', ' ')} needs`}
              tags={[selectedService, 'client-hub']}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="hub-footer">
        <p>© 2024 Saint Vision Group LLC | Patent #10,290,222 | Powered by SaintVision Tech™</p>
      </div>

      <style jsx>{`
        .client-hub-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          color: white;
        }

        .hub-header {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          padding: 32px 24px;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .hub-title {
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #d4af37 0%, #f4c542 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .hub-tagline {
          font-size: 18px;
          color: #999;
          margin-bottom: 24px;
        }

        .header-contact {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #d4af37;
          font-size: 14px;
          font-weight: 600;
        }

        .hub-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .welcome-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .welcome-title {
          font-size: 36px;
          font-weight: 700;
          color: white;
          margin-bottom: 16px;
        }

        .welcome-text {
          font-size: 18px;
          color: #999;
          margin-bottom: 32px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 8px 16px;
          border-radius: 24px;
          font-size: 14px;
          font-weight: 600;
          color: #d4af37;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .service-card {
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
          border-color: currentColor;
        }

        .service-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .service-title {
          font-size: 22px;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }

        .service-description {
          font-size: 15px;
          color: #999;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .service-cta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 16px;
        }

        .form-section {
          max-width: 700px;
          margin: 0 auto;
        }

        .back-btn {
          background: none;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 32px;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(212, 175, 55, 0.1);
          border-color: #d4af37;
        }

        .hub-footer {
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          padding: 24px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .hub-title {
            font-size: 32px;
          }

          .welcome-title {
            font-size: 28px;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .header-contact {
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
