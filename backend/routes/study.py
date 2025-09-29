from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
import logging
from uuid import UUID

from auth import get_current_user
from models import User
from simple_chains import (
    create_plan_chain, StudyPlanInput,
    create_quiz_chain, QuizInput,
    create_explain_chain, ExplainInput
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/study", tags=["study"])

# Initialize the chains
plan_chain = create_plan_chain()
quiz_chain = create_quiz_chain()
explain_chain = create_explain_chain()


@router.post("/plans")
async def generate_study_plan(
    plan_data: StudyPlanInput,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Generate an AI-powered study plan using PlanChain
    
    This endpoint creates a personalized study plan based on the user's
    learning goals, timeline, and preferences using Cerebras AI.
    """
    try:
        # Override user_id with authenticated user
        plan_data.user_id = current_user.id
        
        logger.info(f"Generating study plan for user {current_user.id}, subject: {plan_data.subject}")
        
        # Call the PlanChain
        result = plan_chain({"study_plan_input": plan_data})
        
        logger.info(f"Successfully generated study plan with {len(result.get('sections', []))} sections")
        
        return {
            "success": True,
            "plan": {
                "title": result.get("title"),
                "description": result.get("description"),
                "sections": result.get("sections", []),
                "total_duration": result.get("total_duration"),
                "difficulty_level": result.get("difficulty_level"),
                "learning_objectives": result.get("learning_objectives", []),
                "recommended_resources": result.get("recommended_resources", [])
            },
            "metadata": result.get("metadata", {}),
            "user_id": str(current_user.id)
        }
        
    except Exception as e:
        logger.error(f"Error generating study plan: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate study plan: {str(e)}"
        )


@router.post("/questions")
async def generate_quiz_questions(
    quiz_data: QuizInput,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Generate AI-powered quiz questions using QuizChain
    
    This endpoint creates practice questions based on the specified topic,
    difficulty level, and question types using Cerebras AI.
    """
    try:
        # Override user_id with authenticated user
        quiz_data.user_id = current_user.id
        
        logger.info(f"Generating quiz for user {current_user.id}, topic: {quiz_data.topic}, difficulty: {quiz_data.difficulty}")
        
        # Call the QuizChain
        result = quiz_chain({"quiz_input": quiz_data})
        
        questions = result.get("questions", [])
        logger.info(f"Successfully generated {len(questions)} questions")
        
        return {
            "success": True,
            "questions": questions,
            "metadata": result.get("metadata", {}),
            "quiz_info": {
                "topic": quiz_data.topic,
                "difficulty": quiz_data.difficulty,
                "question_count": len(questions),
                "question_types": quiz_data.question_types or ["multiple_choice"],
                "user_id": str(current_user.id)
            }
        }
        
    except Exception as e:
        logger.error(f"Error generating quiz questions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate quiz questions: {str(e)}"
        )


@router.post("/explain")
async def explain_concept(
    explain_data: ExplainInput,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Generate AI-powered concept explanation using ExplainChain
    
    This endpoint provides detailed explanations of concepts adapted to
    the user's complexity level and learning preferences using Cerebras AI.
    """
    try:
        # Override user_id with authenticated user
        explain_data.user_id = current_user.id
        
        logger.info(f"Generating explanation for user {current_user.id}, concept: {explain_data.concept}")
        
        # Call the ExplainChain
        result = explain_chain({"explain_input": explain_data})
        
        logger.info(f"Successfully generated explanation for concept: {explain_data.concept}")
        
        return {
            "success": True,
            "explanation": {
                "content": result.get("explanation"),
                "key_points": result.get("key_points", []),
                "examples": result.get("examples", []),
                "related_concepts": result.get("related_concepts", []),
                "further_reading": result.get("further_reading", [])
            },
            "metadata": result.get("metadata", {}),
            "concept_info": {
                "concept": explain_data.concept,
                "complexity_level": explain_data.complexity_level or "intermediate",
                "format_preference": explain_data.format_preference or "detailed",
                "target_audience": explain_data.target_audience or "general",
                "user_id": str(current_user.id)
            }
        }
        
    except Exception as e:
        logger.error(f"Error generating explanation: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate explanation: {str(e)}"
        )


# Health check endpoint for the study routes
@router.get("/health")
async def study_health_check():
    """Health check endpoint for study routes"""
    try:
        # Test that all chains are properly initialized
        chains_status = {
            "plan_chain": plan_chain is not None,
            "quiz_chain": quiz_chain is not None,
            "explain_chain": explain_chain is not None
        }
        
        all_chains_ready = all(chains_status.values())
        
        return {
            "status": "healthy" if all_chains_ready else "degraded",
            "chains": chains_status,
            "message": "All AI chains are ready" if all_chains_ready else "Some chains are not initialized"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "message": "Study routes health check failed"
        }