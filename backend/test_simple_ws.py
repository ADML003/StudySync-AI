#!/usr/bin/env python3
"""
Simple WebSocket Test Client for StudySync AI

Tests the /ws/adapt endpoint with streaming quiz generation.
"""

import asyncio
import json
import websockets
from uuid import uuid4


async def test_websocket():
    """Test WebSocket streaming quiz generation"""
    
    uri = "ws://localhost:8000/ws/adapt"
    print(f"🚀 Connecting to WebSocket: {uri}")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected!")
            
            # Wait for welcome message
            welcome = await websocket.recv()
            welcome_data = json.loads(welcome)
            print(f"📨 Welcome: {welcome_data['message']}")
            
            # Send quiz request
            request = {
                "type": "quiz_request",
                "data": {
                    "user_id": str(uuid4()),
                    "topic": "Python Basics",
                    "difficulty": "easy", 
                    "question_count": 2,
                    "question_types": ["multiple_choice"]
                },
                "request_id": str(uuid4())
            }
            
            print(f"\n📤 Sending request:")
            print(json.dumps(request, indent=2))
            
            await websocket.send(json.dumps(request))
            
            # Listen for responses
            print(f"\n🎧 Listening for responses...")
            
            async for message in websocket:
                response = json.loads(message)
                msg_type = response.get("type")
                
                if msg_type == "status":
                    print(f"📊 Status: {response.get('status')} - {response.get('message')}")
                
                elif msg_type == "content_update":
                    content = response.get("content_piece", "")
                    print(f"📝 Content: {repr(content)}")
                
                elif msg_type == "quiz_complete":
                    result = response.get("result", {})
                    questions = result.get("questions", [])
                    print(f"\n🎉 Quiz Complete! Generated {len(questions)} questions:")
                    
                    for i, q in enumerate(questions, 1):
                        print(f"   Q{i}: {q.get('question', '')[:60]}...")
                    
                    break
                
                elif msg_type == "error":
                    print(f"❌ Error: {response.get('error')}")
                    break
                
                else:
                    print(f"📩 {msg_type}: {response}")
    
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(test_websocket())