'use client';
import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Search, Star, X } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  icon: string;
  prompt: string;
  isSystem: boolean;
  createdAt?: Date;
}

interface PromptTemplatesProps {
  userId?: string;
  onSelectTemplate: (prompt: string) => void;
}

export default function PromptTemplates({ userId, onSelectTemplate }: PromptTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'Custom',
    icon: '⭐',
    prompt: '',
  });

  useEffect(() => {
    fetchTemplates();
  }, [userId]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const url = userId ? `/api/templates?userId=${userId}` : '/api/templates';
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setTemplates(data.templates);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!userId || !newTemplate.name || !newTemplate.prompt) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...newTemplate,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCreateModal(false);
        setNewTemplate({ name: '', category: 'Custom', icon: '⭐', prompt: '' });
        fetchTemplates();
      }
    } catch (err) {
      console.error('Failed to create template:', err);
      alert('Failed to create template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!userId || !confirm('Delete this template?')) return;

    try {
      const response = await fetch(`/api/templates?templateId=${templateId}&userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchTemplates();
      }
    } catch (err) {
      console.error('Failed to delete template:', err);
      alert('Failed to delete template');
    }
  };

  const handleSelectTemplate = (template: Template) => {
    onSelectTemplate(template.prompt);
    setShowModal(false);
  };

  // Filter templates
  const categories = ['All', ...Array.from(new Set(templates.map((t) => t.category)))];
  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <button className="templates-trigger-btn" onClick={() => setShowModal(true)} title="Prompt Templates">
        <BookOpen size={18} />
        <span>Templates</span>
      </button>

      {/* Main Modal */}
      {showModal && (
        <>
          <div className="templates-overlay" onClick={() => setShowModal(false)} />
          <div className="templates-modal">
            <div className="templates-modal-header">
              <div>
                <h2 className="templates-modal-title">
                  <BookOpen className="text-gold" size={24} />
                  SaintSal™ Prompt Library
                </h2>
                <p className="templates-modal-subtitle">Pre-built prompts and custom templates</p>
              </div>
              <button className="templates-close-btn" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="templates-controls">
              <div className="templates-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="templates-search-input"
                />
              </div>

              {userId && (
                <button className="templates-create-btn" onClick={() => setShowCreateModal(true)}>
                  <Plus size={18} />
                  <span>Create Template</span>
                </button>
              )}
            </div>

            <div className="templates-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="templates-grid">
              {loading ? (
                <div className="templates-loading">Loading templates...</div>
              ) : filteredTemplates.length === 0 ? (
                <div className="templates-empty">
                  <BookOpen size={48} className="text-gold" />
                  <p>No templates found</p>
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <div key={template.id} className="template-card">
                    <div className="template-card-header">
                      <div className="template-icon">{template.icon}</div>
                      <div className="template-info">
                        <h3 className="template-name">{template.name}</h3>
                        <span className="template-category">{template.category}</span>
                      </div>
                      {!template.isSystem && (
                        <button
                          className="template-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template.id);
                          }}
                          title="Delete template"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <p className="template-preview">{template.prompt.substring(0, 120)}...</p>

                    <button className="template-use-btn" onClick={() => handleSelectTemplate(template)}>
                      Use Template
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <>
          <div className="templates-overlay" onClick={() => setShowCreateModal(false)} />
          <div className="templates-create-modal">
            <div className="templates-modal-header">
              <h2 className="templates-modal-title">
                <Plus className="text-gold" size={24} />
                Create Custom Template
              </h2>
              <button className="templates-close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="templates-form">
              <div className="form-group">
                <label className="form-label">Template Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Python Expert"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Development"
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Icon (emoji)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="⭐"
                    maxLength={2}
                    value={newTemplate.icon}
                    onChange={(e) => setNewTemplate({ ...newTemplate, icon: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Prompt *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter your prompt template..."
                  rows={8}
                  value={newTemplate.prompt}
                  onChange={(e) => setNewTemplate({ ...newTemplate, prompt: e.target.value })}
                />
              </div>

              <button
                className="templates-submit-btn"
                onClick={handleCreateTemplate}
                disabled={!newTemplate.name || !newTemplate.prompt}
              >
                <Plus size={18} />
                <span>Create Template</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
