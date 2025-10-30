# Environment Variables Checklist

## ✅ What You Have vs 🔍 What Code Expects

### CRITICAL - NAME MISMATCH:
- ❌ You have: `GOHIGHLEVEL_API_KEY`
- ✅ Code expects: `GHL_API_KEY`
- **ACTION:** Rename in your deployment platform OR update code to use GOHIGHLEVEL_API_KEY

### Core Services (REQUIRED):

| You Have | Code Expects | Status |
|----------|--------------|--------|
| ✓ Anthropic API Key | `ANTHROPIC_API_KEY` | ✅ Match |
| ✓ OpenAI API Key | `OPENAI_API_KEY` | ✅ Match |
| ✓ ElevenLabs API Key | `ELEVENLABS_API_KEY` | ✅ Match |
| ? ElevenLabs Voice ID | `ELEVENLABS_VOICE_ID` | ❓ Check if set |
| ? MongoDB URI | `MONGODB_URI` | ❓ Check if set |
| ? GitHub Client Secret | `GITHUB_CLIENT_SECRET` | ❓ Check if set |
| ✓ GitHub Client ID | `GITHUB_CLIENT_ID` | ✅ Match |

### GoHighLevel Integration:

| You Have | Code Expects | Status |
|----------|--------------|--------|
| `GOHIGHLEVEL_API_KEY` | `GHL_API_KEY` | ❌ MISMATCH |
| `GHL_WEBHOOK_SECRET` | Not used in code | ⚠️ Extra |
| `GHL_WELCOME_WORKFLOW_ID` | Not used in code | ⚠️ Extra |
| Not set? | `GHL_LOCATION_ID` | ❓ Missing |

### Variables NOT Used by Code:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `AGENT_PHONE_NUMBER`
- `AGENT_EMAIL`
- `UPSTASH_VECTOR_REST_URL`
- `UPSTASH_VECTOR_REST_TOKEN`

(These might be from another project or for future features)

## 🔧 FIXES NEEDED:

### Option 1: Update Deployment Platform (Recommended)
Rename in Vercel/Azure:
```
GOHIGHLEVEL_API_KEY → GHL_API_KEY
```

### Option 2: Update Code
Change the code to use `GOHIGHLEVEL_API_KEY` instead of `GHL_API_KEY`

## 🎯 Missing Variables to Check:

Please verify you have these set in your deployment platform:
1. `MONGODB_URI` - MongoDB connection string
2. `GITHUB_CLIENT_SECRET` - GitHub OAuth secret
3. `ELEVENLABS_VOICE_ID` - ElevenLabs voice ID
4. `GHL_LOCATION_ID` - GoHighLevel location ID (if using GHL)

## 📍 Current Domain Config:
- `GITHUB_CALLBACK_URL` → `https://pay.saintsal.ai/api/github/callback`
- `NEXT_PUBLIC_APP_URL` → `https://pay.saintsal.ai`

Make sure these match in your deployment platform!
