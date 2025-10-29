#!/usr/bin/env node

/**
 * MongoDB Atlas Vector Search Index Setup Script
 *
 * This script creates the vector search index for RAG functionality
 * Run with: node scripts/setup-mongodb-vector-index.mjs
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'saintsal_db';

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI not found in environment variables');
  console.error('Make sure you have a .env.local file with MONGODB_URI set');
  process.exit(1);
}

async function createVectorSearchIndex() {
  console.log('🚀 Starting MongoDB Vector Search Index setup...\n');

  let client;
  try {
    // Connect to MongoDB
    console.log('📊 Connecting to MongoDB Atlas...');
    client = await MongoClient.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(MONGODB_DB);
    const collection = db.collection('documents');

    console.log(`📁 Database: ${MONGODB_DB}`);
    console.log(`📄 Collection: documents\n`);

    // Check if collection exists
    const collections = await db.listCollections({ name: 'documents' }).toArray();
    if (collections.length === 0) {
      console.log('⚠️  Documents collection does not exist yet');
      console.log('Creating empty collection...');
      await db.createCollection('documents');
      console.log('✅ Collection created\n');
    }

    // Create the vector search index
    console.log('🔍 Creating vector search index...');
    console.log('Index name: vector_index');
    console.log('Vector field: embedding');
    console.log('Dimensions: 1536 (OpenAI text-embedding-3-small)');
    console.log('Similarity: cosine\n');

    try {
      await collection.createSearchIndex({
        name: 'vector_index',
        type: 'vectorSearch',
        definition: {
          fields: [
            {
              type: 'vector',
              path: 'embedding',
              numDimensions: 1536,
              similarity: 'cosine'
            }
          ]
        }
      });

      console.log('✅ Vector search index created successfully!\n');
      console.log('🎉 Setup complete! Your RAG functionality is ready to use.\n');
      console.log('ℹ️  Note: It may take a few minutes for the index to become active in MongoDB Atlas.');
      console.log('   You can check the status in the MongoDB Atlas UI under Search Indexes.\n');

    } catch (indexError) {
      if (indexError.message.includes('already exists')) {
        console.log('✅ Vector search index already exists!\n');
        console.log('🎉 No action needed - your RAG functionality is ready to use.\n');
      } else {
        throw indexError;
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure your MONGODB_URI is correct in .env.local');
    console.error('2. Ensure your MongoDB cluster is running');
    console.error('3. Check that your IP address is whitelisted in MongoDB Atlas');
    console.error('4. Verify you have permissions to create search indexes\n');
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('📊 Disconnected from MongoDB');
    }
  }
}

// Run the script
createVectorSearchIndex();
