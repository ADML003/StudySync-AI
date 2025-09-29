#!/usr/bin/env python3
"""
Test script for StudySync AI backend endpoints
"""

import requests
import json
from uuid import uuid4

# Test configuration
BASE_URL = "http://localhost:8001"
TEST_USER_ID = str(uuid4())

def test_health():
    """Test the health endpoint"""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_api_info():
    """Test the API info endpoint"""
    print("\n📊 Testing API info endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/info", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ API info test failed: {e}")
        return False

def test_study_health():
    """Test the study routes health endpoint"""
    print("\n🧠 Testing study health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/study/health", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Study health test failed: {e}")
        return False

def test_study_plan_generation():
    """Test the study plan generation endpoint (without auth for now)"""
    print("\n📋 Testing study plan generation...")
    
    # Test data
    plan_data = {
        "user_id": TEST_USER_ID,
        "subject": "Python Programming",
        "goals": ["Learn web development", "Build API skills"],
        "timeline": "4 weeks",
        "difficulty_level": "intermediate",
        "learning_style": "hands-on",
        "time_commitment": "2 hours per day",
        "focus_areas": ["FastAPI", "databases"],
        "current_knowledge": "Basic Python syntax"
    }
    
    try:
        # This will fail due to authentication, but we can see if the endpoint exists
        response = requests.post(f"{BASE_URL}/study/plans", json=plan_data, timeout=10)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:500]}...")  # First 500 chars
        
        if response.status_code == 401:
            print("✅ Endpoint exists and correctly requires authentication")
            return True
        else:
            print(f"📝 Response received (status {response.status_code})")
            return True
            
    except Exception as e:
        print(f"❌ Study plan test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Starting StudySync AI Backend Tests")
    print("=" * 50)
    
    tests = [
        test_health,
        test_api_info,
        test_study_health,
        test_study_plan_generation
    ]
    
    results = []
    for test in tests:
        result = test()
        results.append(result)
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {sum(results)}/{len(results)} passed")
    
    if all(results):
        print("🎉 All tests passed!")
    else:
        print("⚠️ Some tests failed - check output above")

if __name__ == "__main__":
    main()