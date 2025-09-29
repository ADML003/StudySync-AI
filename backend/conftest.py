"""
Pytest configuration and shared fixtures for StudySync AI tests.
Provides common test setup, mocks, and utilities for both unit and integration tests.
"""

import pytest
import asyncio
import os
from unittest.mock import Mock, patch, AsyncMock
from uuid import uuid4
from datetime import datetime
from typing import Dict, Any, Generator

from fastapi.testclient import TestClient
from models import User


# Test Configuration
pytest_plugins = ["pytest_asyncio"]


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


# Common Test Data Fixtures
@pytest.fixture
def sample_user() -> User:
    """Create a sample user for testing"""
    return User(
        id=uuid4(),
        email="test@studysync.ai",
        name="Test User",
        created_at=datetime.now()
    )


@pytest.fixture
def sample_user_dict() -> Dict[str, Any]:
    """Create a sample user dictionary for testing"""
    return {
        "id": str(uuid4()),
        "email": "test@studysync.ai",
        "name": "Test User",
        "created_at": datetime.now().isoformat()
    }


@pytest.fixture
def sample_study_plan_input() -> Dict[str, Any]:
    """Create sample study plan input data"""
    return {
        "subject": "Python Programming",
        "goals": ["Learn fundamentals", "Build web applications", "Master data structures"],
        "timeline": "8 weeks",
        "difficulty_level": "intermediate",
        "learning_style": "hands-on",
        "time_commitment": "2 hours per day",
        "focus_areas": ["syntax", "web frameworks", "algorithms"],
        "current_knowledge": "Basic programming concepts"
    }


@pytest.fixture
def sample_quiz_input() -> Dict[str, Any]:
    """Create sample quiz input data"""
    return {
        "topic": "Python Functions and Modules",
        "difficulty": "medium",
        "question_count": 5,
        "question_types": ["multiple_choice", "short_answer"],
        "focus_areas": ["function definition", "parameters", "modules", "imports"],
        "learning_objectives": ["Understand function syntax", "Apply modular programming"]
    }


@pytest.fixture
def sample_explain_input() -> Dict[str, Any]:
    """Create sample explanation input data"""
    return {
        "concept": "Object-Oriented Programming",
        "complexity_level": "intermediate",
        "context": "Python programming course for beginners",
        "format_preference": "step-by-step",
        "target_audience": "programming students"
    }


@pytest.fixture
def sample_study_plan_response() -> Dict[str, Any]:
    """Create sample study plan response"""
    return {
        "title": "Comprehensive Python Programming Study Plan",
        "description": "An 8-week intensive course covering Python fundamentals to advanced topics",
        "sections": [
            {
                "week": 1,
                "title": "Python Basics and Environment Setup",
                "topics": ["Installation", "Variables", "Data Types", "Basic Operations"],
                "activities": ["Install Python", "Complete basic exercises", "Practice with REPL"],
                "time_allocation": "14 hours",
                "learning_objectives": ["Set up development environment", "Understand basic syntax"],
                "resources": ["Python.org tutorial", "Interactive Python course"]
            },
            {
                "week": 2,
                "title": "Control Structures and Functions",
                "topics": ["If statements", "Loops", "Function definition", "Scope"],
                "activities": ["Build calculator", "Create utility functions", "Practice debugging"],
                "time_allocation": "14 hours",
                "learning_objectives": ["Master control flow", "Write reusable functions"],
                "resources": ["Automate the Boring Stuff", "Python documentation"]
            }
        ],
        "total_duration": "8 weeks",
        "difficulty_level": "intermediate",
        "learning_objectives": [
            "Master Python syntax and semantics",
            "Build real-world applications",
            "Understand object-oriented programming",
            "Develop problem-solving skills"
        ],
        "recommended_resources": [
            "Python Crash Course by Eric Matthes",
            "Automate the Boring Stuff with Python",
            "Python.org official documentation",
            "Real Python tutorials"
        ],
        "metadata": {
            "user_id": "test-user-id",
            "generated_at": datetime.now().isoformat(),
            "model_used": "llama3.1-8b",
            "generation_time": "2.3s"
        }
    }


@pytest.fixture
def sample_quiz_response() -> Dict[str, Any]:
    """Create sample quiz response"""
    return {
        "questions": [
            {
                "id": 1,
                "question": "Which keyword is used to define a function in Python?",
                "type": "multiple_choice",
                "options": ["def", "function", "func", "define"],
                "correct_answer": "def",
                "explanation": "The 'def' keyword is used to define functions in Python. It starts the function definition followed by the function name and parameters.",
                "topic": "Function Definition",
                "difficulty": "easy",
                "learning_objective": "Understand basic function syntax"
            },
            {
                "id": 2,
                "question": "What does the 'return' statement do in a Python function?",
                "type": "multiple_choice",
                "options": [
                    "Ends the function and returns a value",
                    "Prints a value to console",
                    "Stores a value in memory",
                    "Creates a new variable"
                ],
                "correct_answer": "Ends the function and returns a value",
                "explanation": "The 'return' statement terminates function execution and optionally returns a value to the caller.",
                "topic": "Function Return Values",
                "difficulty": "medium",
                "learning_objective": "Understand function return behavior"
            },
            {
                "id": 3,
                "question": "Explain the difference between parameters and arguments in Python functions.",
                "type": "short_answer",
                "options": [],
                "correct_answer": "Parameters are variables in function definition; arguments are actual values passed when calling",
                "explanation": "Parameters are the variable names in the function definition, while arguments are the actual values passed to the function when it's called.",
                "topic": "Function Parameters",
                "difficulty": "medium",
                "learning_objective": "Distinguish between parameters and arguments"
            }
        ],
        "metadata": {
            "user_id": "test-user-id",
            "generated_at": datetime.now().isoformat(),
            "model_used": "llama3.1-8b",
            "generation_time": "1.8s",
            "total_questions": 3
        }
    }


@pytest.fixture
def sample_explain_response() -> Dict[str, Any]:
    """Create sample explanation response"""
    return {
        "explanation": """Object-Oriented Programming (OOP) is a programming paradigm that organizes code using objects and classes. It's a way of thinking about and structuring programs that makes them more modular, reusable, and easier to maintain.

## Core Concepts

1. **Classes**: Blueprints or templates that define the structure and behavior of objects
2. **Objects**: Instances of classes that contain actual data and can perform actions
3. **Encapsulation**: Bundling data and methods together within a class
4. **Inheritance**: Creating new classes based on existing ones
5. **Polymorphism**: Objects of different types responding to the same interface

## Step-by-Step Example

Let's create a simple `Car` class to demonstrate these concepts:

```python
# Step 1: Define a class (blueprint)
class Car:
    def __init__(self, brand, model, year):
        self.brand = brand      # Attribute (data)
        self.model = model      # Attribute (data)
        self.year = year        # Attribute (data)
        self.is_running = False # Attribute (data)
    
    def start_engine(self):     # Method (behavior)
        self.is_running = True
        return f"{self.brand} {self.model} engine started!"
    
    def stop_engine(self):      # Method (behavior)
        self.is_running = False
        return f"{self.brand} {self.model} engine stopped!"

# Step 2: Create objects (instances)
my_car = Car("Toyota", "Camry", 2022)
your_car = Car("Honda", "Civic", 2023)

# Step 3: Use the objects
print(my_car.start_engine())    # Output: Toyota Camry engine started!
print(your_car.brand)           # Output: Honda
```

## Why Use OOP?

- **Organization**: Code is organized into logical units
- **Reusability**: Classes can be reused to create multiple objects
- **Maintainability**: Changes to a class affect all its instances
- **Abstraction**: Complex functionality is hidden behind simple interfaces""",
        "key_points": [
            "OOP organizes code using objects and classes",
            "Classes are blueprints; objects are instances of classes",
            "Encapsulation bundles data and methods together",
            "Inheritance allows creating new classes from existing ones",
            "Polymorphism enables different objects to respond to same interface",
            "OOP promotes code organization, reusability, and maintainability"
        ],
        "examples": [
            "class Car: # Class definition",
            "my_car = Car('Toyota', 'Camry', 2022) # Object creation",
            "my_car.start_engine() # Method call",
            "class ElectricCar(Car): # Inheritance example"
        ],
        "related_concepts": [
            "Abstraction",
            "Design Patterns",
            "SOLID Principles",
            "Composition vs Inheritance",
            "Method Overriding",
            "Class vs Instance Variables"
        ],
        "further_reading": [
            "Python Object-Oriented Programming by Steven F. Lott",
            "Design Patterns: Elements of Reusable Object-Oriented Software",
            "Clean Code: A Handbook of Agile Software Craftsmanship",
            "Python's official OOP tutorial"
        ],
        "metadata": {
            "user_id": "test-user-id",
            "generated_at": datetime.now().isoformat(),
            "model_used": "llama3.1-8b",
            "generation_time": "3.1s",
            "complexity_level": "intermediate",
            "target_audience": "programming students"
        }
    }


# Mock Fixtures for External Dependencies
@pytest.fixture
def mock_cerebras_client():
    """Mock Cerebras client for testing"""
    with patch('simple_chains.cerebras_client') as mock_client:
        # Setup default mock response
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = "Test AI response"
        mock_client.chat.completions.create.return_value = mock_response
        yield mock_client


@pytest.fixture
def mock_supabase_client():
    """Mock Supabase client for testing"""
    with patch('database_service.get_supabase_client') as mock_client:
        mock_instance = Mock()
        mock_client.return_value = mock_instance
        yield mock_instance


@pytest.fixture
def mock_memory_manager():
    """Mock memory manager for testing"""
    with patch('simple_chains.MEMORY_AVAILABLE', True), \
         patch('simple_chains.get_context_for_ai_chain') as mock_get_context, \
         patch('simple_chains.store_user_interaction') as mock_store:
        
        mock_get_context.return_value = []
        mock_store.return_value = None
        yield {"get_context": mock_get_context, "store": mock_store}


@pytest.fixture
def mock_auth():
    """Mock authentication for testing"""
    with patch('auth.get_current_user') as mock_get_user:
        # Setup default mock user
        mock_user = User(
            id=uuid4(),
            email="test@studysync.ai",
            name="Test User",
            created_at=datetime.now()
        )
        mock_get_user.return_value = mock_user
        yield mock_get_user


@pytest.fixture
def mock_database_operations():
    """Mock all database operations for testing"""
    with patch('database_service.save_study_plan_to_db') as mock_save_plan, \
         patch('database_service.save_question_history_to_db') as mock_save_quiz, \
         patch('database_service.save_explanation_request_to_db') as mock_save_explain:
        
        # Setup default return values
        mock_save_plan.return_value = "plan-record-id"
        mock_save_quiz.return_value = "quiz-record-id"
        mock_save_explain.return_value = "explain-record-id"
        
        yield {
            "save_plan": mock_save_plan,
            "save_quiz": mock_save_quiz,
            "save_explain": mock_save_explain
        }


# Test Client Fixtures
@pytest.fixture
def test_client():
    """Create FastAPI test client"""
    from main import app
    return TestClient(app)


@pytest.fixture
def authenticated_client(test_client, mock_auth):
    """Create authenticated test client"""
    return test_client


# Utility Functions for Tests
def create_mock_chain_response(content: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
    """Create a mock chain response with given content"""
    if metadata is None:
        metadata = {
            "user_id": str(uuid4()),
            "generated_at": datetime.now().isoformat(),
            "model_used": "llama3.1-8b"
        }
    
    return {
        "content": content,
        "metadata": metadata
    }


def assert_valid_response_structure(response: Dict[str, Any], expected_keys: list):
    """Assert that response has the expected structure"""
    assert isinstance(response, dict)
    for key in expected_keys:
        assert key in response, f"Expected key '{key}' not found in response"


def assert_valid_metadata(metadata: Dict[str, Any]):
    """Assert that metadata has required fields"""
    required_fields = ["user_id", "generated_at", "model_used"]
    for field in required_fields:
        assert field in metadata, f"Required metadata field '{field}' missing"
    
    # Validate user_id format
    try:
        uuid4().hex  # This will validate UUID format
    except ValueError:
        pytest.fail("Invalid UUID format in metadata.user_id")


# Environment Setup for Tests
@pytest.fixture(autouse=True)
def setup_test_environment():
    """Setup test environment variables and configurations"""
    # Set test-specific environment variables
    original_env = os.environ.copy()
    
    # Set test environment
    os.environ["TESTING"] = "true"
    os.environ["LOG_LEVEL"] = "DEBUG"
    
    yield
    
    # Restore original environment
    os.environ.clear()
    os.environ.update(original_env)


# Async Test Helpers
@pytest.fixture
def mock_async_background_task():
    """Mock background tasks for async testing"""
    with patch('fastapi.BackgroundTasks') as mock_bg_tasks:
        mock_instance = Mock()
        mock_bg_tasks.return_value = mock_instance
        yield mock_instance


# Error Simulation Fixtures
@pytest.fixture
def simulate_cerebras_error():
    """Fixture to simulate Cerebras API errors"""
    def _simulate_error(error_type="network"):
        if error_type == "network":
            return Exception("Network connection failed")
        elif error_type == "api_limit":
            return Exception("API rate limit exceeded")
        elif error_type == "invalid_response":
            return Exception("Invalid response format")
        else:
            return Exception("Unknown error")
    
    return _simulate_error


@pytest.fixture
def simulate_database_error():
    """Fixture to simulate database errors"""
    def _simulate_error(error_type="connection"):
        if error_type == "connection":
            return Exception("Database connection failed")
        elif error_type == "timeout":
            return Exception("Database operation timed out")
        elif error_type == "permission":
            return Exception("Insufficient database permissions")
        else:
            return Exception("Unknown database error")
    
    return _simulate_error


# Performance Testing Fixtures
@pytest.fixture
def performance_monitor():
    """Monitor performance of test operations"""
    import time
    
    class PerformanceMonitor:
        def __init__(self):
            self.start_time = None
            self.end_time = None
        
        def start(self):
            self.start_time = time.time()
        
        def stop(self):
            self.end_time = time.time()
        
        @property
        def duration(self):
            if self.start_time and self.end_time:
                return self.end_time - self.start_time
            return None
        
        def assert_duration_under(self, max_seconds):
            assert self.duration is not None, "Performance monitoring not started/stopped"
            assert self.duration < max_seconds, f"Operation took {self.duration}s, expected < {max_seconds}s"
    
    return PerformanceMonitor()


# Test Data Validation
def validate_study_plan_structure(plan: Dict[str, Any]):
    """Validate study plan response structure"""
    required_fields = ["title", "description", "sections", "metadata"]
    for field in required_fields:
        assert field in plan, f"Missing required field: {field}"
    
    # Validate sections
    assert isinstance(plan["sections"], list)
    for section in plan["sections"]:
        section_fields = ["week", "title", "topics", "activities", "time_allocation"]
        for field in section_fields:
            assert field in section, f"Missing section field: {field}"


def validate_quiz_structure(quiz: Dict[str, Any]):
    """Validate quiz response structure"""
    required_fields = ["questions", "metadata"]
    for field in required_fields:
        assert field in quiz, f"Missing required field: {field}"
    
    # Validate questions
    assert isinstance(quiz["questions"], list)
    for question in quiz["questions"]:
        question_fields = ["id", "question", "type", "correct_answer", "explanation"]
        for field in question_fields:
            assert field in question, f"Missing question field: {field}"


def validate_explanation_structure(explanation: Dict[str, Any]):
    """Validate explanation response structure"""
    required_fields = ["explanation", "key_points", "examples", "metadata"]
    for field in required_fields:
        assert field in explanation, f"Missing required field: {field}"
    
    # Validate that lists are actually lists
    list_fields = ["key_points", "examples", "related_concepts", "further_reading"]
    for field in list_fields:
        if field in explanation:
            assert isinstance(explanation[field], list), f"{field} should be a list"


# Configuration for pytest
def pytest_configure(config):
    """Configure pytest with custom settings"""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )
    config.addinivalue_line(
        "markers", "auth: marks tests related to authentication"
    )
    config.addinivalue_line(
        "markers", "database: marks tests requiring database"
    )


# Test discovery settings
def pytest_collection_modifyitems(config, items):
    """Modify test collection to add markers automatically"""
    for item in items:
        # Add unit test marker to test_chains.py tests
        if "test_chains" in str(item.fspath):
            item.add_marker(pytest.mark.unit)
        
        # Add integration test marker to test_routes.py tests
        if "test_routes" in str(item.fspath):
            item.add_marker(pytest.mark.integration)
        
        # Add auth marker to authentication tests
        if "auth" in item.name.lower():
            item.add_marker(pytest.mark.auth)
        
        # Add database marker to database tests
        if any(db_term in item.name.lower() for db_term in ["database", "save", "db"]):
            item.add_marker(pytest.mark.database)