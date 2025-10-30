#!/bin/bash
# Authentication Testing Script
# Tests the auth flow with curl commands

BASE_URL="${1:-http://localhost:3000}"
echo "🔐 Testing SaintSal Authentication Flow"
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Check server is running
echo "📡 Test 1: Server health check..."
curl -s "$BASE_URL" > /dev/null && echo "✅ Server is running" || echo "❌ Server is not responding"
echo ""

# Test 2: Auth check without cookie (should return authenticated: false)
echo "📡 Test 2: Auth check without cookie..."
RESPONSE=$(curl -s "$BASE_URL/api/auth/check")
echo "Response: $RESPONSE"
if echo "$RESPONSE" | grep -q '"authenticated":false'; then
  echo "✅ Correctly returns unauthenticated"
else
  echo "⚠️  Unexpected response"
fi
echo ""

# Test 3: Login attempt (requires credentials)
echo "📡 Test 3: Login test..."
echo "⚠️  You need to provide credentials for this test"
echo ""
echo "To test login manually, run:"
echo "curl -X POST $BASE_URL/api/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"YOUR_EMAIL\",\"password\":\"YOUR_PASSWORD\"}' \\"
echo "  -c cookies.txt -v"
echo ""

# Test 4: Protected route without auth (should return 401)
echo "📡 Test 4: Protected route without auth..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/chat" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}')
STATUS_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$STATUS_CODE" = "401" ]; then
  echo "✅ Correctly returns 401 Unauthorized"
  echo "Response: $BODY"
else
  echo "⚠️  Expected 401, got $STATUS_CODE"
  echo "Response: $BODY"
fi
echo ""

echo "🎯 Manual Testing Steps:"
echo "1. Create a test user via /api/auth/signup or database"
echo "2. Login: curl -X POST $BASE_URL/api/auth/login -d '{...}' -c cookies.txt"
echo "3. Test auth: curl $BASE_URL/api/auth/check -b cookies.txt"
echo "4. Test chat: curl -X POST $BASE_URL/api/chat -d '{...}' -b cookies.txt"
echo ""
echo "📄 See AUTH_DEBUG_REPORT.md for detailed testing guide"
