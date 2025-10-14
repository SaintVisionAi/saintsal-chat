import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function test() {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: 'What is 2+2?' }]
    });
    
    console.log('✅ CLAUDE WORKS!');
    console.log('Response:', response.content[0].text);
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

test();
