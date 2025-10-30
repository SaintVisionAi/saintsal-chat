# 🔧 SaintSal Chat - Complete Setup Fix Guide

## 🚨 Critical Issues Identified

1. **Missing `.env.local` file** - The app cannot run without environment variables
2. **MongoDB not initialized** - Collections and indexes need to be created
3. **Auth flow not tested** - Need to verify login → pricing → playground flow

---

## 🎯 Quick Fix (5 minutes)

### Step 1: Create `.env.local` File

```bash
# Copy the template
cp .env.example .env.local
```

Then edit `.env.local` and add your actual values. Since you said the keys are fine, you should have these:

```env
# MongoDB (REQUIRED)
MONGODB_URI=mongodb+srv://your-actual-connection-string
MONGODB_DB=saintsal_db

# AI APIs (REQUIRED)
OPENAI_API_KEY=sk-your-actual-openai-key
ANTHROPIC_API_KEY=sk-ant-your-actual-anthropic-key

# Voice (Optional but recommended)
ELEVENLABS_API_KEY=your-actual-elevenlabs-key

# OAuth (if using)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Initialize MongoDB

```bash
# This creates all required collections and indexes
node -e "import('./lib/mongodb-schema.js').then(m => m.initializeMongoDB())"
```

Expected output:
```
Created users collection
Created pricing collection
Created messages collection
Created documents collection
Created user indexes
Created message indexes
Created document indexes
Inserted pricing tiers
MongoDB initialization complete!
```

### Step 3: Start Dev Server

```bash
npm run dev
```

Should see:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
- Ready in 2.5s
```

### Step 4: Test Auth Flow

Open your browser to `http://localhost:3000` and:

1. **Sign Up** → Should create account and redirect to pricing
2. **Choose Plan** → Should save plan and redirect to playground/warroom
3. **Login** → Should authenticate and maintain session
4. **Send Message** → Should work without 401 errors

---

## 🐛 Common Setup Issues & Fixes

### Issue: "Missing MONGODB_URI in environment"
**Cause**: No `.env.local` file
**Fix**:
```bash
# Create .env.local from template
cp .env.example .env.local
# Edit and add your actual MongoDB URI
nano .env.local  # or use your editor
```

### Issue: "Cannot find module"
**Cause**: Dependencies not installed
**Fix**:
```bash
npm install
```

### Issue: "User not found" on login
**Cause**: MongoDB not initialized or wrong database name
**Fix**:
1. Check `MONGODB_DB=saintsal_db` in `.env.local`
2. Run MongoDB init script
3. Verify collections exist in MongoDB Atlas

### Issue: OAuth redirect mismatch
**Cause**: Provider callback URLs don't match
**Fix**:

**GitHub** (https://github.com/settings/developers):
- Authorization callback URL: `http://localhost:3000/api/github/callback`
- For production: `https://yourdomain.com/api/github/callback`

**Google** (https://console.cloud.google.com/apis/credentials):
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/oauth/google/callback`
  - `https://yourdomain.com/api/auth/oauth/google/callback`

### Issue: 401 on /api/chat or /api/playground
**Cause**: Cookie not being sent or session expired
**Fix**:
1. Check browser DevTools > Application > Cookies
2. Look for `saintsal_auth` cookie
3. If missing, logout and login again
4. Check cookie domain matches (localhost vs 127.0.0.1)

### Issue: "Message limit exceeded"
**Cause**: Free tier limits (50 messages/month)
**Fix**:
1. Upgrade to Pro plan
2. Or reset usage in MongoDB:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  {
    $set: {
      "usage.messagesThisMonth": 0,
      "usage.lastReset": new Date()
    }
  }
)
```

---

## 🔍 Auth Flow Debugging

### Expected Flow

```
1. User visits site (/)
   ↓
2. Not logged in → Redirect to /signin
   ↓
3. User signs up/logs in
   - POST /api/auth/signup or /api/auth/login
   - Server sets `saintsal_auth` cookie
   ↓
4. Redirect to /pricing
   - User sees: Free, Pro, Enterprise
   ↓
5. User selects plan
   - Updates user.plan in MongoDB
   - Redirect to /playground or /warroom
   ↓
6. Protected page loads
   - GET /api/auth/check (verifies cookie)
   - Returns user info if authenticated
   ↓
7. User sends message
   - POST /api/chat (with cookie)
   - Checks usage limits
   - Returns streaming response
```

### Check Each Step

#### Step 1: Check Auth Status
```bash
curl http://localhost:3000/api/auth/check
# Should return: {"authenticated": false}
```

#### Step 2: Create Test User (if needed)
Go to MongoDB Atlas → Browse Collections → users → Insert Document:
```json
{
  "email": "test@saintsal.ai",
  "name": "Test User",
  "password": "$2a$10$...",  // bcrypt hash of "test123"
  "plan": "pro",
  "limits": {
    "messagesPerMonth": 1000,
    "voiceMinutesPerMonth": 200,
    "ragQueriesPerMonth": 500,
    "maxFileSize": 50
  },
  "usage": {
    "messagesThisMonth": 0,
    "voiceMinutesThisMonth": 0,
    "ragQueriesThisMonth": 0,
    "lastReset": {"$date": "2025-10-30T00:00:00.000Z"}
  },
  "createdAt": {"$date": "2025-10-30T00:00:00.000Z"}
}
```

#### Step 3: Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@saintsal.ai","password":"test123"}' \
  -c cookies.txt -v
```

Should return:
- Status: 200
- Body: `{"success":true,"user":{...}}`
- Headers: `Set-Cookie: saintsal_auth=...`

#### Step 4: Verify Auth
```bash
curl http://localhost:3000/api/auth/check -b cookies.txt
```

Should return:
```json
{
  "authenticated": true,
  "user": {
    "name": "Test User",
    "email": "test@saintsal.ai",
    "plan": "pro"
  }
}
```

#### Step 5: Test Chat
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","model":"gpt-4o-mini","stream":false}' \
  -b cookies.txt
```

Should return streaming response or JSON with AI response.

---

## 🌐 Browser DevTools Checklist

### 1. Network Tab
- [x] Filter by "XHR" or "Fetch"
- [x] Click on `/api/auth/check`
  - Status should be 200
  - Response should show `"authenticated": true`
- [x] Click on `/api/chat` or `/api/playground`
  - Request Headers should include `Cookie: saintsal_auth=...`
  - Status should be 200 (not 401)

### 2. Console Tab
- [x] No errors about missing cookies
- [x] No CORS errors
- [x] No "Authentication required" errors

### 3. Application Tab
- [x] Cookies → http://localhost:3000
  - `saintsal_auth` should exist
  - Value should be a valid MongoDB ObjectId
  - Domain should be `localhost`
  - Path should be `/`
  - HttpOnly should be checked

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] `.env` file on server has all required variables
- [ ] `MONGODB_URI` points to production database
- [ ] `NEXT_PUBLIC_APP_URL` is set to production domain
- [ ] OAuth redirect URIs updated in provider consoles
- [ ] MongoDB collections and indexes created
- [ ] Pricing tiers populated
- [ ] Test user created for testing
- [ ] SSL/HTTPS enabled
- [ ] Cookies work across domains
- [ ] CORS configured if using separate domains

---

## 🚀 Production OAuth Setup

### GitHub
1. Go to https://github.com/settings/developers
2. Create new OAuth App or edit existing
3. Set Authorization callback URL:
   - Dev: `http://localhost:3000/api/github/callback`
   - Prod: `https://saintsal.ai/api/github/callback`
4. Copy Client ID and Secret to `.env`

### Google
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add Authorized redirect URIs:
   - Dev: `http://localhost:3000/api/auth/oauth/google/callback`
   - Prod: `https://saintsal.ai/api/auth/oauth/google/callback`
4. Copy Client ID and Secret to `.env`

### Microsoft
1. Go to https://portal.azure.com
2. Azure Active Directory → App registrations
3. Add Redirect URIs:
   - Dev: `http://localhost:3000/api/auth/oauth/microsoft/callback`
   - Prod: `https://saintsal.ai/api/auth/oauth/microsoft/callback`
4. Copy Application (client) ID and Secret to `.env`

---

## 🎯 Next Steps After Setup

1. **Test the full flow**:
   - [ ] Sign up new account
   - [ ] Get redirected to pricing
   - [ ] Select a plan
   - [ ] Get redirected to playground
   - [ ] Send a test message
   - [ ] Verify response works

2. **Test edge cases**:
   - [ ] Logout and login again
   - [ ] Try to access protected page without login (should redirect)
   - [ ] Hit message limit (if on free plan)
   - [ ] Upgrade plan

3. **Check integrations**:
   - [ ] GitHub OAuth
   - [ ] Google OAuth
   - [ ] Voice features
   - [ ] RAG search

4. **Production deploy**:
   - [ ] Update environment variables on hosting platform
   - [ ] Update OAuth redirect URIs
   - [ ] Test production auth flow
   - [ ] Monitor logs for errors

---

## 📞 Need Help?

If you're still seeing issues:

1. Check server logs: `npm run dev` output
2. Check browser console for errors
3. Check Network tab for failed requests
4. Verify MongoDB connection in Atlas
5. Test with curl commands from this guide

**Generated**: 2025-10-30
**Status**: Ready to implement
