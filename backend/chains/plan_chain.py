"""
LangChain-based study plan generation chain using Cerebras AI.
Provides intelligent, personalized study plan creation with structured output.
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from uuid import UUID

from langchain.schema import BaseOutputParser
from langchain.prompts import PromptTemplate
from langchain.chains.base import Chain
from pydantic import BaseModel, Field

from cerebras_client import cerebras_client

# Configure logging
logger = logging.getLogger(__name__)

class StudyPlanInput(BaseModel):
    """Input model for study plan generation"""
    user_id: UUID = Field(..., description="Unique identifier for the user")
    subject: str = Field(..., description="Subject or topic to study")
    exam_date: Optional[str] = Field(None, description="Target exam date (YYYY-MM-DD)")
    current_level: str = Field(..., description="Current knowledge level (beginner, intermediate, advanced)")
    available_hours_per_day: Optional[float] = Field(2.0, description="Hours available for study per day")
    preferred_study_style: Optional[str] = Field("mixed", description="Learning style preference")
    specific_goals: Optional[str] = Field(None, description="Specific learning objectives")

class StudyPlanOutputParser(BaseOutputParser):
    """Parser for Cerebras AI study plan JSON response"""
    
    def parse(self, text: str) -> Dict[str, Any]:
        """
        Parse the JSON response from Cerebras AI into a structured study plan.
        
        Args:
            text: Raw JSON response from Cerebras AI
            
        Returns:
            Dict: Parsed study plan data
            
        Raises:
            ValueError: If JSON parsing fails
        """
        try:
            # Clean the response text
            text = text.strip()
            
            # Handle potential markdown code blocks
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            # Parse JSON
            plan_data = json.loads(text)
            
            # Validate required fields
            required_fields = ["title", "duration_weeks", "daily_schedule", "learning_objectives"]
            for field in required_fields:
                if field not in plan_data:
                    logger.warning(f"Missing required field: {field}")
            
            return plan_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Raw response: {text}")
            
            # Return a fallback plan structure
            return {
                "title": f"Study Plan for {self.subject}",
                "error": "Failed to parse AI response",
                "raw_response": text,
                "duration_weeks": 4,
                "daily_schedule": {},
                "learning_objectives": []
            }
        except Exception as e:
            logger.error(f"Unexpected error parsing response: {e}")
            return {
                "title": "Error Generated Plan",
                "error": str(e),
                "duration_weeks": 4,
                "daily_schedule": {},
                "learning_objectives": []
            }

class PlanChain(Chain):
    """
    LangChain chain for generating personalized study plans using Cerebras AI.
    
    Takes user inputs and generates a comprehensive, structured study plan
    with daily schedules, learning objectives, and progress milestones.
    """
    
    input_key: str = "plan_input"
    output_key: str = "study_plan"
    
    def __init__(self):
        super().__init__()
        self.output_parser = StudyPlanOutputParser()
        self.prompt_template = self._create_prompt_template()
    
    @property
    def input_keys(self) -> list[str]:
        return [self.input_key]
    
    @property
    def output_keys(self) -> list[str]:
        return [self.output_key]
    
    def _create_prompt_template(self) -> PromptTemplate:
        """Create the prompt template for study plan generation"""
        
        template = """
You are an expert educational consultant and study plan creator. Generate a comprehensive, personalized study plan based on the following requirements.

USER INFORMATION:
- User ID: {user_id}
- Subject/Topic: {subject}
- Target Exam Date: {exam_date}
- Current Knowledge Level: {current_level}
- Available Study Hours Per Day: {available_hours_per_day}
- Preferred Learning Style: {preferred_study_style}
- Specific Goals: {specific_goals}

INSTRUCTIONS:
Create a detailed study plan that includes:
1. A clear title and overview
2. Weekly breakdown with specific topics
3. Daily study schedules with time allocations
4. Learning objectives and milestones
5. Progress tracking methods
6. Recommended resources and materials
7. Assessment and review strategies

RESPONSE FORMAT:
Respond with ONLY a valid JSON object in this exact structure:

{{
  "title": "Comprehensive study plan title",
  "subject": "{subject}",
  "target_level": "Target proficiency level",
  "duration_weeks": 8,
  "total_study_hours": 112,
  "daily_hours": {available_hours_per_day},
  "learning_objectives": [
    "Specific learning goal 1",
    "Specific learning goal 2",
    "Specific learning goal 3"
  ],
  "weekly_breakdown": {{
    "week_1": {{
      "title": "Foundation Building",
      "topics": ["Topic 1", "Topic 2"],
      "objectives": ["Objective 1", "Objective 2"],
      "estimated_hours": 14
    }},
    "week_2": {{
      "title": "Core Concepts",
      "topics": ["Topic 3", "Topic 4"],
      "objectives": ["Objective 3", "Objective 4"],
      "estimated_hours": 14
    }}
  }},
  "daily_schedule": {{
    "monday": [
      {{"time": "09:00-10:30", "activity": "Reading and notes", "topic": "Core concept review"}},
      {{"time": "19:00-19:30", "activity": "Practice problems", "topic": "Application exercises"}}
    ],
    "tuesday": [
      {{"time": "09:00-10:30", "activity": "Video lectures", "topic": "New concept introduction"}},
      {{"time": "19:00-19:30", "activity": "Review and summary", "topic": "Consolidation"}}
    ],
    "wednesday": [
      {{"time": "09:00-10:30", "activity": "Hands-on practice", "topic": "Practical application"}},
      {{"time": "19:00-19:30", "activity": "Quiz self-assessment", "topic": "Knowledge check"}}
    ],
    "thursday": [
      {{"time": "09:00-10:30", "activity": "Reading and research", "topic": "Deep dive topics"}},
      {{"time": "19:00-19:30", "activity": "Discussion and reflection", "topic": "Critical thinking"}}
    ],
    "friday": [
      {{"time": "09:00-10:30", "activity": "Practice tests", "topic": "Assessment preparation"}},
      {{"time": "19:00-19:30", "activity": "Week review", "topic": "Progress evaluation"}}
    ],
    "saturday": [
      {{"time": "10:00-12:00", "activity": "Project work", "topic": "Applied learning"}}
    ],
    "sunday": [
      {{"time": "10:00-11:00", "activity": "Review and planning", "topic": "Week preparation"}}
    ]
  }},
  "resources": [
    {{"type": "textbook", "title": "Recommended textbook", "priority": "high"}},
    {{"type": "online_course", "title": "Complementary course", "priority": "medium"}},
    {{"type": "practice_platform", "title": "Exercise platform", "priority": "high"}}
  ],
  "milestones": [
    {{"week": 2, "description": "Complete foundational concepts", "assessment": "Self-quiz"}},
    {{"week": 4, "description": "Mid-term knowledge check", "assessment": "Practice exam"}},
    {{"week": 6, "description": "Advanced topic mastery", "assessment": "Project completion"}},
    {{"week": 8, "description": "Final preparation", "assessment": "Mock exam"}}
  ],
  "study_tips": [
    "Specific tip for this subject and level",
    "Learning strategy recommendation",
    "Time management advice",
    "Motivation and consistency tips"
  ],
  "assessment_strategy": {{
    "self_assessment_frequency": "weekly",
    "practice_test_schedule": ["week_2", "week_4", "week_6", "week_8"],
    "progress_tracking": "Daily task completion and weekly review",
    "adjustment_points": ["week_3", "week_5", "week_7"]
  }},
  "created_at": "{current_date}",
  "metadata": {{
    "generated_by": "StudySync AI - Cerebras",
    "user_level": "{current_level}",
    "customization_factors": [
      "available_time",
      "learning_style", 
      "target_deadline",
      "current_knowledge"
    ]
  }}
}}

Ensure the JSON is valid, comprehensive, and specifically tailored to the user's requirements. Focus on practical, actionable study activities that align with their available time and learning goals.
"""
        
        return PromptTemplate(
            template=template,
            input_variables=[
                "user_id", "subject", "exam_date", "current_level",
                "available_hours_per_day", "preferred_study_style", 
                "specific_goals", "current_date"
            ]
        )
    
    def _calculate_study_duration(self, exam_date: Optional[str]) -> int:
        """Calculate study duration in weeks based on exam date"""
        if not exam_date:
            return 8  # Default 8 weeks
        
        try:
            target_date = datetime.strptime(exam_date, "%Y-%m-%d")
            current_date = datetime.now()
            days_available = (target_date - current_date).days
            weeks_available = max(1, days_available // 7)
            return min(weeks_available, 16)  # Cap at 16 weeks
        except ValueError:
            logger.warning(f"Invalid exam date format: {exam_date}")
            return 8
    
    def _call(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the study plan generation chain.
        
        Args:
            inputs: Dictionary containing plan_input (StudyPlanInput)
            
        Returns:
            Dictionary with generated study plan
        """
        try:
            # Extract and validate input
            plan_input_data = inputs[self.input_key]
            
            if isinstance(plan_input_data, dict):
                plan_input = StudyPlanInput(**plan_input_data)
            else:
                plan_input = plan_input_data
            
            # Prepare prompt variables
            prompt_vars = {
                "user_id": str(plan_input.user_id),
                "subject": plan_input.subject,
                "exam_date": plan_input.exam_date or "Not specified",
                "current_level": plan_input.current_level,
                "available_hours_per_day": plan_input.available_hours_per_day,
                "preferred_study_style": plan_input.preferred_study_style,
                "specific_goals": plan_input.specific_goals or "General mastery of the subject",
                "current_date": datetime.now().isoformat()
            }
            
            # Generate the prompt
            prompt = self.prompt_template.format(**prompt_vars)
            
            # Call Cerebras AI
            if not cerebras_client:
                raise ValueError("Cerebras client not initialized. Check API key configuration.")
            
            logger.info(f"Generating study plan for user {plan_input.user_id}, subject: {plan_input.subject}")
            
            response = cerebras_client.chat.completions.create(
                model="llama3.1-8b",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert educational consultant. Always respond with valid JSON only."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=4000,
                temperature=0.7,
                top_p=0.9
            )
            
            # Extract and parse response
            ai_response = response.choices[0].message.content
            study_plan = self.output_parser.parse(ai_response)
            
            # Add metadata
            study_plan["generation_metadata"] = {
                "user_id": str(plan_input.user_id),
                "generated_at": datetime.now().isoformat(),
                "model_used": "llama3.1-8b",
                "prompt_version": "1.0"
            }
            
            logger.info(f"Successfully generated study plan for user {plan_input.user_id}")
            
            return {self.output_key: study_plan}
            
        except Exception as e:
            logger.error(f"Error in PlanChain execution: {e}")
            
            # Return error plan
            fallback_plan = {
                "title": f"Study Plan for {inputs.get('subject', 'Unknown Subject')}",
                "error": str(e),
                "status": "generation_failed",
                "duration_weeks": 4,
                "daily_schedule": {},
                "learning_objectives": [],
                "created_at": datetime.now().isoformat()
            }
            
            return {self.output_key: fallback_plan}

# Factory function for easy chain creation
def create_plan_chain() -> PlanChain:
    """
    Factory function to create a new PlanChain instance.
    
    Returns:
        PlanChain: Configured study plan generation chain
    """
    return PlanChain()

# Export the main components
__all__ = ["PlanChain", "StudyPlanInput", "create_plan_chain"]