/**
 * MongoDB Schema and Initialization
 * Sets up collections, indexes, and default data
 */

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || 'saintsal_db';

export interface User {
  _id?: string;
  email: string;
  name: string;
  password: string; // bcrypt hashed
  plan: 'free' | 'pro' | 'enterprise';

  // Email verification
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;

  // Team membership (for team plans)
  teamId?: string; // If user is part of a team
  teamRole?: 'owner' | 'admin' | 'member'; // Role within the team

  // Usage limits based on plan (for individual users)
  // Team members use team limits instead
  limits: {
    messagesPerMonth: number;
    voiceMinutesPerMonth: number;
    ragQueriesPerMonth: number;
    maxFileSize: number; // in MB
  };

  // Current usage (resets monthly)
  // For team members, this is still tracked individually but checked against team limits
  usage: {
    messagesThisMonth: number;
    voiceMinutesThisMonth: number;
    ragQueriesThisMonth: number;
    lastReset: Date;
  };

  // OAuth connections
  githubConnected?: boolean;
  githubAccessToken?: string;
  githubUsername?: string;
  githubUserId?: number;
  googleConnected?: boolean;
  googleAccessToken?: string;
  microsoftConnected?: boolean;
  microsoftAccessToken?: string;

  // Timestamps
  createdAt: Date;
  lastLogin?: Date;
  updatedAt?: Date;

  // Stripe (if using paid plans - for individual users)
  // Team billing is handled at team level
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface Team {
  _id?: string;
  name: string;
  ownerId: string; // User who created and owns the team
  plan: 'pro' | 'enterprise'; // Teams are only available on paid plans

  // Team members
  members: {
    userId: string;
    email: string;
    name: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
    verified: boolean; // Email verification status
  }[];

  // Team-wide limits (shared across all members)
  limits: {
    messagesPerMonth: number;
    voiceMinutesPerMonth: number;
    ragQueriesPerMonth: number;
    maxFileSize: number;
    maxMembers: number; // Max team size
  };

  // Team-wide usage (aggregate of all members)
  usage: {
    messagesThisMonth: number;
    voiceMinutesThisMonth: number;
    ragQueriesThisMonth: number;
    lastReset: Date;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Stripe (team-level billing)
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface TeamInvitation {
  _id?: string;
  teamId: string;
  teamName: string;
  email: string;
  invitedBy: string; // userId of person who sent invitation
  invitedByName: string;
  role: 'admin' | 'member'; // Can't invite as owner
  token: string; // Unique invitation token
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: Date; // Invitations expire after 7 days
  createdAt: Date;
}

export interface PricingTier {
  _id?: string;
  name: 'free' | 'pro' | 'enterprise';
  displayName: string;
  price: number; // monthly in dollars
  limits: {
    messagesPerMonth: number;
    voiceMinutesPerMonth: number;
    ragQueriesPerMonth: number;
    maxFileSize: number;
  };
  teamLimits?: {
    // Team-specific limits (for Pro and Enterprise)
    messagesPerMonth: number;
    voiceMinutesPerMonth: number;
    ragQueriesPerMonth: number;
    maxFileSize: number;
    maxMembers: number;
  };
  features: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'free',
    displayName: 'Free',
    price: 0,
    limits: {
      messagesPerMonth: 50,
      voiceMinutesPerMonth: 10,
      ragQueriesPerMonth: 20,
      maxFileSize: 5, // 5MB
    },
    features: [
      'Basic chat with GPT-4o mini',
      '50 messages per month',
      '10 voice minutes per month',
      'Basic RAG support',
      'Community support',
    ],
  },
  {
    name: 'pro',
    displayName: 'Pro',
    price: 29,
    limits: {
      messagesPerMonth: 1000,
      voiceMinutesPerMonth: 200,
      ragQueriesPerMonth: 500,
      maxFileSize: 50, // 50MB
    },
    teamLimits: {
      messagesPerMonth: 5000, // Shared across team
      voiceMinutesPerMonth: 1000, // Shared across team
      ragQueriesPerMonth: 2500, // Shared across team
      maxFileSize: 100, // 100MB for teams
      maxMembers: 10, // Up to 10 team members
    },
    features: [
      'Unlimited chat with all models',
      '1,000 messages per month (individual)',
      '200 voice minutes per month (individual)',
      'Advanced RAG with vector search',
      'Walkie Talkie mode',
      'Model playground',
      'Team collaboration (up to 10 members)',
      'Priority support',
    ],
  },
  {
    name: 'enterprise',
    displayName: 'Enterprise',
    price: 199,
    limits: {
      messagesPerMonth: -1, // unlimited
      voiceMinutesPerMonth: -1, // unlimited
      ragQueriesPerMonth: -1, // unlimited
      maxFileSize: 500, // 500MB
    },
    teamLimits: {
      messagesPerMonth: -1, // Unlimited for teams
      voiceMinutesPerMonth: -1, // Unlimited for teams
      ragQueriesPerMonth: -1, // Unlimited for teams
      maxFileSize: 1000, // 1GB for teams
      maxMembers: -1, // Unlimited team members
    },
    features: [
      'Everything in Pro',
      'Unlimited usage',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated support',
      'GoHighLevel CRM integration',
      'White-label options',
      'Custom AI training',
    ],
  },
];

export async function initializeMongoDB() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);

  try {
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // Users collection
    if (!collectionNames.includes('users')) {
      await db.createCollection('users');
      console.log('Created users collection');
    }

    // Pricing tiers collection
    if (!collectionNames.includes('pricing')) {
      await db.createCollection('pricing');
      console.log('Created pricing collection');
    }

    // Messages collection (for chat history)
    if (!collectionNames.includes('messages')) {
      await db.createCollection('messages');
      console.log('Created messages collection');
    }

    // Documents collection (for RAG)
    if (!collectionNames.includes('documents')) {
      await db.createCollection('documents');
      console.log('Created documents collection');
    }

    // Teams collection
    if (!collectionNames.includes('teams')) {
      await db.createCollection('teams');
      console.log('Created teams collection');
    }

    // Team invitations collection
    if (!collectionNames.includes('team_invitations')) {
      await db.createCollection('team_invitations');
      console.log('Created team_invitations collection');
    }

    // Create indexes
    const users = db.collection('users');
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ createdAt: -1 });
    await users.createIndex({ teamId: 1 });
    console.log('Created user indexes');

    const teams = db.collection('teams');
    await teams.createIndex({ ownerId: 1 });
    await teams.createIndex({ createdAt: -1 });
    console.log('Created team indexes');

    const teamInvitations = db.collection('team_invitations');
    await teamInvitations.createIndex({ email: 1 });
    await teamInvitations.createIndex({ teamId: 1 });
    await teamInvitations.createIndex({ token: 1 }, { unique: true });
    await teamInvitations.createIndex({ status: 1 });
    await teamInvitations.createIndex({ expiresAt: 1 });
    console.log('Created team invitation indexes');

    const messages = db.collection('messages');
    await messages.createIndex({ timestamp: -1 });
    await messages.createIndex({ userId: 1 });
    console.log('Created message indexes');

    // Vector index for RAG (if using MongoDB Atlas)
    try {
      const documents = db.collection('documents');
      await documents.createIndex({ userId: 1 });
      await documents.createIndex({ createdAt: -1 });
      console.log('Created document indexes');

      // Note: Vector search index must be created in MongoDB Atlas UI
      console.log('Remember to create vector search index "vector_index" in Atlas!');
    } catch (err) {
      console.log('Vector index creation skipped (requires Atlas)');
    }

    // Insert pricing tiers
    const pricing = db.collection('pricing');
    for (const tier of PRICING_TIERS) {
      await pricing.updateOne(
        { name: tier.name },
        { $set: tier },
        { upsert: true }
      );
    }
    console.log('Inserted pricing tiers');

    console.log('MongoDB initialization complete!');
  } finally {
    await client.close();
  }
}

export function getPlanLimits(plan: string): PricingTier['limits'] {
  const tier = PRICING_TIERS.find((t) => t.name === plan);
  return tier?.limits || PRICING_TIERS[0].limits;
}

export async function checkUserLimit(
  userId: string,
  limitType: 'messages' | 'voice' | 'rag'
): Promise<boolean> {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  const users = db.collection('users');

  try {
    const { ObjectId } = require('mongodb');
    const user = await users.findOne({ _id: new ObjectId(userId) }) as any;
    if (!user) return false;

    // If user is part of a team, check team limits instead
    if (user.teamId) {
      return await checkTeamLimit(user.teamId, limitType);
    }

    // Reset usage if it's a new month
    const now = new Date();
    const lastReset = new Date(user.usage.lastReset);
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            'usage.messagesThisMonth': 0,
            'usage.voiceMinutesThisMonth': 0,
            'usage.ragQueriesThisMonth': 0,
            'usage.lastReset': now,
          },
        }
      );
      return true; // New month, limit OK
    }

    // Check specific limit
    const limits = user.limits;
    const usage = user.usage;

    switch (limitType) {
      case 'messages':
        return limits.messagesPerMonth === -1 || usage.messagesThisMonth < limits.messagesPerMonth;
      case 'voice':
        return limits.voiceMinutesPerMonth === -1 || usage.voiceMinutesThisMonth < limits.voiceMinutesPerMonth;
      case 'rag':
        return limits.ragQueriesPerMonth === -1 || usage.ragQueriesThisMonth < limits.ragQueriesPerMonth;
      default:
        return true;
    }
  } finally {
    await client.close();
  }
}

export async function incrementUsage(
  userId: string,
  limitType: 'messages' | 'voice' | 'rag',
  amount: number = 1
): Promise<void> {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  const users = db.collection('users');

  try {
    const { ObjectId } = require('mongodb');
    const field =
      limitType === 'messages' ? 'usage.messagesThisMonth' :
      limitType === 'voice' ? 'usage.voiceMinutesThisMonth' :
      'usage.ragQueriesThisMonth';

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { [field]: amount } }
    );

    // Also increment team usage if user is part of a team
    const user = await users.findOne({ _id: new ObjectId(userId) }) as any;
    if (user?.teamId) {
      const teams = db.collection('teams');
      const teamField =
        limitType === 'messages' ? 'usage.messagesThisMonth' :
        limitType === 'voice' ? 'usage.voiceMinutesThisMonth' :
        'usage.ragQueriesThisMonth';

      await teams.updateOne(
        { _id: new ObjectId(user.teamId) },
        { $inc: { [teamField]: amount } }
      );
    }
  } finally {
    await client.close();
  }
}

/**
 * Check if a team has reached its usage limit
 */
export async function checkTeamLimit(
  teamId: string,
  limitType: 'messages' | 'voice' | 'rag'
): Promise<boolean> {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  const teams = db.collection('teams');

  try {
    const { ObjectId } = require('mongodb');
    const team = await teams.findOne({ _id: new ObjectId(teamId) }) as any;
    if (!team) return false;

    // Reset usage if it's a new month
    const now = new Date();
    const lastReset = new Date(team.usage.lastReset);
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      await teams.updateOne(
        { _id: new ObjectId(teamId) },
        {
          $set: {
            'usage.messagesThisMonth': 0,
            'usage.voiceMinutesThisMonth': 0,
            'usage.ragQueriesThisMonth': 0,
            'usage.lastReset': now,
          },
        }
      );
      return true; // New month, limit OK
    }

    // Check specific limit
    const limits = team.limits;
    const usage = team.usage;

    switch (limitType) {
      case 'messages':
        return limits.messagesPerMonth === -1 || usage.messagesThisMonth < limits.messagesPerMonth;
      case 'voice':
        return limits.voiceMinutesPerMonth === -1 || usage.voiceMinutesThisMonth < limits.voiceMinutesPerMonth;
      case 'rag':
        return limits.ragQueriesPerMonth === -1 || usage.ragQueriesThisMonth < limits.ragQueriesPerMonth;
      default:
        return true;
    }
  } finally {
    await client.close();
  }
}

/**
 * Create a new team
 */
export async function createTeam(
  ownerId: string,
  teamName: string,
  plan: 'pro' | 'enterprise'
): Promise<string> {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  const teams = db.collection('teams');
  const users = db.collection('users');

  try {
    const { ObjectId } = require('mongodb');
    const owner = await users.findOne({ _id: new ObjectId(ownerId) }) as any;
    if (!owner) throw new Error('Owner not found');

    const tier = PRICING_TIERS.find((t) => t.name === plan);
    if (!tier || !tier.teamLimits) throw new Error('Invalid plan for teams');

    const newTeam = {
      name: teamName,
      ownerId,
      plan,
      members: [
        {
          userId: ownerId,
          email: owner.email,
          name: owner.name,
          role: 'owner',
          joinedAt: new Date(),
          verified: true,
        },
      ],
      limits: tier.teamLimits,
      usage: {
        messagesThisMonth: 0,
        voiceMinutesThisMonth: 0,
        ragQueriesThisMonth: 0,
        lastReset: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await teams.insertOne(newTeam);
    const teamId = result.insertedId.toString();

    // Update owner's user record
    await users.updateOne(
      { _id: new ObjectId(ownerId) },
      {
        $set: {
          teamId,
          teamRole: 'owner',
          updatedAt: new Date(),
        },
      }
    );

    console.log(`✅ [TEAMS] Team created: ${teamName} (${teamId})`);
    return teamId;
  } finally {
    await client.close();
  }
}

/**
 * Invite a new member to the team
 */
export async function inviteTeamMember(
  teamId: string,
  invitedBy: string,
  email: string,
  role: 'admin' | 'member' = 'member'
): Promise<string> {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  const teams = db.collection('teams');
  const users = db.collection('users');
  const invitations = db.collection('team_invitations');

  try {
    const { ObjectId } = require('mongodb');
    const team = await teams.findOne({ _id: new ObjectId(teamId) }) as any;
    const inviter = await users.findOne({ _id: new ObjectId(invitedBy) }) as any;

    if (!team) throw new Error('Team not found');
    if (!inviter) throw new Error('Inviter not found');

    // Check if team is at capacity
    if (team.limits.maxMembers !== -1 && team.members.length >= team.limits.maxMembers) {
      throw new Error('Team is at maximum capacity');
    }

    // Check if user is already a member
    const isMember = team.members.some((m: any) => m.email.toLowerCase() === email.toLowerCase());
    if (isMember) {
      throw new Error('User is already a team member');
    }

    // Check if there's already a pending invitation
    const existingInvite = await invitations.findOne({
      teamId,
      email: email.toLowerCase(),
      status: 'pending',
    });

    if (existingInvite) {
      throw new Error('Invitation already sent to this email');
    }

    // Generate unique token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');

    // Create invitation
    const invitation = {
      teamId,
      teamName: team.name,
      email: email.toLowerCase(),
      invitedBy,
      invitedByName: inviter.name,
      role,
      token,
      status: 'pending',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      createdAt: new Date(),
    };

    await invitations.insertOne(invitation);
    console.log(`📧 [TEAMS] Invitation sent to ${email} for team ${team.name}`);

    return token;
  } finally {
    await client.close();
  }
}

/**
 * Accept a team invitation
 */
export async function acceptTeamInvitation(
  userId: string,
  token: string
): Promise<boolean> {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  const teams = db.collection('teams');
  const users = db.collection('users');
  const invitations = db.collection('team_invitations');

  try {
    const { ObjectId } = require('mongodb');
    const invitation = await invitations.findOne({ token }) as any;

    if (!invitation) throw new Error('Invitation not found');
    if (invitation.status !== 'pending') throw new Error('Invitation is not pending');
    if (new Date() > new Date(invitation.expiresAt)) {
      await invitations.updateOne({ token }, { $set: { status: 'expired' } });
      throw new Error('Invitation has expired');
    }

    const user = await users.findOne({ _id: new ObjectId(userId) }) as any;
    if (!user) throw new Error('User not found');
    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new Error('Invitation email does not match user email');
    }

    const team = await teams.findOne({ _id: new ObjectId(invitation.teamId) }) as any;
    if (!team) throw new Error('Team not found');

    // Add user to team
    await teams.updateOne(
      { _id: new ObjectId(invitation.teamId) },
      {
        $push: {
          members: {
            userId,
            email: user.email,
            name: user.name,
            role: invitation.role,
            joinedAt: new Date(),
            verified: true,
          },
        } as any,
        $set: { updatedAt: new Date() },
      }
    );

    // Update user's team info
    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          teamId: invitation.teamId,
          teamRole: invitation.role,
          updatedAt: new Date(),
        },
      }
    );

    // Mark invitation as accepted
    await invitations.updateOne(
      { token },
      { $set: { status: 'accepted' } }
    );

    console.log(`✅ [TEAMS] User ${user.email} joined team ${team.name}`);
    return true;
  } finally {
    await client.close();
  }
}

/**
 * Remove a member from the team
 */
export async function removeTeamMember(
  teamId: string,
  memberId: string,
  removedBy: string
): Promise<boolean> {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);
  const teams = db.collection('teams');
  const users = db.collection('users');

  try {
    const { ObjectId } = require('mongodb');
    const team = await teams.findOne({ _id: new ObjectId(teamId) }) as any;
    const remover = await users.findOne({ _id: new ObjectId(removedBy) }) as any;

    if (!team) throw new Error('Team not found');
    if (!remover) throw new Error('Remover not found');

    // Check permissions (owner or admin can remove members)
    const removerMember = team.members.find((m: any) => m.userId === removedBy);
    if (!removerMember || (removerMember.role !== 'owner' && removerMember.role !== 'admin')) {
      throw new Error('Insufficient permissions');
    }

    // Can't remove the owner
    const memberToRemove = team.members.find((m: any) => m.userId === memberId);
    if (memberToRemove?.role === 'owner') {
      throw new Error('Cannot remove team owner');
    }

    // Remove from team
    await teams.updateOne(
      { _id: new ObjectId(teamId) },
      {
        $pull: { members: { userId: memberId } } as any,
        $set: { updatedAt: new Date() },
      }
    );

    // Update user's team info
    await users.updateOne(
      { _id: new ObjectId(memberId) },
      {
        $unset: { teamId: '', teamRole: '' },
        $set: { updatedAt: new Date() },
      }
    );

    console.log(`🚫 [TEAMS] User ${memberId} removed from team ${team.name}`);
    return true;
  } finally {
    await client.close();
  }
}
