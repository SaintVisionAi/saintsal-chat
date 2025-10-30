# 🔍 How to Find "Network Access" in MongoDB Atlas

## You're looking for this in the WRONG place!

### Step-by-Step with Screenshots Reference:

1. **Go to:** https://cloud.mongodb.com

2. **Make sure you're on the correct project:**
   - Look at the top of the page
   - Should say your project name (probably "saintsal-chat" or similar)

3. **Look at the LEFT SIDEBAR** - You should see:
   ```
   ┌─────────────────────────┐
   │ Overview                │
   │ Data Services           │  ← Don't click this
   │   Database              │
   │   Search                │
   │   Data Federation       │
   │ Security                │  ← CLICK THIS!
   │ Settings                │
   │ Integrations            │
   └─────────────────────────┘
   ```

4. **Click "Security" in the left sidebar**

5. **After clicking Security, you'll see TWO tabs:**
   ```
   ┌────────────────────┬────────────────────┐
   │ Database Access    │  Network Access    │ ← CLICK THIS TAB!
   └────────────────────┴────────────────────┘
   ```

6. **Once on "Network Access" tab, you'll see:**
   - A list of allowed IP addresses (probably empty or very few)
   - A green button: **"+ ADD IP ADDRESS"**

---

## If You DON'T See "Security" in the Sidebar:

### Option A: You might be in the wrong view
- Click on your **organization name** at the top left
- Select the correct **project**
- Then look for Security again

### Option B: You might not have permissions
- You need to be a **Project Owner** or **Org Owner** to see Security
- Ask whoever created the MongoDB account to:
  1. Add you as Project Owner, OR
  2. Do this step for you

### Option C: Different Atlas UI Version
Some older/newer UI versions have different navigation:

**Old UI:**
- Security → IP Whitelist (instead of Network Access)

**New UI:**
- Security → Network Access

**Newest UI:**
- Left sidebar → Security (scroll down) → Network Access

---

## What You Should See After Finding It:

```
Network Access
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[+ ADD IP ADDRESS]  [+ ADD PRIVATE ENDPOINT]

IP Access List
┌──────────────────────┬──────────┬────────────┐
│ IP Address           │ Status   │ Comment    │
├──────────────────────┼──────────┼────────────┤
│ (probably empty)     │          │            │
└──────────────────────┴──────────┴────────────┘
```

---

## Once You Find It:

1. Click **"+ ADD IP ADDRESS"** (green button)
2. You'll see a modal with options:
   - ⭐ **"ALLOW ACCESS FROM ANYWHERE"** ← Click this!
   - Or "Add Current IP Address"
   - Or "Add IP Address" (manual)
3. If you clicked "ALLOW ACCESS FROM ANYWHERE":
   - It will show: `0.0.0.0/0`
   - This allows connections from any IP
4. Add a comment: "Development access"
5. Click **"Confirm"**
6. **WAIT 1-2 MINUTES** for it to propagate

---

## Still Can't Find It?

### Take a Screenshot and Share:
- Take a screenshot of your ENTIRE MongoDB Atlas screen
- Show me what you see in the left sidebar
- I'll tell you exactly where to click

### Alternative - Check Current Status:
You can see if network access is already configured by running:
```bash
npm run db:check
```

If you get:
- ❌ "ECONNREFUSED" or "querySrv" error → Network access NOT configured
- ✅ "CONNECTION SUCCESSFUL" → Network access IS configured (you're good!)

---

## Quick Test (Do This First!):

Before searching for Network Access, try running:
```bash
npm run db:check
```

**If it works** → You don't need to change network access!
**If it fails** → Then we need to find and configure Network Access
