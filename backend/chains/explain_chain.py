"""
ExplainChain - AI-Powered Concept Explanation

This module implements a LangChain-based explanation chain that generates
detailed explanations of concepts using Cerebras AI.
"""

import json
import logging
from typing import Dict, Any, Optional
from uuid import UUID
from datetime import datetime

from langchain.chains.base import Chain
from langchain.schema import BaseOutputParser
from pydantic import BaseModel, Field

from cerebras_client import cerebras_client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ExplainInput(BaseModel):
    """Input model for concept explanation requests"""
    user_id: UUID = Field(..., description="User identifier")
    concept: str = Field(..., description="Concept or topic to explain")
    complexity_level: Optional[str] = Field(
        default="intermediate",
        description="Explanation complexity: beginner, intermediate, advanced"
    )
    context: Optional[str] = Field(
        default=None,
        description="Additional context or specific focus area"
    )
    format_preference: Optional[str] = Field(
        default="detailed",
        description="Explanation format: brief, detailed, step-by-step, examples"
    )
    target_audience: Optional[str] = Field(
        default="general",
        description="Target audience: student, professional, general, child"
    )


class ExplanationOutputParser(BaseOutputParser):
    """Parser for explanation responses from Cerebras AI"""
    
    def parse(self, text: str) -> Dict[str, Any]:
        """Parse the explanation response"""
        try:
            # Try to parse as JSON first
            if text.strip().startswith('{'):
                parsed = json.loads(text)
                return {
                    "explanation": parsed.get("explanation", text),
                    "key_points": parsed.get("key_points", []),
                    "examples": parsed.get("examples", []),
                    "related_concepts": parsed.get("related_concepts", []),
                    "further_reading": parsed.get("further_reading", [])
                }
            else:
                # If not JSON, treat as plain text explanation
                return {
                    "explanation": text.strip(),
                    "key_points": [],
                    "examples": [],
                    "related_concepts": [],
                    "further_reading": []
                }
        except json.JSONDecodeError:
            logger.warning("Failed to parse explanation as JSON, returning as plain text")
            return {
                "explanation": text.strip(),
                "key_points": [],
                "examples": [],
                "related_concepts": [],
                "further_reading": []
            }
    
    @property
    def _type(self) -> str:
        return "explanation_output_parser"


class ExplainChain(Chain):
    """LangChain implementation for generating concept explanations"""
    
    def __init__(self):
        super().__init__()
        self.output_parser = ExplanationOutputParser()
    
    @property
    def input_keys(self) -> list:
        return ["explain_input"]
    
    @property
    def output_keys(self) -> list:
        return ["explanation", "metadata"]
    
    def _call(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the explanation chain"""
        explain_input = inputs["explain_input"]
        
        try:
            # Create the explanation prompt
            prompt = self._create_explanation_prompt(explain_input)
            
            # Call Cerebras AI
            response = cerebras_client.chat.completions.create(
                model="llama3.1-8b",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert educator and communicator. Your role is to provide clear, accurate, and engaging explanations of concepts at the appropriate level for your audience. Always structure your responses to be educational and easy to understand."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=1500,
                temperature=0.7,
                stream=False
            )
            
            # Extract the explanation text
            explanation_text = response.choices[0].message.content
            
            # Parse the response
            parsed_explanation = self.output_parser.parse(explanation_text)
            
            # Add metadata
            metadata = {
                "user_id": str(explain_input.user_id),
                "concept": explain_input.concept,
                "complexity_level": explain_input.complexity_level,
                "format_preference": explain_input.format_preference,
                "target_audience": explain_input.target_audience,
                "generated_at": datetime.now().isoformat(),
                "model_used": "llama3.1-8b",
                "prompt_version": "1.0"
            }
            
            logger.info(f"Successfully generated explanation for concept: {explain_input.concept}")
            
            return {
                "explanation": parsed_explanation["explanation"],
                "key_points": parsed_explanation["key_points"],
                "examples": parsed_explanation["examples"],
                "related_concepts": parsed_explanation["related_concepts"],
                "further_reading": parsed_explanation["further_reading"],
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"Error generating explanation: {str(e)}")
            # Return a fallback explanation
            return {
                "explanation": f"I apologize, but I'm unable to generate a detailed explanation for '{explain_input.concept}' at this moment. Please try again later or contact support if the issue persists.",
                "key_points": [],
                "examples": [],
                "related_concepts": [],
                "further_reading": [],
                "metadata": {
                    "user_id": str(explain_input.user_id),
                    "concept": explain_input.concept,
                    "error": str(e),
                    "generated_at": datetime.now().isoformat(),
                    "status": "error"
                }
            }
    
    def _create_explanation_prompt(self, explain_input: ExplainInput) -> str:
        """Create a detailed prompt for concept explanation"""
        
        complexity_guidance = {
            "beginner": "Use simple language, avoid jargon, provide basic definitions, and use everyday analogies",
            "intermediate": "Use moderate technical language, provide some background context, and include practical applications",
            "advanced": "Use technical terminology appropriately, assume prior knowledge, and focus on nuanced details and implications"
        }
        
        format_guidance = {
            "brief": "Provide a concise explanation in 2-3 paragraphs",
            "detailed": "Provide a comprehensive explanation with multiple sections",
            "step-by-step": "Break down the concept into sequential steps or stages",
            "examples": "Focus heavily on practical examples and use cases"
        }
        
        audience_guidance = {
            "student": "Focus on learning objectives and academic understanding",
            "professional": "Emphasize practical applications and industry relevance", 
            "general": "Balance accessibility with thoroughness",
            "child": "Use very simple language, fun analogies, and engaging examples"
        }
        
        context_section = ""
        if explain_input.context:
            context_section = f"\n\nAdditional Context: {explain_input.context}"
        
        prompt = f"""Please provide a {explain_input.complexity_level}-level explanation of the concept: "{explain_input.concept}"

Target Audience: {explain_input.target_audience}
Format Preference: {explain_input.format_preference}

Guidelines:
- Complexity Level ({explain_input.complexity_level}): {complexity_guidance.get(explain_input.complexity_level, complexity_guidance["intermediate"])}
- Format ({explain_input.format_preference}): {format_guidance.get(explain_input.format_preference, format_guidance["detailed"])}
- Audience ({explain_input.target_audience}): {audience_guidance.get(explain_input.target_audience, audience_guidance["general"])}{context_section}

Structure your explanation to include:
1. Clear definition or overview
2. Key components or aspects
3. Why it's important or relevant
4. Practical examples or applications
5. Common misconceptions (if applicable)
6. Related concepts or next steps

Aim to make the explanation engaging, accurate, and appropriately detailed for the specified audience and complexity level."""

        return prompt
    
    @property
    def _chain_type(self) -> str:
        return "explain_chain"


def create_explain_chain() -> ExplainChain:
    """Factory function to create an ExplainChain instance"""
    return ExplainChain()