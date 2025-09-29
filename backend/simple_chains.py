"""
Simple AI chain implementations for StudySync AI.
Provides intelligent study plan, quiz, and explanation generation using Cerebras AI.
Enhanced with memory capabilities for context-aware responses.
"""

import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional, List
from uuid import UUID

from pydantic import BaseModel, Field
from cerebras_client import cerebras_client

# Import memory management for context-aware responses
try:
    from memory_manager import get_context_for_ai_chain, store_user_interaction
    MEMORY_AVAILABLE = True
except ImportError:
    MEMORY_AVAILABLE = False
    logging.warning("Memory manager not available. Chains will work without context awareness.")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Input Models
class StudyPlanInput(BaseModel):
    """Input model for study plan generation requests"""
    user_id: UUID = Field(..., description="User identifier")
    subject: str = Field(..., description="Subject or topic to study")
    goals: List[str] = Field(..., description="Learning goals and objectives")
    timeline: str = Field(..., description="Study timeline (e.g., '4 weeks', '3 months')")
    difficulty_level: Optional[str] = Field(default="intermediate", description="Difficulty: beginner, intermediate, advanced")
    learning_style: Optional[str] = Field(default="balanced", description="Learning style preference")
    time_commitment: Optional[str] = Field(default="1 hour per day", description="Available study time")
    focus_areas: Optional[List[str]] = Field(default=[], description="Specific topics to focus on")
    current_knowledge: Optional[str] = Field(default="", description="Current knowledge level")


class QuizInput(BaseModel):
    """Input model for quiz generation requests"""
    user_id: UUID = Field(..., description="User identifier")
    topic: str = Field(..., description="Quiz topic")
    difficulty: str = Field(..., description="Question difficulty: easy, medium, hard")
    question_count: Optional[int] = Field(default=5, description="Number of questions")
    question_types: Optional[List[str]] = Field(default=["multiple_choice"], description="Question types")
    focus_areas: Optional[List[str]] = Field(default=[], description="Specific subtopics")
    learning_objectives: Optional[List[str]] = Field(default=[], description="Learning objectives")


class ExplainInput(BaseModel):
    """Input model for concept explanation requests"""
    user_id: UUID = Field(..., description="User identifier")
    concept: str = Field(..., description="Concept to explain")
    complexity_level: Optional[str] = Field(default="intermediate", description="Complexity: beginner, intermediate, advanced")
    context: Optional[str] = Field(default=None, description="Additional context")
    format_preference: Optional[str] = Field(default="detailed", description="Format: brief, detailed, step-by-step, examples")
    target_audience: Optional[str] = Field(default="general", description="Audience: student, professional, general, child")


# Simple Chain Implementations
class PlanChain:
    """Simple AI chain for generating study plans with memory context"""
    
    def __call__(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a study plan with context awareness"""
        try:
            study_plan_input = inputs["study_plan_input"]
            
            # Get context from previous interactions if memory is available
            context = []
            if MEMORY_AVAILABLE:
                try:
                    context = get_context_for_ai_chain(
                        user_id=study_plan_input.user_id,
                        chain_type="plan",
                        current_input=study_plan_input.model_dump(),
                        max_context_items=3
                    )
                except Exception as e:
                    logger.warning(f"Failed to retrieve context: {e}")
            
            # Create prompt with context
            prompt = self._create_plan_prompt(study_plan_input, context)
            
            # Call Cerebras AI
            response = cerebras_client.chat.completions.create(
                model="llama3.1-8b",
                messages=[
                    {"role": "system", "content": "You are an expert educational consultant who creates personalized study plans. Generate comprehensive, structured study plans with clear sections and actionable steps. Use any previous learning context to create more personalized and progressive plans."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.7
            )
            
            plan_text = response.choices[0].message.content
            
            # Parse the response
            try:
                if plan_text.strip().startswith('{'):
                    plan_data = json.loads(plan_text)
                else:
                    # Create structured response from text
                    plan_data = {
                        "title": f"{study_plan_input.subject} Study Plan",
                        "description": plan_text,
                        "sections": [],
                        "total_duration": study_plan_input.timeline,
                        "difficulty_level": study_plan_input.difficulty_level
                    }
            except json.JSONDecodeError:
                plan_data = {
                    "title": f"{study_plan_input.subject} Study Plan",
                    "description": plan_text,
                    "sections": [],
                    "total_duration": study_plan_input.timeline,
                    "difficulty_level": study_plan_input.difficulty_level
                }
            
            # Add metadata
            plan_data["metadata"] = {
                "user_id": str(study_plan_input.user_id),
                "generated_at": datetime.now().isoformat(),
                "model_used": "llama3.1-8b"
            }
            
            # Store interaction in memory if available
            if MEMORY_AVAILABLE:
                try:
                    store_user_interaction(
                        user_id=study_plan_input.user_id,
                        chain_type="plan",
                        input_data=study_plan_input.model_dump(),
                        output_data=plan_data,
                        metadata={"context_used": len(context) > 0}
                    )
                except Exception as e:
                    logger.warning(f"Failed to store interaction in memory: {e}")
            
            return plan_data
            
        except Exception as e:
            logger.error(f"Error generating study plan: {str(e)}")
            return {
                "title": "Study Plan Generation Failed",
                "description": f"Unable to generate study plan: {str(e)}",
                "sections": [],
                "metadata": {"error": str(e)}
            }
    
    def _create_plan_prompt(self, input_data: StudyPlanInput, context: List[Dict[str, Any]] = None) -> str:
        """Create prompt for study plan generation with memory context"""
        
        # Base prompt
        prompt = f"""Create a detailed study plan for the following requirements:

Subject: {input_data.subject}
Goals: {', '.join(input_data.goals)}
Timeline: {input_data.timeline}
Difficulty Level: {input_data.difficulty_level}
Learning Style: {input_data.learning_style}
Time Commitment: {input_data.time_commitment}
Focus Areas: {', '.join(input_data.focus_areas) if input_data.focus_areas else 'General coverage'}
Current Knowledge: {input_data.current_knowledge or 'Beginner level'}"""

        # Add context from previous interactions if available
        if context and len(context) > 0:
            prompt += "\n\nPrevious Learning Context:\n"
            prompt += "Consider the user's learning history when creating this plan:\n"
            for i, ctx in enumerate(context[:3], 1):  # Limit to 3 most relevant
                prompt += f"{i}. {ctx.get('input_summary', '')} - {ctx.get('output_summary', '')}\n"
            prompt += "\nBuild upon this previous learning and avoid unnecessary repetition.\n"
        
        prompt += """

Please create a comprehensive study plan with:
1. Clear title and description
2. Weekly sections with specific topics
3. Daily activities and time allocations
4. Learning objectives for each section
5. Recommended resources and materials
6. Progress milestones and assessments

Format the response as a well-structured plan that is practical and achievable."""

        return prompt


class QuizChain:
    """Simple AI chain for generating quiz questions with memory context"""
    
    def __call__(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Generate quiz questions with context awareness"""
        try:
            quiz_input = inputs["quiz_input"]
            
            # Get context from previous interactions if memory is available
            context = []
            if MEMORY_AVAILABLE:
                try:
                    context = get_context_for_ai_chain(
                        user_id=quiz_input.user_id,
                        chain_type="quiz",
                        current_input=quiz_input.model_dump(),
                        max_context_items=3
                    )
                except Exception as e:
                    logger.warning(f"Failed to retrieve context: {e}")
            
            # Create prompt with context
            prompt = self._create_quiz_prompt(quiz_input, context)
            
            # Call Cerebras AI
            response = cerebras_client.chat.completions.create(
                model="llama3.1-8b",
                messages=[
                    {"role": "system", "content": "You are an expert educator who creates high-quality educational quiz questions. Generate clear, accurate questions with detailed explanations. Use any previous quiz history to create varied and progressive questions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            quiz_text = response.choices[0].message.content
            
            # Parse questions
            questions = self._parse_questions(quiz_text, quiz_input)
            
            quiz_result = {
                "questions": questions,
                "metadata": {
                    "user_id": str(quiz_input.user_id),
                    "generated_at": datetime.now().isoformat(),
                    "model_used": "llama3.1-8b"
                }
            }
            
            # Store interaction in memory if available
            if MEMORY_AVAILABLE:
                try:
                    store_user_interaction(
                        user_id=quiz_input.user_id,
                        chain_type="quiz",
                        input_data=quiz_input.model_dump(),
                        output_data=quiz_result,
                        metadata={"context_used": len(context) > 0}
                    )
                except Exception as e:
                    logger.warning(f"Failed to store interaction in memory: {e}")
            
            return quiz_result
            
        except Exception as e:
            logger.error(f"Error generating quiz: {str(e)}")
            return {
                "questions": [{
                    "id": 1,
                    "question": f"Quiz generation failed: {str(e)}",
                    "type": "multiple_choice",
                    "options": ["Error occurred", "Please try again", "Contact support", "Check configuration"],
                    "correct_answer": "Please try again",
                    "explanation": "An error occurred during quiz generation."
                }],
                "metadata": {"error": str(e)}
            }
    
    def _create_quiz_prompt(self, input_data: QuizInput, context: List[Dict[str, Any]] = None) -> str:
        """Create prompt for quiz generation with memory context"""
        
        # Base prompt
        prompt = f"""Generate {input_data.question_count} educational quiz questions about: {input_data.topic}

Requirements:
- Difficulty Level: {input_data.difficulty}
- Question Types: {', '.join(input_data.question_types)}
- Focus Areas: {', '.join(input_data.focus_areas) if input_data.focus_areas else 'General coverage'}"""

        # Add context from previous quizzes if available
        if context and len(context) > 0:
            prompt += "\n\nPrevious Quiz History:\n"
            prompt += "Consider the user's previous quiz attempts to create varied and progressive questions:\n"
            for i, ctx in enumerate(context[:3], 1):  # Limit to 3 most relevant
                prompt += f"{i}. {ctx.get('input_summary', '')} - {ctx.get('output_summary', '')}\n"
            prompt += "\nCreate different questions that build upon or complement previous topics.\n"

        prompt += """

For each question, provide:
1. Clear, unambiguous question text
2. Multiple choice options (if applicable)
3. Correct answer
4. Detailed explanation of why the answer is correct
5. Educational value and learning objective

Format each question clearly and ensure they test understanding rather than just memorization."""

        return prompt
    
    def _parse_questions(self, text: str, quiz_input: QuizInput) -> List[Dict]:
        """Parse questions from AI response"""
        questions = []
        try:
            # Try to parse as JSON
            if text.strip().startswith('[') or text.strip().startswith('{'):
                parsed = json.loads(text)
                if isinstance(parsed, list):
                    questions = parsed
                else:
                    questions = [parsed]
        except:
            # Create simple questions from text
            lines = text.split('\n')
            question_lines = [line for line in lines if line.strip() and ('?' in line or 'Question' in line)]
            
            for i, line in enumerate(question_lines[:quiz_input.question_count]):
                questions.append({
                    "id": i + 1,
                    "question": line.strip(),
                    "type": "short_answer",
                    "options": [],
                    "correct_answer": "See explanation",
                    "explanation": "Answer depends on understanding of the topic.",
                    "topic": quiz_input.topic,
                    "difficulty": quiz_input.difficulty
                })
        
        return questions[:quiz_input.question_count]


class ExplainChain:
    """Simple AI chain for generating concept explanations with memory context"""
    
    def __call__(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Generate concept explanation with context awareness"""
        try:
            explain_input = inputs["explain_input"]
            
            # Get context from previous interactions if memory is available
            context = []
            if MEMORY_AVAILABLE:
                try:
                    context = get_context_for_ai_chain(
                        user_id=explain_input.user_id,
                        chain_type="explain",
                        current_input=explain_input.model_dump(),
                        max_context_items=3
                    )
                except Exception as e:
                    logger.warning(f"Failed to retrieve context: {e}")
            
            # Create prompt with context
            prompt = self._create_explain_prompt(explain_input, context)
            
            # Call Cerebras AI
            response = cerebras_client.chat.completions.create(
                model="llama3.1-8b",
                messages=[
                    {"role": "system", "content": "You are an expert educator who provides clear, comprehensive explanations of concepts. Adapt your language and complexity to your audience. Use any previous learning context to build upon prior knowledge."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            explanation_text = response.choices[0].message.content
            
            explain_result = {
                "explanation": explanation_text,
                "key_points": [],
                "examples": [],
                "related_concepts": [],
                "further_reading": [],
                "metadata": {
                    "user_id": str(explain_input.user_id),
                    "generated_at": datetime.now().isoformat(),
                    "model_used": "llama3.1-8b"
                }
            }
            
            # Store interaction in memory if available
            if MEMORY_AVAILABLE:
                try:
                    store_user_interaction(
                        user_id=explain_input.user_id,
                        chain_type="explain",
                        input_data=explain_input.model_dump(),
                        output_data=explain_result,
                        metadata={"context_used": len(context) > 0}
                    )
                except Exception as e:
                    logger.warning(f"Failed to store interaction in memory: {e}")
            
            return explain_result
            
        except Exception as e:
            logger.error(f"Error generating explanation: {str(e)}")
            return {
                "explanation": f"Unable to generate explanation for '{explain_input.concept}': {str(e)}",
                "key_points": [],
                "examples": [],
                "related_concepts": [],
                "further_reading": [],
                "metadata": {"error": str(e)}
            }
    
    def _create_explain_prompt(self, input_data: ExplainInput, context: List[Dict[str, Any]] = None) -> str:
        """Create prompt for concept explanation with memory context"""
        context_text = f"\nContext: {input_data.context}" if input_data.context else ""
        
        # Base prompt
        prompt = f"""Provide a {input_data.complexity_level}-level explanation of: {input_data.concept}

Target Audience: {input_data.target_audience}
Format Preference: {input_data.format_preference}{context_text}"""

        # Add context from previous explanations if available
        if context and len(context) > 0:
            prompt += "\n\nPrevious Learning Context:\n"
            prompt += "Consider the user's previous concept explorations to provide a more connected explanation:\n"
            for i, ctx in enumerate(context[:3], 1):  # Limit to 3 most relevant
                prompt += f"{i}. {ctx.get('input_summary', '')} - {ctx.get('output_summary', '')}\n"
            prompt += "\nBuild upon this knowledge and make connections where relevant.\n"

        prompt += """

Please provide a clear, comprehensive explanation that:
1. Defines the concept clearly
2. Explains why it's important
3. Provides practical examples
4. Covers key components or aspects
5. Addresses common misconceptions (if any)
6. Suggests related concepts to explore

Tailor the complexity and language to the specified level and audience."""

        return prompt


# Factory functions
def create_plan_chain() -> PlanChain:
    """Create a study plan generation chain"""
    return PlanChain()

def create_quiz_chain() -> QuizChain:
    """Create a quiz generation chain"""
    return QuizChain()

def create_explain_chain() -> ExplainChain:
    """Create an explanation generation chain"""
    return ExplainChain()