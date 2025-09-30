# Enhanced Backend Endpoints for Intelligent Study Assistant

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from typing import List, Dict, Any, Optional
from uuid import UUID
import json
from datetime import datetime

from models import ChatMessage, ChatResponse, User
from cerebras_client import cerebras_client
from memory_manager import get_memory_manager, store_user_interaction, get_context_for_ai_chain
from simple_chains import PlanChain, QuizChain, ExplainChain

# Enhanced Chat Endpoint with Memory Integration
@app.post("/chat")
async def enhanced_chat(
    message_data: Dict[str, Any],
    current_user: User = None  # Depends(get_current_user) - disabled for demo
) -> ChatResponse:
    """
    Enhanced chat endpoint with memory, context awareness, and learning analytics
    """
    try:
        message = message_data.get("message", "")
        model = message_data.get("model", "llama3.1-8b")
        context = message_data.get("context", {})
        
        # Extract learning context and user information
        learning_context = context.get("learningContext", {})
        previous_messages = context.get("previousMessages", [])
        uploaded_document = context.get("uploadedDocument")
        active_feature = context.get("activeFeature", "chat")
        
        # Get user ID (for demo purposes, use a default user)
        user_id = current_user.id if current_user else "demo-user-123"
        
        # Get memory context for enhanced responses
        memory_context = []
        try:
            memory_manager = get_memory_manager()
            if memory_manager:
                memory_context = memory_manager.get_context_for_chain(
                    user_id=user_id,
                    chain_type="chat",
                    current_input={"message": message, "context": context},
                    max_context_items=5
                )
        except Exception as e:
            print(f"Memory context retrieval failed: {e}")
        
        # Build enhanced prompt with all available context
        enhanced_prompt = build_intelligent_prompt(
            message=message,
            learning_context=learning_context,
            memory_context=memory_context,
            uploaded_document=uploaded_document,
            active_feature=active_feature,
            previous_messages=previous_messages[-3:]  # Last 3 messages
        )
        
        # Call Cerebras AI with enhanced prompt
        response = cerebras_client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": enhanced_prompt["system"]
                },
                {
                    "role": "user", 
                    "content": enhanced_prompt["user"]
                }
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content
        
        # Analyze response for learning insights
        learning_insights = analyze_learning_patterns(
            user_message=message,
            ai_response=ai_response,
            current_context=learning_context
        )
        
        # Store interaction in memory for future context
        try:
            if memory_manager:
                memory_manager.store_interaction(
                    user_id=user_id,
                    chain_type="chat",
                    input_data={
                        "message": message,
                        "learning_context": learning_context,
                        "active_feature": active_feature
                    },
                    output_data={
                        "response": ai_response,
                        "learning_insights": learning_insights,
                        "model_used": model
                    },
                    metadata={
                        "feature": active_feature,
                        "context_used": len(memory_context) > 0,
                        "document_analyzed": uploaded_document is not None
                    }
                )
        except Exception as e:
            print(f"Memory storage failed: {e}")
        
        return ChatResponse(
            response=ai_response,
            model_used=model,
            timestamp=datetime.now(),
            confidence=calculate_confidence_score(ai_response, context),
            suggestions=generate_smart_suggestions(learning_insights, learning_context),
            learning_insights=learning_insights
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")


@app.post("/analyze-document")
async def analyze_document(
    file: UploadFile = File(...),
    user_context: str = None,
    current_user: User = None
):
    """
    Analyze uploaded documents and extract learning-relevant information
    """
    try:
        # Read file content
        content = await file.read()
        file_type = file.content_type
        filename = file.filename
        
        # Parse user context
        context = json.loads(user_context) if user_context else {}
        
        # Analyze document based on type
        if file_type == "application/pdf":
            analysis = await analyze_pdf_document(content, filename, context)
        elif file_type.startswith("image/"):
            analysis = await analyze_image_document(content, filename, context)
        else:
            # Treat as text
            text_content = content.decode('utf-8')
            analysis = await analyze_text_document(text_content, filename, context)
        
        # Store document analysis in memory
        user_id = current_user.id if current_user else "demo-user-123"
        try:
            memory_manager = get_memory_manager()
            if memory_manager:
                memory_manager.store_interaction(
                    user_id=user_id,
                    chain_type="document",
                    input_data={
                        "filename": filename,
                        "file_type": file_type,
                        "user_context": context
                    },
                    output_data=analysis,
                    metadata={"analysis_type": "document", "file_size": len(content)}
                )
        except Exception as e:
            print(f"Document analysis storage failed: {e}")
        
        return analysis
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(e)}")


@app.post("/generate-adaptive-quiz")
async def generate_adaptive_quiz(
    quiz_data: Dict[str, Any],
    current_user: User = None
):
    """
    Generate adaptive quiz questions based on learning context and performance
    """
    try:
        learning_context = quiz_data.get("learningContext", {})
        previous_messages = quiz_data.get("previousMessages", [])
        difficulty = quiz_data.get("difficulty", "intermediate")
        
        user_id = current_user.id if current_user else "demo-user-123"
        
        # Get relevant learning history
        memory_context = []
        try:
            memory_manager = get_memory_manager()
            if memory_manager:
                # Get quiz and learning history
                memory_context = memory_manager.get_context_for_chain(
                    user_id=user_id,
                    chain_type="quiz",
                    current_input=quiz_data,
                    max_context_items=5
                )
        except Exception as e:
            print(f"Quiz context retrieval failed: {e}")
        
        # Generate adaptive quiz using enhanced QuizChain
        quiz_chain = QuizChain()
        quiz_input = {
            "topic": learning_context.get("currentTopic", "General Knowledge"),
            "difficulty": difficulty,
            "learning_context": learning_context,
            "memory_context": memory_context,
            "user_id": user_id
        }
        
        quiz_result = quiz_chain({"quiz_input": quiz_input})
        
        # Store quiz generation in memory
        try:
            if memory_manager:
                memory_manager.store_interaction(
                    user_id=user_id,
                    chain_type="quiz",
                    input_data=quiz_data,
                    output_data=quiz_result,
                    metadata={"adaptive": True, "context_used": len(memory_context) > 0}
                )
        except Exception as e:
            print(f"Quiz storage failed: {e}")
        
        return quiz_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")


@app.get("/learning-analytics/{user_id}")
async def get_learning_analytics(
    user_id: str,
    days_back: int = 30,
    current_user: User = None
):
    """
    Get comprehensive learning analytics and progress insights
    """
    try:
        memory_manager = get_memory_manager()
        if not memory_manager:
            raise HTTPException(status_code=503, detail="Memory system not available")
        
        # Get learning history
        learning_history = memory_manager.get_user_learning_history(
            user_id=user_id,
            days_back=days_back
        )
        
        # Generate insights and recommendations
        analytics = {
            "learning_history": learning_history,
            "progress_insights": generate_progress_insights(learning_history),
            "recommendations": generate_learning_recommendations(learning_history),
            "knowledge_gaps": identify_knowledge_gaps(learning_history),
            "strengths": identify_learning_strengths(learning_history),
            "study_patterns": analyze_study_patterns(learning_history)
        }
        
        return analytics
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics generation failed: {str(e)}")


# Helper Functions

def build_intelligent_prompt(
    message: str,
    learning_context: Dict[str, Any],
    memory_context: List[Dict[str, Any]],
    uploaded_document: Optional[Dict[str, Any]],
    active_feature: str,
    previous_messages: List[Dict[str, Any]]
) -> Dict[str, str]:
    """Build enhanced prompt with all available context"""
    
    system_prompt = f"""You are an advanced AI study assistant with the following capabilities:
    
    CORE INTELLIGENCE:
    - You have perfect memory of all past conversations with this user
    - You adapt your teaching style based on the user's learning patterns
    - You provide personalized explanations at the right difficulty level
    - You can analyze documents and create relevant study materials
    
    CURRENT USER CONTEXT:
    - Learning Level: {learning_context.get('difficulty', 'intermediate')}
    - Current Topic: {learning_context.get('currentTopic', 'Not specified')}
    - Learning Goals: {', '.join(learning_context.get('learningGoals', []))}
    - Known Strengths: {', '.join(learning_context.get('strengths', []))}
    - Areas for Improvement: {', '.join(learning_context.get('weakPoints', []))}
    - Study Streak: {learning_context.get('streak', 0)} days
    - Active Feature: {active_feature}
    
    CONVERSATION MEMORY:
    {format_memory_context(memory_context) if memory_context else "No previous context available"}
    
    DOCUMENT CONTEXT:
    {format_document_context(uploaded_document) if uploaded_document else "No document uploaded"}
    
    INSTRUCTIONS:
    1. Be personalized - remember what the user has learned before
    2. Adapt difficulty based on their demonstrated understanding
    3. Connect new concepts to things they already know
    4. Provide specific, actionable next steps
    5. Generate relevant follow-up questions
    6. If analyzing documents, focus on educational value
    7. Always encourage and acknowledge progress
    
    RESPONSE STYLE:
    - Clear, educational explanations
    - Use examples relevant to their interests
    - Break complex topics into manageable steps
    - Provide visual learning cues when helpful
    - Include confidence indicators for your explanations
    """
    
    user_prompt = f"""Current request: {message}
    
    Recent conversation context:
    {format_previous_messages(previous_messages) if previous_messages else "This is the start of our conversation"}
    
    Please provide a helpful, personalized response that takes into account my learning history and current context."""
    
    return {
        "system": system_prompt,
        "user": user_prompt
    }


def format_memory_context(memory_context: List[Dict[str, Any]]) -> str:
    """Format memory context for prompt inclusion"""
    if not memory_context:
        return "No previous learning context"
    
    formatted = "Previous learning interactions:\n"
    for item in memory_context[:3]:  # Limit to most relevant
        timestamp = item.get('timestamp', 'Unknown time')
        topic = item.get('topic', 'General')
        summary = item.get('summary', 'No summary available')
        formatted += f"- {timestamp}: {topic} - {summary}\n"
    
    return formatted


def format_document_context(document: Dict[str, Any]) -> str:
    """Format document analysis for prompt inclusion"""
    return f"""Document being analyzed:
    Title: {document.get('title', 'Unknown')}
    Type: {document.get('type', 'Unknown')}
    Summary: {document.get('summary', 'No summary')}
    Key Topics: {', '.join(document.get('keyTopics', []))}
    Difficulty: {document.get('difficulty', 'Unknown')}
    """


def format_previous_messages(messages: List[Dict[str, Any]]) -> str:
    """Format recent messages for context"""
    if not messages:
        return "No previous messages"
    
    formatted = ""
    for msg in messages[-3:]:  # Last 3 messages
        role = msg.get('role', 'unknown')
        content = msg.get('content', '')[:200] + ("..." if len(msg.get('content', '')) > 200 else "")
        formatted += f"{role.title()}: {content}\n"
    
    return formatted


async def analyze_pdf_document(content: bytes, filename: str, context: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze PDF document content"""
    # For demo - in production, use PyPDF2 or similar
    return {
        "title": filename,
        "type": "pdf",
        "summary": "PDF document analysis would extract text and create summary here",
        "keyTopics": ["Document Analysis", "PDF Processing"],
        "difficulty": "intermediate",
        "suggestedQuestions": [
            "What are the main concepts in this document?",
            "Create practice questions from this material",
            "Explain the key points in simpler terms"
        ],
        "relatedConcepts": ["Document Processing", "Information Extraction"]
    }


async def analyze_image_document(content: bytes, filename: str, context: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze image document (diagrams, handwritten notes, etc.)"""
    # For demo - in production, use OCR and image analysis
    return {
        "title": filename,
        "type": "image",
        "summary": "Image analysis would extract text/diagrams and create summary here",
        "keyTopics": ["Visual Learning", "Image Analysis"],
        "difficulty": "intermediate",
        "suggestedQuestions": [
            "Explain what's shown in this image",
            "Create questions based on this diagram",
            "Help me understand this visual concept"
        ],
        "relatedConcepts": ["Visual Learning", "Diagram Analysis"]
    }


async def analyze_text_document(content: str, filename: str, context: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze text document content"""
    # Basic analysis - in production, use NLP libraries
    words = content.split()
    word_count = len(words)
    
    # Determine difficulty based on word count and complexity
    difficulty = "beginner" if word_count < 500 else "intermediate" if word_count < 2000 else "advanced"
    
    return {
        "title": filename,
        "type": "text",
        "summary": f"Text document with {word_count} words. Content analysis would provide detailed summary here.",
        "keyTopics": ["Text Analysis", "Document Processing"],
        "difficulty": difficulty,
        "suggestedQuestions": [
            "Summarize the main points of this text",
            "Create study questions from this material",
            "Explain the complex concepts in simpler terms"
        ],
        "relatedConcepts": ["Reading Comprehension", "Text Analysis"]
    }


def analyze_learning_patterns(user_message: str, ai_response: str, current_context: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze learning patterns from interaction"""
    # Simple pattern analysis - enhance with ML in production
    return {
        "engagement_level": "high" if len(user_message) > 50 else "moderate",
        "question_complexity": "advanced" if "how" in user_message.lower() or "why" in user_message.lower() else "basic",
        "learning_focus": extract_learning_focus(user_message),
        "suggested_difficulty": current_context.get("difficulty", "intermediate")
    }


def extract_learning_focus(message: str) -> str:
    """Extract the main learning focus from user message"""
    # Simple keyword extraction - enhance with NLP
    if any(word in message.lower() for word in ["math", "calculus", "algebra"]):
        return "Mathematics"
    elif any(word in message.lower() for word in ["physics", "chemistry", "biology"]):
        return "Science"
    elif any(word in message.lower() for word in ["history", "literature", "english"]):
        return "Humanities"
    else:
        return "General"


def calculate_confidence_score(response: str, context: Dict[str, Any]) -> float:
    """Calculate confidence score for AI response"""
    # Simple scoring - enhance with actual confidence metrics
    base_score = 0.8
    
    # Increase confidence if we have good context
    if context.get("learningContext"):
        base_score += 0.1
    if context.get("uploadedDocument"):
        base_score += 0.05
    if context.get("previousMessages"):
        base_score += 0.05
    
    return min(base_score, 1.0)


def generate_smart_suggestions(learning_insights: Dict[str, Any], learning_context: Dict[str, Any]) -> List[str]:
    """Generate smart follow-up suggestions"""
    suggestions = []
    
    focus = learning_insights.get("learning_focus", "General")
    difficulty = learning_context.get("difficulty", "intermediate")
    
    suggestions.append(f"Ask me more about {focus}")
    suggestions.append(f"Generate {difficulty} practice questions")
    suggestions.append("Explain this concept differently")
    suggestions.append("Create a study plan for this topic")
    
    return suggestions


def generate_progress_insights(learning_history: Dict[str, Any]) -> Dict[str, Any]:
    """Generate insights from learning history"""
    return {
        "total_sessions": learning_history.get("total_interactions", 0),
        "favorite_topics": ["Math", "Science"],  # Analyze from history
        "learning_velocity": "Improving",
        "consistency": "Good",
        "areas_of_growth": ["Problem solving", "Concept application"]
    }


def generate_learning_recommendations(learning_history: Dict[str, Any]) -> List[str]:
    """Generate personalized learning recommendations"""
    return [
        "Focus on practicing problems you got wrong",
        "Review concepts from last week",
        "Try explaining topics to someone else",
        "Set aside 30 minutes daily for consistent practice"
    ]


def identify_knowledge_gaps(learning_history: Dict[str, Any]) -> List[str]:
    """Identify potential knowledge gaps"""
    return [
        "Advanced algebra concepts",
        "Scientific notation",
        "Reading comprehension strategies"
    ]


def identify_learning_strengths(learning_history: Dict[str, Any]) -> List[str]:
    """Identify learning strengths"""
    return [
        "Quick to grasp new concepts",
        "Asks thoughtful questions",
        "Consistent study habits",
        "Good at making connections"
    ]


def analyze_study_patterns(learning_history: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze study patterns and habits"""
    return {
        "most_active_time": "Evening",
        "preferred_subjects": ["Mathematics", "Science"],
        "session_length": "25 minutes average",
        "learning_style": "Visual and Interactive",
        "progress_trend": "Upward"
    }