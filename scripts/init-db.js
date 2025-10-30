#!/usr/bin/env node
/**
 * MongoDB Database Initialization Script
 * Creates collections, indexes, and initial data
 */

const { initializeMongoDB } = require('../lib/mongodb-schema.ts');

console.log('🚀 Starting MongoDB initialization...\n');

initializeMongoDB()
  .then(() => {
    console.log('\n✅ MongoDB initialization complete!');
    console.log('\n📋 Collections created:');
    console.log('   - users (with email index)');
    console.log('   - pricing (pre-populated)');
    console.log('   - messages (with indexes)');
    console.log('   - documents (with indexes)');
    console.log('\n⚠️  Remember to create vector search index in MongoDB Atlas UI!');
    console.log('   Index name: "vector_index"');
    console.log('   Field: "embedding"');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ MongoDB initialization failed:', error);
    console.error('\n🔍 Check:');
    console.error('   1. MONGODB_URI is set in .env.local');
    console.error('   2. MongoDB cluster is accessible');
    console.error('   3. Database name is correct');
    process.exit(1);
  });
