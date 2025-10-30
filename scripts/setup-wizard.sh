#!/bin/bash

# MongoDB Setup Wizard
# Interactive guide to set up your database

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         MONGODB DATABASE SETUP WIZARD                      ║"
echo "║         SaintSal Chat Platform                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "   Please run this script from the project root directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local not found"
    echo "   Please create .env.local with your MongoDB connection string"
    exit 1
fi

echo "📋 Current Status Check..."
echo ""
echo "Project: saintsal-chat"
echo "Cluster: saintsal-chat.wsoouc.mongodb.net"
echo "Database: saintsal_db"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Configure Network Access"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Before we can connect to MongoDB, you need to allow network access:"
echo ""
echo "1. Open: https://cloud.mongodb.com"
echo "2. Select your project"
echo "3. Go to: Security → Network Access"
echo "4. Click: Add IP Address"
echo "5. Select: Allow Access from Anywhere (0.0.0.0/0)"
echo "6. Click: Confirm"
echo "7. WAIT: 1-2 minutes for changes to apply"
echo ""

read -p "Have you completed these steps? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete Step 1 and run this script again"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Test Connection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Testing MongoDB connection..."
echo ""

if npm run db:check; then
    echo ""
    echo "✅ Connection successful!"
else
    echo ""
    echo "❌ Connection failed!"
    echo ""
    echo "Possible issues:"
    echo "1. Network Access not configured (go back to Step 1)"
    echo "2. Still propagating (wait 1-2 more minutes and try again)"
    echo "3. Wrong credentials in .env.local"
    echo ""
    read -p "Do you want to continue anyway? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Initialize Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will create:"
echo "  ✓ 6 collections (users, pricing, messages, documents, teams, team_invitations)"
echo "  ✓ 15+ indexes for performance"
echo "  ✓ 3 pricing tiers (free, pro, enterprise)"
echo ""

read -p "Ready to initialize? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🚀 Initializing database..."
echo ""

if npm run db:init; then
    echo ""
    echo "✅ Database initialized successfully!"
else
    echo ""
    echo "❌ Initialization failed! Check the error above."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 4: Verify Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Verifying all collections, indexes, and data..."
echo ""

npm run db:verify

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  ✅ SETUP COMPLETE!                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "🎉 Your MongoDB database is ready!"
echo ""
echo "Next steps:"
echo "  1. npm run dev      - Start the development server"
echo "  2. Visit http://localhost:3000"
echo "  3. Sign up for an account"
echo "  4. Test all features"
echo ""
echo "📝 Don't forget to create the vector search index for RAG:"
echo "   See: DATABASE_SETUP_GUIDE.md (Vector Search Setup section)"
echo ""
