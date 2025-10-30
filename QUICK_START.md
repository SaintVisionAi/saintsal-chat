# 🚀 SAINTSAL CHAT - QUICK START GUIDE

## ✅ What's Fixed

All major issues have been resolved:

1. ✅ **Playground Full Page** - Fixed CSS layout, playground now fills entire screen
2. ✅ **File Upload Works** - Upload PDFs, images, text files in chat
3. ✅ **Walkie Talkie Works** - Voice-to-voice communication with AI
4. ✅ **RAG & LLM** - Vector search with MongoDB Atlas
5. ✅ **Chat Streaming** - Real-time AI responses
6. ✅ **Authentication** - Cookie-based auth with MongoDB

---

## 🎯 5-Minute Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment File

```bash
# Copy the template
cp .env.local.example .env.local
```

Then edit `.env.local` and add your API keys:

```env
# REQUIRED - Get from MongoDB Atlas (free tier available)
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"
MONGODB_DB="saintsal_db"

# REQUIRED - Get from OpenAI (https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-your-openai-key"

# REQUIRED - Get from Anthropic (https://console.anthropic.com/)
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"

# OPTIONAL - For voice features (https://elevenlabs.io/)
ELEVENLABS_API_KEY="your-elevenlabs-key"
```

### Step 3: Initialize MongoDB

```bash
# This creates all required collections and indexes
node -e "import('./lib/mongodb-schema.js').then(m => m.initializeMongoDB())"
```

You should see:
```
Created users collection
Created pricing collection
Created messages collection
Created documents collection
MongoDB initialization complete!
```

### Step 4: Start the App

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🎨 Features Overview

### 1. **Chat Interface** (Main View)
- Real-time streaming AI responses
- File upload (PDFs, images, text files)
- Voice input (speech-to-text)
- Code generation
- Web search integration
- Image generation

### 2. **Playground** (Model Testing)
- Test different AI models side-by-side
- Adjust temperature and max tokens
- Custom system prompts
- Compare GPT-4, Claude, and more
- **NOW FULL PAGE!** ✅

### 3. **Walkie Talkie** (Voice Mode)
- Press and hold to talk
- Real-time voice-to-voice AI conversation
- Automatic transcription
- Text-to-speech responses
- **NOW WORKS!** ✅

### 4. **Model Comparison**
- Test same prompt across multiple models
- Side-by-side comparison
- Performance metrics
- Cost estimation

---

## 🔧 How to Use Each Feature

### File Upload

1. Click the **📎 Paperclip** button in chat
2. Select a file (PDF, image, text, JSON, CSV)
3. File is analyzed and added to RAG knowledge base
4. Ask questions about the file content

**Supported formats:**
- PDFs (up to 10MB)
- Images (JPG, PNG) - uses GPT-4 Vision
- Text files (TXT, JSON, CSV)

### Voice Input (Chat)

1. Click the **🎤 Microphone** button
2. Speak your message
3. Click **🛑 Stop** when done
4. Text appears in input field
5. Press Enter to send

### Walkie Talkie Mode

1. Click **"Walkie Talkie"** in sidebar
2. **Press and hold** the big button
3. Speak your message
4. **Release** to send
5. AI responds with voice

**Perfect for:**
- Hands-free operation
- Natural conversations
- Quick questions
- Voice memos

### Playground Testing

1. Click **"Playground"** in sidebar
2. Click **⚙️ Settings** to configure:
   - Choose AI model (GPT-4, Claude, etc.)
   - Set temperature (0-2)
   - Set max tokens (100-4000)
   - Customize system prompt
3. Type your test message
4. See real-time response

**Use cases:**
- Prompt engineering
- Model comparison
- Testing different temperatures
- Finding best model for your task

---

## 🐛 Troubleshooting

### "Authentication required" errors

**Problem:** No `.env.local` file or missing auth

**Fix:**
1. Create `.env.local` from template
2. Add your API keys
3. Restart dev server
4. Clear browser cookies
5. Login again

### File upload doesn't work

**Problem:** Missing OpenAI API key or wrong file type

**Fix:**
1. Check `OPENAI_API_KEY` in `.env.local`
2. Ensure file is under 10MB
3. Use supported formats only
4. Check console for errors

### Voice doesn't work

**Problem:** Browser permissions or missing API keys

**Fix:**
1. Allow microphone access in browser
2. Check `OPENAI_API_KEY` (for Whisper STT)
3. Check `ELEVENLABS_API_KEY` (for TTS)
4. Try in Chrome/Edge (best support)

### Playground shows half page

**Problem:** Old CSS cached

**Fix:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Restart dev server

### MongoDB connection fails

**Problem:** Wrong connection string

**Fix:**
1. Get connection string from MongoDB Atlas
2. Replace `<password>` with actual password
3. Whitelist your IP in Atlas
4. Check network firewall

---

## 📊 MongoDB Setup (Detailed)

### Collections Created

The init script creates these collections:

1. **users** - User accounts and authentication
   - Indexes: `email` (unique), `createdAt`
   - Stores: credentials, plan, usage limits

2. **pricing** - Pricing tiers (Free, Pro, Enterprise)
   - Pre-populated with 3 tiers
   - Defines usage limits

3. **messages** - Chat history
   - Indexes: `timestamp`, `userId`
   - Stores: messages, model used, RAG usage

4. **documents** - RAG document storage
   - Indexes: `userId`, `createdAt`
   - Requires vector search index (create in Atlas UI)

5. **files** - Uploaded files
   - Stores: file metadata, extracted text

### Create Vector Search Index (Optional but Recommended)

For RAG features to work:

1. Go to MongoDB Atlas
2. Navigate to your cluster
3. Click "Search" tab
4. Create Search Index:
   - Name: `vector_index`
   - Field: `embedding`
   - Type: Vector Search
   - Dimensions: 1536 (for OpenAI embeddings)

---

## 🎯 Testing Checklist

After setup, test these features:

- [ ] Navigate to http://localhost:3000
- [ ] Sign up for a new account
- [ ] Login successfully
- [ ] Send a chat message
- [ ] Upload a file
- [ ] Use voice input
- [ ] Switch to Playground view
- [ ] Test different AI models
- [ ] Try Walkie Talkie mode
- [ ] Compare models side-by-side

---

## 🚀 Production Deployment

### Environment Variables

Update for production:

```env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
MONGODB_URI="your-production-mongodb-uri"
```

### OAuth Redirect URIs

Update in provider consoles:

**GitHub:**
- `https://yourdomain.com/api/github/callback`

**Google:**
- `https://yourdomain.com/api/auth/oauth/google/callback`

### Deployment Platforms

**Vercel (Recommended):**
```bash
npm run build
vercel --prod
```

**Other platforms:**
```bash
npm run build
npm start
```

---

## 📞 Support

### Common Issues

1. **401 Unauthorized** → Check auth cookies and .env.local
2. **500 Server Error** → Check MongoDB connection
3. **Voice not working** → Check browser permissions
4. **Playground half page** → Hard refresh browser

### Debug Mode

Enable verbose logging:
```bash
NODE_ENV=development npm run dev
```

Check console for detailed error messages.

---

## 🎉 You're Ready!

Everything should now work:
- ✅ Playground is full page
- ✅ File uploads work
- ✅ Voice communication works
- ✅ RAG and LLM integrated
- ✅ Chat streaming works

**Start building with SaintSal!** 🚀

---

**Generated:** 2025-10-30
**Version:** 2.0.0
