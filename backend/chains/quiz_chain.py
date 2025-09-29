"""
LangChain-based quiz generation chain using Cerebras AI.
Provides intelligent practice question generation with various question types.
"""

import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
from uuid import UUID

from langchain.schema import BaseOutputParser
from langchain.prompts import PromptTemplate
from langchain.chains.base import Chain
from pydantic import BaseModel, Field

from cerebras_client import cerebras_client

# Configure logging
logger = logging.getLogger(__name__)

class QuizInput(BaseModel):
    """Input model for quiz generation"""
    user_id: UUID = Field(..., description="Unique identifier for the user")
    topic: str = Field(..., description="Topic or subject for the quiz questions")
    difficulty: str = Field(..., description="Difficulty level (easy, medium, hard)")
    question_count: Optional[int] = Field(5, description="Number of questions to generate")
    question_types: Optional[List[str]] = Field(
        default=["multiple_choice", "true_false", "short_answer"], 
        description="Types of questions to include"
    )
    focus_areas: Optional[List[str]] = Field(None, description="Specific areas to focus on")
    learning_objectives: Optional[List[str]] = Field(None, description="Learning objectives to assess")

class QuizOutputParser(BaseOutputParser):
    """Parser for Cerebras AI quiz JSON response"""
    
    def parse(self, text: str) -> List[Dict[str, Any]]:
        """
        Parse the JSON response from Cerebras AI into a list of question dictionaries.
        
        Args:
            text: Raw JSON response from Cerebras AI
            
        Returns:
            List[Dict]: List of parsed quiz questions
            
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
            quiz_data = json.loads(text)
            
            # Handle both array and object responses
            if isinstance(quiz_data, dict):
                if "questions" in quiz_data:
                    questions = quiz_data["questions"]
                elif "quiz" in quiz_data:
                    questions = quiz_data["quiz"]
                else:
                    # Assume the entire object is a single question
                    questions = [quiz_data]
            else:
                questions = quiz_data
            
            # Validate and standardize questions
            standardized_questions = []
            for i, question in enumerate(questions):
                if not isinstance(question, dict):
                    logger.warning(f"Question {i} is not a dictionary, skipping")
                    continue
                
                # Ensure required fields exist
                if "question" not in question:
                    logger.warning(f"Question {i} missing 'question' field")
                    continue
                
                # Standardize the question format
                standardized_question = {
                    "id": question.get("id", i + 1),
                    "question": question["question"],
                    "type": question.get("type", "multiple_choice"),
                    "difficulty": question.get("difficulty", "medium"),
                    "options": question.get("options", []),
                    "correct_answer": question.get("correct_answer", ""),
                    "explanation": question.get("explanation", ""),
                    "topic": question.get("topic", ""),
                    "learning_objective": question.get("learning_objective", ""),
                    "estimated_time": question.get("estimated_time", 60)  # seconds
                }
                
                standardized_questions.append(standardized_question)
            
            if not standardized_questions:
                logger.error("No valid questions found in response")
                return self._create_fallback_questions()
            
            logger.info(f"Successfully parsed {len(standardized_questions)} questions")
            return standardized_questions
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.error(f"Raw response: {text}")
            return self._create_fallback_questions()
            
        except Exception as e:
            logger.error(f"Unexpected error parsing quiz response: {e}")
            return self._create_fallback_questions()
    
    def _create_fallback_questions(self) -> List[Dict[str, Any]]:
        """Create fallback questions when parsing fails"""
        return [
            {
                "id": 1,
                "question": "This is a fallback question due to parsing error.",
                "type": "multiple_choice",
                "difficulty": "easy",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A",
                "explanation": "Quiz generation encountered an error. Please try again.",
                "topic": "Error Recovery",
                "learning_objective": "Handle system errors gracefully",
                "estimated_time": 30
            }
        ]

class QuizChain(Chain):
    """
    LangChain chain for generating practice quiz questions using Cerebras AI.
    
    Takes topic and difficulty inputs and generates a set of diverse,
    educational quiz questions with explanations and metadata.
    """
    
    input_key: str = "quiz_input"
    output_key: str = "questions"
    
    def __init__(self):
        super().__init__()
        self.output_parser = QuizOutputParser()
        self.prompt_template = self._create_prompt_template()
    
    @property
    def input_keys(self) -> list[str]:
        return [self.input_key]
    
    @property
    def output_keys(self) -> list[str]:
        return [self.output_key]
    
    def _create_prompt_template(self) -> PromptTemplate:
        """Create the prompt template for quiz generation"""
        
        template = """
You are an expert educational assessment designer and quiz creator. Generate high-quality practice questions based on the following requirements.

QUIZ REQUIREMENTS:
- User ID: {user_id}
- Topic: {topic}
- Difficulty Level: {difficulty}
- Number of Questions: {question_count}
- Question Types: {question_types}
- Focus Areas: {focus_areas}
- Learning Objectives: {learning_objectives}

INSTRUCTIONS:
Create {question_count} educational quiz questions that:
1. Test understanding of the specified topic
2. Match the requested difficulty level
3. Include diverse question types
4. Provide clear, accurate answers
5. Include educational explanations
6. Are appropriate for the learning level

RESPONSE FORMAT:
Respond with ONLY a valid JSON array of question objects in this exact structure:

[
  {{
    "id": 1,
    "question": "Clear, well-formulated question text here?",
    "type": "multiple_choice",
    "difficulty": "{difficulty}",
    "topic": "{topic}",
    "options": [
      "Option A: First possible answer",
      "Option B: Second possible answer", 
      "Option C: Third possible answer",
      "Option D: Fourth possible answer"
    ],
    "correct_answer": "Option B: Second possible answer",
    "explanation": "Detailed explanation of why this answer is correct and why other options are incorrect. Include educational context and key concepts.",
    "learning_objective": "Specific learning goal this question assesses",
    "estimated_time": 90,
    "difficulty_justification": "Brief explanation of why this question matches the {difficulty} difficulty level"
  }},
  {{
    "id": 2,
    "question": "Another well-crafted question about {topic}?",
    "type": "true_false",
    "difficulty": "{difficulty}",
    "topic": "{topic}",
    "options": ["True", "False"],
    "correct_answer": "True",
    "explanation": "Comprehensive explanation covering the reasoning behind the correct answer and common misconceptions.",
    "learning_objective": "Another specific learning goal",
    "estimated_time": 60,
    "difficulty_justification": "Explanation of difficulty level reasoning"
  }},
  {{
    "id": 3,
    "question": "What is the key concept behind [specific aspect of {topic}]?",
    "type": "short_answer",
    "difficulty": "{difficulty}",
    "topic": "{topic}",
    "options": [],
    "correct_answer": "Sample ideal answer demonstrating expected response quality and key points",
    "explanation": "Detailed explanation including key points that should be covered in the answer, common mistakes to avoid, and additional context.",
    "learning_objective": "Demonstrate understanding of core concepts",
    "estimated_time": 120,
    "difficulty_justification": "Justification for difficulty rating"
  }}
]

QUALITY GUIDELINES:
- Questions should be clear, unambiguous, and grammatically correct
- Multiple choice options should be plausible but have one clearly correct answer
- Explanations should be educational and help reinforce learning
- Difficulty should be appropriate: 
  * Easy: Basic recall and recognition
  * Medium: Application and analysis
  * Hard: Synthesis, evaluation, and complex problem-solving
- Include variety in question formats and cognitive levels
- Ensure questions align with stated learning objectives
- Make questions engaging and relevant to real-world applications

TOPIC-SPECIFIC CONSIDERATIONS:
- For technical topics: Include practical scenarios and code examples
- For theoretical subjects: Focus on concepts, principles, and applications
- For skills-based topics: Include problem-solving and application questions
- Always consider the learner's perspective and common misconceptions

Generate exactly {question_count} high-quality questions that will effectively assess understanding of {topic} at the {difficulty} level.
"""
        
        return PromptTemplate(
            template=template,
            input_variables=[
                "user_id", "topic", "difficulty", "question_count",
                "question_types", "focus_areas", "learning_objectives"
            ]
        )
    
    def _format_list_for_prompt(self, items: Optional[List[str]], default: str = "Not specified") -> str:
        """Format a list for inclusion in the prompt"""
        if not items:
            return default
        return ", ".join(items)
    
    def _call(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the quiz generation chain.
        
        Args:
            inputs: Dictionary containing quiz_input (QuizInput)
            
        Returns:
            Dictionary with generated quiz questions
        """
        try:
            # Extract and validate input
            quiz_input_data = inputs[self.input_key]
            
            if isinstance(quiz_input_data, dict):
                quiz_input = QuizInput(**quiz_input_data)
            else:
                quiz_input = quiz_input_data
            
            # Prepare prompt variables
            prompt_vars = {
                "user_id": str(quiz_input.user_id),
                "topic": quiz_input.topic,
                "difficulty": quiz_input.difficulty,
                "question_count": quiz_input.question_count,
                "question_types": self._format_list_for_prompt(quiz_input.question_types),
                "focus_areas": self._format_list_for_prompt(quiz_input.focus_areas),
                "learning_objectives": self._format_list_for_prompt(quiz_input.learning_objectives)
            }
            
            # Generate the prompt
            prompt = self.prompt_template.format(**prompt_vars)
            
            # Call Cerebras AI
            if not cerebras_client:
                raise ValueError("Cerebras client not initialized. Check API key configuration.")
            
            logger.info(f"Generating quiz for user {quiz_input.user_id}, topic: {quiz_input.topic}, difficulty: {quiz_input.difficulty}")
            
            response = cerebras_client.chat.completions.create(
                model="llama3.1-8b",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert educational assessment designer. Always respond with valid JSON only."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=3000,
                temperature=0.8,  # Slightly higher for creative question variety
                top_p=0.9
            )
            
            # Extract and parse response
            ai_response = response.choices[0].message.content
            questions = self.output_parser.parse(ai_response)
            
            # Add generation metadata to each question
            for question in questions:
                question["generation_metadata"] = {
                    "user_id": str(quiz_input.user_id),
                    "generated_at": datetime.now().isoformat(),
                    "model_used": "llama3.1-8b",
                    "prompt_version": "1.0",
                    "requested_difficulty": quiz_input.difficulty,
                    "requested_topic": quiz_input.topic
                }
            
            logger.info(f"Successfully generated {len(questions)} questions for user {quiz_input.user_id}")
            
            return {self.output_key: questions}
            
        except Exception as e:
            logger.error(f"Error in QuizChain execution: {e}")
            
            # Return error questions
            fallback_questions = [
                {
                    "id": 1,
                    "question": f"Quiz generation failed for topic: {inputs.get('topic', 'Unknown')}",
                    "type": "multiple_choice",
                    "difficulty": "easy",
                    "topic": inputs.get("topic", "Error"),
                    "options": ["Retry", "Check configuration", "Contact support", "Try different topic"],
                    "correct_answer": "Retry",
                    "explanation": f"Error occurred during quiz generation: {str(e)}",
                    "learning_objective": "System error handling",
                    "estimated_time": 30,
                    "error": str(e),
                    "generated_at": datetime.now().isoformat()
                }
            ]
            
            return {self.output_key: fallback_questions}

# Factory function for easy chain creation
def create_quiz_chain() -> QuizChain:
    """
    Factory function to create a new QuizChain instance.
    
    Returns:
        QuizChain: Configured quiz generation chain
    """
    return QuizChain()

# Export the main components
__all__ = ["QuizChain", "QuizInput", "create_quiz_chain"]