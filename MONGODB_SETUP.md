# MongoDB Atlas Manual Setup Guide

## Current Status
- ❌ **Database:** saintsal_db (NOT CREATED YET)
- ❌ **Collections:** 0 out of 6 required

## Required Collections

Your application needs these collections to function:

1. **users** - User authentication, email verification, subscriptions
2. **pricing** - Plan tiers (free, pro, enterprise)
3. **messages** - Chat history and conversation logs
4. **documents** - RAG/vector storage for extended AI memory
5. **teams** - Team collaboration features
6. **team_invitations** - Team member invitations

---

## Setup Instructions

### Step 1: Create Database

1. In Atlas, click **"Browse Collections"** (green button)
2. Click **"+ Create Database"**
3. Database name: `saintsal_db`
4. Collection name: `users`
5. Click **Create**

### Step 2: Create Remaining Collections

Once in `saintsal_db`, click **"+"** or **"Create Collection"** for each:

- `pricing`
- `messages`
- `documents`
- `teams`
- `team_invitations`

### Step 3: Create Indexes (IMPORTANT for Performance)

For each collection, click on it → **Indexes** tab → **Create Index**

#### users collection:
```json
{ "email": 1 }
```
Options: ☑️ Unique

```json
{ "createdAt": -1 }
```

```json
{ "teamId": 1 }
```

#### messages collection:
```json
{ "timestamp": -1 }
```

```json
{ "userId": 1 }
```

#### documents collection (RAG):
```json
{ "userId": 1 }
```

```json
{ "createdAt": -1 }
```

#### teams collection:
```json
{ "ownerId": 1 }
```

```json
{ "createdAt": -1 }
```

#### team_invitations collection:
```json
{ "email": 1 }
```

```json
{ "teamId": 1 }
```

```json
{ "token": 1 }
```
Options: ☑️ Unique

```json
{ "status": 1 }
```

```json
{ "expiresAt": 1 }
```

### Step 4: Insert Pricing Data

Go to `pricing` collection → **Insert Document** (3 times)

**Document 1 (Free Plan):**
```json
{
  "name": "free",
  "displayName": "Free",
  "price": 0,
  "limits": {
    "messagesPerMonth": 50,
    "voiceMinutesPerMonth": 10,
    "ragQueriesPerMonth": 20,
    "maxFileSize": 5
  },
  "features": [
    "Basic chat with GPT-4o mini",
    "50 messages per month",
    "10 voice minutes per month",
    "Basic RAG support",
    "Community support"
  ]
}
```

**Document 2 (Pro Plan):**
```json
{
  "name": "pro",
  "displayName": "Pro",
  "price": 29,
  "limits": {
    "messagesPerMonth": 1000,
    "voiceMinutesPerMonth": 200,
    "ragQueriesPerMonth": 500,
    "maxFileSize": 50
  },
  "teamLimits": {
    "messagesPerMonth": 5000,
    "voiceMinutesPerMonth": 1000,
    "ragQueriesPerMonth": 2500,
    "maxFileSize": 100,
    "maxMembers": 10
  },
  "features": [
    "Unlimited chat with all models",
    "1,000 messages per month (individual)",
    "200 voice minutes per month (individual)",
    "Advanced RAG with vector search",
    "Walkie Talkie mode",
    "Model playground",
    "Team collaboration (up to 10 members)",
    "Priority support"
  ]
}
```

**Document 3 (Enterprise Plan):**
```json
{
  "name": "enterprise",
  "displayName": "Enterprise",
  "price": 199,
  "limits": {
    "messagesPerMonth": -1,
    "voiceMinutesPerMonth": -1,
    "ragQueriesPerMonth": -1,
    "maxFileSize": 500
  },
  "teamLimits": {
    "messagesPerMonth": -1,
    "voiceMinutesPerMonth": -1,
    "ragQueriesPerMonth": -1,
    "maxFileSize": 1000,
    "maxMembers": -1
  },
  "features": [
    "Everything in Pro",
    "Unlimited usage",
    "Unlimited team members",
    "Custom integrations",
    "Dedicated support",
    "GoHighLevel CRM integration",
    "White-label options",
    "Custom AI training"
  ]
}
```

### Step 5: Set Up Vector Search (For RAG/AI Memory)

1. Go to **Search** tab (left sidebar)
2. Click **Create Search Index**
3. Select **JSON Editor**
4. Index Name: `vector_index`
5. Database: `saintsal_db`
6. Collection: `documents`
7. Paste this configuration:

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

8. Click **Create**

---

## Verify Setup

Your `saintsal_db` should now have:
- ✅ 6 collections
- ✅ Multiple indexes per collection
- ✅ 3 pricing tier documents
- ✅ 1 vector search index

## Test Connection

Run this to verify the app can connect:
```bash
npm run dev
```

Then try to sign up a new user!

---

## Automated Setup (Alternative)

If you fix network access in Atlas:
1. Go to **Security → Network Access**
2. Click **Add IP Address**
3. Either add your IP or click **Allow Access from Anywhere** (0.0.0.0/0)
4. Then run: `npx tsx scripts/init-mongodb.ts`
