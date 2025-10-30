#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * Tests all API connections without exposing sensitive data
 */

import { MongoClient } from 'mongodb';
import OpenAI from 'openai';
import 'dotenv/config';

const results = {
  passed: [],
  failed: [],
  warnings: []
};

console.log('\n🔍 Verifying Environment Configuration...\n');

// Helper to mask sensitive values
function maskValue(value) {
  if (!value || value.length < 8) return '***';
  return value.substring(0, 4) + '...' + value.substring(value.length - 4);
}

// Check MongoDB
async function checkMongoDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('your-connection-string-here')) {
      results.failed.push('❌ MongoDB: Connection string not set');
      return;
    }

    const client = new MongoClient(uri);
    await client.connect();
    await client.db().admin().ping();
    await client.close();

    results.passed.push('✅ MongoDB: Connected successfully');
    console.log(`   DB: ${process.env.MONGODB_DB || 'saintsal_db'}`);
  } catch (error) {
    results.failed.push(`❌ MongoDB: ${error.message}`);
  }
}

// Check OpenAI
async function checkOpenAI() {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes('your-openai-api-key-here')) {
      results.failed.push('❌ OpenAI: API key not set');
      return;
    }

    const openai = new OpenAI({ apiKey });
    const response = await openai.models.list();

    results.passed.push('✅ OpenAI: API key valid');
    console.log(`   Key: ${maskValue(apiKey)}`);
    console.log(`   Model: ${process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'}`);
  } catch (error) {
    results.failed.push(`❌ OpenAI: ${error.message}`);
  }
}

// Check ElevenLabs
async function checkElevenLabs() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey || apiKey.includes('your-elevenlabs-api-key-here')) {
      results.failed.push('❌ ElevenLabs: API key not set');
      return;
    }

    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': apiKey }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    if (!voiceId || voiceId.includes('your-voice-id-here')) {
      results.warnings.push('⚠️  ElevenLabs: Voice ID not set');
    }

    results.passed.push('✅ ElevenLabs: API key valid');
    console.log(`   Key: ${maskValue(apiKey)}`);
    if (voiceId && !voiceId.includes('your-voice-id-here')) {
      console.log(`   Voice ID: ${voiceId}`);
    }
  } catch (error) {
    results.failed.push(`❌ ElevenLabs: ${error.message}`);
  }
}

// Check GitHub OAuth
function checkGitHubOAuth() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const callbackUrl = process.env.GITHUB_CALLBACK_URL;

  if (!clientId || clientId === 'your-github-client-id-here') {
    results.failed.push('❌ GitHub: Client ID not set');
    return;
  }

  if (!clientSecret || clientSecret === 'your-github-secret-here') {
    results.failed.push('❌ GitHub: Client Secret not set');
    return;
  }

  if (!callbackUrl || callbackUrl.includes('saintsal.ai')) {
    results.passed.push('✅ GitHub OAuth: Configured');
    console.log(`   Client ID: ${maskValue(clientId)}`);
    console.log(`   Callback: ${callbackUrl}`);

    if (callbackUrl === 'https://pay.saintsal.ai/api/github/callback') {
      console.log('   ⚠️  Make sure to add this callback URL in GitHub OAuth app settings!');
    }
  }
}

// Check App URL
function checkAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    results.warnings.push('⚠️  App URL: Not set (using default)');
    return;
  }

  results.passed.push('✅ App URL: Set');
  console.log(`   URL: ${appUrl}`);
}

// Run all checks
async function runChecks() {
  console.log('📋 Checking Required Services:\n');

  await checkMongoDB();
  await checkOpenAI();
  await checkElevenLabs();
  checkGitHubOAuth();
  checkAppUrl();

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 RESULTS:\n');

  if (results.passed.length > 0) {
    console.log('✅ Passed:');
    results.passed.forEach(msg => console.log(`   ${msg}`));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(msg => console.log(`   ${msg}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed:');
    results.failed.forEach(msg => console.log(`   ${msg}`));
  }

  console.log('\n' + '='.repeat(50));

  const total = results.passed.length + results.failed.length + results.warnings.length;
  const passed = results.passed.length;

  console.log(`\n📈 Score: ${passed}/${total - results.warnings.length} required checks passed\n`);

  if (results.failed.length === 0) {
    console.log('🎉 All required services are configured correctly!\n');
    process.exit(0);
  } else {
    console.log('❌ Some services need configuration. Check the failed items above.\n');
    process.exit(1);
  }
}

runChecks().catch(error => {
  console.error('\n💥 Verification failed:', error.message);
  process.exit(1);
});
