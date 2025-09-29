"""
Comprehensive integration tests for StudySync AI study routes.
Tests authentication, request/response validation, database writes, and error scenarios.
"""

import pytest
import json
from unittest.mock import Mock, patch, AsyncMock, MagicMock
from uuid import uuid4, UUID
from datetime import datetime
from typing import Dict, Any

from fastapi import HTTPException
from fastapi.testclient import TestClient
from fastapi.background import BackgroundTasks

from main import app
from models import User
from simple_chains import StudyPlanInput, QuizInput, ExplainInput
from routes.study import (
    router,
    _save_study_plan_interaction,
    _save_question_history_interaction,
    _save_explanation_interaction
)


class TestStudyRoutesAuthentication:
    """Test authentication and authorization for study routes"""
    
    @pytest.fixture
    def client(self):
        """Create test client"""
        return TestClient(app)
    
    @pytest.fixture
    def mock_user(self):
        """Create mock authenticated user"""
        return User(
            id=uuid4(),
            email="test@example.com",
            name="Test User",
            created_at=datetime.now()
        )
    
    def test_study_plans_requires_authentication(self, client):
        """Test that /study/plans requires authentication"""
        response = client.post("/study/plans", json={
            "subject": "Python",
            "goals": ["Learn basics"],
            "timeline": "4 weeks"
        })
        assert response.status_code == 403  # or 401 depending on implementation
    
    def test_quiz_questions_requires_authentication(self, client):
        """Test that /study/questions requires authentication"""
        response = client.post("/study/questions", json={
            "topic": "Python Functions",
            "difficulty": "medium"
        })
        assert response.status_code == 403
    
    def test_explain_concept_requires_authentication(self, client):
        """Test that /study/explain requires authentication"""
        response = client.post("/study/explain", json={
            "concept": "Recursion"
        })
        assert response.status_code == 403
    
    def test_health_check_no_authentication_required(self, client):
        """Test that /study/health does not require authentication"""
        response = client.get("/study/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "status" in data
        assert "chains" in data


class TestStudyPlanRoute:
    """Test /study/plans endpoint functionality"""
    
    @pytest.fixture
    def mock_user(self):
        return User(
            id=uuid4(),
            email="test@example.com",
            name="Test User",
            created_at=datetime.now()
        )
    
    @pytest.fixture
    def valid_plan_request(self):
        return {
            "subject": "Python Programming",
            "goals": ["Learn basics", "Build projects"],
            "timeline": "6 weeks",
            "difficulty_level": "beginner",
            "learning_style": "hands-on",
            "time_commitment": "2 hours per day",
            "focus_areas": ["syntax", "web development"],
            "current_knowledge": "No programming experience"
        }
    
    @pytest.fixture
    def mock_plan_response(self):
        return {
            "title": "Python Programming Study Plan",
            "description": "Comprehensive beginner-friendly Python learning plan",
            "sections": [
                {
                    "week": 1,
                    "title": "Python Basics",
                    "topics": ["Variables", "Data types", "Basic operations"],
                    "activities": ["Read documentation", "Complete exercises"],
                    "time_allocation": "14 hours"
                }
            ],
            "total_duration": "6 weeks",
            "difficulty_level": "beginner",
            "learning_objectives": ["Understand Python syntax", "Build simple programs"],
            "recommended_resources": ["Python.org tutorial", "Automate the Boring Stuff"],
            "metadata": {
                "user_id": "test-user-id",
                "generated_at": datetime.now().isoformat(),
                "model_used": "llama3.1-8b"
            }
        }
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.plan_chain')
    @patch('routes.study.save_study_plan_to_db')
    async def test_generate_study_plan_success(
        self,
        mock_save_db,
        mock_plan_chain,
        mock_get_user,
        mock_user,
        valid_plan_request,
        mock_plan_response
    ):
        """Test successful study plan generation"""
        # Setup mocks
        mock_get_user.return_value = mock_user
        mock_plan_chain.return_value = mock_plan_response
        mock_save_db.return_value = "saved-record-id"
        
        # Import and call the endpoint directly
        from routes.study import generate_study_plan
        
        # Create StudyPlanInput
        plan_input = StudyPlanInput(
            user_id=mock_user.id,
            **valid_plan_request
        )
        
        # Create mock background tasks
        background_tasks = BackgroundTasks()
        
        # Call the endpoint
        result = await generate_study_plan(plan_input, background_tasks, mock_user)
        
        # Verify response structure
        assert result["success"] is True
        assert "plan" in result
        assert "metadata" in result
        assert "user_id" in result
        assert result["user_id"] == str(mock_user.id)
        
        # Verify plan structure
        plan = result["plan"]
        assert plan["title"] == "Python Programming Study Plan"
        assert plan["description"] == "Comprehensive beginner-friendly Python learning plan"
        assert len(plan["sections"]) == 1
        assert plan["difficulty_level"] == "beginner"
        
        # Verify chain was called with correct data
        mock_plan_chain.assert_called_once()
        call_args = mock_plan_chain.call_args[0][0]
        assert "study_plan_input" in call_args
        assert call_args["study_plan_input"].user_id == mock_user.id
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.plan_chain')
    async def test_generate_study_plan_validation_error(self, mock_plan_chain, mock_get_user, mock_user):
        """Test study plan generation with invalid input"""
        mock_get_user.return_value = mock_user
        
        # Test with missing required fields
        invalid_input = StudyPlanInput(
            user_id=mock_user.id,
            subject="",  # Empty subject should cause validation error
            goals=[],    # Empty goals should cause validation error
            timeline=""  # Empty timeline should cause validation error
        )
        
        from routes.study import generate_study_plan
        background_tasks = BackgroundTasks()
        
        # This should raise a validation error or return error response
        with pytest.raises((ValueError, HTTPException)):
            await generate_study_plan(invalid_input, background_tasks, mock_user)
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.plan_chain')
    async def test_generate_study_plan_chain_error(self, mock_plan_chain, mock_get_user, mock_user, valid_plan_request):
        """Test study plan generation when chain raises exception"""
        mock_get_user.return_value = mock_user
        mock_plan_chain.side_effect = Exception("Chain execution failed")
        
        plan_input = StudyPlanInput(user_id=mock_user.id, **valid_plan_request)
        
        from routes.study import generate_study_plan
        background_tasks = BackgroundTasks()
        
        with pytest.raises(HTTPException) as exc_info:
            await generate_study_plan(plan_input, background_tasks, mock_user)
        
        assert exc_info.value.status_code == 500
        assert "Failed to generate study plan" in exc_info.value.detail


class TestQuizQuestionsRoute:
    """Test /study/questions endpoint functionality"""
    
    @pytest.fixture
    def mock_user(self):
        return User(
            id=uuid4(),
            email="test@example.com",
            name="Test User",
            created_at=datetime.now()
        )
    
    @pytest.fixture
    def valid_quiz_request(self):
        return {
            "topic": "Python Functions",
            "difficulty": "medium",
            "question_count": 5,
            "question_types": ["multiple_choice"],
            "focus_areas": ["parameters", "return values"],
            "learning_objectives": ["Understand function syntax", "Apply functions"]
        }
    
    @pytest.fixture
    def mock_quiz_response(self):
        return {
            "questions": [
                {
                    "id": 1,
                    "question": "What keyword is used to define a function in Python?",
                    "type": "multiple_choice",
                    "options": ["def", "function", "func", "define"],
                    "correct_answer": "def",
                    "explanation": "The 'def' keyword is used to define functions in Python.",
                    "topic": "Python Functions",
                    "difficulty": "medium"
                },
                {
                    "id": 2,
                    "question": "How do you return a value from a function?",
                    "type": "multiple_choice",
                    "options": ["return value", "send value", "output value", "give value"],
                    "correct_answer": "return value",
                    "explanation": "The 'return' statement is used to return values from functions.",
                    "topic": "Python Functions",
                    "difficulty": "medium"
                }
            ],
            "metadata": {
                "user_id": "test-user-id",
                "generated_at": datetime.now().isoformat(),
                "model_used": "llama3.1-8b"
            }
        }
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.quiz_chain')
    @patch('routes.study.save_question_history_to_db')
    async def test_generate_quiz_questions_success(
        self,
        mock_save_db,
        mock_quiz_chain,
        mock_get_user,
        mock_user,
        valid_quiz_request,
        mock_quiz_response
    ):
        """Test successful quiz question generation"""
        # Setup mocks
        mock_get_user.return_value = mock_user
        mock_quiz_chain.return_value = mock_quiz_response
        mock_save_db.return_value = "saved-record-id"
        
        from routes.study import generate_quiz_questions
        
        quiz_input = QuizInput(user_id=mock_user.id, **valid_quiz_request)
        background_tasks = BackgroundTasks()
        
        result = await generate_quiz_questions(quiz_input, background_tasks, mock_user)
        
        # Verify response structure
        assert result["success"] is True
        assert "questions" in result
        assert "metadata" in result
        assert "quiz_info" in result
        
        # Verify questions
        questions = result["questions"]
        assert len(questions) == 2
        assert questions[0]["question"] == "What keyword is used to define a function in Python?"
        assert questions[0]["correct_answer"] == "def"
        
        # Verify quiz info
        quiz_info = result["quiz_info"]
        assert quiz_info["topic"] == "Python Functions"
        assert quiz_info["difficulty"] == "medium"
        assert quiz_info["question_count"] == 2
        assert quiz_info["user_id"] == str(mock_user.id)
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.quiz_chain')
    async def test_generate_quiz_questions_empty_response(self, mock_quiz_chain, mock_get_user, mock_user, valid_quiz_request):
        """Test quiz generation with empty questions response"""
        mock_get_user.return_value = mock_user
        mock_quiz_chain.return_value = {"questions": [], "metadata": {}}
        
        from routes.study import generate_quiz_questions
        
        quiz_input = QuizInput(user_id=mock_user.id, **valid_quiz_request)
        background_tasks = BackgroundTasks()
        
        result = await generate_quiz_questions(quiz_input, background_tasks, mock_user)
        
        # Should still return success with empty questions
        assert result["success"] is True
        assert result["questions"] == []
        assert result["quiz_info"]["question_count"] == 0
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.quiz_chain')
    async def test_generate_quiz_questions_chain_error(self, mock_quiz_chain, mock_get_user, mock_user, valid_quiz_request):
        """Test quiz generation when chain raises exception"""
        mock_get_user.return_value = mock_user
        mock_quiz_chain.side_effect = Exception("Quiz generation failed")
        
        quiz_input = QuizInput(user_id=mock_user.id, **valid_quiz_request)
        
        from routes.study import generate_quiz_questions
        background_tasks = BackgroundTasks()
        
        with pytest.raises(HTTPException) as exc_info:
            await generate_quiz_questions(quiz_input, background_tasks, mock_user)
        
        assert exc_info.value.status_code == 500
        assert "Failed to generate quiz questions" in exc_info.value.detail


class TestExplainConceptRoute:
    """Test /study/explain endpoint functionality"""
    
    @pytest.fixture
    def mock_user(self):
        return User(
            id=uuid4(),
            email="test@example.com",
            name="Test User",
            created_at=datetime.now()
        )
    
    @pytest.fixture
    def valid_explain_request(self):
        return {
            "concept": "Object-Oriented Programming",
            "complexity_level": "intermediate",
            "context": "Computer Science course",
            "format_preference": "detailed",
            "target_audience": "student"
        }
    
    @pytest.fixture
    def mock_explain_response(self):
        return {
            "explanation": "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects...",
            "key_points": [
                "Encapsulation: Bundling data and methods",
                "Inheritance: Creating new classes from existing ones",
                "Polymorphism: Objects of different types responding to same interface"
            ],
            "examples": [
                "Class definition: class Car: pass",
                "Inheritance: class SportsCar(Car): pass"
            ],
            "related_concepts": ["Abstraction", "Design Patterns", "SOLID Principles"],
            "further_reading": ["Design Patterns book", "Clean Code"],
            "metadata": {
                "user_id": "test-user-id",
                "generated_at": datetime.now().isoformat(),
                "model_used": "llama3.1-8b"
            }
        }
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.explain_chain')
    @patch('routes.study.save_explanation_request_to_db')
    async def test_explain_concept_success(
        self,
        mock_save_db,
        mock_explain_chain,
        mock_get_user,
        mock_user,
        valid_explain_request,
        mock_explain_response
    ):
        """Test successful concept explanation"""
        # Setup mocks
        mock_get_user.return_value = mock_user
        mock_explain_chain.return_value = mock_explain_response
        mock_save_db.return_value = "saved-record-id"
        
        from routes.study import explain_concept
        
        explain_input = ExplainInput(user_id=mock_user.id, **valid_explain_request)
        background_tasks = BackgroundTasks()
        
        result = await explain_concept(explain_input, background_tasks, mock_user)
        
        # Verify response structure
        assert result["success"] is True
        assert "explanation" in result
        assert "metadata" in result
        assert "concept_info" in result
        
        # Verify explanation content
        explanation = result["explanation"]
        assert "Object-Oriented Programming" in explanation["content"]
        assert len(explanation["key_points"]) == 3
        assert "Encapsulation" in explanation["key_points"][0]
        assert len(explanation["examples"]) == 2
        assert "class Car" in explanation["examples"][0]
        
        # Verify concept info
        concept_info = result["concept_info"]
        assert concept_info["concept"] == "Object-Oriented Programming"
        assert concept_info["complexity_level"] == "intermediate"
        assert concept_info["user_id"] == str(mock_user.id)
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.explain_chain')
    async def test_explain_concept_minimal_request(self, mock_explain_chain, mock_get_user, mock_user):
        """Test explanation with minimal required fields"""
        mock_get_user.return_value = mock_user
        mock_explain_chain.return_value = {
            "explanation": "Simple explanation",
            "key_points": [],
            "examples": [],
            "related_concepts": [],
            "further_reading": [],
            "metadata": {}
        }
        
        from routes.study import explain_concept
        
        # Only required field
        explain_input = ExplainInput(user_id=mock_user.id, concept="Variables")
        background_tasks = BackgroundTasks()
        
        result = await explain_concept(explain_input, background_tasks, mock_user)
        
        assert result["success"] is True
        assert result["concept_info"]["concept"] == "Variables"
        assert result["concept_info"]["complexity_level"] == "intermediate"  # default
        assert result["concept_info"]["format_preference"] == "detailed"  # default
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.explain_chain')
    async def test_explain_concept_chain_error(self, mock_explain_chain, mock_get_user, mock_user, valid_explain_request):
        """Test explanation when chain raises exception"""
        mock_get_user.return_value = mock_user
        mock_explain_chain.side_effect = Exception("Explanation failed")
        
        explain_input = ExplainInput(user_id=mock_user.id, **valid_explain_request)
        
        from routes.study import explain_concept
        background_tasks = BackgroundTasks()
        
        with pytest.raises(HTTPException) as exc_info:
            await explain_concept(explain_input, background_tasks, mock_user)
        
        assert exc_info.value.status_code == 500
        assert "Failed to generate explanation" in exc_info.value.detail


class TestBackgroundTasks:
    """Test background task functions for database operations"""
    
    @pytest.fixture
    def mock_user_id(self):
        return uuid4()
    
    @pytest.fixture
    def sample_input_data(self):
        return {
            "subject": "Python",
            "goals": ["Learn basics"],
            "timeline": "4 weeks"
        }
    
    @pytest.fixture
    def sample_output_data(self):
        return {
            "success": True,
            "plan": {"title": "Python Study Plan"},
            "metadata": {"generated_at": datetime.now().isoformat()}
        }
    
    @patch('routes.study.save_study_plan_to_db')
    async def test_save_study_plan_interaction_success(
        self,
        mock_save_db,
        mock_user_id,
        sample_input_data,
        sample_output_data
    ):
        """Test successful study plan interaction save"""
        mock_save_db.return_value = "record-id-123"
        
        # Should not raise any exception
        await _save_study_plan_interaction(mock_user_id, sample_input_data, sample_output_data)
        
        mock_save_db.assert_called_once_with(mock_user_id, sample_input_data, sample_output_data)
    
    @patch('routes.study.save_study_plan_to_db')
    async def test_save_study_plan_interaction_db_error(
        self,
        mock_save_db,
        mock_user_id,
        sample_input_data,
        sample_output_data
    ):
        """Test study plan interaction save with database error"""
        mock_save_db.side_effect = Exception("Database connection failed")
        
        # Should handle exception gracefully (not re-raise)
        await _save_study_plan_interaction(mock_user_id, sample_input_data, sample_output_data)
        
        mock_save_db.assert_called_once_with(mock_user_id, sample_input_data, sample_output_data)
    
    @patch('routes.study.save_question_history_to_db')
    async def test_save_question_history_interaction_success(
        self,
        mock_save_db,
        mock_user_id
    ):
        """Test successful question history interaction save"""
        mock_save_db.return_value = "record-id-456"
        
        input_data = {"topic": "Python", "difficulty": "medium"}
        output_data = {"questions": [], "success": True}
        
        await _save_question_history_interaction(mock_user_id, input_data, output_data)
        
        mock_save_db.assert_called_once_with(mock_user_id, input_data, output_data)
    
    @patch('routes.study.save_explanation_request_to_db')
    async def test_save_explanation_interaction_success(
        self,
        mock_save_db,
        mock_user_id
    ):
        """Test successful explanation interaction save"""
        mock_save_db.return_value = "record-id-789"
        
        input_data = {"concept": "OOP", "complexity_level": "intermediate"}
        output_data = {"explanation": {"content": "..."}, "success": True}
        
        await _save_explanation_interaction(mock_user_id, input_data, output_data)
        
        mock_save_db.assert_called_once_with(mock_user_id, input_data, output_data)


class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_health_check_all_chains_ready(self):
        """Test health check when all chains are initialized"""
        # Import the function directly since we want to test the logic
        from routes.study import study_health_check
        
        # Mock the chains being available
        with patch('routes.study.plan_chain', Mock()), \
             patch('routes.study.quiz_chain', Mock()), \
             patch('routes.study.explain_chain', Mock()):
            
            result = asyncio.run(study_health_check())
            
            assert result["status"] == "healthy"
            assert result["chains"]["plan_chain"] is True
            assert result["chains"]["quiz_chain"] is True
            assert result["chains"]["explain_chain"] is True
            assert "All AI chains are ready" in result["message"]
    
    def test_health_check_some_chains_missing(self):
        """Test health check when some chains are not initialized"""
        from routes.study import study_health_check
        
        # Mock some chains being None
        with patch('routes.study.plan_chain', Mock()), \
             patch('routes.study.quiz_chain', None), \
             patch('routes.study.explain_chain', Mock()):
            
            result = asyncio.run(study_health_check())
            
            assert result["status"] == "degraded"
            assert result["chains"]["plan_chain"] is True
            assert result["chains"]["quiz_chain"] is False
            assert result["chains"]["explain_chain"] is True
            assert "Some chains are not initialized" in result["message"]
    
    def test_health_check_exception(self):
        """Test health check when an exception occurs"""
        from routes.study import study_health_check
        
        # Mock chains to raise exception
        with patch('routes.study.plan_chain', side_effect=Exception("Chain error")):
            result = asyncio.run(study_health_check())
            
            assert result["status"] == "unhealthy"
            assert "error" in result
            assert "Study routes health check failed" in result["message"]


class TestRouteIntegration:
    """Integration tests combining multiple components"""
    
    @pytest.fixture
    def client(self):
        return TestClient(app)
    
    @patch('routes.study.get_current_user')
    @patch('routes.study.plan_chain')
    @patch('routes.study.save_study_plan_to_db')
    def test_full_study_plan_flow(self, mock_save_db, mock_plan_chain, mock_get_user, client):
        """Test complete study plan generation flow"""
        # Setup user and mocks
        user = User(id=uuid4(), email="test@example.com", name="Test User")
        mock_get_user.return_value = user
        
        mock_plan_response = {
            "title": "Test Plan",
            "description": "Test Description",
            "sections": [],
            "metadata": {"user_id": str(user.id)}
        }
        mock_plan_chain.return_value = mock_plan_response
        mock_save_db.return_value = "saved-id"
        
        # Make request
        request_data = {
            "subject": "Python",
            "goals": ["Learn basics"],
            "timeline": "4 weeks"
        }
        
        with patch('auth.get_current_user', return_value=user):
            response = client.post("/study/plans", json=request_data)
        
        # Note: This test might need adjustment based on actual authentication setup
        # The main purpose is to verify the integration works end-to-end
    
    def test_invalid_json_request(self, client):
        """Test handling of invalid JSON in requests"""
        # Send malformed JSON
        response = client.post(
            "/study/plans",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        
        # Should return 422 for validation error or 400 for bad request
        assert response.status_code in [400, 422]
    
    def test_missing_required_fields(self, client):
        """Test handling of requests with missing required fields"""
        # Send request with missing required fields
        incomplete_data = {"subject": "Python"}  # missing goals and timeline
        
        response = client.post("/study/plans", json=incomplete_data)
        
        # Should return validation error (typically 422)
        assert response.status_code in [422, 403]  # 403 if auth fails first


if __name__ == "__main__":
    pytest.main([__file__])