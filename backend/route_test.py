#!/usr/bin/env python3
"""
Simple authentication test to debug route registration
"""

import requests
import time

def test_available_routes():
    """Test what routes are actually available"""
    
    print("🔍 Testing available routes...")
    
    # Test root endpoint
    try:
        response = requests.get("http://localhost:8000/", timeout=5)
        print(f"Root endpoint (/): {response.status_code}")
    except Exception as e:
        print(f"Root endpoint failed: {e}")
    
    # Test docs endpoint
    try:
        response = requests.get("http://localhost:8000/docs", timeout=5)
        print(f"Docs endpoint (/docs): {response.status_code}")
    except Exception as e:
        print(f"Docs endpoint failed: {e}")
    
    # Test auth endpoints
    try:
        response = requests.get("http://localhost:8000/auth/test", timeout=5)
        print(f"Auth test endpoint (/auth/test): {response.status_code}")
        if response.status_code != 404:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Auth test endpoint failed: {e}")
    
    try:
        response = requests.get("http://localhost:8000/auth/me", timeout=5)
        print(f"Auth me endpoint (/auth/me): {response.status_code}")
        if response.status_code != 404:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Auth me endpoint failed: {e}")
    
    # Test study health endpoint
    try:
        response = requests.get("http://localhost:8000/study/health", timeout=5)
        print(f"Study health endpoint (/study/health): {response.status_code}")
        if response.status_code == 200:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"Study health endpoint failed: {e}")

if __name__ == "__main__":
    print("🔍 Route Availability Test")
    print("=" * 40)
    test_available_routes()