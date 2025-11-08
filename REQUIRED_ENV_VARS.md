# 🔐 Required Environment Variables

## ✅ CRITICAL (Required for Security Fixes - NEW!)

These are the **NEW variables** we just added for secure sessions:

```bash
# Session encryption (REQUIRED - auto-generated)
SESSION_SECRET=d0efa48000418fe0c26ffc40a06de32fa5966cd4e11ae65d45f3bbfe02a7f203

# Admin authentication (REQUIRED)
ADMIN_EMAIL=ryan@cookinknowledge.com
ADMIN_PASSWORD=Ayden0428$$
```

## 🔴 ESSENTIAL (Core Functionality)

These are required for the app to work:

```bash
# Database
MONGODB_URI=mongodb+srv://Vercel-Admin-SaintSal-Chat:jojiG4k7REvb6TK7@saintsal-chat.wsoouc.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=saintsal_db

# AI Models (for chat to work)
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-api03-...

# App URL (for email links)
NEXT_PUBLIC_APP_URL=https://saintsal.ai
```

## 🟡 IMPORTANT (Features)

These enable specific features:

```bash
# Email (for verification emails)
RESEND_API_KEY=re_...
EMAIL_FROM=SaintSal <noreply@saintsal.ai>

# Stripe (for payments)
STRIPE_API_KEY=sk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Voice (for Walkie Talkie)
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Optional AI Models
OPENAI_MODEL=gpt-4o-mini
```

## 🟢 OPTIONAL (Nice to Have)

These are optional features:

```bash
# Search (optional)
SERPER_API_KEY=...
BRAVE_SEARCH_API_KEY=...

# Supabase (optional - for RAG)
SUPABASE_URL=...
SUPABASE_ANON_KEY=...

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

---

## 📝 Quick Setup

**Minimum to get started:**
1. SESSION_SECRET ✅ (already generated)
2. ADMIN_EMAIL ✅ (already set)
3. ADMIN_PASSWORD ✅ (already set)
4. MONGODB_URI ✅ (you have this)
5. OPENAI_API_KEY ✅ (you have this)

**That's it!** The rest are optional based on which features you want to use.

