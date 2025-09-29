"""
WebSocket module for real-time AI-powered quiz generation.
Provides streaming quiz generation using QuizChain with live updates to clients.
"""

import json
import logging
import asyncio
from typing import Dict, Any, Optional
from uuid import UUID, uuid4
from datetime import datetime

from fastapi import WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel, ValidationError

from simple_chains import QuizInput, QuizChain
from cerebras_client import cerebras_client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class WebSocketMessage(BaseModel):
    """WebSocket message model for quiz generation requests"""
    type: str  # "quiz_request", "ping", etc.
    data: Dict[str, Any]
    user_id: Optional[str] = None
    request_id: Optional[str] = None


class StreamingQuizChain:
    """Enhanced QuizChain with streaming capabilities for real-time updates"""
    
    def __init__(self):
        self.base_chain = QuizChain()
    
    async def generate_streaming_quiz(
        self,
        quiz_input: QuizInput,
        websocket: WebSocket,
        request_id: str
    ) -> None:
        """
        Generate quiz questions with real-time streaming updates
        
        Args:
            quiz_input: Quiz generation parameters
            websocket: WebSocket connection for streaming
            request_id: Unique request identifier
        """
        try:
            # Send initial status
            await self._send_status(websocket, request_id, "initializing", "Starting quiz generation...")
            
            # Get context from memory if available
            context = []
            try:
                from memory_manager import get_context_for_ai_chain
                context = get_context_for_ai_chain(
                    user_id=quiz_input.user_id,
                    chain_type="quiz",
                    current_input=quiz_input.model_dump(),
                    max_context_items=3
                )
                await self._send_status(websocket, request_id, "context_loaded", f"Loaded {len(context)} context items")
            except Exception as e:
                logger.warning(f"Failed to retrieve context: {e}")
                await self._send_status(websocket, request_id, "context_warning", "Proceeding without context")
            
            # Create prompt
            prompt = self.base_chain._create_quiz_prompt(quiz_input, context)
            await self._send_status(websocket, request_id, "prompt_ready", "Prompt created, calling AI...")
            
            # Stream AI response
            await self._stream_ai_response(websocket, request_id, prompt, quiz_input)
            
        except Exception as e:
            logger.error(f"Error in streaming quiz generation: {e}")
            await self._send_error(websocket, request_id, str(e))
    
    async def _stream_ai_response(
        self,
        websocket: WebSocket,
        request_id: str,
        prompt: str,
        quiz_input: QuizInput
    ) -> None:
        """Stream AI response with real-time updates"""
        try:
            # Call Cerebras AI with streaming enabled
            response = cerebras_client.chat.completions.create(
                model="llama3.1-8b",
                messages=[
                    {
                        "role": "system", 
                        "content": "You are an expert educator who creates high-quality educational quiz questions. Generate clear, accurate questions with detailed explanations in JSON format."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.7,
                stream=True  # Enable streaming
            )
            
            accumulated_content = ""
            question_count = 0
            
            await self._send_status(websocket, request_id, "generating", "AI is generating questions...")
            
            # Process streaming response
            for chunk in response:
                if chunk.choices[0].delta.content:
                    content_piece = chunk.choices[0].delta.content
                    accumulated_content += content_piece
                    
                    # Send real-time content updates
                    await self._send_content_update(
                        websocket, 
                        request_id, 
                        content_piece, 
                        accumulated_content
                    )
                    
                    # Check for completed questions (simple heuristic)
                    if "?" in content_piece:
                        question_count += 1
                        await self._send_status(
                            websocket, 
                            request_id, 
                            "question_completed", 
                            f"Generated question {question_count}"
                        )
            
            # Parse final result
            questions = self.base_chain._parse_questions(accumulated_content, quiz_input)
            
            # Create final result
            quiz_result = {
                "questions": questions,
                "metadata": {
                    "user_id": str(quiz_input.user_id),
                    "generated_at": datetime.now().isoformat(),
                    "model_used": "llama3.1-8b",
                    "question_count": len(questions)
                }
            }
            
            # Store in memory if available
            try:
                from memory_manager import store_user_interaction
                store_user_interaction(
                    user_id=quiz_input.user_id,
                    chain_type="quiz",
                    input_data=quiz_input.model_dump(),
                    output_data=quiz_result,
                    metadata={"streamed": True}
                )
            except Exception as e:
                logger.warning(f"Failed to store interaction: {e}")
            
            # Send final result
            await self._send_final_result(websocket, request_id, quiz_result)
            
        except Exception as e:
            logger.error(f"Error streaming AI response: {e}")
            await self._send_error(websocket, request_id, str(e))
    
    async def _send_status(
        self, 
        websocket: WebSocket, 
        request_id: str, 
        status: str, 
        message: str
    ) -> None:
        """Send status update to client"""
        try:
            await websocket.send_text(json.dumps({
                "type": "status",
                "request_id": request_id,
                "status": status,
                "message": message,
                "timestamp": datetime.now().isoformat()
            }))
        except Exception as e:
            logger.error(f"Error sending status: {e}")
    
    async def _send_content_update(
        self, 
        websocket: WebSocket, 
        request_id: str, 
        content_piece: str,
        accumulated_content: str
    ) -> None:
        """Send real-time content update to client"""
        try:
            await websocket.send_text(json.dumps({
                "type": "content_update",
                "request_id": request_id,
                "content_piece": content_piece,
                "accumulated_content": accumulated_content,
                "timestamp": datetime.now().isoformat()
            }))
        except Exception as e:
            logger.error(f"Error sending content update: {e}")
    
    async def _send_final_result(
        self, 
        websocket: WebSocket, 
        request_id: str, 
        quiz_result: Dict[str, Any]
    ) -> None:
        """Send final quiz result to client"""
        try:
            await websocket.send_text(json.dumps({
                "type": "quiz_complete",
                "request_id": request_id,
                "result": quiz_result,
                "timestamp": datetime.now().isoformat()
            }))
        except Exception as e:
            logger.error(f"Error sending final result: {e}")
    
    async def _send_error(
        self, 
        websocket: WebSocket, 
        request_id: str, 
        error_message: str
    ) -> None:
        """Send error message to client"""
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "request_id": request_id,
                "error": error_message,
                "timestamp": datetime.now().isoformat()
            }))
        except Exception as e:
            logger.error(f"Error sending error message: {e}")


class ConnectionManager:
    """Manages WebSocket connections and handles client lifecycle"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.streaming_chain = StreamingQuizChain()
    
    async def connect(self, websocket: WebSocket, client_id: str) -> None:
        """Accept new WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client {client_id} connected. Active connections: {len(self.active_connections)}")
    
    def disconnect(self, client_id: str) -> None:
        """Remove client connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"Client {client_id} disconnected. Active connections: {len(self.active_connections)}")
    
    async def handle_message(
        self, 
        websocket: WebSocket, 
        client_id: str, 
        message: str
    ) -> None:
        """Process incoming WebSocket message"""
        try:
            # Parse message
            try:
                ws_message = WebSocketMessage.model_validate(json.loads(message))
            except (json.JSONDecodeError, ValidationError) as e:
                await self._send_error_to_client(websocket, None, f"Invalid message format: {e}")
                return
            
            # Handle different message types
            if ws_message.type == "quiz_request":
                await self._handle_quiz_request(websocket, ws_message)
            elif ws_message.type == "ping":
                await self._handle_ping(websocket, ws_message)
            else:
                await self._send_error_to_client(
                    websocket, 
                    ws_message.request_id, 
                    f"Unknown message type: {ws_message.type}"
                )
        
        except Exception as e:
            logger.error(f"Error handling message from {client_id}: {e}")
            await self._send_error_to_client(websocket, None, str(e))
    
    async def _handle_quiz_request(
        self, 
        websocket: WebSocket, 
        ws_message: WebSocketMessage
    ) -> None:
        """Handle quiz generation request"""
        try:
            # Validate quiz input data
            quiz_data = ws_message.data
            
            # Ensure user_id is provided
            if not quiz_data.get("user_id"):
                if ws_message.user_id:
                    quiz_data["user_id"] = ws_message.user_id
                else:
                    raise ValueError("user_id is required")
            
            # Create QuizInput instance
            quiz_input = QuizInput(**quiz_data)
            
            # Generate request ID if not provided
            request_id = ws_message.request_id or str(uuid4())
            
            # Start streaming quiz generation
            await self.streaming_chain.generate_streaming_quiz(
                quiz_input, 
                websocket, 
                request_id
            )
            
        except ValidationError as e:
            await self._send_error_to_client(
                websocket, 
                ws_message.request_id, 
                f"Invalid quiz request data: {e}"
            )
        except Exception as e:
            await self._send_error_to_client(
                websocket, 
                ws_message.request_id, 
                f"Error processing quiz request: {e}"
            )
    
    async def _handle_ping(
        self, 
        websocket: WebSocket, 
        ws_message: WebSocketMessage
    ) -> None:
        """Handle ping message"""
        try:
            await websocket.send_text(json.dumps({
                "type": "pong",
                "request_id": ws_message.request_id,
                "timestamp": datetime.now().isoformat()
            }))
        except Exception as e:
            logger.error(f"Error sending pong: {e}")
    
    async def _send_error_to_client(
        self, 
        websocket: WebSocket, 
        request_id: Optional[str], 
        error_message: str
    ) -> None:
        """Send error message to specific client"""
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "request_id": request_id,
                "error": error_message,
                "timestamp": datetime.now().isoformat()
            }))
        except Exception as e:
            logger.error(f"Error sending error to client: {e}")


# Global connection manager instance
manager = ConnectionManager()


async def websocket_adapt_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for adaptive quiz generation with real-time streaming.
    
    Message Format:
    {
        "type": "quiz_request",
        "data": {
            "user_id": "uuid",
            "topic": "Python Data Structures",
            "difficulty": "medium",
            "question_count": 5,
            "question_types": ["multiple_choice", "short_answer"],
            "focus_areas": ["Lists", "Dictionaries"]
        },
        "request_id": "optional-uuid"
    }
    
    Response Types:
    - status: Progress updates during generation
    - content_update: Real-time AI response streaming
    - quiz_complete: Final quiz result
    - error: Error messages
    - pong: Response to ping
    """
    client_id = str(uuid4())
    
    try:
        # Accept connection
        await manager.connect(websocket, client_id)
        
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "connected",
            "client_id": client_id,
            "message": "Connected to StudySync AI streaming quiz service",
            "timestamp": datetime.now().isoformat()
        }))
        
        # Handle messages
        while True:
            try:
                # Receive message with timeout
                message = await asyncio.wait_for(websocket.receive_text(), timeout=300.0)
                await manager.handle_message(websocket, client_id, message)
                
            except asyncio.TimeoutError:
                # Send ping to check if connection is still alive
                await websocket.send_text(json.dumps({
                    "type": "ping",
                    "timestamp": datetime.now().isoformat()
                }))
                
            except WebSocketDisconnect:
                logger.info(f"Client {client_id} disconnected normally")
                break
                
    except WebSocketDisconnect:
        logger.info(f"Client {client_id} disconnected")
    except Exception as e:
        logger.error(f"Unexpected error in WebSocket connection {client_id}: {e}")
    finally:
        # Clean up connection
        manager.disconnect(client_id)
        logger.info(f"Cleaned up connection for client {client_id}")