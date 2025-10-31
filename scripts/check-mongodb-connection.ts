#!/usr/bin/env tsx
/**
 * Check MongoDB Connection
 * Tests if we can connect to MongoDB Atlas
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

async function checkConnection() {
  console.log('🔍 Checking MongoDB connection...\n');

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  console.log('✓ MongoDB URI found');
  console.log(`✓ Database name: ${process.env.MONGODB_DB || 'saintsal_db'}\n`);

  try {
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);

    console.log('🔌 Attempting to connect...');
    await client.connect();
    console.log('✅ CONNECTION SUCCESSFUL!\n');

    const db = client.db(process.env.MONGODB_DB || 'saintsal_db');
    const collections = await db.listCollections().toArray();

    console.log(`📊 Found ${collections.length} collections:`);
    collections.forEach(c => console.log(`   - ${c.name}`));

    if (collections.length === 0) {
      console.log('\n⚠️  No collections found. You need to run: npm run db:init');
    }

    await client.close();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ CONNECTION FAILED!\n');

    if (error.code === 'ECONNREFUSED' || error.message?.includes('querySrv')) {
      console.error('🔒 Network Access Issue Detected!');
      console.error('\n📝 To fix this:');
      console.error('1. Go to MongoDB Atlas: https://cloud.mongodb.com');
      console.error('2. Select your project');
      console.error('3. Go to Security → Network Access');
      console.error('4. Click "Add IP Address"');
      console.error('5. Choose one option:');
      console.error('   - "Add Current IP Address" (recommended for production)');
      console.error('   - "Allow Access from Anywhere" (0.0.0.0/0) for development');
      console.error('6. Save and wait 1-2 minutes for changes to apply');
      console.error('7. Run this script again\n');
    } else if (error.message?.includes('authentication')) {
      console.error('🔑 Authentication Issue!');
      console.error('Check your MongoDB username and password in .env.local\n');
    } else {
      console.error('Unknown error:');
      console.error(error);
    }

    process.exit(1);
  }
}

checkConnection();
