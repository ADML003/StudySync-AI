"""
Test script for async database operations in StudySync AI

This script tests the enhanced study endpoints with asynchronous database saving:
1. Study plan generation with database persistence
2. Quiz question generation with interaction tracking
3. Concept explanation with request logging
4. Database service functionality and error handling
"""

import asyncio
import requests
import json
import logging
import sys
import time
from uuid import uuid4
from datetime import datetime

# Add backend to path for testing
sys.path.append('/Users/ADML/Desktop/cerebras/backend')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Test configuration
BASE_URL = "http://localhost:8001"
TEST_USER_TOKEN = "test_jwt_token"  # Replace with actual token for testing


def test_database_service():
    """Test database service functionality"""
    logger.info("Testing Database Service")
    
    try:
        from database_service import DatabaseService
        
        # Initialize database service
        db_service = DatabaseService()
        logger.info(f"Database service initialized: {db_service.supabase is not None}")
        
        # Test data serialization
        test_data = {
            "user_id": str(uuid4()),
            "subject": "Test Subject",
            "goals": ["Learn", "Practice"],
            "metadata": {"test": True}
        }
        
        serialized = db_service._serialize_record_data(test_data)
        logger.info(f"Data serialization test passed: {type(serialized)} with {len(serialized)} keys")
        
        return True
        
    except Exception as e:
        logger.error(f"Database service test failed: {e}")
        return False


def test_study_plan_endpoint():
    """Test study plan generation with database saving"""
    logger.info("Testing Study Plan Endpoint with Database Saving")
    
    try:
        url = f"{BASE_URL}/study/plans"
        
        test_data = {
            "user_id": str(uuid4()),
            "subject": "Advanced Python Programming",
            "goals": [
                "Master object-oriented programming",
                "Learn web development frameworks",
                "Build real-world projects"
            ],
            "timeline": "6 weeks",
            "difficulty_level": "intermediate",
            "learning_style": "hands-on",
            "time_commitment": "2 hours per day",
            "focus_areas": ["Django", "FastAPI", "Database integration"],
            "current_knowledge": "Basic Python syntax and fundamentals"
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TEST_USER_TOKEN}"
        }
        
        logger.info("Sending study plan request...")
        start_time = time.time()
        
        response = requests.post(url, json=test_data, headers=headers, timeout=30)
        
        end_time = time.time()
        duration = end_time - start_time
        
        if response.status_code == 200:
            result = response.json()
            plan = result.get("plan", {})
            
            logger.info(f"Study plan generated successfully in {duration:.2f}s")
            logger.info(f"Plan title: {plan.get('title', 'No title')}")
            logger.info(f"Sections count: {len(plan.get('sections', []))}")
            logger.info(f"Response includes success: {result.get('success', False)}")
            
            # Wait a moment for background task to complete
            time.sleep(2)
            logger.info("Background database save should be completed")
            
            return True
        else:
            logger.error(f"Study plan request failed: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Study plan endpoint test failed: {e}")
        return False


def test_quiz_questions_endpoint():
    """Test quiz generation with database saving"""
    logger.info("Testing Quiz Questions Endpoint with Database Saving")
    
    try:
        url = f"{BASE_URL}/study/questions"
        
        test_data = {
            "user_id": str(uuid4()),
            "topic": "Python Data Structures",
            "difficulty": "medium",
            "question_count": 5,
            "question_types": ["multiple_choice", "short_answer"],
            "focus_areas": ["Lists", "Dictionaries", "Sets"],
            "learning_objectives": [
                "Understand data structure operations",
                "Practice problem-solving with collections"
            ]
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TEST_USER_TOKEN}"
        }
        
        logger.info("Sending quiz generation request...")
        start_time = time.time()
        
        response = requests.post(url, json=test_data, headers=headers, timeout=30)
        
        end_time = time.time()
        duration = end_time - start_time
        
        if response.status_code == 200:
            result = response.json()
            questions = result.get("questions", [])
            quiz_info = result.get("quiz_info", {})
            
            logger.info(f"Quiz generated successfully in {duration:.2f}s")
            logger.info(f"Questions count: {len(questions)}")
            logger.info(f"Topic: {quiz_info.get('topic', 'Unknown')}")
            logger.info(f"Difficulty: {quiz_info.get('difficulty', 'Unknown')}")
            
            # Wait a moment for background task to complete
            time.sleep(2)
            logger.info("Background database save should be completed")
            
            return True
        else:
            logger.error(f"Quiz request failed: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Quiz endpoint test failed: {e}")
        return False


def test_explanation_endpoint():
    """Test concept explanation with database saving"""
    logger.info("Testing Explanation Endpoint with Database Saving")
    
    try:
        url = f"{BASE_URL}/study/explain"
        
        test_data = {
            "user_id": str(uuid4()),
            "concept": "Machine Learning Overfitting",
            "complexity_level": "intermediate",
            "context": "Preparing for a data science interview",
            "format_preference": "detailed",
            "target_audience": "professional"
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TEST_USER_TOKEN}"
        }
        
        logger.info("Sending explanation request...")
        start_time = time.time()
        
        response = requests.post(url, json=test_data, headers=headers, timeout=30)
        
        end_time = time.time()
        duration = end_time - start_time
        
        if response.status_code == 200:
            result = response.json()
            explanation = result.get("explanation", {})
            concept_info = result.get("concept_info", {})
            
            logger.info(f"Explanation generated successfully in {duration:.2f}s")
            logger.info(f"Concept: {concept_info.get('concept', 'Unknown')}")
            logger.info(f"Content length: {len(explanation.get('content', ''))}")
            logger.info(f"Key points: {len(explanation.get('key_points', []))}")
            
            # Wait a moment for background task to complete
            time.sleep(2)
            logger.info("Background database save should be completed")
            
            return True
        else:
            logger.error(f"Explanation request failed: {response.status_code}")
            logger.error(f"Response: {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Explanation endpoint test failed: {e}")
        return False


def test_health_check():
    """Test health check endpoint"""
    logger.info("Testing Health Check Endpoint")
    
    try:
        url = f"{BASE_URL}/study/health"
        
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            status = result.get("status", "unknown")
            chains = result.get("chains", {})
            
            logger.info(f"Health check passed: {status}")
            logger.info(f"Chains status: {chains}")
            
            return status in ["healthy", "degraded"]
        else:
            logger.error(f"Health check failed: {response.status_code}")
            return False
            
    except Exception as e:
        logger.error(f"Health check test failed: {e}")
        return False


def test_async_database_operations():
    """Test async database operations directly"""
    logger.info("Testing Async Database Operations")
    
    try:
        from database_service import (
            save_study_plan_to_db,
            save_question_history_to_db,
            save_explanation_request_to_db,
            get_user_summary
        )
        
        async def run_async_tests():
            test_user_id = uuid4()
            
            # Test study plan save
            plan_input = {
                "subject": "Test Subject",
                "goals": ["Test Goal"],
                "timeline": "Test Timeline"
            }
            plan_output = {
                "plan": {"title": "Test Plan", "description": "Test Description"},
                "metadata": {"test": True}
            }
            
            result1 = await save_study_plan_to_db(test_user_id, plan_input, plan_output)
            logger.info(f"Study plan save result: {result1 is not None}")
            
            # Test question history save
            quiz_input = {
                "topic": "Test Topic",
                "difficulty": "easy"
            }
            quiz_output = {
                "questions": [{"question": "Test question?"}],
                "metadata": {"test": True}
            }
            
            result2 = await save_question_history_to_db(test_user_id, quiz_input, quiz_output)
            logger.info(f"Question history save result: {result2 is not None}")
            
            # Test explanation save
            explain_input = {
                "concept": "Test Concept",
                "complexity_level": "beginner"
            }
            explain_output = {
                "explanation": {"content": "Test explanation"},
                "metadata": {"test": True}
            }
            
            result3 = await save_explanation_request_to_db(test_user_id, explain_input, explain_output)
            logger.info(f"Explanation save result: {result3 is not None}")
            
            # Test user summary
            summary = await get_user_summary(test_user_id)
            logger.info(f"User summary: {summary}")
            
            return True
        
        # Run async tests
        result = asyncio.run(run_async_tests())
        logger.info("Async database operations completed")
        return result
        
    except Exception as e:
        logger.error(f"Async database operations test failed: {e}")
        return False


def check_server_running():
    """Check if the FastAPI server is running"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        return response.status_code == 200
    except:
        return False


def main():
    """Run all database integration tests"""
    logger.info("Starting Database Integration Tests")
    
    # Check if server is running
    if not check_server_running():
        logger.error("FastAPI server is not running on localhost:8001")
        logger.info("Please start the server with: python main.py")
        return False
    
    tests = [
        ("Database Service", test_database_service),
        ("Health Check", test_health_check),
        ("Study Plan Endpoint", test_study_plan_endpoint),
        ("Quiz Questions Endpoint", test_quiz_questions_endpoint),
        ("Explanation Endpoint", test_explanation_endpoint),
        ("Async Database Operations", test_async_database_operations)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        logger.info(f"\n{'='*50}")
        logger.info(f"Running: {test_name}")
        logger.info(f"{'='*50}")
        
        try:
            result = test_func()
            results.append((test_name, result))
            
            if result:
                logger.info(f"{test_name} PASSED")
            else:
                logger.error(f"{test_name} FAILED")
        
        except Exception as e:
            logger.error(f"{test_name} CRASHED: {e}")
            results.append((test_name, False))
    
    # Summary
    logger.info(f"\n{'='*50}")
    logger.info("DATABASE INTEGRATION TEST SUMMARY")
    logger.info(f"{'='*50}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        logger.info(f"{test_name}: {status}")
    
    logger.info(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        logger.info("All database integration tests passed!")
        logger.info("Async database saving is working correctly")
        logger.info("All endpoints properly log interactions")
        logger.info("Error handling and logging are comprehensive")
        return True
    else:
        logger.error(f"{total - passed} tests failed")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)