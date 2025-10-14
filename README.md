# 🦸 SUPERMAN AI ORCHESTRATOR

**The Complete Multi-Modal AI System**

## 🎯 What This Is

Superman is your unified AI orchestration platform that intelligently routes requests across:
- **GPT-5** (Core & Fast) - Azure OpenAI
- **Grok-3** - Real-time analysis
- **Claude Sonnet 4** - Creative & analytical tasks
- **Gemini 2.0** - Multimodal capabilities

**Plus ALL Azure Cognitive Services:**
- Speech (STT/TTS)
- Vision (Image Analysis & OCR)
- Document Intelligence
- Language Services
- Translator
- Content Safety

**With Built-In:**
- ✅ Streaming (real-time responses)
- ✅ Memory (Cosmos DB conversation history)
- ✅ RAG (Azure AI Search with vector embeddings)
- ✅ Express REST API

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Verify .env File

Your `.env` file is already configured with all credentials!

### 3. Start the Server

```bash
npm start
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║              🦸 SUPERMAN AI ORCHESTRATOR 🦸                ║
║  ✅ GPT-5 Core & Fast        ✅ Grok-3                    ║
║  ✅ Claude Sonnet 4          ✅ Gemini 2.0                ║
║  🚀 Server running on port 3000                           ║
╚════════════════════════════════════════════════════════════╝
```

---

## 📡 API Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### 1. Standard Chat
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain quantum computing in simple terms",
    "userId": "ryan",
    "taskType": "general"
  }'
```

**Task Types:**
- `general` - Default, routes to best model
- `reasoning` - Complex analysis (GPT-5 Core)
- `quick` - Fast responses (GPT-5 Fast)
- `creative` - Writing tasks (Claude)
- `realtime` - News/current events (Grok-3)
- `multimodal` - Images (Gemini)

### 2. Streaming Chat (Real-time)
```bash
curl -X POST http://localhost:3000/stream \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a story about a robot chef",
    "userId": "ryan",
    "taskType": "creative"
  }'
```

Response streams as SSE:
```
data: {"model":"Claude Sonnet 4"}
data: {"chunk":"Once upon"}
data: {"chunk":" a time..."}
data: {"done":true}
```

### 3. Chat with RAG (Knowledge Retrieval)
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What are our Q4 goals?",
    "userId": "ryan",
    "useRAG": true
  }'
```

### 4. Voice Input/Output
```bash
curl -X POST http://localhost:3000/voice \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Tell me a joke",
    "userId": "ryan",
    "returnAudio": true
  }'
```

Response includes:
- `transcript` - Input text (if audio was provided)
- `response` - AI response text
- `audio` - Base64 encoded audio (if returnAudio=true)

### 5. Vision - Analyze Image
```bash
curl -X POST http://localhost:3000/vision \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/image.jpg",
    "task": "analyze"
  }'
```

**Tasks:**
- `analyze` - Full image analysis
- `ocr` - Extract text from image

### 6. Document Analysis
```bash
curl -X POST http://localhost:3000/document \
  -H "Content-Type: application/json" \
  -d '{
    "documentUrl": "https://example.com/document.pdf"
  }'
```

### 7. Translation
```bash
curl -X POST http://localhost:3000/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "targetLanguage": "es",
    "sourceLanguage": "en"
  }'
```

### 8. Content Safety Check
```bash
curl -X POST http://localhost:3000/safety \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Sample text to check for harmful content"
  }'
```

### 9. Index Knowledge (RAG)
```bash
curl -X POST http://localhost:3000/rag/index \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Q4 2025 Goals",
    "content": "Our main goals for Q4 are to increase revenue by 30% and expand to 3 new markets..."
  }'
```

### 10. Get Conversation History
```bash
curl http://localhost:3000/history/ryan
```

### 11. Clear Conversation History
```bash
curl -X DELETE http://localhost:3000/history/ryan
```

---

## 🧪 Testing Each Feature

### Test 1: Basic Chat with All Models
```bash
# GPT-5 (reasoning task)
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Explain the implications of quantum entanglement","taskType":"reasoning","userId":"test1"}'

# Claude (creative task)
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Write a haiku about technology","taskType":"creative","userId":"test2"}'

# Grok-3 (realtime task)
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What are the latest trends in AI?","taskType":"realtime","userId":"test3"}'
```

### Test 2: Streaming
```bash
curl -N -X POST http://localhost:3000/stream \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Count from 1 to 10 slowly","userId":"stream-test"}'
```

### Test 3: Memory (Conversation History)
```bash
# First message
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"My favorite color is blue","userId":"memory-test"}'

# Second message (should remember)
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is my favorite color?","userId":"memory-test"}'

# Check history
curl http://localhost:3000/history/memory-test
```

### Test 4: RAG (Knowledge Retrieval)
```bash
# Index some knowledge
curl -X POST http://localhost:3000/rag/index \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Commercial Lending Basics",
    "content": "Commercial lending typically requires a minimum credit score of 680, at least 2 years in business, and annual revenue of $100k+. Standard rates range from 6-12% depending on creditworthiness."
  }'

# Query with RAG enabled
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What are the requirements for commercial lending?",
    "useRAG": true,
    "userId": "rag-test"
  }'
```

### Test 5: Translation
```bash
curl -X POST http://localhost:3000/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Good morning, how can I help you today?",
    "targetLanguage": "es"
  }'
```

---

## 🎮 Testing with Postman/Insomnia

Import this collection:

```json
{
  "name": "Superman AI API",
  "requests": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "http://localhost:3000/health"
    },
    {
      "name": "Chat",
      "method": "POST",
      "url": "http://localhost:3000/chat",
      "body": {
        "prompt": "What is the meaning of life?",
        "userId": "postman-test"
      }
    }
  ]
}
```

---

## 🏗️ Architecture

```
superman-complete.mjs
├── Configuration Loading (.env)
├── Client Initialization
│   ├── Azure OpenAI (GPT-5, Grok-3)
│   ├── Anthropic (Claude)
│   ├── Google (Gemini)
│   ├── Cosmos DB (Memory)
│   └── Azure AI Search (RAG)
├── Intelligent Routing
│   └── selectModel() - Routes to best AI
├── AI Model Calls
│   ├── callAzureOpenAI()
│   ├── callClaude()
│   └── callGemini()
├── Memory Management
│   ├── loadConversationHistory()
│   ├── saveConversationTurn()
│   └── clearConversationHistory()
├── RAG (Knowledge)
│   ├── generateEmbeddings()
│   ├── searchKnowledge()
│   └── indexDocument()
├── Azure Cognitive Services
│   ├── speechToText()
│   ├── textToSpeech()
│   ├── analyzeImage()
│   ├── extractTextFromImage()
│   ├── analyzeDocument()
│   ├── translateText()
│   └── analyzeContentSafety()
└── Express API Routes
    ├── POST /chat
    ├── POST /stream
    ├── POST /voice
    ├── POST /vision
    ├── POST /document
    ├── POST /translate
    ├── POST /safety
    ├── POST /rag/index
    ├── GET /history/:userId
    └── DELETE /history/:userId
```

---

## 📊 Model Selection Logic

Superman intelligently routes requests:

| Task Type | Model | Use Case |
|-----------|-------|----------|
| `reasoning` | GPT-5 Core | Complex analysis, math, logic |
| `quick` | GPT-5 Fast | Simple queries, <100 chars |
| `creative` | Claude Sonnet 4 | Writing, stories, essays |
| `realtime` | Grok-3 | News, current events |
| `multimodal` | Gemini 2.0 | Images, vision tasks |
| `general` | GPT-5 Core | Default |

---

## 🔥 What You Built

After 28+ hours of work, you now have:

✅ **4 AI Models** working in harmony
✅ **Real-time Streaming** (SSE)
✅ **Conversation Memory** (Cosmos DB)
✅ **RAG** (Azure AI Search + Embeddings)
✅ **8 Azure Cognitive Services** integrated
✅ **Full REST API** ready to deploy
✅ **Production-ready** error handling
✅ **One unified backend** for all your platforms

This powers:
- saintvision.ai
- partnertech.ai
- cookin.io
- Any other platform you build

---

## 🚀 Next Steps

### 1. Test Locally
```bash
npm start
# Test each endpoint above
```

### 2. Deploy to Azure
```bash
# Build Docker image
docker build -t superman-ai .

# Push to Azure Container Registry
az acr login --name svcookinregistry
docker tag superman-ai svcookinregistry.azurecr.io/superman-ai:latest
docker push svcookinregistry.azurecr.io/superman-ai:latest

# Deploy to Container Apps
az containerapp create \
  --name superman-ai \
  --resource-group svt-cookin-resource-group \
  --environment superman-env \
  --image svcookinregistry.azurecr.io/superman-ai:latest \
  --target-port 3000 \
  --ingress external
```

### 3. Connect Your Frontend
```javascript
// Example: Chat with Superman
const response = await fetch('https://superman-ai.azurecontainerapps.io/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: userMessage,
    userId: currentUser.id,
    taskType: 'general'
  })
});

const data = await response.json();
console.log(data.response); // AI response
console.log(data.model);    // Which model was used
```

---

## 💪 YOU DID IT BROTHER!

This is THE foundation. Everything you need. Now go build on top of it! 🚀

LFG! 🔥
