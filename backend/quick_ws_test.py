#!/usr/bin/env python3
"""
Quick WebSocket connection test for StudySync AI
"""

import asyncio
import json
import websockets
from uuid import uuid4

async def quick_test():
    try:
        # Test connection
        async with websockets.connect("ws://localhost:8000/ws/adapt") as ws:
            print("✅ WebSocket connected!")
            
            # Get welcome
            welcome = await ws.recv()
            print(f"📨 Welcome: {json.loads(welcome)['type']}")
            
            # Send ping
            await ws.send(json.dumps({"type": "ping", "data": {}}))
            
            # Get pong
            pong = await asyncio.wait_for(ws.recv(), timeout=5)
            print(f"📨 Response: {json.loads(pong)['type']}")
            
            print("🎉 WebSocket test successful!")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    asyncio.run(quick_test())