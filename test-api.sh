#!/bin/bash
# Script test API local
# Chạy: bash test-api.sh

BASE_URL="http://localhost:3000"

echo "🧪 Testing Backend API Local"
echo "================================"
echo ""

# Test Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/api/health" | jq .
echo ""
echo ""

# Test Save Cookie
echo "2. Testing Save Cookie..."
curl -s -X POST "$BASE_URL/api/groups/save" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "test-group",
    "profileName": "test-profile",
    "cookies": [
      {
        "name": "session",
        "value": "abc123",
        "domain": ".example.com",
        "path": "/",
        "secure": true,
        "httpOnly": true
      }
    ]
  }' | jq .
echo ""
echo ""

# Test Get Group
echo "3. Testing Get Group..."
curl -s "$BASE_URL/api/groups/test-group" | jq .
echo ""
echo ""

echo "✅ Test completed!"

