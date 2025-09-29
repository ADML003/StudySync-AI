#!/usr/bin/env python3
"""Quick authentication test script to verify endpoints are working"""

import requests
import time
import subprocess
import os
import signal

def check_server():
    """Check if server is running"""
    try:
        response = requests.get("http://localhost:8000/", timeout=2)
        return response.status_code == 200
    except:
        return False

def test_auth_endpoints():
    """Test auth endpoints quickly"""
    
    if not check_server():
        print("❌ Server not running on localhost:8000")
        return False
    
    print("✅ Server is running")
    
    # Test endpoint without auth
    print("\\n🔒 Testing /auth/test without authentication...")
    try:
        response = requests.get("http://localhost:8000/auth/test", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print("✅ Correctly rejected - no authentication")
        else:
            print(f"⚠️  Expected 401, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    # Test endpoint with invalid token
    print("\\n🔑 Testing /auth/test with invalid token...")
    try:
        headers = {"Authorization": "Bearer invalid-token-here"}
        response = requests.get("http://localhost:8000/auth/test", headers=headers, timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 401:
            print("✅ Correctly rejected - invalid token")
        else:
            print(f"⚠️  Expected 401, got {response.status_code}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    return True

if __name__ == "__main__":
    print("🚀 Quick Authentication Test")
    print("=" * 40)
    test_auth_endpoints()