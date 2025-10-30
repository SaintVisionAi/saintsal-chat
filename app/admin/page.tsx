'use client';
import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Database,
  DollarSign,
  TrendingUp,
  Shield,
  Plus,
  Edit,
  Trash2,
  LogOut,
} from 'lucide-react';

interface DashboardMetrics {
  totalUsers: number;
  totalMessages: number;
  totalDocuments: number;
  estimatedTokens: number;
  estimatedCost: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  plan: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'packages'>('dashboard');

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPlan, setNewUserPlan] = useState('free');
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    checkAuth();

    // Prevent browser back button
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', window.location.href);
    });

    return () => {
      window.removeEventListener('popstate', () => {});
    };
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth');
      const data = await response.json();
      if (data.authenticated) {
        setAuthenticated(true);
        loadDashboard();
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthenticated(true);
        loadDashboard();
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to logout from Admin Panel?')) {
      return;
    }
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setAuthenticated(false);
    setMetrics(null);
    setUsers([]);
  };

  const loadDashboard = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (data.success) {
        setMetrics(data.metrics);
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingUser(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          plan: newUserPlan,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('User added successfully!');
        setShowAddUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPlan('free');
        loadDashboard(); // Reload users
      } else {
        alert(data.error || 'Failed to add user');
      }
    } catch (err) {
      alert('Failed to add user');
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        alert('User deleted successfully!');
        loadDashboard(); // Reload users
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  // Login Screen
  if (!authenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <Shield className="text-gold" size={48} />
            <h1 className="admin-login-title">SaintSal™ Admin</h1>
            <p className="admin-login-subtitle">Secure Admin Access</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ryan@cookinknowledge.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? 'Authenticating...' : 'Login to Admin Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <Shield className="text-gold" size={32} />
            <div>
              <h1 className="admin-header-title">SaintSal™ Admin Dashboard</h1>
              <p className="admin-header-subtitle">ryan@cookinknowledge.com</p>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <TrendingUp size={18} />
          <span>Dashboard</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          <span>User Management</span>
        </button>
        <button
          className={`admin-tab ${activeTab === 'packages' ? 'active' : ''}`}
          onClick={() => setActiveTab('packages')}
        >
          <DollarSign size={18} />
          <span>Packages</span>
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'dashboard' && metrics && (
          <div className="admin-dashboard-grid">
            {/* Metrics Cards */}
            <div className="metric-card">
              <div className="metric-icon users">
                <Users size={24} />
              </div>
              <div className="metric-content">
                <p className="metric-label">Total Users</p>
                <p className="metric-value">{metrics.totalUsers}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon messages">
                <MessageSquare size={24} />
              </div>
              <div className="metric-content">
                <p className="metric-label">Total Messages</p>
                <p className="metric-value">{metrics.totalMessages.toLocaleString()}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon database">
                <Database size={24} />
              </div>
              <div className="metric-content">
                <p className="metric-label">Documents (RAG)</p>
                <p className="metric-value">{metrics.totalDocuments}</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon cost">
                <DollarSign size={24} />
              </div>
              <div className="metric-content">
                <p className="metric-label">Estimated Cost</p>
                <p className="metric-value">${metrics.estimatedCost}</p>
                <p className="metric-sublabel">
                  ~{(metrics.estimatedTokens / 1000000).toFixed(2)}M tokens
                </p>
              </div>
            </div>

            {/* Recent Users Table */}
            <div className="admin-table-container">
              <h3 className="admin-table-title">Recent Users</h3>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Plan</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`plan-badge ${user.plan}`}>{user.plan}</span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-users-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">User Management</h2>
              <button className="admin-add-btn" onClick={() => setShowAddUserModal(true)}>
                <Plus size={18} />
                <span>Add User</span>
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`plan-badge ${user.plan}`}>{user.plan}</span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn edit" title="Edit user">
                            <Edit size={16} />
                          </button>
                          <button
                            className="admin-action-btn delete"
                            onClick={() => handleDeleteUser(user._id)}
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="admin-packages-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">Package Management</h2>
              <button className="admin-add-btn">
                <Plus size={18} />
                <span>Add Package</span>
              </button>
            </div>

            <div className="packages-grid">
              <div className="package-card">
                <h3>Free</h3>
                <p className="package-price">$0/month</p>
                <ul className="package-features">
                  <li>Basic chat</li>
                  <li>1,000 messages/month</li>
                  <li>Standard support</li>
                </ul>
                <button className="package-edit-btn">
                  <Edit size={16} />
                  Edit
                </button>
              </div>

              <div className="package-card">
                <h3>Pro</h3>
                <p className="package-price">$29/month</p>
                <ul className="package-features">
                  <li>Unlimited chat</li>
                  <li>Voice features</li>
                  <li>Priority support</li>
                </ul>
                <button className="package-edit-btn">
                  <Edit size={16} />
                  Edit
                </button>
              </div>

              <div className="package-card">
                <h3>Enterprise</h3>
                <p className="package-price">$199/month</p>
                <ul className="package-features">
                  <li>Everything in Pro</li>
                  <li>Dedicated support</li>
                  <li>Custom integrations</li>
                </ul>
                <button className="package-edit-btn">
                  <Edit size={16} />
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New User</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddUserModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Plan</label>
                <select
                  className="form-input"
                  value={newUserPlan}
                  onChange={(e) => setNewUserPlan(e.target.value)}
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-btn cancel"
                  onClick={() => setShowAddUserModal(false)}
                  disabled={addingUser}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn submit"
                  disabled={addingUser}
                >
                  {addingUser ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
