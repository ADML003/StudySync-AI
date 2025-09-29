#!/usr/bin/env python3
"""
WebSocket Test Client for StudySync AI Streaming Quiz Generation

This script demonstrates how to connect to the /ws/adapt endpoint
and stream real-time quiz generation.

Usage:
    python test_websocket_client.py

Requirements:
    pip install websockets asyncio
"""

import asyncio
import json
import websockets
from uuid import uuid4
from datetime import datetime


async def test_websocket_client():
    """Test WebSocket client for streaming quiz generation"""
    
    # WebSocket URL
    websocket_url = "ws://localhost:8001/ws/adapt"
    
    print("🚀 Starting WebSocket Test Client")
    print(f"Connecting to: {websocket_url}")
    
    try:
        # Connect to WebSocket
        async with websockets.connect(websocket_url) as websocket:
            print("✅ Connected to WebSocket!")
            
            # Wait for welcome message
            welcome = await websocket.recv()
            welcome_data = json.loads(welcome)
            print(f"📨 Welcome: {welcome_data}")
            
            # Send quiz generation request
            quiz_request = {
                "type": "quiz_request",
                "data": {
                    "user_id": str(uuid4()),
                    "topic": "Python Programming Fundamentals",
                    "difficulty": "medium",
                    "question_count": 3,
                    "question_types": ["multiple_choice", "short_answer"],
                    "focus_areas": ["Variables", "Functions", "Data Types"],
                    "learning_objectives": [
                        "Understand Python syntax",
                        "Practice problem-solving"
                    ]
                },
                "request_id": str(uuid4())
            }
            
            print(f"\n📤 Sending quiz request:")
            print(json.dumps(quiz_request, indent=2))
            
            await websocket.send(json.dumps(quiz_request))
            
            # Listen for responses
            print(f"\n🎧 Listening for streaming responses...\n")
            
            response_count = 0
            while True:
                try:
                    # Receive message with timeout
                    message = await asyncio.wait_for(websocket.recv(), timeout=60.0)
                    response_count += 1
                    
                    response = json.loads(message)
                    response_type = response.get("type", "unknown")
                    timestamp = response.get("timestamp", "")
                    
                    print(f"[{response_count:03d}] {timestamp} - {response_type.upper()}")
                    
                    if response_type == "status":
                        status = response.get("status", "")
                        message_text = response.get("message", "")
                        print(f"     Status: {status} - {message_text}")
                    
                    elif response_type == "content_update":
                        content_piece = response.get("content_piece", "")
                        print(f"     Content: {repr(content_piece)}")
                    
                    elif response_type == "quiz_complete":
                        result = response.get("result", {})
                        questions = result.get("questions", [])
                        metadata = result.get("metadata", {})
                        
                        print(f"     ✅ Quiz Complete!")
                        print(f"     Questions generated: {len(questions)}")
                        print(f"     Model used: {metadata.get('model_used', 'unknown')}")
                        
                        # Print questions summary
                        for i, q in enumerate(questions, 1):
                            question_text = q.get("question", "")[:50] + "..." if len(q.get("question", "")) > 50 else q.get("question", "")
                            print(f"     Q{i}: {question_text}")
                        
                        print(f"\n🎉 Quiz generation completed successfully!")
                        break
                    
                    elif response_type == "error":
                        error_msg = response.get("error", "")
                        print(f"     ❌ Error: {error_msg}")
                        break
                    
                    elif response_type == "ping":
                        # Send pong response
                        pong = {
                            "type": "pong",
                            "request_id": response.get("request_id"),
                            "timestamp": datetime.now().isoformat()
                        }
                        await websocket.send(json.dumps(pong))
                        print(f"     🏓 Sent pong response")
                    
                    else:
                        print(f"     Data: {json.dumps(response, indent=6)}")
                
                except asyncio.TimeoutError:
                    print("⏰ Timeout waiting for response")
                    break
                except websockets.exceptions.ConnectionClosed:
                    print("🔌 Connection closed by server")
                    break
    
    except ConnectionRefusedError:
        print("❌ Connection refused. Make sure the FastAPI server is running on localhost:8001")
        print("   Start the server with: python main.py")
    except Exception as e:
        print(f"❌ Error: {e}")


async def test_ping_pong():
    """Test ping/pong functionality"""
    websocket_url = "ws://localhost:8001/ws/adapt"
    
    print("\n🏓 Testing Ping/Pong...")
    
    try:
        async with websockets.connect(websocket_url) as websocket:
            # Wait for welcome
            await websocket.recv()
            
            # Send ping
            ping_request = {
                "type": "ping",
                "request_id": str(uuid4()),
                "timestamp": datetime.now().isoformat()
            }
            
            await websocket.send(json.dumps(ping_request))
            
            # Wait for pong
            response = await asyncio.wait_for(websocket.recv(), timeout=10.0)
            pong_data = json.loads(response)
            
            if pong_data.get("type") == "pong":
                print("✅ Ping/Pong test successful!")
            else:
                print(f"❌ Unexpected response: {pong_data}")
    
    except Exception as e:
        print(f"❌ Ping/Pong test failed: {e}")


async def main():
    """Run all WebSocket tests"""
    print("🧪 StudySync AI WebSocket Test Suite\n")
    
    # Test main functionality
    await test_websocket_client()
    
    # Test ping/pong
    await test_ping_pong()
    
    print("\n✅ WebSocket tests completed!")


if __name__ == "__main__":
    # Run the test
    asyncio.run(main())