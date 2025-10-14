#!/usr/bin/env node

/**
 * Quick Test Script for Superman AI
 * Tests all major features
 */

const BASE_URL = 'http://localhost:3000';

async function test(name, endpoint, method = 'GET', body = null) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    
    const options = {
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    console.log(`✅ ${name}: SUCCESS`);
    console.log(JSON.stringify(data, null, 2).substring(0, 200) + '...');
    
    return data;
  } catch (error) {
    console.log(`❌ ${name}: FAILED`);
    console.error(error.message);
    return null;
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  SUPERMAN AI - QUICK TEST SUITE       ║');
  console.log('╚════════════════════════════════════════╝');
  
  // 1. Health Check
  await test('Health Check', '/health');
  
  // 2. Basic Chat
  await test('Basic Chat', '/chat', 'POST', {
    prompt: 'What is 2+2?',
    userId: 'test-user'
  });
  
  // 3. Creative Task (Claude)
  await test('Creative Task (Claude)', '/chat', 'POST', {
    prompt: 'Write a haiku about coding',
    userId: 'test-user',
    taskType: 'creative'
  });
  
  // 4. Reasoning Task (GPT-5)
  await test('Reasoning Task (GPT-5)', '/chat', 'POST', {
    prompt: 'Explain quantum entanglement briefly',
    userId: 'test-user',
    taskType: 'reasoning'
  });
  
  // 5. Memory Test - First Message
  await test('Memory Test - Set', '/chat', 'POST', {
    prompt: 'My name is Ryan and I love AI',
    userId: 'memory-test'
  });
  
  // 6. Memory Test - Recall
  await test('Memory Test - Recall', '/chat', 'POST', {
    prompt: 'What is my name?',
    userId: 'memory-test'
  });
  
  // 7. Get History
  await test('Get History', '/history/memory-test');
  
  // 8. Translation
  await test('Translation', '/translate', 'POST', {
    text: 'Hello, how are you?',
    targetLanguage: 'es'
  });
  
  // 9. RAG - Index
  await test('RAG - Index Knowledge', '/rag/index', 'POST', {
    title: 'Test Document',
    content: 'This is a test document about artificial intelligence and machine learning.'
  });
  
  // 10. RAG - Search
  await test('RAG - Search with Knowledge', '/chat', 'POST', {
    prompt: 'What did I just teach you about?',
    userId: 'rag-test',
    useRAG: true
  });
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  ALL TESTS COMPLETE!                   ║');
  console.log('╚════════════════════════════════════════╝\n');
}

// Run tests
runTests().catch(console.error);
