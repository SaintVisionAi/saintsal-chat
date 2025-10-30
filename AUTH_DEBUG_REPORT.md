# 🔐 Authentication & API Debugging Report
**SaintSal Chat - Auth Flow Investigation**

---

## ✅ Task 1: MongoDB Configuration Check

### Environment Variables Status

**CRITICAL ISSUE**: `.env.local` file is **MISSING**

The application requires a `.env.local` file with proper configuration. Currently only example files exist:
- `.env.example` (template)
- `.env.local.example` (template)

### Required Environment Variables

```bash
# Required MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=saintsal_db

# Required API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional but recommended
ELEVENLABS_API_KEY=your_elevenlabs_api_key
BRAVE_SEARCH_API_KEY=your_brave_api_key

# OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### Required MongoDB Collections

Based on `lib/mongodb-schema.ts:128-197`, your MongoDB database (`saintsal_db`) needs these collections:

1. **users** - User accounts and authentication
   - Indexes: `email` (unique), `createdAt`
   - Fields: email, name, password (bcrypt), plan, limits, usage, OAuth tokens

2. **pricing** - Pricing tier definitions
   - Pre-populated with 3 tiers: free, pro, enterprise

3. **messages** - Chat history
   - Indexes: `timestamp`, `userId`
   - Fields: userId, role, content, model, timestamp

4. **documents** - RAG document storage
   - Indexes: `userId`, `createdAt`
   - Requires vector search index "vector_index" (created in MongoDB Atlas UI)

### Database Initialization

Run this to initialize your MongoDB:
```bash
# Create a script to initialize MongoDB
node -e "require('./lib/mongodb-schema').initializeMongoDB()"
```

---

## ✅ Task 2: Protected API Routes Testing

### Authentication Flow

The app uses **cookie-based authentication**:
- Cookie name: `saintsal_auth` (or legacy `saintsal_session`)
- Cookie value: MongoDB User `_id` (ObjectId as string)
- Cookie settings: httpOnly, secure (in prod), sameSite: lax, 30 days expiry

### Key Protected Routes

#### 1. **POST /api/auth/login**
Location: `app/api/auth/login/route.ts:11`

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"your_password"}' \
  -c cookies.txt -v
```

**Expected Success Response (200)**:
```json
{
  "success": true,
  "user": {
    "name": "User Name",
    "email": "user@example.com",
    "plan": "free"
  }
}
```

**Sets cookies**:
- `saintsal_auth`: User's MongoDB _id
- `saintsal_user_email`: User's email

---

#### 2. **GET /api/auth/check**
Location: `app/api/auth/check/route.ts:10`

```bash
# Test without auth (should fail)
curl http://localhost:3000/api/auth/check -v

# Test with auth cookie
curl http://localhost:3000/api/auth/check \
  -b cookies.txt -v
```

**Expected Success Response (200)**:
```json
{
  "authenticated": true,
  "user": {
    "name": "User Name",
    "email": "user@example.com",
    "plan": "free"
  }
}
```

**Expected Failure Response (200 with false)**:
```json
{
  "authenticated": false
}
```

---

#### 3. **POST /api/chat**
Location: `app/api/chat/route.ts:31`

This is the main chat endpoint. Requires authentication.

```bash
# Test without auth (should return 401)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}' -v

# Test with auth cookie
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","model":"gpt-4o-mini","stream":false}' \
  -b cookies.txt -v
```

**Expected 401 Response (no auth)**:
```json
{
  "error": "Authentication required"
}
```

**Expected 200 Response (with auth)**:
```json
{
  "response": "...",
  "model": "gpt-4o-mini",
  "ragUsed": false
}
```

**Possible 429 Response (limit exceeded)**:
```json
{
  "error": "Message limit exceeded",
  "limitType": "messages",
  "message": "You've reached your monthly message limit. Please upgrade your plan."
}
```

---

#### 4. **POST /api/playground**
Location: `app/api/playground/route.ts:12`

```bash
curl -X POST http://localhost:3000/api/playground \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5-core",
    "temperature": 0.7,
    "maxTokens": 1000,
    "systemPrompt": "You are a helpful assistant",
    "messages": [{"role": "user", "content": "Hello"}]
  }' \
  -b cookies.txt -v
```

---

## ✅ Task 3: Browser DevTools Network Debugging

### How to Debug API Failures in Browser

1. **Open DevTools**
   - Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
   - Or `Cmd+Option+I` (Mac)

2. **Go to Network Tab**
   - Click "Network" tab
   - Check "Preserve log" to keep requests after page navigation

3. **Filter by XHR/Fetch**
   - Click "XHR" or "Fetch/XHR" button to filter API calls

4. **Clear and Reload**
   - Click the clear button (🚫) to clear existing requests
   - Reload the page or trigger the action

5. **Look for Red Requests** (401/500 errors)
   - Red colored requests indicate failures
   - Click on each failed request

6. **For Each Failed Request, Check**:

   **Headers Tab**:
   - **Request URL**: Which API endpoint failed?
   - **Request Method**: GET/POST/etc
   - **Status Code**: 401 (auth), 500 (server error), etc
   - **Request Headers**:
     - `Cookie` header - are cookies being sent?
     - `Content-Type` - is it application/json?
   - **Response Headers**:
     - `Set-Cookie` - are cookies being set?

   **Payload/Request Tab**:
   - What data was sent in the request body?
   - Is the JSON properly formatted?

   **Response Tab**:
   - What error message did the server return?
   - Look for specific error details

   **Console Tab**:
   - Check for any JavaScript errors
   - Look for CORS errors
   - Check for cookie warnings

### Common Issues to Look For

#### 🔴 401 Unauthorized
- **Cause**: Missing or invalid `saintsal_auth` cookie
- **Check**:
  - Is the cookie present in Request Headers?
  - Did login succeed and set the cookie?
  - Is cookie domain/path correct?

#### 🔴 500 Internal Server Error
- **Cause**: Server-side error (MongoDB, API keys, etc)
- **Check**:
  - Server logs (terminal running `npm run dev`)
  - Response body for error message
  - Missing environment variables

#### 🔴 CORS Errors
- **Cause**: Cross-origin request blocked
- **Check**:
  - Are you accessing from correct domain?
  - Check CORS headers in response

#### 🔴 Network Error / Failed to Fetch
- **Cause**: Server not running or network issue
- **Check**:
  - Is dev server running?
  - Is the URL correct?

---

## ✅ Task 4: OAuth Provider Redirect URI Check

### Google OAuth Setup

If using Google OAuth, check your Google Cloud Console:

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Select your OAuth 2.0 Client ID**
3. **Authorized redirect URIs must include**:
   ```
   http://localhost:3000/api/auth/oauth/google/callback (for dev)
   https://yourdomain.com/api/auth/oauth/google/callback (for prod)
   ```

### GitHub OAuth Setup

If using GitHub OAuth, check your GitHub OAuth App:

1. **Go to**: https://github.com/settings/developers
2. **Select your OAuth App**
3. **Authorization callback URL must be**:
   ```
   http://localhost:3000/api/github/callback (for dev)
   https://yourdomain.com/api/github/callback (for prod)
   ```

   **Note**: Also check `/api/auth/oauth/github/callback` - there are TWO callback routes!

### Microsoft OAuth Setup

If using Microsoft OAuth:

1. **Go to**: https://portal.azure.com
2. **Azure AD > App registrations**
3. **Redirect URIs must include**:
   ```
   http://localhost:3000/api/auth/oauth/microsoft/callback (for dev)
   https://yourdomain.com/api/auth/oauth/microsoft/callback (for prod)
   ```

### Critical Redirect URI Rules

⚠️ **Exact Match Required** - Redirect URIs must match EXACTLY:
- Protocol: `http://` vs `https://`
- Domain: `localhost` vs `127.0.0.1` vs `yourdomain.com`
- Port: `:3000` must match
- Path: `/api/auth/oauth/github/callback` must match exactly
- No trailing slashes unless explicitly in your code

⚠️ **Multiple Environments** - Add both:
- Development: `http://localhost:3000/...`
- Production: `https://yourdomain.com/...`

---

## 🔥 Quick Start Checklist

### Before Testing

- [ ] Create `.env.local` file with all required variables
- [ ] Verify `MONGODB_URI` is correct and accessible
- [ ] Verify `MONGODB_DB=saintsal_db` is set
- [ ] Initialize MongoDB collections (run init script)
- [ ] Verify API keys are valid (OpenAI, Anthropic)
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`

### Testing Flow

- [ ] Test server is running: `curl http://localhost:3000`
- [ ] Test auth check (should fail): `curl http://localhost:3000/api/auth/check`
- [ ] Create a test user or use existing credentials
- [ ] Test login: `curl -X POST http://localhost:3000/api/auth/login -d '...'`
- [ ] Test auth check (should succeed): `curl http://localhost:3000/api/auth/check -b cookies.txt`
- [ ] Test protected route: `curl http://localhost:3000/api/chat -b cookies.txt`

### Browser Testing

- [ ] Open DevTools > Network tab
- [ ] Try to sign in
- [ ] Check if `/api/auth/login` returns 200
- [ ] Check if cookies are set
- [ ] Navigate to chat page
- [ ] Check if `/api/auth/check` returns 200
- [ ] Try sending a message
- [ ] Check if `/api/chat` returns 200 or error

---

## 🔍 Common Issues & Solutions

### Issue: "MONGODB_URI is undefined"
**Solution**: Create `.env.local` file with valid MongoDB URI

### Issue: "Authentication required" on all routes
**Solution**:
1. Check if login sets cookies correctly
2. Check browser cookie settings
3. Verify cookie domain/path match

### Issue: "Message limit exceeded"
**Solution**: User's monthly limit reached - check user document in MongoDB `usage` field

### Issue: OAuth redirect mismatch
**Solution**:
1. Check provider console redirect URIs
2. Verify NEXTAUTH_URL matches your domain
3. Ensure exact match including protocol and path

### Issue: Vector search fails
**Solution**: Create vector search index in MongoDB Atlas UI (index name: "vector_index")

---

## 📊 Next Steps

1. **Create `.env.local`** - Copy from `.env.example` and fill in real values
2. **Initialize MongoDB** - Run the init script to create collections
3. **Test with curl** - Follow the curl commands above
4. **Use browser DevTools** - Debug any remaining issues
5. **Check provider consoles** - Verify OAuth redirect URIs

---

**Generated**: 2025-10-30
**Status**: Ready for debugging
