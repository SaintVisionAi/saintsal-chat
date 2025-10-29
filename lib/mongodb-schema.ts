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

  // Usage limits based on plan
  limits: {
    messagesPerMonth: number;
    voiceMinutesPerMonth: number;
    ragQueriesPerMonth: number;
    maxFileSize: number; // in MB
  };

  // Current usage (resets monthly)
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

  // Stripe (if using paid plans)
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
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
    features: [
      'Unlimited chat with all models',
      '1,000 messages per month',
      '200 voice minutes per month',
      'Advanced RAG with vector search',
      'Walkie Talkie mode',
      'Model playground',
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
    features: [
      'Everything in Pro',
      'Unlimited usage',
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

    // Create indexes
    const users = db.collection('users');
    await users.createIndex({ email: 1 }, { unique: true });
    await users.createIndex({ createdAt: -1 });
    console.log('Created user indexes');

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
  } finally {
    await client.close();
  }
}
