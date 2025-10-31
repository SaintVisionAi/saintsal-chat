# 🚀 MongoDB Database Setup - Complete Guide

## 🔴 CRITICAL: Your Database is Empty!

Your MongoDB cluster exists but has **ZERO collections**. Without these, nothing will work:
- ❌ No user authentication
- ❌ No email verification
- ❌ No Stripe payments tracking
- ❌ No chat history
- ❌ No RAG/AI memory
- ❌ No team features

## ✅ Quick Setup (3 Steps)

### Step 1: Fix Network Access

**You MUST do this first or the scripts will fail!**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your project
3. Go to **Security → Network Access** (left sidebar)
4. Click **"Add IP Address"**
5. Choose **"Allow Access from Anywhere"** → Add `0.0.0.0/0`
   - (Or add your specific IP for better security)
6. Click **Confirm**
7. **WAIT 1-2 MINUTES** for changes to apply

### Step 2: Test Connection

```bash
npm run db:check
```

You should see:
```
✅ CONNECTION SUCCESSFUL!
📊 Found 0 collections
⚠️  No collections found. You need to run: npm run db:init
```

### Step 3: Initialize Database

```bash
npm run db:init
```

This will create:
- ✅ **6 collections** (users, pricing, messages, documents, teams, team_invitations)
- ✅ **All indexes** (for performance)
- ✅ **Pricing data** (free, pro, enterprise plans)

Expected output:
```
Created users collection
Created pricing collection
Created messages collection
Created documents collection
Created teams collection
Created team_invitations collection
Created user indexes
Created team indexes
Created team invitation indexes
Created message indexes
Created document indexes
Inserted pricing tiers
✅ SUCCESS! Database is ready.
```

### Step 4: Verify Everything

```bash
npm run db:verify
```

You should see all green checkmarks! ✅

---

## 🎯 What Gets Created

### Collections (6 total)

1. **users** - User accounts, authentication, email verification
   ```typescript
   {
     email: string
     name: string
     password: string (bcrypt hashed)
     plan: 'free' | 'pro' | 'enterprise'
     emailVerified: boolean
     verificationToken?: string
     limits: { messagesPerMonth, voiceMinutesPerMonth, ... }
     usage: { messagesThisMonth, voiceMinutesThisMonth, ... }
     stripeCustomerId?: string
     createdAt: Date
   }
   ```

2. **pricing** - Plan tiers and limits
   - Free: $0/mo - 50 messages, 10 voice minutes
   - Pro: $29/mo - 1,000 messages, 200 voice minutes, teams
   - Enterprise: $199/mo - Unlimited everything

3. **messages** - Chat history and conversation logs
   ```typescript
   {
     userId: string
     message: string
     response: string
     timestamp: Date
     model: string
   }
   ```

4. **documents** - RAG vector storage for AI extended memory
   ```typescript
   {
     userId: string
     content: string
     embedding: number[] // vector
     metadata: object
     createdAt: Date
   }
   ```

5. **teams** - Team collaboration (Pro/Enterprise)
   ```typescript
   {
     name: string
     ownerId: string
     plan: 'pro' | 'enterprise'
     members: Array<{userId, email, role, verified}>
     limits: { messagesPerMonth, maxMembers, ... }
     usage: { messagesThisMonth, ... }
   }
   ```

6. **team_invitations** - Team member invitations
   ```typescript
   {
     teamId: string
     email: string
     token: string
     status: 'pending' | 'accepted' | 'declined'
     expiresAt: Date
   }
   ```

### Indexes (Performance)

Critical indexes for fast queries:
- `users.email` (unique)
- `users.createdAt`
- `messages.timestamp`
- `documents.userId`
- And 10+ more...

---

## 🔧 Available Commands

```bash
# Check if you can connect to MongoDB
npm run db:check

# Initialize database (create collections, indexes, seed data)
npm run db:init

# Verify everything is set up correctly
npm run db:verify

# Do all three in sequence
npm run db:setup
```

---

## 🚨 Troubleshooting

### Error: "ECONNREFUSED" or "querySrv"

**Problem:** Network access not configured

**Solution:**
1. Go to MongoDB Atlas → Security → Network Access
2. Add IP address `0.0.0.0/0` (allow from anywhere)
3. Wait 1-2 minutes
4. Try again

### Error: "authentication failed"

**Problem:** Wrong username/password in connection string

**Solution:**
1. Check `.env.local` line 57: `MONGODB_URI`
2. Verify username/password are correct
3. In Atlas: Database Access → Reset password if needed

### Error: "MongoServerError: namespace already exists"

**Problem:** Collections already exist (this is actually fine!)

**Solution:** The script will skip existing collections. Run `npm run db:verify` to check status.

### Collections exist but no pricing data

**Solution:**
```bash
npm run db:init
```
The script will insert pricing data if missing.

---

## 📋 Manual Setup (If Scripts Fail)

If the automated scripts don't work, follow [MONGODB_SETUP.md](./MONGODB_SETUP.md) for manual Atlas UI setup.

---

## ✅ After Setup

Once database is initialized:

1. **Start the app**
   ```bash
   npm run dev
   ```

2. **Test user signup**
   - Go to http://localhost:3000
   - Sign up with email
   - Check email verification works

3. **Test Stripe integration**
   - Upgrade to Pro plan
   - Verify webhook receives events

4. **Test RAG/AI memory**
   - Upload a document
   - Ask questions about it

5. **Monitor usage**
   - Check limits are being tracked
   - Verify monthly resets work

---

## 🎯 Vector Search Setup (For RAG)

After running the init script, you need to create a vector search index in Atlas UI:

1. Go to MongoDB Atlas
2. Click on **Search** (left sidebar)
3. Click **Create Search Index**
4. Choose **JSON Editor**
5. Settings:
   - Index Name: `vector_index`
   - Database: `saintsal_db`
   - Collection: `documents`
6. Paste this config:
   ```json
   {
     "fields": [
       {
         "type": "vector",
         "path": "embedding",
         "numDimensions": 1536,
         "similarity": "cosine"
       },
       {
         "type": "filter",
         "path": "userId"
       }
     ]
   }
   ```
7. Click **Create**
8. Wait for index to build (2-5 minutes)

---

## 📞 Need Help?

- Check connection: `npm run db:check`
- Verify setup: `npm run db:verify`
- See what exists: Log into Atlas → Browse Collections
- View logs: Check the script output for specific errors

---

## 🎉 Success Checklist

- [ ] Network access configured in Atlas
- [ ] Connection test passes (`npm run db:check`)
- [ ] Database initialized (`npm run db:init`)
- [ ] All checks pass (`npm run db:verify`)
- [ ] Vector search index created
- [ ] App starts without errors (`npm run dev`)
- [ ] User signup works
- [ ] Email verification works
- [ ] Stripe integration works
- [ ] RAG queries work

---

**Your database cluster:** `saintsal-chat.wsoouc.mongodb.net`
**Your database name:** `saintsal_db`
**Required collections:** 6
**Required indexes:** 15+
**Initial seed data:** 3 pricing tiers
