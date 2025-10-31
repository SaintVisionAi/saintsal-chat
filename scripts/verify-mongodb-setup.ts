#!/usr/bin/env tsx
/**
 * Verify MongoDB Setup
 * Checks that all collections, indexes, and data are properly configured
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

const REQUIRED_COLLECTIONS = [
  'users',
  'pricing',
  'messages',
  'documents',
  'teams',
  'team_invitations'
];

const REQUIRED_INDEXES = {
  users: ['email_1', 'createdAt_-1', 'teamId_1'],
  messages: ['timestamp_-1', 'userId_1'],
  documents: ['userId_1', 'createdAt_-1'],
  teams: ['ownerId_1', 'createdAt_-1'],
  team_invitations: ['email_1', 'teamId_1', 'token_1', 'status_1', 'expiresAt_1']
};

async function verify() {
  console.log('🔍 Verifying MongoDB setup...\n');

  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db(process.env.MONGODB_DB || 'saintsal_db');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    let allGood = true;

    // Check collections
    console.log('📁 Checking collections...');
    for (const collectionName of REQUIRED_COLLECTIONS) {
      if (collectionNames.includes(collectionName)) {
        console.log(`   ✅ ${collectionName}`);
      } else {
        console.log(`   ❌ ${collectionName} - MISSING`);
        allGood = false;
      }
    }

    // Check indexes
    console.log('\n📇 Checking indexes...');
    for (const [collectionName, requiredIndexes] of Object.entries(REQUIRED_INDEXES)) {
      if (collectionNames.includes(collectionName)) {
        const collection = db.collection(collectionName);
        const indexes = await collection.indexes();
        const indexNames = indexes.map((idx: any) => idx.name);

        console.log(`\n   ${collectionName}:`);
        for (const reqIndex of requiredIndexes) {
          if (indexNames.includes(reqIndex)) {
            console.log(`      ✅ ${reqIndex}`);
          } else {
            console.log(`      ❌ ${reqIndex} - MISSING`);
            allGood = false;
          }
        }
      }
    }

    // Check pricing data
    console.log('\n💰 Checking pricing data...');
    const pricing = db.collection('pricing');
    const pricingDocs = await pricing.find({}).toArray();

    const plans = ['free', 'pro', 'enterprise'];
    for (const plan of plans) {
      const found = pricingDocs.find((p: any) => p.name === plan);
      if (found) {
        console.log(`   ✅ ${plan} plan (${found.displayName} - $${found.price}/mo)`);
      } else {
        console.log(`   ❌ ${plan} plan - MISSING`);
        allGood = false;
      }
    }

    // Check for users
    console.log('\n👥 Checking users...');
    const users = db.collection('users');
    const userCount = await users.countDocuments();
    console.log(`   ℹ️  ${userCount} users registered`);

    await client.close();

    console.log('\n' + '='.repeat(60));
    if (allGood) {
      console.log('✅ ALL CHECKS PASSED! Database is properly configured.');
      console.log('\n🚀 Your application is ready to use!');
      console.log('\nNext steps:');
      console.log('1. npm run dev - Start the development server');
      console.log('2. Sign up for a new account');
      console.log('3. Test email verification');
      console.log('4. Test Stripe integration\n');
    } else {
      console.log('❌ SOME CHECKS FAILED! Run: npm run db:init');
    }
    console.log('='.repeat(60) + '\n');

    process.exit(allGood ? 0 : 1);
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  }
}

verify();
