#!/usr/bin/env tsx
/**
 * Initialize MongoDB Database
 * Creates all collections, indexes, and seeds initial data
 *
 * Run: npx tsx scripts/init-mongodb.ts
 */

// MUST load env FIRST before any imports
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

// Verify MongoDB URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('✓ Environment loaded');
console.log('✓ MongoDB URI detected (value hidden for safety)');
console.log(`✓ Database: ${process.env.MONGODB_DB || 'saintsal_db'}\n`);

// Now import after env is set
async function main() {
  console.log('🚀 Starting MongoDB initialization...\n');
  console.log('This will create:');
  console.log('  ✓ users collection (with email verification fields)');
  console.log('  ✓ pricing collection (free, pro, enterprise plans)');
  console.log('  ✓ messages collection (chat history)');
  console.log('  ✓ documents collection (RAG/vector storage)');
  console.log('  ✓ teams collection');
  console.log('  ✓ team_invitations collection');
  console.log('  ✓ All necessary indexes');
  console.log('');

  try {
    // Dynamic import after env is loaded
    const { initializeMongoDB } = await import('../lib/mongodb-schema.js');
    await initializeMongoDB();
    console.log('\n✅ SUCCESS! Database is ready.');
    console.log('\n📝 Next steps:');
    console.log('  1. Create vector search index in MongoDB Atlas UI');
    console.log('  2. Test user signup & email verification');
    console.log('  3. Test Stripe webhook integration');
    console.log('  4. Test RAG functionality\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR during initialization:');
    console.error(error);
    process.exit(1);
  }
}

main();
