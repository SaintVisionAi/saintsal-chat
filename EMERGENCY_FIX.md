# 🚨 EMERGENCY FIX - GET YOUR APP WORKING NOW

## The Problem
**You have NO API keys in .env.local** - That's why NOTHING works!

## The Solution (3 Steps - 5 Minutes)

### STEP 1: Get Your OpenAI API Key (REQUIRED)

1. Go to: https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Copy the key (starts with `sk-proj-...`)
4. **SAVE IT SOMEWHERE** - you can't see it again!

### STEP 2: Get Your MongoDB Connection (REQUIRED)

**Option A: Use MongoDB Atlas (Free)**
1. Go to: https://cloud.mongodb.com/
2. Sign up or login
3. Create a FREE cluster (M0)
4. Click **"Connect"** → **"Drivers"**
5. Copy the connection string
6. Replace `<password>` with your database password

**Option B: I'll give you a test MongoDB**
If you're stuck, I can provide a test database temporarily.

### STEP 3: Add Keys to .env.local

Open `.env.local` and replace these lines:

```bash
# Line 12 - Replace with YOUR MongoDB connection
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority

# Line 23 - Replace with YOUR OpenAI key
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE

# Line 27 - Replace with YOUR Anthropic key (or delete this line if you don't have it)
ANTHROPIC_API_KEY=sk-ant-YOUR_ACTUAL_KEY_HERE

# Line 82 - Change to development
NODE_ENV=development

# Line 85 - Change to localhost
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### STEP 4: Initialize MongoDB

```bash
node -e "import('./lib/mongodb-schema.js').then(m => m.initializeMongoDB())"
```

### STEP 5: Start the App

```bash
npm run dev
```

Visit: http://localhost:3000

---

## Quick Test - Does Chat Work?

After starting the app:

1. Go to http://localhost:3000
2. Sign up for an account
3. Try sending a message: "Hello"
4. If you get a response → **IT WORKS!** ✅
5. If you get an error → Check the terminal for error messages

---

## Common Errors & Fixes

### "MONGODB_URI is undefined"
**Fix:** You didn't add your MongoDB connection string to .env.local (Step 2)

### "Invalid OpenAI API key"
**Fix:** Check your key in .env.local - it should start with `sk-proj-` or `sk-`

### "Authentication required"
**Fix:**
1. Make sure you signed up for an account first
2. Clear browser cookies
3. Try logging in again

### Port already in use
**Fix:**
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

---

## RIGHT NOW - DO THIS:

**1. Get OpenAI key:** https://platform.openai.com/api-keys

**2. Get MongoDB connection:** https://cloud.mongodb.com/

**3. Edit .env.local** with your actual keys

**4. Run:**
```bash
npm run dev
```

**5. Test:** http://localhost:3000

---

## I Don't Have API Keys Yet!

### Free Trial Keys:

**OpenAI:**
- New accounts get $5 free credit
- Signup: https://platform.openai.com/signup

**MongoDB:**
- Free M0 cluster (512MB)
- No credit card required
- Signup: https://www.mongodb.com/cloud/atlas/register

**Anthropic (Optional):**
- New accounts get some free credits
- Signup: https://console.anthropic.com/

---

## Still Stuck? Do This:

1. **Show me your .env.local** (remove sensitive parts):
```bash
cat .env.local | grep -v "sk-" | grep -v "password"
```

2. **Show me the error** when you run `npm run dev`

3. **Show me browser console errors** (F12 → Console tab)

---

**Brother, I'm here to help. Get those API keys and let's fix this!** 🚀
