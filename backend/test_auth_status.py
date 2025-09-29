#!/usr/bin/env python3
"""
Authentication Test Script for StudySync AI

Tests the authentication endpoints to verify JWT token verification.
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_authentication_endpoints():
    """Test authentication functionality"""
    print("🔐 Testing Authentication Endpoints")
    print("=" * 50)
    
    # Test 1: Access protected endpoint without auth (should get 401)
    print("\n1. Testing endpoint without authentication...")
    try:
        response = requests.get(f"{BASE_URL}/auth/test", timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print("   ✅ Correctly rejected request without auth")
        else:
            print(f"   ❌ Expected 401, got {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: Test with invalid auth header
    print("\n2. Testing with invalid authorization header...")
    try:
        headers = {"Authorization": "Bearer invalid_token"}
        response = requests.get(f"{BASE_URL}/auth/test", headers=headers, timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 401:
            print("   ✅ Correctly rejected invalid token")
        else:
            print(f"   ❌ Expected 401, got {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Test basic endpoints
    print("\n3. Testing basic endpoints...")
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"   Root endpoint status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Root endpoint accessible")
        
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"   Health endpoint status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Health endpoint accessible")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 4: Check available routes
    print("\n4. Testing route availability...")
    test_routes = [
        "/",
        "/health", 
        "/api/info",
        "/auth/test",
        "/auth/me",
        "/study/health"
    ]
    
    for route in test_routes:
        try:
            response = requests.get(f"{BASE_URL}{route}", timeout=5)
            status_emoji = "✅" if response.status_code in [200, 401] else "❌"
            print(f"   {route}: {response.status_code} {status_emoji}")
        except Exception as e:
            print(f"   {route}: Error - {e} ❌")

def test_server_running():
    """Check if server is running"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=2)
        return response.status_code == 200
    except:
        return False

if __name__ == "__main__":
    if test_server_running():
        print("✅ Server is running")
        test_authentication_endpoints()
    else:
        print("❌ Server is not running on localhost:8000")
        print("   Start the server with: python main.py")