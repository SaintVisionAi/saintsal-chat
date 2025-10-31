'use client';
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Crown, Shield, User, Mail, Trash2, X, Check, AlertCircle } from 'lucide-react';

interface TeamMember {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  verified: boolean;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  invitedBy: string;
  createdAt: string;
  expiresAt: string;
}

interface TeamInfo {
  id: string;
  name: string;
  plan: string;
  ownerId: string;
  members: TeamMember[];
  limits: {
    messagesPerMonth: number;
    voiceMinutesPerMonth: number;
    ragQueriesPerMonth: number;
    maxFileSize: number;
    maxMembers: number;
  };
  usage: {
    messagesThisMonth: number;
    voiceMinutesThisMonth: number;
    ragQueriesThisMonth: number;
    lastReset: string;
  };
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  plan: string;
  teamRole?: string;
}

export default function TeamManagement() {
  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [team, setTeam] = useState<TeamInfo | null>(null);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);

  // Create team state
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamPlan, setTeamPlan] = useState<'pro' | 'enterprise'>('pro');
  const [creating, setCreating] = useState(false);

  // Invite member state
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [inviting, setInviting] = useState(false);

  // Alert state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadTeamInfo();
  }, []);

  const loadTeamInfo = async () => {
    try {
      const response = await fetch('/api/teams/info');
      const data = await response.json();

      if (data.hasTeam) {
        setHasTeam(true);
        setUser(data.user);
        setTeam(data.team);
        setPendingInvitations(data.pendingInvitations || []);
      } else {
        setHasTeam(false);
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to load team info:', error);
      showAlert('error', 'Failed to load team information');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/teams/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, plan: teamPlan }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', 'Team created successfully!');
        setShowCreateTeam(false);
        await loadTeamInfo();
      } else {
        showAlert('error', data.error || 'Failed to create team');
      }
    } catch (error) {
      showAlert('error', 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      const response = await fetch('/api/teams/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', `Invitation sent to ${inviteEmail}!`);
        setShowInvite(false);
        setInviteEmail('');
        await loadTeamInfo();
      } else {
        showAlert('error', data.error || 'Failed to send invitation');
      }
    } catch (error) {
      showAlert('error', 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from the team?`)) return;

    try {
      const response = await fetch('/api/teams/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', `${memberName} removed from team`);
        await loadTeamInfo();
      } else {
        showAlert('error', data.error || 'Failed to remove member');
      }
    } catch (error) {
      showAlert('error', 'Failed to remove member');
    }
  };

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      admin: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      member: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return colors[role as keyof typeof colors] || colors.member;
  };

  const formatUsage = (current: number, limit: number) => {
    if (limit === -1) return `${current.toLocaleString()} (Unlimited)`;
    const percentage = (current / limit) * 100;
    return (
      <div className="flex items-center gap-2">
        <span>{current.toLocaleString()} / {limit.toLocaleString()}</span>
        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <div className="team-management">
      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-down ${
            alert.type === 'success'
              ? 'bg-green-500/20 border border-green-500/30 text-green-500'
              : 'bg-red-500/20 border border-red-500/30 text-red-500'
          }`}
        >
          {alert.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="text-sm font-medium">{alert.message}</span>
          <button onClick={() => setAlert(null)} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {!hasTeam ? (
        /* No Team - Show Create Team */
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-4">
            <Users className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Create Your Team</h2>
          <p className="text-gray-400 mb-6">Collaborate with your team members on Pro or Enterprise plans</p>

          {!showCreateTeam ? (
            <button onClick={() => setShowCreateTeam(true)} className="btn-primary">
              <UserPlus className="w-5 h-5" />
              Create Team
            </button>
          ) : (
            <form onSubmit={handleCreateTeam} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Plan</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTeamPlan('pro')}
                    className={`p-4 rounded-lg border-2 transition ${
                      teamPlan === 'pro'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-900'
                    }`}
                  >
                    <div className="text-lg font-bold text-white">Pro</div>
                    <div className="text-sm text-gray-400">Up to 10 members</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeamPlan('enterprise')}
                    className={`p-4 rounded-lg border-2 transition ${
                      teamPlan === 'enterprise'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-900'
                    }`}
                  >
                    <div className="text-lg font-bold text-white">Enterprise</div>
                    <div className="text-sm text-gray-400">Unlimited members</div>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTeam(false)}
                  className="flex-1 btn-secondary"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Has Team - Show Team Info */
        <div className="space-y-6 p-4">
          {/* Team Header */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-purple-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-white">{team?.name}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                {team?.plan.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {team?.members.length} member{team?.members.length !== 1 && 's'}
              {team?.limits.maxMembers !== -1 && ` (max ${team?.limits.maxMembers})`}
            </p>
          </div>

          {/* Usage Stats - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">Messages</div>
              <div className="text-sm text-white">
                {formatUsage(team?.usage.messagesThisMonth || 0, team?.limits.messagesPerMonth || 0)}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">Voice Minutes</div>
              <div className="text-sm text-white">
                {formatUsage(team?.usage.voiceMinutesThisMonth || 0, team?.limits.voiceMinutesPerMonth || 0)}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-400 mb-1">RAG Queries</div>
              <div className="text-sm text-white">
                {formatUsage(team?.usage.ragQueriesThisMonth || 0, team?.limits.ragQueriesPerMonth || 0)}
              </div>
            </div>
          </div>

          {/* Invite Button - Large and Touch-Friendly */}
          {user?.teamRole && ['owner', 'admin'].includes(user.teamRole) && (
            <button
              onClick={() => setShowInvite(true)}
              className="w-full btn-primary text-base py-4"
            >
              <UserPlus className="w-5 h-5" />
              Invite Team Member
            </button>
          )}

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-yellow-500" />
                Pending Invitations
              </h3>
              <div className="space-y-2">
                {pendingInvitations.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{invite.email}</div>
                      <div className="text-xs text-gray-400">
                        Invited by {invite.invitedBy} • {new Date(invite.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium border ${getRoleBadge(
                        invite.role
                      )}`}
                    >
                      {invite.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Members - Mobile Optimized Cards */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-500" />
              Team Members
            </h3>
            <div className="space-y-2">
              {team?.members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">{getRoleIcon(member.role)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{member.name}</div>
                      <div className="text-xs text-gray-400 truncate">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getRoleBadge(member.role)}`}>
                      {member.role}
                    </span>
                    {user?.teamRole &&
                      ['owner', 'admin'].includes(user.teamRole) &&
                      member.role !== 'owner' &&
                      member.userId !== user.id && (
                        <button
                          onClick={() => handleRemoveMember(member.userId, member.name)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal - Mobile Optimized */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Invite Team Member</h3>
              <button
                onClick={() => setShowInvite(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteMember} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInviteRole('member')}
                    className={`p-4 rounded-lg border-2 transition ${
                      inviteRole === 'member'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-800'
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                    <div className="text-sm font-medium text-white">Member</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInviteRole('admin')}
                    className={`p-4 rounded-lg border-2 transition ${
                      inviteRole === 'admin'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-gray-700 bg-gray-800'
                    }`}
                  >
                    <Shield className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                    <div className="text-sm font-medium text-white">Admin</div>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="flex-1 btn-secondary py-3"
                  disabled={inviting}
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-3" disabled={inviting}>
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
