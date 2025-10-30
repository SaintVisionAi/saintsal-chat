#!/usr/bin/env node

/**
 * Simple Environment Variables Check
 * Just verifies env vars are set (no API calls)
 */

console.log('\n🔍 Checking Environment Variables...\n');

const checks = {
  required: [
    { name: 'MONGODB_URI', value: process.env.MONGODB_URI },
    { name: 'MONGODB_DB', value: process.env.MONGODB_DB },
    { name: 'GITHUB_CLIENT_ID', value: process.env.GITHUB_CLIENT_ID },
    { name: 'GITHUB_CLIENT_SECRET', value: process.env.GITHUB_CLIENT_SECRET },
    { name: 'GITHUB_CALLBACK_URL', value: process.env.GITHUB_CALLBACK_URL },
    { name: 'OPENAI_API_KEY', value: process.env.OPENAI_API_KEY },
    { name: 'ELEVENLABS_API_KEY', value: process.env.ELEVENLABS_API_KEY },
    { name: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL },
  ],
  optional: [
    { name: 'ELEVENLABS_VOICE_ID', value: process.env.ELEVENLABS_VOICE_ID },
    { name: 'ANTHROPIC_API_KEY', value: process.env.ANTHROPIC_API_KEY },
    { name: 'GITHUB_TOKEN', value: process.env.GITHUB_TOKEN },
  ]
};

function maskValue(value) {
  if (!value || value.length < 8) return '***';
  return value.substring(0, 6) + '...' + value.substring(value.length - 4);
}

function isPlaceholder(value) {
  return !value ||
         value.includes('your-') ||
         value.includes('here') ||
         value.includes('<') ||
         value === 'undefined';
}

let passed = 0;
let failed = 0;
let warnings = 0;

console.log('📋 Required Configuration:\n');

checks.required.forEach(({ name, value }) => {
  if (isPlaceholder(value)) {
    console.log(`❌ ${name}: Not configured`);
    failed++;
  } else {
    console.log(`✅ ${name}: ${maskValue(value)}`);
    passed++;
  }
});

console.log('\n📋 Optional Configuration:\n');

checks.optional.forEach(({ name, value }) => {
  if (isPlaceholder(value)) {
    console.log(`⚠️  ${name}: Not set`);
    warnings++;
  } else {
    console.log(`✅ ${name}: ${maskValue(value)}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Results: ${passed}/${checks.required.length} required items configured`);

if (warnings > 0) {
  console.log(`⚠️  ${warnings} optional items not configured`);
}

if (failed === 0) {
  console.log('\n🎉 All required environment variables are set!\n');
  console.log('💡 To verify API connectivity, run: npm install && node scripts/verify-env.mjs\n');
} else {
  console.log(`\n❌ ${failed} required variables need to be configured in .env.local\n`);
  process.exit(1);
}
