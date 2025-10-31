# 🔥 SMOKE IT OUT - COMPREHENSIVE TEST PLAN
## SaintSal™ Chat Platform - CLAUDE CAP LEVEL TESTING

**Branch:** `claude/session-011CUZWjQwnZ5N9eDhz4cfmC`
**Date:** 2025-10-29
**Test Engineer:** You + Claude

---

## 🎯 PRE-TEST CHECKLIST
- [ ] Git pulled latest changes
- [ ] `npm install` run (if package.json changed)
- [ ] `npm run dev` running on localhost:3000
- [ ] Browser DevTools open (Console + Network tabs)
- [ ] Mobile view enabled (81% of users are mobile!)

---

## 🧪 TEST SUITE A - WALKIE TALKIE VOICE SYSTEM

### A1: Cookin' Knowledge Logo Animation
**Route:** `/` → Click "Walkie Talkie" in sidebar
**Expected:**
- [ ] Logo appears when clicking the button and speaking
- [ ] Golden glow pulse animation while AI processes
- [ ] Logo URL: `https://image2url.com/images/1761721248098-5fa26a0f-2749-420e-9c93-982f257e4b9e.png`
- [ ] "Cookin' Your Answer..." text displays during processing

**Test Steps:**
1. Press and hold the big circular button
2. Speak: "Tell me about SaintSal"
3. Release button
4. **OBSERVE:** Logo should pulse with golden glow
5. **OBSERVE:** Text streams to screen in real-time
6. **OBSERVE:** Voice plays through speakers

**Success Criteria:**
✅ Logo pulses while processing
✅ Text appears BEFORE voice starts playing
✅ Voice plays smoothly without cutting off
✅ Console shows: `🎤 [WALKIE] Starting speech-to-text...`

### A2: Real-Time Streaming
**Expected:**
- [ ] User speech converts to text (Whisper API)
- [ ] AI response streams token-by-token to screen
- [ ] Text visible WHILE voice is generating
- [ ] ElevenLabs voice plays after streaming complete

**Console Logs to Check:**
```
🎤 [WALKIE] Starting speech-to-text...
✅ [WALKIE] STT complete: [your speech]
💬 [WALKIE] Starting chat streaming...
✅ [WALKIE] Streaming complete, playing TTS...
```

---

## 🧪 TEST SUITE B - MODEL COMPARISON (WHITELABELING)

### B1: SaintSal™ Branded Models
**Route:** `/` → Click "Model Comparison" in sidebar
**Expected:**
- [ ] Full-screen layout (not half screen!)
- [ ] 5 models all branded as "SaintSal™ [Function]":
  - SaintSal™ Knowledge (Blue brain icon)
  - SaintSal™ Speed (Green zap icon)
  - SaintSal™ Business (Purple sparkles icon)
  - SaintSal™ Code (Orange code icon)
  - SaintSal™ Voice (Yellow mic icon)

**Test Steps:**
1. Select all 5 models
2. Type prompt: "Explain quantum computing"
3. Click "Compare Models"
4. **OBSERVE:** All 5 responses stream simultaneously

**Success Criteria:**
✅ No mention of "GPT", "Claude", "Grok", or "ElevenLabs"
✅ Only "SaintSal™" branding visible
✅ Responses stream in real-time

### B2: File Upload Feature
**Expected:**
- [ ] File upload button visible
- [ ] Supports images and text files
- [ ] Multiple file support
- [ ] Files display with preview/icon

**Test Steps:**
1. Click "Upload Files" button
2. Upload an image file
3. Upload a .txt file
4. Type prompt: "Analyze these files"
5. **OBSERVE:** Files appear in the UI
6. **OBSERVE:** Models can reference the files in responses

### B3: Auto-Image Rendering
**Expected:**
- [ ] Image URLs in responses render as actual images
- [ ] Supports: jpg, jpeg, png, gif, webp, svg

**Test Steps:**
1. Type prompt: "Generate an image URL example"
2. If response contains image URL, **OBSERVE:** it renders as `<img>` tag
3. No broken image icons (error handling works)

**Success Criteria:**
✅ Images display inline
✅ Broken images are hidden
✅ Text before/after images displays correctly

---

## 🧪 TEST SUITE C - TEAM MANAGEMENT SYSTEM

### C1: Team Creation
**Route:** `/` → Click "Teams" in sidebar
**Expected:**
- [ ] Mobile-first UI (large touch targets)
- [ ] Create team button prominent
- [ ] Pro/Enterprise plan selection

**Test Steps:**
1. Click "Create Team"
2. Enter team name: "Test Team Alpha"
3. Select plan: "Pro"
4. Click submit
5. **OBSERVE:** Team created successfully
6. **OBSERVE:** You're listed as "Owner"

**Success Criteria:**
✅ Team appears in sidebar
✅ Owner badge visible
✅ Usage tracking shows 0/5000 messages

### C2: Team Invitations (WITH EMAIL!)
**Expected:**
- [ ] Invite team member form
- [ ] Email sent automatically via Resend API
- [ ] Beautiful HTML email template
- [ ] Invitation link works

**Test Steps:**
1. Click "Invite Member"
2. Enter email: `test@example.com` (or your real email!)
3. Select role: "Admin"
4. Click "Send Invitation"
5. **CHECK EMAIL INBOX** for invitation email
6. **OBSERVE:** Email has:
   - SaintSal™ gradient branding
   - Team name
   - Your name as inviter
   - "Accept Invitation" button with working link

**Console Log to Check:**
```
📧 [EMAIL] Sending team invitation to test@example.com
✅ [EMAIL] Email sent successfully via Resend
```

### C3: Team Invitation Acceptance
**Route:** Click link from invitation email
**Expected:**
- [ ] Beautiful acceptance page with gradient design
- [ ] Shows team name and inviter
- [ ] "Accept" button works
- [ ] Redirects to dashboard after accepting

**Test Steps:**
1. Open invitation link from email
2. Click "Accept Invitation"
3. **OBSERVE:** Added to team
4. **OBSERVE:** Team appears in your sidebar
5. **OBSERVE:** Role badge shows "Admin"

### C4: Usage Tracking
**Expected:**
- [ ] Real-time usage bars
- [ ] Color-coded progress (green → yellow → red)
- [ ] Team-wide limits shared across members

**Test Steps:**
1. Send a message in chat
2. Go to Teams page
3. **OBSERVE:** Messages count increased (e.g., 1/5000)
4. **OBSERVE:** Progress bar updated
5. **OBSERVE:** Percentage calculated correctly

**Success Criteria:**
✅ Usage increments immediately
✅ All team members see same usage
✅ Limits enforced (can't exceed)

---

## 🧪 TEST SUITE D - RAG VECTOR SEARCH

### D1: Vector Search Integration
**Route:** Any chat interface
**Expected:**
- [ ] Relevant documents retrieved from MongoDB
- [ ] Vector similarity scores shown in logs
- [ ] Context injected into AI responses

**Test Steps:**
1. Upload a document via file upload
2. Ask a question about the document
3. **CHECK CONSOLE:** Should see:
   ```
   🔍 [RAG] Starting vector search...
   📊 [RAG] Creating embedding for query...
   ✅ [RAG] Found 5 relevant documents
   📄 [RAG] Doc 1: Score 0.875
   ```
4. **OBSERVE:** AI response references the document

**Success Criteria:**
✅ Vector search executes
✅ Relevant docs found
✅ AI uses context from docs

---

## 🧪 TEST SUITE E - PRODUCTION PAGES

### E1: Pricing Page
**Route:** `/pricing`
**Expected:**
- [ ] 3 tiers: Free, Pro, Enterprise
- [ ] Team limits shown for Pro (10 members) and Enterprise (unlimited)
- [ ] Stripe integration working
- [ ] Contact links use `mailto:ryan@cookinknowledge.com`

**Test Steps:**
1. Visit `/pricing`
2. Click "Contact Sales" → should open email client
3. **OBSERVE:** No broken `/contact` links
4. **OBSERVE:** Team features highlighted

### E2: Terms & Privacy
**Routes:** `/terms`, `/privacy`
**Expected:**
- [ ] Pages load successfully
- [ ] Contact links fixed (no 404s)
- [ ] Professional formatting

---

## 🧪 TEST SUITE F - MOBILE OPTIMIZATION

### F1: Mobile Responsiveness
**Device:** Test on actual mobile or DevTools mobile view
**Expected:**
- [ ] Touch-friendly buttons (min 44x44px)
- [ ] Bottom sheet modals
- [ ] No horizontal scrolling
- [ ] Text readable without zooming

**Test Routes:**
- `/` (Main chat)
- Model Comparison
- Walkie Talkie
- Teams page

**Success Criteria:**
✅ Everything accessible with thumb
✅ No tiny tap targets
✅ Modals slide up from bottom

---

## 🧪 TEST SUITE G - ERROR HANDLING

### G1: Rate Limiting
**Expected:**
- [ ] Message limit enforced (Free: 100/month)
- [ ] Error message shown when limit exceeded
- [ ] Upgrade prompt displayed

**Test Steps:**
1. Create free account
2. Send 101 messages
3. **OBSERVE:** "Message limit exceeded" error
4. **OBSERVE:** Upgrade button appears

### G2: Failed API Calls
**Expected:**
- [ ] Graceful fallback when APIs fail
- [ ] User-friendly error messages
- [ ] No white screen of death

**Test Steps:**
1. Temporarily disconnect internet
2. Try to send a chat message
3. **OBSERVE:** Error message appears
4. **OBSERVE:** UI doesn't crash

---

## 📊 FINAL SCORECARD

### Critical Features (MUST PASS)
- [ ] WalkieTalkie voice streaming works
- [ ] Cookin' Knowledge logo pulses
- [ ] Text streams before voice plays
- [ ] Model Comparison whitelabeled (no GPT/Claude/Grok branding)
- [ ] Team invitations send emails
- [ ] Team members can join successfully

### High Priority (SHOULD PASS)
- [ ] File uploads work
- [ ] Auto-image rendering works
- [ ] RAG vector search works
- [ ] Usage tracking accurate
- [ ] Mobile responsive

### Nice to Have (COULD PASS)
- [ ] Error handling graceful
- [ ] Rate limiting enforced
- [ ] All console logs clean

---

## 🔥 SMOKE TEST RESULTS

**Overall Status:** [ ] PASSED | [ ] FAILED | [ ] PARTIAL
**Date Tested:** __________
**Tester:** __________
**Environment:** [ ] Dev | [ ] Staging | [ ] Production

**Notes:**
_______________________________________________________
_______________________________________________________
_______________________________________________________

---

## 🚀 DEPLOYMENT CHECKLIST (AFTER SMOKE TEST PASSES)

- [ ] All tests passed
- [ ] No console errors
- [ ] Build completes successfully
- [ ] Environment variables set on production
- [ ] MongoDB connection string correct
- [ ] API keys configured (OpenAI, ElevenLabs, Resend)
- [ ] Push to main branch
- [ ] Deploy to Vercel/production
- [ ] Test on live URL
- [ ] Celebrate! 🎉

---

**Remember:** We're testing at CLAUDE CAP LEVEL! That means:
- ✅ Every feature works flawlessly
- ✅ No bugs, no excuses
- ✅ Production-ready quality
- ✅ SaintSal™ excellence across the board

**LET'S SMOKE IT OUT! 🔥**
