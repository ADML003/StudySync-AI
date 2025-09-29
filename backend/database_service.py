"""
Database service module for StudySync AI interaction tracking.

This module provides asynchronous database operations for storing user interactions
with AI features (study plans, quiz questions, explanations) in Supabase.

Features:
- Async database operations with proper error handling
- Structured logging for monitoring and debugging
- User-scoped data access with RLS compliance
- JSON data validation and serialization
- Comprehensive interaction history tracking
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List
from uuid import UUID
import traceback

from supabase_client import get_supabase_client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DatabaseService:
    """Service class for handling database operations"""
    
    def __init__(self):
        self.supabase = get_supabase_client()
        if not self.supabase:
            logger.warning("Supabase client not available. Database operations will be disabled.")
    
    async def save_study_plan_async(
        self,
        user_id: UUID,
        input_data: Dict[str, Any],
        output_data: Dict[str, Any]
    ) -> Optional[str]:
        """
        Asynchronously save study plan interaction to database
        
        Args:
            user_id: User identifier
            input_data: Original request data
            output_data: Generated plan data
            
        Returns:
            str: Record ID if successful, None if failed
        """
        if not self.supabase:
            logger.warning("Database not available - study plan not saved")
            return None
        
        try:
            # Extract plan details from output data
            plan = output_data.get("plan", {})
            
            # Prepare record data
            record_data = {
                "user_id": str(user_id),
                "subject": input_data.get("subject", "Unknown"),
                "title": plan.get("title", "Untitled Study Plan"),
                "description": plan.get("description", ""),
                "goals": input_data.get("goals", []),
                "timeline": input_data.get("timeline", ""),
                "difficulty_level": input_data.get("difficulty_level", "intermediate"),
                "sections": plan.get("sections", []),
                "learning_objectives": plan.get("learning_objectives", []),
                "recommended_resources": plan.get("recommended_resources", []),
                "input_data": input_data,
                "output_data": output_data,
                "metadata": output_data.get("metadata", {}),
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            # Execute async database operation
            result = await asyncio.to_thread(
                self._insert_record,
                "study_plans",
                record_data
            )
            
            if result:
                logger.info(f"Successfully saved study plan for user {user_id}: {result.get('id')}")
                return result.get('id')
            else:
                logger.error(f"Failed to save study plan for user {user_id}")
                return None
                
        except Exception as e:
            logger.error(f"Error saving study plan: {str(e)}")
            logger.error(traceback.format_exc())
            return None
    
    async def save_question_history_async(
        self,
        user_id: UUID,
        input_data: Dict[str, Any],
        output_data: Dict[str, Any]
    ) -> Optional[str]:
        """
        Asynchronously save quiz question interaction to database
        
        Args:
            user_id: User identifier
            input_data: Original request data
            output_data: Generated quiz data
            
        Returns:
            str: Record ID if successful, None if failed
        """
        if not self.supabase:
            logger.warning("Database not available - question history not saved")
            return None
        
        try:
            # Extract quiz details
            questions = output_data.get("questions", [])
            quiz_info = output_data.get("quiz_info", {})
            
            # Prepare record data
            record_data = {
                "user_id": str(user_id),
                "topic": input_data.get("topic", "Unknown"),
                "difficulty": input_data.get("difficulty", "medium"),
                "question_count": len(questions),
                "question_types": input_data.get("question_types", ["multiple_choice"]),
                "focus_areas": input_data.get("focus_areas", []),
                "questions": questions,
                "input_data": input_data,
                "output_data": output_data,
                "metadata": output_data.get("metadata", {}),
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            # Execute async database operation
            result = await asyncio.to_thread(
                self._insert_record,
                "question_history",
                record_data
            )
            
            if result:
                logger.info(f"Successfully saved question history for user {user_id}: {result.get('id')}")
                return result.get('id')
            else:
                logger.error(f"Failed to save question history for user {user_id}")
                return None
                
        except Exception as e:
            logger.error(f"Error saving question history: {str(e)}")
            logger.error(traceback.format_exc())
            return None
    
    async def save_explanation_request_async(
        self,
        user_id: UUID,
        input_data: Dict[str, Any],
        output_data: Dict[str, Any]
    ) -> Optional[str]:
        """
        Asynchronously save explanation request interaction to database
        
        Args:
            user_id: User identifier
            input_data: Original request data
            output_data: Generated explanation data
            
        Returns:
            str: Record ID if successful, None if failed
        """
        if not self.supabase:
            logger.warning("Database not available - explanation request not saved")
            return None
        
        try:
            # Extract explanation details
            explanation = output_data.get("explanation", {})
            concept_info = output_data.get("concept_info", {})
            
            # Prepare record data
            record_data = {
                "user_id": str(user_id),
                "concept": input_data.get("concept", "Unknown"),
                "complexity_level": input_data.get("complexity_level", "intermediate"),
                "target_audience": input_data.get("target_audience", "general"),
                "format_preference": input_data.get("format_preference", "detailed"),
                "context": input_data.get("context", ""),
                "explanation_content": explanation.get("content", ""),
                "key_points": explanation.get("key_points", []),
                "examples": explanation.get("examples", []),
                "related_concepts": explanation.get("related_concepts", []),
                "further_reading": explanation.get("further_reading", []),
                "input_data": input_data,
                "output_data": output_data,
                "metadata": output_data.get("metadata", {}),
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            # Execute async database operation
            result = await asyncio.to_thread(
                self._insert_record,
                "explanation_requests",
                record_data
            )
            
            if result:
                logger.info(f"Successfully saved explanation request for user {user_id}: {result.get('id')}")
                return result.get('id')
            else:
                logger.error(f"Failed to save explanation request for user {user_id}")
                return None
                
        except Exception as e:
            logger.error(f"Error saving explanation request: {str(e)}")
            logger.error(traceback.format_exc())
            return None
    
    def _insert_record(self, table_name: str, record_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Insert a record into the specified table (synchronous operation)
        
        Args:
            table_name: Name of the table to insert into
            record_data: Data to insert
            
        Returns:
            Dict: Inserted record data if successful, None if failed
        """
        try:
            # Ensure JSON serializable data
            serialized_data = self._serialize_record_data(record_data)
            
            # Insert into Supabase
            result = self.supabase.table(table_name).insert(serialized_data).execute()
            
            if result.data and len(result.data) > 0:
                return result.data[0]
            else:
                logger.error(f"Insert to {table_name} returned no data")
                return None
                
        except Exception as e:
            logger.error(f"Database insert error for {table_name}: {str(e)}")
            return None
    
    def _serialize_record_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ensure all data is JSON serializable for database storage
        
        Args:
            data: Raw record data
            
        Returns:
            Dict: Serialized data safe for database storage
        """
        try:
            # Convert any non-serializable objects to strings
            serialized = {}
            for key, value in data.items():
                if isinstance(value, (dict, list)):
                    # Ensure nested structures are serializable
                    serialized[key] = json.loads(json.dumps(value, default=str))
                elif isinstance(value, UUID):
                    serialized[key] = str(value)
                else:
                    serialized[key] = value
            
            return serialized
            
        except Exception as e:
            logger.error(f"Error serializing record data: {str(e)}")
            return data
    
    async def get_user_interactions_summary(self, user_id: UUID) -> Dict[str, Any]:
        """
        Get summary of user interactions for analytics
        
        Args:
            user_id: User identifier
            
        Returns:
            Dict: Summary of user interactions
        """
        if not self.supabase:
            return {"error": "Database not available"}
        
        try:
            # Get counts from each table
            study_plans_result = await asyncio.to_thread(
                lambda: self.supabase.table("study_plans").select("id").eq("user_id", str(user_id)).execute()
            )
            
            question_history_result = await asyncio.to_thread(
                lambda: self.supabase.table("question_history").select("id").eq("user_id", str(user_id)).execute()
            )
            
            explanation_requests_result = await asyncio.to_thread(
                lambda: self.supabase.table("explanation_requests").select("id").eq("user_id", str(user_id)).execute()
            )
            
            return {
                "user_id": str(user_id),
                "total_study_plans": len(study_plans_result.data) if study_plans_result.data else 0,
                "total_quizzes": len(question_history_result.data) if question_history_result.data else 0,
                "total_explanations": len(explanation_requests_result.data) if explanation_requests_result.data else 0,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting user interactions summary: {str(e)}")
            return {"error": str(e)}


# Global database service instance
db_service = DatabaseService()


# Convenience functions for easy import
async def save_study_plan_to_db(user_id: UUID, input_data: Dict[str, Any], output_data: Dict[str, Any]) -> Optional[str]:
    """Save study plan interaction to database"""
    return await db_service.save_study_plan_async(user_id, input_data, output_data)


async def save_question_history_to_db(user_id: UUID, input_data: Dict[str, Any], output_data: Dict[str, Any]) -> Optional[str]:
    """Save question history interaction to database"""
    return await db_service.save_question_history_async(user_id, input_data, output_data)


async def save_explanation_request_to_db(user_id: UUID, input_data: Dict[str, Any], output_data: Dict[str, Any]) -> Optional[str]:
    """Save explanation request interaction to database"""
    return await db_service.save_explanation_request_async(user_id, input_data, output_data)


async def get_user_summary(user_id: UUID) -> Dict[str, Any]:
    """Get user interaction summary"""
    return await db_service.get_user_interactions_summary(user_id)