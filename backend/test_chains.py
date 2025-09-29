"""
Comprehensive unit tests for AI chains in StudySync AI.
Tests PlanChain, QuizChain, and ExplainChain with mocked Cerebras client responses.
"""

import pytest
import json
from unittest.mock import Mock, patch, MagicMock
from uuid import uuid4, UUID
from datetime import datetime
from typing import Dict, Any, List

from simple_chains import (
    PlanChain, QuizChain, ExplainChain,
    StudyPlanInput, QuizInput, ExplainInput,
    create_plan_chain, create_quiz_chain, create_explain_chain
)


class TestStudyPlanInput:
    """Test StudyPlanInput model validation"""
    
    def test_valid_study_plan_input(self):
        """Test creating valid StudyPlanInput"""
        user_id = uuid4()
        input_data = StudyPlanInput(
            user_id=user_id,
            subject="Python Programming",
            goals=["Learn basics", "Build projects"],
            timeline="4 weeks"
        )
        assert input_data.user_id == user_id
        assert input_data.subject == "Python Programming"
        assert input_data.difficulty_level == "intermediate"  # default
        assert input_data.learning_style == "balanced"  # default
    
    def test_study_plan_input_with_optional_fields(self):
        """Test StudyPlanInput with all optional fields"""
        input_data = StudyPlanInput(
            user_id=uuid4(),
            subject="Machine Learning",
            goals=["Understand algorithms", "Apply to projects"],
            timeline="8 weeks",
            difficulty_level="advanced",
            learning_style="visual",
            time_commitment="2 hours per day",
            focus_areas=["neural networks", "deep learning"],
            current_knowledge="Intermediate Python and statistics"
        )
        assert input_data.difficulty_level == "advanced"
        assert input_data.focus_areas == ["neural networks", "deep learning"]
    
    def test_study_plan_input_missing_required_fields(self):
        """Test StudyPlanInput validation with missing required fields"""
        with pytest.raises(ValueError):
            StudyPlanInput(subject="Python")  # missing user_id, goals, timeline


class TestQuizInput:
    """Test QuizInput model validation"""
    
    def test_valid_quiz_input(self):
        """Test creating valid QuizInput"""
        user_id = uuid4()
        input_data = QuizInput(
            user_id=user_id,
            topic="Python Functions",
            difficulty="medium"
        )
        assert input_data.user_id == user_id
        assert input_data.topic == "Python Functions"
        assert input_data.question_count == 5  # default
        assert input_data.question_types == ["multiple_choice"]  # default
    
    def test_quiz_input_with_optional_fields(self):
        """Test QuizInput with all optional fields"""
        input_data = QuizInput(
            user_id=uuid4(),
            topic="Data Structures",
            difficulty="hard",
            question_count=10,
            question_types=["multiple_choice", "short_answer"],
            focus_areas=["arrays", "linked lists"],
            learning_objectives=["Understand complexity", "Implement algorithms"]
        )
        assert input_data.question_count == 10
        assert input_data.focus_areas == ["arrays", "linked lists"]


class TestExplainInput:
    """Test ExplainInput model validation"""
    
    def test_valid_explain_input(self):
        """Test creating valid ExplainInput"""
        user_id = uuid4()
        input_data = ExplainInput(
            user_id=user_id,
            concept="Object-Oriented Programming"
        )
        assert input_data.user_id == user_id
        assert input_data.concept == "Object-Oriented Programming"
        assert input_data.complexity_level == "intermediate"  # default
        assert input_data.format_preference == "detailed"  # default
    
    def test_explain_input_with_optional_fields(self):
        """Test ExplainInput with all optional fields"""
        input_data = ExplainInput(
            user_id=uuid4(),
            concept="Recursion",
            complexity_level="advanced",
            context="Computer Science algorithms course",
            format_preference="step-by-step",
            target_audience="student"
        )
        assert input_data.complexity_level == "advanced"
        assert input_data.context == "Computer Science algorithms course"


class TestPlanChain:
    """Test PlanChain functionality with mocked Cerebras responses"""
    
    @pytest.fixture
    def plan_chain(self):
        """Create PlanChain instance for testing"""
        return PlanChain()
    
    @pytest.fixture
    def sample_plan_input(self):
        """Create sample StudyPlanInput for testing"""
        return StudyPlanInput(
            user_id=uuid4(),
            subject="Python Programming",
            goals=["Learn basics", "Build web app"],
            timeline="6 weeks",
            difficulty_level="beginner",
            learning_style="hands-on",
            time_commitment="1 hour per day",
            focus_areas=["syntax", "web frameworks"],
            current_knowledge="No programming experience"
        )
    
    @patch('simple_chains.cerebras_client.chat.completions.create')
    @patch('simple_chains.MEMORY_AVAILABLE', False)
    def test_plan_chain_success(self, mock_cerebras, plan_chain, sample_plan_input):
        """Test successful study plan generation"""
        # Mock Cerebras response
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = """
        # Python Programming Study Plan
        
        ## Week 1: Python Basics
        - Learn variables and data types
        - Practice basic operations
        
        ## Week 2: Control Structures
        - If statements and loops
        - Functions and scope
        
        ## Week 3-6: Advanced Topics
        - Object-oriented programming
        - Web framework introduction
        """
        mock_cerebras.return_value = mock_response
        
        # Test the chain
        inputs = {"study_plan_input": sample_plan_input}
        result = plan_chain(inputs)
        
        # Verify response
        assert "title" in result
        assert "description" in result
        assert "sections" in result
        assert "metadata" in result
        assert result["metadata"]["user_id"] == str(sample_plan_input.user_id)
        assert "generated_at" in result["metadata"]
        
        # Verify Cerebras was called correctly
        mock_cerebras.assert_called_once()
        call_args = mock_cerebras.call_args
        assert call_args[1]["model"] == "llama3.1-8b"
        assert call_args[1]["max_tokens"] == 2000
        assert call_args[1]["temperature"] == 0.7
        
        # Check that the prompt contains our input data
        messages = call_args[1]["messages"]
        user_message = messages[1]["content"]
        assert "Python Programming" in user_message
        assert "6 weeks" in user_message
        assert "beginner" in user_message
    
    @patch('simple_chains.cerebras_client.chat.completions.create')
    @patch('simple_chains.MEMORY_AVAILABLE', False)
    def test_plan_chain_error_handling(self, mock_cerebras, plan_chain, sample_plan_input):
        """Test error handling in plan generation"""
        # Mock Cerebras to raise an exception
        mock_cerebras.side_effect = Exception("API Error")
        
        inputs = {"study_plan_input": sample_plan_input}
        result = plan_chain(inputs)
        
        # Verify error response
        assert "title" in result
        assert "error" in result["description"]
        assert "sections" in result
        assert len(result["sections"]) == 0
        assert "error" in result["metadata"]
    
    @patch('simple_chains.cerebras_client.chat.completions.create')
    @patch('simple_chains.MEMORY_AVAILABLE', True)
    @patch('simple_chains.get_context_for_ai_chain')
    @patch('simple_chains.store_user_interaction')
    def test_plan_chain_with_memory(self, mock_store, mock_get_context, mock_cerebras, plan_chain, sample_plan_input):
        """Test plan generation with memory context"""
        # Mock memory context
        mock_context = [
            {
                "input_summary": "Previous Python basics study",
                "output_summary": "Completed variables and functions"
            }
        ]
        mock_get_context.return_value = mock_context
        
        # Mock Cerebras response
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = "# Advanced Python Study Plan"
        mock_cerebras.return_value = mock_response
        
        inputs = {"study_plan_input": sample_plan_input}
        result = plan_chain(inputs)
        
        # Verify memory functions were called
        mock_get_context.assert_called_once_with(
            user_id=sample_plan_input.user_id,
            chain_type="plan",
            current_input=sample_plan_input.model_dump(),
            max_context_items=3
        )
        mock_store.assert_called_once()
        
        # Verify context was included in prompt
        messages = mock_cerebras.call_args[1]["messages"]
        user_message = messages[1]["content"]
        assert "Previous Learning Context" in user_message
    
    def test_create_plan_prompt(self, plan_chain, sample_plan_input):
        """Test prompt creation for study plans"""
        prompt = plan_chain._create_plan_prompt(sample_plan_input)
        
        # Verify all input fields are included
        assert "Python Programming" in prompt
        assert "Learn basics" in prompt
        assert "6 weeks" in prompt
        assert "beginner" in prompt
        assert "hands-on" in prompt
        assert "syntax" in prompt
        assert "No programming experience" in prompt
        
        # Verify prompt structure
        assert "Subject:" in prompt
        assert "Goals:" in prompt
        assert "Timeline:" in prompt
        assert "comprehensive study plan" in prompt
    
    def test_create_plan_prompt_with_context(self, plan_chain, sample_plan_input):
        """Test prompt creation with memory context"""
        context = [
            {
                "input_summary": "Previous study session",
                "output_summary": "Learned basic syntax"
            }
        ]
        
        prompt = plan_chain._create_plan_prompt(sample_plan_input, context)
        
        assert "Previous Learning Context" in prompt
        assert "Previous study session" in prompt
        assert "Learned basic syntax" in prompt


class TestQuizChain:
    """Test QuizChain functionality with mocked Cerebras responses"""
    
    @pytest.fixture
    def quiz_chain(self):
        """Create QuizChain instance for testing"""
        return QuizChain()
    
    @pytest.fixture
    def sample_quiz_input(self):
        """Create sample QuizInput for testing"""
        return QuizInput(
            user_id=uuid4(),
            topic="Python Functions",
            difficulty="medium",
            question_count=3,
            question_types=["multiple_choice"],
            focus_areas=["parameters", "return values"]
        )
    
    @patch('simple_chains.cerebras_client.chat.completions.create')
    @patch('simple_chains.MEMORY_AVAILABLE', False)
    def test_quiz_chain_success(self, mock_cerebras, quiz_chain, sample_quiz_input):
        """Test successful quiz generation"""
        # Mock Cerebras response with JSON format
        quiz_json = [
            {
                "id": 1,
                "question": "What keyword is used to define a function in Python?",
                "type": "multiple_choice",
                "options": ["def", "function", "func", "define"],
                "correct_answer": "def",
                "explanation": "The 'def' keyword is used to define functions in Python."
            },
            {
                "id": 2,
                "question": "How do you return a value from a function?",
                "type": "multiple_choice",
                "options": ["return value", "send value", "output value", "give value"],
                "correct_answer": "return value",
                "explanation": "The 'return' statement is used to return values from functions."
            }
        ]
        
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = json.dumps(quiz_json)
        mock_cerebras.return_value = mock_response
        
        inputs = {"quiz_input": sample_quiz_input}
        result = quiz_chain(inputs)
        
        # Verify response structure
        assert "questions" in result
        assert "metadata" in result
        assert len(result["questions"]) <= sample_quiz_input.question_count
        assert result["metadata"]["user_id"] == str(sample_quiz_input.user_id)
        
        # Verify question structure
        question = result["questions"][0]
        assert "id" in question
        assert "question" in question
        assert "type" in question
        assert "correct_answer" in question
        assert "explanation" in question
    
    @patch('simple_chains.cerebras_client.chat.completions.create')
    @patch('simple_chains.MEMORY_AVAILABLE', False)
    def test_quiz_chain_text_parsing(self, mock_cerebras, quiz_chain, sample_quiz_input):
        """Test quiz generation with text response (not JSON)"""
        # Mock Cerebras response with plain text
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = """
        Question 1: What is a function parameter?
        Question 2: How do you call a function?
        Question 3: What does return do?
        """
        mock_cerebras.return_value = mock_response
        
        inputs = {"quiz_input": sample_quiz_input}
        result = quiz_chain(inputs)
        
        # Verify response
        assert "questions" in result
        assert len(result["questions"]) == 3
        
        # Verify questions were parsed from text
        for question in result["questions"]:
            assert "question" in question
            assert "type" in question
            assert question["type"] == "short_answer"
    
    @patch('simple_chains.cerebras_client.chat.completions.create')
    @patch('simple_chains.MEMORY_AVAILABLE', False)
    def test_quiz_chain_error_handling(self, mock_cerebras, quiz_chain, sample_quiz_input):
        """Test error handling in quiz generation"""
        mock_cerebras.side_effect = Exception("Network error")
        
        inputs = {"quiz_input": sample_quiz_input}
        result = quiz_chain(inputs)
        
        # Verify error response
        assert "questions" in result
        assert len(result["questions"]) == 1
        assert "Quiz generation failed" in result["questions"][0]["question"]
        assert "error" in result["metadata"]
    
    def test_create_quiz_prompt(self, quiz_chain, sample_quiz_input):
        """Test prompt creation for quiz generation"""
        prompt = quiz_chain._create_quiz_prompt(sample_quiz_input)
        
        assert "Python Functions" in prompt
        assert "medium" in prompt
        assert "3" in prompt
        assert "parameters" in prompt
        assert "return values" in prompt
        assert "multiple_choice" in prompt
    
    def test_parse_questions_json(self, quiz_chain, sample_quiz_input):
        """Test parsing questions from JSON response"""
        json_text = json.dumps([
            {
                "id": 1,
                "question": "Test question?",
                "type": "multiple_choice",
                "options": ["A", "B", "C", "D"],
                "correct_answer": "A",
                "explanation": "Test explanation"
            }
        ])
        
        questions = quiz_chain._parse_questions(json_text, sample_quiz_input)
        
        assert len(questions) == 1
        assert questions[0]["question"] == "Test question?"
        assert questions[0]["type"] == "multiple_choice"
    
    def test_parse_questions_text(self, quiz_chain, sample_quiz_input):
        """Test parsing questions from plain text"""
        text = """
        Question 1: What is Python?
        Some other text
        Question 2: How to define variables?
        More text
        """
        
        questions = quiz_chain._parse_questions(text, sample_quiz_input)
        
        assert len(questions) == 2
        assert "What is Python?" in questions[0]["question"]
        assert "How to define variables?" in questions[1]["question"]


class TestExplainChain:
    """Test ExplainChain functionality with mocked Cerebras responses"""
    
    @pytest.fixture
    def explain_chain(self):
        """Create ExplainChain instance for testing"""
        return ExplainChain()
    
    @pytest.fixture
    def sample_explain_input(self):
        """Create sample ExplainInput for testing"""
        return ExplainInput(
            user_id=uuid4(),
            concept="Recursion",
            complexity_level="intermediate",
            context="Computer Science course",
            format_preference="step-by-step",
            target_audience="student"
        )
    
    @patch('simple_chains.cerebras_client.chat.completions.create')
    @patch('simple_chains.MEMORY_AVAILABLE', False)
    def test_explain_chain_success(self, mock_cerebras, explain_chain, sample_explain_input):
        """Test successful concept explanation"""
        explanation_text = """
        Recursion is a programming technique where a function calls itself to solve a problem.
        
        Key concepts:
        1. Base case - when to stop
        2. Recursive case - how to break down the problem
        
        Example: Factorial function
        """
        
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = explanation_text
        mock_cerebras.return_value = mock_response
        
        inputs = {"explain_input": sample_explain_input}
        result = explain_chain(inputs)
        
        # Verify response structure
        assert "explanation" in result
        assert "key_points" in result
        assert "examples" in result
        assert "related_concepts" in result
        assert "further_reading" in result
        assert "metadata" in result
        
        assert result["explanation"] == explanation_text
        assert result["metadata"]["user_id"] == str(sample_explain_input.user_id)
    
    @patch('simple_chains.cerebras_client.chat.completions.create')
    @patch('simple_chains.MEMORY_AVAILABLE', False)
    def test_explain_chain_error_handling(self, mock_cerebras, explain_chain, sample_explain_input):
        """Test error handling in explanation generation"""
        mock_cerebras.side_effect = Exception("Service unavailable")
        
        inputs = {"explain_input": sample_explain_input}
        result = explain_chain(inputs)
        
        # Verify error response
        assert "Unable to generate explanation" in result["explanation"]
        assert "error" in result["metadata"]
        assert result["key_points"] == []
    
    def test_create_explain_prompt(self, explain_chain, sample_explain_input):
        """Test prompt creation for explanations"""
        prompt = explain_chain._create_explain_prompt(sample_explain_input)
        
        assert "Recursion" in prompt
        assert "intermediate" in prompt
        assert "Computer Science course" in prompt
        assert "step-by-step" in prompt
        assert "student" in prompt
        assert "clear, comprehensive explanation" in prompt
    
    def test_create_explain_prompt_no_context(self, explain_chain):
        """Test prompt creation without context"""
        input_data = ExplainInput(
            user_id=uuid4(),
            concept="Variables"
        )
        
        prompt = explain_chain._create_explain_prompt(input_data)
        
        assert "Variables" in prompt
        assert "intermediate" in prompt  # default
        assert "Context:" not in prompt


class TestFactoryFunctions:
    """Test factory functions for creating chain instances"""
    
    def test_create_plan_chain(self):
        """Test create_plan_chain factory function"""
        chain = create_plan_chain()
        assert isinstance(chain, PlanChain)
    
    def test_create_quiz_chain(self):
        """Test create_quiz_chain factory function"""
        chain = create_quiz_chain()
        assert isinstance(chain, QuizChain)
    
    def test_create_explain_chain(self):
        """Test create_explain_chain factory function"""
        chain = create_explain_chain()
        assert isinstance(chain, ExplainChain)


class TestMemoryIntegration:
    """Test memory integration across all chains"""
    
    @patch('simple_chains.MEMORY_AVAILABLE', True)
    @patch('simple_chains.get_context_for_ai_chain')
    def test_memory_context_retrieval_error_handling(self, mock_get_context):
        """Test handling of memory context retrieval errors"""
        mock_get_context.side_effect = Exception("Memory service down")
        
        # This should not break the chain execution
        plan_chain = PlanChain()
        input_data = StudyPlanInput(
            user_id=uuid4(),
            subject="Test",
            goals=["Learn"],
            timeline="1 week"
        )
        
        with patch('simple_chains.cerebras_client.chat.completions.create') as mock_cerebras:
            mock_response = Mock()
            mock_response.choices = [Mock()]
            mock_response.choices[0].message.content = "Test plan"
            mock_cerebras.return_value = mock_response
            
            inputs = {"study_plan_input": input_data}
            result = plan_chain(inputs)
            
            # Should still work without memory
            assert "title" in result
            assert "sections" in result
    
    @patch('simple_chains.MEMORY_AVAILABLE', True)
    @patch('simple_chains.store_user_interaction')
    def test_memory_storage_error_handling(self, mock_store):
        """Test handling of memory storage errors"""
        mock_store.side_effect = Exception("Storage failed")
        
        quiz_chain = QuizChain()
        input_data = QuizInput(
            user_id=uuid4(),
            topic="Test",
            difficulty="easy"
        )
        
        with patch('simple_chains.cerebras_client.chat.completions.create') as mock_cerebras:
            mock_response = Mock()
            mock_response.choices = [Mock()]
            mock_response.choices[0].message.content = '[]'
            mock_cerebras.return_value = mock_response
            
            inputs = {"quiz_input": input_data}
            result = quiz_chain(inputs)
            
            # Should still work even if storage fails
            assert "questions" in result
            assert "metadata" in result


if __name__ == "__main__":
    pytest.main([__file__])