from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
from uuid import UUID
import uuid

class User(BaseModel):
    """
    User model for authentication and user data
    """
    id: UUID = Field(..., description="Unique user identifier")
    email: Optional[str] = Field(None, description="User's email address") 
    name: Optional[str] = Field(None, description="User's display name")
    created_at: Optional[datetime] = Field(None, description="Account creation timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "user@example.com",
                "name": "John Doe",
                "created_at": "2024-01-15T10:30:00Z"
            }
        }

class StudyPlanCreate(BaseModel):
    """
    Pydantic model for creating a new study plan
    """
    user_id: UUID = Field(
        ..., 
        description="Unique identifier for the user",
        example="123e4567-e89b-12d3-a456-426614174000"
    )
    plan: Dict[str, Any] = Field(
        ..., 
        description="Study plan data as a flexible dictionary structure",
        example={
            "title": "Advanced Mathematics Study Plan",
            "subjects": ["Calculus", "Linear Algebra", "Statistics"],
            "duration_weeks": 12,
            "daily_hours": 2,
            "difficulty_level": "advanced",
            "goals": [
                "Master differential calculus",
                "Understand matrix operations",
                "Complete statistical analysis projects"
            ],
            "schedule": {
                "monday": ["Calculus - 2hrs"],
                "wednesday": ["Linear Algebra - 2hrs"],
                "friday": ["Statistics - 2hrs"]
            }
        }
    )

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "plan": {
                    "title": "Web Development Bootcamp",
                    "subjects": ["HTML/CSS", "JavaScript", "React", "Node.js"],
                    "duration_weeks": 16,
                    "daily_hours": 3,
                    "difficulty_level": "intermediate",
                    "goals": [
                        "Build responsive websites",
                        "Create interactive web applications",
                        "Develop full-stack projects"
                    ],
                    "schedule": {
                        "monday": ["HTML/CSS - 1.5hrs", "JavaScript - 1.5hrs"],
                        "tuesday": ["React - 3hrs"],
                        "wednesday": ["Node.js - 3hrs"],
                        "thursday": ["Project work - 3hrs"],
                        "friday": ["Review and practice - 3hrs"]
                    }
                }
            }
        }


class StudyPlan(BaseModel):
    """
    Pydantic model representing a complete study plan with database fields
    """
    id: int = Field(
        ..., 
        description="Unique identifier for the study plan",
        example=1
    )
    user_id: UUID = Field(
        ..., 
        description="Unique identifier for the user who owns this plan",
        example="123e4567-e89b-12d3-a456-426614174000"
    )
    plan: Dict[str, Any] = Field(
        ..., 
        description="Study plan data as a flexible dictionary structure"
    )
    created_at: datetime = Field(
        ..., 
        description="Timestamp when the study plan was created",
        example="2024-01-15T10:30:00Z"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "plan": {
                    "title": "Data Science Fundamentals",
                    "subjects": ["Python", "Statistics", "Machine Learning", "Data Visualization"],
                    "duration_weeks": 20,
                    "daily_hours": 2.5,
                    "difficulty_level": "intermediate",
                    "goals": [
                        "Learn Python for data analysis",
                        "Understand statistical concepts",
                        "Build machine learning models",
                        "Create data visualizations"
                    ],
                    "schedule": {
                        "monday": ["Python basics - 2.5hrs"],
                        "tuesday": ["Statistics - 2.5hrs"],
                        "wednesday": ["Data manipulation - 2.5hrs"],
                        "thursday": ["Machine Learning - 2.5hrs"],
                        "friday": ["Data Visualization - 2.5hrs"]
                    },
                    "progress": {
                        "completed_weeks": 3,
                        "current_subject": "Statistics",
                        "completion_percentage": 15
                    }
                },
                "created_at": "2024-01-15T10:30:00Z"
            }
        }


class StudyPlanUpdate(BaseModel):
    """
    Pydantic model for updating an existing study plan
    """
    plan: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Updated study plan data"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "plan": {
                    "title": "Updated Study Plan Title",
                    "progress": {
                        "completed_weeks": 5,
                        "current_subject": "Machine Learning",
                        "completion_percentage": 25
                    }
                }
            }
        }


class StudyPlanResponse(BaseModel):
    """
    Standard response model for study plan operations
    """
    success: bool = Field(..., description="Whether the operation was successful")
    message: str = Field(..., description="Response message")
    data: Optional[StudyPlan] = Field(default=None, description="Study plan data if applicable")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Study plan created successfully",
                "data": {
                    "id": 1,
                    "user_id": "123e4567-e89b-12d3-a456-426614174000",
                    "plan": {
                        "title": "Sample Study Plan",
                        "subjects": ["Math", "Science"],
                        "duration_weeks": 8
                    },
                    "created_at": "2024-01-15T10:30:00Z"
                }
            }
        }

class ChatMessage(BaseModel):
    """
    Model for chat messages sent to Cerebras AI
    """
    message: str = Field(..., description="User's message/question")
    context: Optional[str] = Field(None, description="Optional context for the conversation")
    model: Optional[str] = Field("llama3.1-8b", description="Cerebras model to use")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Explain quantum physics in simple terms",
                "context": "I'm a high school student learning physics",
                "model": "llama3.1-8b"
            }
        }

class ChatResponse(BaseModel):
    """
    Response model for chat messages from Cerebras AI
    """
    response: str = Field(..., description="AI response to the user's message")
    model_used: str = Field(..., description="The Cerebras model that generated the response")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "Quantum physics is the branch of physics that studies the behavior of matter and energy at the atomic and subatomic level...",
                "model_used": "llama3.1-8b",
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }