#!/usr/bin/env python3
"""
Authentication Security Test Suite for StudySync AI

This script comprehensively tests JWT authentication with Supabase tokens:
1. Tests endpoints without authentication (should fail with 401)
2. Tests endpoints with invalid tokens (should fail with 401)
3. Tests endpoints with expired tokens (should fail with 401)
4. Tests endpoints with valid tokens (should succeed)
5. Validates user information extraction from JWT
"""

import asyncio
import requests
import json
import jwt
import time
from datetime import datetime, timedelta
from uuid import uuid4


class AuthTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.test_user_id = str(uuid4())
        self.test_email = "test@example.com"
        
    def create_test_jwt(self, user_id=None, email=None, expires_in_minutes=60, secret="test-secret"):
        """Create a test JWT token for authentication testing"""
        payload = {
            "sub": user_id or self.test_user_id,
            "email": email or self.test_email,
            "role": "authenticated",
            "iat": int(time.time()),
            "exp": int(time.time()) + (expires_in_minutes * 60),
            "aud": "authenticated",
            "user_metadata": {
                "name": "Test User"
            },
            "app_metadata": {
                "provider": "email"
            }
        }
        
        return jwt.encode(payload, secret, algorithm="HS256")
    
    def create_expired_jwt(self, secret="test-secret"):
        """Create an expired JWT token for testing"""
        return self.create_test_jwt(expires_in_minutes=-10, secret=secret)
    
    def test_endpoint_without_auth(self, endpoint):
        """Test endpoint without authentication header"""
        print(f"\\n🔒 Testing {endpoint} without authentication...")
        try:
            response = requests.get(f"{self.base_url}{endpoint}", timeout=10)
            if response.status_code == 401:
                print("✅ Correctly rejected request without authentication")
                return True
            else:
                print(f"❌ Expected 401, got {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Request failed: {e}")
            return False
    
    def test_endpoint_with_invalid_token(self, endpoint):
        """Test endpoint with invalid JWT token"""
        print(f"\\n🔑 Testing {endpoint} with invalid token...")
        try:
            headers = {"Authorization": "Bearer invalid-token-here"}
            response = requests.get(f"{self.base_url}{endpoint}", headers=headers, timeout=10)
            if response.status_code == 401:
                print("✅ Correctly rejected invalid token")
                return True
            else:
                print(f"❌ Expected 401, got {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Request failed: {e}")
            return False
    
    def test_endpoint_with_expired_token(self, endpoint, secret):
        """Test endpoint with expired JWT token"""
        print(f"\\n⏰ Testing {endpoint} with expired token...")
        try:
            expired_token = self.create_expired_jwt(secret)
            headers = {"Authorization": f"Bearer {expired_token}"}
            response = requests.get(f"{self.base_url}{endpoint}", headers=headers, timeout=10)
            if response.status_code == 401:
                print("✅ Correctly rejected expired token")
                return True
            else:
                print(f"❌ Expected 401, got {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Request failed: {e}")
            return False
    
    def test_endpoint_with_valid_token(self, endpoint, secret):
        """Test endpoint with valid JWT token"""
        print(f"\\n✅ Testing {endpoint} with valid token...")
        try:
            valid_token = self.create_test_jwt(secret=secret)
            headers = {"Authorization": f"Bearer {valid_token}"}
            response = requests.get(f"{self.base_url}{endpoint}", headers=headers, timeout=10)
            if response.status_code == 200:
                print("✅ Successfully authenticated with valid token")
                print(f"Response: {json.dumps(response.json(), indent=2)}")
                return True
            else:
                print(f"❌ Expected 200, got {response.status_code}")
                print(f"Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Request failed: {e}")
            return False
    
    def test_user_info_extraction(self, secret):
        """Test that user information is correctly extracted from JWT"""
        print(f"\\n👤 Testing user information extraction...")
        try:
            test_user_id = str(uuid4())
            test_email = "specific-test@example.com"
            
            token = self.create_test_jwt(
                user_id=test_user_id,
                email=test_email,
                secret=secret
            )
            headers = {"Authorization": f"Bearer {token}"}
            
            response = requests.get(f"{self.base_url}/auth/me", headers=headers, timeout=10)
            if response.status_code == 200:
                user_data = response.json()
                
                # Validate user ID extraction
                if user_data.get("id") == test_user_id:
                    print("✅ User ID correctly extracted from JWT")
                else:
                    print(f"❌ User ID mismatch: expected {test_user_id}, got {user_data.get('id')}")
                    return False
                
                # Validate email extraction
                if user_data.get("email") == test_email:
                    print("✅ Email correctly extracted from JWT")
                else:
                    print(f"❌ Email mismatch: expected {test_email}, got {user_data.get('email')}")
                    return False
                
                print(f"User data: {json.dumps(user_data, indent=2)}")
                return True
            else:
                print(f"❌ Expected 200, got {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Test failed: {e}")
            return False
    
    def check_server_running(self):
        """Check if the FastAPI server is running"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def get_jwt_secret(self):
        """Get JWT secret from server config (for testing purposes)"""
        try:
            response = requests.get(f"{self.base_url}/api/config", timeout=5)
            if response.status_code == 200:
                config = response.json()
                # In a real scenario, this would come from environment
                # For testing, we'll use a default secret
                return "your-256-bit-secret"  # This should match your .env SUPABASE_JWT_SECRET
            else:
                print("⚠️  Could not get config, using default test secret")
                return "test-secret"
        except Exception as e:
            print(f"⚠️  Could not get config: {e}, using default test secret")
            return "test-secret"
    
    def run_all_tests(self):
        """Run complete authentication security test suite"""
        print("🚀 Starting Authentication Security Test Suite")
        print("=" * 60)
        
        # Check server
        if not self.check_server_running():
            print("❌ FastAPI server is not running!")
            print("Please start the server with: python main.py")
            return False
        
        print("✅ Server is running")
        
        # Get JWT secret for testing
        jwt_secret = self.get_jwt_secret()
        print(f"🔑 Using JWT secret for testing: {jwt_secret[:10]}...")
        
        # Test endpoints
        test_endpoints = [
            "/auth/test",
            "/auth/me",
            "/study/health"  # This should be protected in study routes
        ]
        
        results = []
        
        for endpoint in test_endpoints:
            print(f"\\n📍 Testing endpoint: {endpoint}")
            print("-" * 40)
            
            # Test 1: No authentication
            result1 = self.test_endpoint_without_auth(endpoint)
            
            # Test 2: Invalid token
            result2 = self.test_endpoint_with_invalid_token(endpoint)
            
            # Test 3: Expired token
            result3 = self.test_endpoint_with_expired_token(endpoint, jwt_secret)
            
            # Test 4: Valid token
            result4 = self.test_endpoint_with_valid_token(endpoint, jwt_secret)
            
            endpoint_success = all([result1, result2, result3, result4])
            results.append((endpoint, endpoint_success))
            
            if endpoint_success:
                print(f"✅ {endpoint} - All security tests passed")
            else:
                print(f"❌ {endpoint} - Some security tests failed")
        
        # Test user info extraction
        print(f"\\n📍 Testing user information extraction")
        print("-" * 40)
        user_info_result = self.test_user_info_extraction(jwt_secret)
        results.append(("User Info Extraction", user_info_result))
        
        # Summary
        print(f"\\n{'=' * 60}")
        print("🏁 Authentication Security Test Results")
        print(f"{'=' * 60}")
        
        passed = sum(1 for _, success in results if success)
        total = len(results)
        
        for endpoint, success in results:
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"{endpoint}: {status}")
        
        print(f"\\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All authentication security tests passed!")
            print("✅ JWT authentication is working correctly")
            print("✅ All endpoints are properly protected")
            print("✅ User information extraction is functioning")
            return True
        else:
            print(f"💥 {total - passed} tests failed")
            print("❌ Authentication security issues detected")
            return False


def main():
    """Run authentication security tests"""
    tester = AuthTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)


if __name__ == "__main__":
    main()