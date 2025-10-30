import express from 'express';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CosmosClient } from '@azure/cosmos';
import { SearchClient, AzureKeyCredential } from '@azure/search-documents';

dotenv.config();

// ============================================
// CONFIGURATION
// ============================================
const config = {
  foundry: {
    key: process.env.AZURE_AI_FOUNDRY_KEY,
    endpoint: process.env.AZURE_AI_FOUNDRY_ENDPOINT,
    deployments: {
      gpt5Core: process.env.AZURE_DEPLOYMENT_GPT5_CORE || 'gpt-5-core',
      gpt5Fast: process.env.AZURE_DEPLOYMENT_GPT5_FAST || 'gpt-5-fast',
      grok3: process.env.AZURE_DEPLOYMENT_GROK3 || 'grok-3-biz',
      embeddings: process.env.AZURE_DEPLOYMENT_EMBEDDINGS || 'embed-3-large'
    }
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY
  },
  cosmos: {
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY,
    database: process.env.COSMOS_DB_DATABASE || 'superman',
    container: process.env.COSMOS_DB_CONTAINER || 'conversations'
  },
  search: {
    endpoint: process.env.AZURE_SEARCH_ENDPOINT,
    key: process.env.AZURE_SEARCH_KEY,
    indexName: process.env.AZURE_SEARCH_INDEX_NAME || 'superman-knowledge'
  },
  server: {
    port: process.env.PORT || 4000

  }
};

// ============================================
// AZURE AI FOUNDRY REST API CLIENT
// ============================================
async function callFoundryModel(deployment, messages, stream = false) {
  const url = `${config.foundry.endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-08-01-preview`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': config.foundry.key
    },
    body: JSON.stringify({
      messages,
      max_completion_tokens: 2000,
      stream
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Foundry API error: ${response.status} - ${error}`);
  }

  if (stream) {
    return response.body;
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ============================================
// AI CLIENTS
// ============================================
const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey
});

const gemini = new GoogleGenerativeAI(config.gemini.apiKey);

// ============================================
// COSMOS DB CLIENT
// ============================================
const cosmosClient = new CosmosClient({
  endpoint: config.cosmos.endpoint,
  key: config.cosmos.key
});

let conversationContainer;

async function initCosmosDB() {
  try {
    const { database } = await cosmosClient.databases.createIfNotExists({
      id: config.cosmos.database
    });
    
    const { container } = await database.containers.createIfNotExists({
      id: config.cosmos.container,
      partitionKey: { paths: ['/userId'] }
    });
    
    conversationContainer = container;
    console.log('✅ Cosmos DB initialized');
  } catch (error) {
    console.error('❌ Cosmos DB init error:', error.message);
  }
}

// ============================================
// AZURE AI SEARCH CLIENT
// ============================================
const searchClient = new SearchClient(
  config.search.endpoint,
  config.search.indexName,
  new AzureKeyCredential(config.search.key)
);

// ============================================
// CONVERSATION MEMORY FUNCTIONS
// ============================================
async function getConversationHistory(userId, limit = 10) {
  try {
    const query = {
      query: 'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.timestamp DESC OFFSET 0 LIMIT @limit',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@limit', value: limit }
      ]
    };
    
    const { resources } = await conversationContainer.items.query(query).fetchAll();
    return resources.reverse();
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
}

async function saveMessage(userId, role, content) {
  try {
    await conversationContainer.items.create({
      userId,
      role,
      content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

async function clearHistory(userId) {
  try {
    const query = {
      query: 'SELECT c.id FROM c WHERE c.userId = @userId',
      parameters: [{ name: '@userId', value: userId }]
    };
    
    const { resources } = await conversationContainer.items.query(query).fetchAll();
    
    for (const item of resources) {
      await conversationContainer.item(item.id, userId).delete();
    }
    
    return { deleted: resources.length };
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
}

// ============================================
// RAG SEARCH FUNCTION
// ============================================
async function searchKnowledge(query, topK = 5) {
  try {
    const searchResults = await searchClient.search(query, {
      top: topK,
      select: ['content', 'title', 'url']
    });
    
    const results = [];
    for await (const result of searchResults.results) {
      results.push(result.document);
    }
    
    return results;
  } catch (error) {
    console.error('RAG search error:', error);
    return [];
  }
}

// ============================================
// MODEL SELECTION LOGIC
// ============================================
function selectModel(prompt) {
  const promptLower = prompt.toLowerCase();
  
  // Fast tasks -> GPT-5 Fast
  if (promptLower.length < 100 || 
      promptLower.includes('quick') || 
      promptLower.includes('simple')) {
    return { provider: 'gpt5-fast', deployment: config.foundry.deployments.gpt5Fast };
  }
  
  // Code/technical -> Claude
  if (promptLower.includes('code') || 
      promptLower.includes('function') || 
      promptLower.includes('debug') ||
      promptLower.includes('technical')) {
    return { provider: 'claude', model: 'claude-sonnet-4-20250514' };
  }
  
  // Creative/reasoning -> Grok-3
  if (promptLower.includes('creative') || 
      promptLower.includes('story') || 
      promptLower.includes('imagine')) {
    return { provider: 'grok3', deployment: config.foundry.deployments.grok3 };
  }
  
  // Multimodal -> Gemini
  if (promptLower.includes('image') || 
      promptLower.includes('video') || 
      promptLower.includes('analyze')) {
    return { provider: 'gemini', model: 'gemini-2.0-flash-exp' };
  }
  
  // Default -> GPT-5 Core
  return { provider: 'gpt5-core', deployment: config.foundry.deployments.gpt5Core };
}

// ============================================
// MAIN ASK FUNCTION
// ============================================
async function ask(prompt, userId = 'default', useRAG = false) {
  try {
    // Get conversation history
    const history = await getConversationHistory(userId, 5);
    
    // Build messages array
    const messages = [
      { role: 'system', content: 'You are Superman AI, a helpful and intelligent assistant.' }
    ];
    
    // Add history
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }
    
    // RAG enhancement
    let enhancedPrompt = prompt;
    if (useRAG) {
      const knowledge = await searchKnowledge(prompt);
      if (knowledge.length > 0) {
        const context = knowledge.map(k => k.content).join('\n\n');
        enhancedPrompt = `Context:\n${context}\n\nQuestion: ${prompt}`;
      }
    }
    
    messages.push({ role: 'user', content: enhancedPrompt });
    
    // Select model
    const selected = selectModel(prompt);
    console.log(`🤖 Using: ${selected.provider}`);
    
    // Save user message
    await saveMessage(userId, 'user', prompt);
    
    // Call appropriate model
    let response;
    
    if (selected.provider === 'gpt5-core' || selected.provider === 'gpt5-fast' || selected.provider === 'grok3') {
      response = await callFoundryModel(selected.deployment, messages);
    } else if (selected.provider === 'claude') {
      const claudeMessages = messages.slice(1).map(m => ({
        role: m.role,
        content: m.content
      }));
      
      const claudeResponse = await anthropic.messages.create({
        model: selected.model,
        max_tokens: 2000,
        messages: claudeMessages
      });
      
      response = claudeResponse.content[0].text;
    } else if (selected.provider === 'gemini') {
      const geminiModel = gemini.getGenerativeModel({ model: selected.model });
      const result = await geminiModel.generateContent(enhancedPrompt);
      response = result.response.text();
    }
    
    // Save assistant message
    await saveMessage(userId, 'assistant', response);
    
    return {
      response,
      model: selected.provider,
      userId
    };
  } catch (error) {
    console.error('Error in ask():', error);
    throw error;
  }
}

// ============================================
// STREAMING FUNCTION
// ============================================
async function* askStream(prompt, userId = 'default') {
  try {
    const history = await getConversationHistory(userId, 5);
    const messages = [
      { role: 'system', content: 'You are Superman AI, a helpful assistant.' }
    ];
    
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }
    
    messages.push({ role: 'user', content: prompt });
    
    const selected = selectModel(prompt);
    console.log(`🤖 Streaming with: ${selected.provider}`);
    
    await saveMessage(userId, 'user', prompt);
    
    let fullResponse = '';
    
    if (selected.provider === 'gpt5-core' || selected.provider === 'gpt5-fast' || selected.provider === 'grok3') {
      const stream = await callFoundryModel(selected.deployment, messages, true);
      
      for await (const chunk of stream) {
        const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
                yield content;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } else if (selected.provider === 'claude') {
      const claudeMessages = messages.slice(1);
      const stream = await anthropic.messages.create({
        model: selected.model,
        max_tokens: 2000,
        messages: claudeMessages,
        stream: true
      });
      
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          fullResponse += event.delta.text;
          yield event.delta.text;
        }
      }
    }
    
    await saveMessage(userId, 'assistant', fullResponse);
  } catch (error) {
    console.error('Stream error:', error);
    yield `Error: ${error.message}`;
  }
}

// ============================================
// EXPRESS API
// ============================================
const app = express();
app.use(express.json());

// Health check
app.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      azureOpenAI: config.foundry.key ? '✅' : '❌',
      claude: config.anthropic.apiKey ? '✅' : '❌',
      gemini: config.gemini.apiKey ? '✅' : '❌',
      cosmosDB: conversationContainer ? '✅' : '❌',
      azureSearch: config.search.key ? '✅' : '❌'
    }
  });
});

// Standard chat
app.post('/chat', async (req, res) => {
  try {
    const { prompt, userId = 'default', useRAG = false } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const result = await ask(prompt, userId, useRAG);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Streaming chat
app.post('/stream', async (req, res) => {
  try {
    const { prompt, userId = 'default' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    for await (const chunk of askStream(prompt, userId)) {
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation history
app.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await getConversationHistory(userId, 50);
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear conversation history
app.delete('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await clearHistory(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RAG index endpoint
app.post('/rag/index', async (req, res) => {
  try {
    const { documents } = req.body;
    
    if (!Array.isArray(documents)) {
      return res.status(400).json({ error: 'documents must be an array' });
    }
    
    await searchClient.uploadDocuments(documents);
    res.json({ indexed: documents.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SERVER START
// ============================================
async function startServer() {
  await initCosmosDB();
  
  app.listen(config.server.port, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🦸 SUPERMAN AI ORCHESTRATOR 🦸                ║
║                                                            ║
║  ✅ GPT-5 Core & Fast        ✅ Grok-3                    ║
║  ✅ Claude Sonnet 4          ✅ Gemini 2.0                ║
║  ✅ Streaming Support        ✅ Cosmos DB Memory          ║
║  ✅ Azure AI Search (RAG)    ✅ Multi-Modal Services      ║
║                                                            ║
║  🚀 Server running on port ${config.server.port}                      ║
║  📡 Ready to receive requests!                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

API Endpoints:
──────────────
  POST   /chat           - Standard chat
  POST   /stream         - Streaming chat
  POST   /rag/index      - Index knowledge
  GET    /history/:userId - Get history
  DELETE /history/:userId - Clear history
  GET    /health         - Health check
    `);
  });
}

startServer().catch(console.error);
