#!/usr/bin/env node
/**
 * Quick diagnostic script to check if your app is configured correctly
 */

console.log('\n🔍 SAINTSAL CHAT - SETUP CHECKER\n');
console.log('='.repeat(50));

// Load environment
require('dotenv').config({ path: '.env.local' });

let errors = 0;
let warnings = 0;

// Check critical environment variables
console.log('\n📋 Checking Required Configuration:\n');

// MongoDB
if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('username:password')) {
  console.log('❌ MONGODB_URI - NOT SET or using placeholder');
  console.log('   → Get from: https://cloud.mongodb.com');
  errors++;
} else {
  console.log('✅ MONGODB_URI - Configured');
}

if (!process.env.MONGODB_DB) {
  console.log('⚠️  MONGODB_DB - Not set, using default "saintsal_db"');
  warnings++;
} else {
  console.log('✅ MONGODB_DB - Set to:', process.env.MONGODB_DB);
}

// OpenAI
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('sk-proj-...')) {
  console.log('❌ OPENAI_API_KEY - NOT SET or using placeholder');
  console.log('   → Get from: https://platform.openai.com/api-keys');
  errors++;
} else if (process.env.OPENAI_API_KEY.startsWith('sk-')) {
  console.log('✅ OPENAI_API_KEY - Configured');
} else {
  console.log('⚠️  OPENAI_API_KEY - Set but format looks wrong');
  warnings++;
}

// Anthropic (optional)
if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('sk-ant-...')) {
  console.log('⚠️  ANTHROPIC_API_KEY - Not set (optional, but recommended)');
  console.log('   → Get from: https://console.anthropic.com');
  warnings++;
} else {
  console.log('✅ ANTHROPIC_API_KEY - Configured');
}

// App settings
if (process.env.NODE_ENV !== 'development') {
  console.log('⚠️  NODE_ENV - Set to:', process.env.NODE_ENV, '(should be "development" for local testing)');
  warnings++;
} else {
  console.log('✅ NODE_ENV - Set to development');
}

// Optional features
console.log('\n📋 Checking Optional Features:\n');

if (process.env.ELEVENLABS_API_KEY && !process.env.ELEVENLABS_API_KEY.includes('...')) {
  console.log('✅ ElevenLabs - Configured (voice features enabled)');
} else {
  console.log('⚠️  ElevenLabs - Not configured (voice features disabled)');
}

if (process.env.SERPER_API_KEY || process.env.BRAVE_SEARCH_API_KEY) {
  console.log('✅ Search API - Configured');
} else {
  console.log('⚠️  Search API - Not configured (web search disabled)');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 SUMMARY:\n');

if (errors === 0 && warnings === 0) {
  console.log('✅ ALL CHECKS PASSED! Your app is ready to run.');
  console.log('\nNext steps:');
  console.log('1. npm run dev');
  console.log('2. Visit http://localhost:3000');
  console.log('3. Sign up and start chatting!');
} else if (errors > 0) {
  console.log(`❌ ${errors} CRITICAL ERROR${errors > 1 ? 'S' : ''} FOUND`);
  console.log(`⚠️  ${warnings} warning${warnings > 1 ? 's' : ''}`);
  console.log('\n🔧 FIX REQUIRED:');
  console.log('1. Edit .env.local with your actual API keys');
  console.log('2. See EMERGENCY_FIX.md for detailed instructions');
  console.log('3. Run this checker again: node check-setup.js');
  process.exit(1);
} else {
  console.log(`✅ Core setup complete!`);
  console.log(`⚠️  ${warnings} optional feature${warnings > 1 ? 's' : ''} not configured`);
  console.log('\nYou can run the app now:');
  console.log('npm run dev');
}

console.log('\n' + '='.repeat(50) + '\n');
