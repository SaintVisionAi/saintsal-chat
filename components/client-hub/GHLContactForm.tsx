'use client';
import React, { useState } from 'react';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle, Building2 } from 'lucide-react';

interface GHLContactFormProps {
  service: 'lending' | 'real-estate' | 'investments' | 'tech' | 'general';
  title?: string;
  subtitle?: string;
  tags?: string[];
  onSuccess?: () => void;
}

export default function GHLContactForm({
  service,
  title,
  subtitle,
  tags = [],
  onSuccess
}: GHLContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create contact in GHL
      const response = await fetch('/api/integrations/gohighlevel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_contact',
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          tags: [service, ...tags],
          customFields: {
            service_interest: service,
            message: formData.message,
            company: formData.company,
            source: 'Client Hub'
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          company: ''
        });

        if (onSuccess) {
          setTimeout(() => onSuccess(), 2000);
        }
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="ghl-form-success">
        <CheckCircle className="success-icon" size={64} />
        <h3>Thank You!</h3>
        <p>We've received your information and will be in touch shortly.</p>
        <p className="success-note">Check your email for next steps.</p>
      </div>
    );
  }

  return (
    <div className="ghl-contact-form">
      {title && <h2 className="form-title">{title}</h2>}
      {subtitle && <p className="form-subtitle">{subtitle}</p>}

      <form onSubmit={handleSubmit} className="form-container">
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              <User size={16} />
              <span>First Name *</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="John"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <User size={16} />
              <span>Last Name *</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Doe"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            <Mail size={16} />
            <span>Email *</span>
          </label>
          <input
            type="email"
            className="form-input"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Phone size={16} />
            <span>Phone *</span>
          </label>
          <input
            type="tel"
            className="form-input"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(949) 820-2108"
            required
            disabled={loading}
          />
        </div>

        {service !== 'general' && (
          <div className="form-group">
            <label className="form-label">
              <Building2 size={16} />
              <span>Company (Optional)</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Your company name"
              disabled={loading}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">
            <MessageSquare size={16} />
            <span>How can we help you? *</span>
          </label>
          <textarea
            className="form-textarea"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us about your needs..."
            rows={4}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="form-submit-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send size={20} />
              <span>Submit Request</span>
            </>
          )}
        </button>
      </form>

      <style jsx>{`
        .ghl-contact-form {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .form-title {
          font-size: 28px;
          font-weight: 700;
          color: #d4af37;
          margin-bottom: 8px;
          text-align: center;
        }

        .form-subtitle {
          font-size: 16px;
          color: #999;
          margin-bottom: 32px;
          text-align: center;
        }

        .form-container {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          padding: 32px;
        }

        .form-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #d4af37;
          margin-bottom: 8px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #d4af37;
          background: rgba(0, 0, 0, 0.4);
        }

        .form-input:disabled,
        .form-textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #d4af37 0%, #f4c542 100%);
          border: none;
          border-radius: 8px;
          color: #000;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .form-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
        }

        .form-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .ghl-form-success {
          text-align: center;
          padding: 48px 24px;
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid rgba(16, 185, 129, 0.3);
          border-radius: 16px;
        }

        .success-icon {
          color: #10b981;
          margin-bottom: 16px;
        }

        .ghl-form-success h3 {
          font-size: 28px;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 12px;
        }

        .ghl-form-success p {
          font-size: 16px;
          color: #999;
          margin-bottom: 8px;
        }

        .success-note {
          font-size: 14px;
          color: #d4af37;
          font-weight: 600;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-container {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}
