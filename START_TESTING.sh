#!/bin/bash

echo "🔥 SMOKE IT OUT - STARTING TEST ENVIRONMENT"
echo "==========================================="
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️  Building project..."
npm run build

echo ""
echo "🚀 Starting dev server..."
echo ""
echo "✅ Server will be available at: http://localhost:3000"
echo ""
echo "📋 Test Plan: See SMOKE_TEST.md"
echo ""
echo "🎯 CLAUDE CAP LEVEL TESTING - LET'S GO!"
echo ""

npm run dev
