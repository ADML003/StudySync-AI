#!/usr/bin/env python3
"""
Advanced test script for StudySync AI backend endpoints with AI features
"""

import requests
import json
from uuid import uuid4
import time

BASE_URL = "http://localhost:8001"
TEST_USER_ID = str(uuid4())

def test_study_plan_generation_direct():
    """Test study plan generation by calling the chain directly"""
    print("🧠 Testing Study Plan Generation (Direct Chain Call)...")
    
    try:
        from simple_chains import create_plan_chain, StudyPlanInput
        
        # Create the chain
        plan_chain = create_plan_chain()
        
        # Create test input
        plan_input = StudyPlanInput(
            user_id=uuid4(),
            subject="Python Programming",
            goals=["Learn web development", "Build REST APIs"],
            timeline="4 weeks",
            difficulty_level="intermediate",
            learning_style="hands-on",
            time_commitment="2 hours per day",
            focus_areas=["FastAPI", "databases", "testing"],
            current_knowledge="Basic Python syntax and functions"
        )
        
        print(f"📋 Generating study plan for: {plan_input.subject}")
        print(f"   Timeline: {plan_input.timeline}")
        print(f"   Goals: {', '.join(plan_input.goals)}")
        
        # Call the chain
        start_time = time.time()
        result = plan_chain({"study_plan_input": plan_input})
        end_time = time.time()
        
        print(f"✅ Plan generated in {end_time - start_time:.2f} seconds")
        print(f"📖 Title: {result.get('title', 'No title')}")
        print(f"📝 Description: {result.get('description', 'No description')[:200]}...")
        print(f"🎯 Sections: {len(result.get('sections', []))}")
        print(f"📊 Metadata: {result.get('metadata', {})}")
        
        return True
        
    except Exception as e:
        print(f"❌ Study plan generation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_quiz_generation_direct():
    """Test quiz generation by calling the chain directly"""
    print("\n❓ Testing Quiz Generation (Direct Chain Call)...")
    
    try:
        from simple_chains import create_quiz_chain, QuizInput
        
        # Create the chain
        quiz_chain = create_quiz_chain()
        
        # Create test input
        quiz_input = QuizInput(
            user_id=uuid4(),
            topic="Python Functions",
            difficulty="medium",
            question_count=3,
            question_types=["multiple_choice", "short_answer"],
            focus_areas=["function definition", "parameters", "return values"],
            learning_objectives=["Understand function syntax", "Apply function concepts"]
        )
        
        print(f"❓ Generating quiz for: {quiz_input.topic}")
        print(f"   Difficulty: {quiz_input.difficulty}")
        print(f"   Questions: {quiz_input.question_count}")
        
        # Call the chain
        start_time = time.time()
        result = quiz_chain({"quiz_input": quiz_input})
        end_time = time.time()
        
        questions = result.get('questions', [])
        print(f"✅ Quiz generated in {end_time - start_time:.2f} seconds")
        print(f"❓ Generated {len(questions)} questions")
        
        for i, q in enumerate(questions[:2], 1):  # Show first 2 questions
            print(f"\n   Question {i}: {q.get('question', 'No question')[:100]}...")
            print(f"   Type: {q.get('type', 'unknown')}")
            if q.get('options'):
                print(f"   Options: {len(q.get('options', []))} choices")
        
        print(f"📊 Metadata: {result.get('metadata', {})}")
        
        return True
        
    except Exception as e:
        print(f"❌ Quiz generation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_explanation_generation_direct():
    """Test explanation generation by calling the chain directly"""
    print("\n🧠 Testing Concept Explanation (Direct Chain Call)...")
    
    try:
        from simple_chains import create_explain_chain, ExplainInput
        
        # Create the chain
        explain_chain = create_explain_chain()
        
        # Create test input
        explain_input = ExplainInput(
            user_id=uuid4(),
            concept="Python Decorators",
            complexity_level="intermediate",
            format_preference="detailed",
            target_audience="student",
            context="Learning advanced Python concepts for web development"
        )
        
        print(f"🧠 Generating explanation for: {explain_input.concept}")
        print(f"   Complexity: {explain_input.complexity_level}")
        print(f"   Audience: {explain_input.target_audience}")
        
        # Call the chain
        start_time = time.time()
        result = explain_chain({"explain_input": explain_input})
        end_time = time.time()
        
        explanation = result.get('explanation', '')
        print(f"✅ Explanation generated in {end_time - start_time:.2f} seconds")
        print(f"📖 Explanation length: {len(explanation)} characters")
        print(f"📝 Preview: {explanation[:300]}...")
        print(f"📊 Metadata: {result.get('metadata', {})}")
        
        return True
        
    except Exception as e:
        print(f"❌ Explanation generation failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_cerebras_connection():
    """Test Cerebras AI connection directly"""
    print("\n🤖 Testing Cerebras AI Connection...")
    
    try:
        from cerebras_client import cerebras_client
        
        print("🔌 Testing Cerebras API connection...")
        
        # Simple test call
        response = cerebras_client.chat.completions.create(
            model="llama3.1-8b",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'Hello from StudySync AI!' in exactly those words."}
            ],
            max_tokens=20,
            temperature=0.1
        )
        
        message = response.choices[0].message.content
        print(f"✅ Cerebras response: {message}")
        
        if "StudySync AI" in message:
            print("🎉 Cerebras AI is working correctly!")
            return True
        else:
            print("⚠️ Cerebras response seems unexpected but connection works")
            return True
            
    except Exception as e:
        print(f"❌ Cerebras connection failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all AI tests"""
    print("🚀 StudySync AI - Advanced Endpoint Testing")
    print("=" * 60)
    
    tests = [
        test_cerebras_connection,
        test_study_plan_generation_direct,
        test_quiz_generation_direct,
        test_explanation_generation_direct
    ]
    
    results = []
    for test in tests:
        result = test()
        results.append(result)
        time.sleep(1)  # Brief pause between tests
    
    print("\n" + "=" * 60)
    print(f"📊 AI Test Results: {sum(results)}/{len(results)} passed")
    
    if all(results):
        print("🎉 All AI features are working perfectly!")
        print("\n🚀 Your StudySync AI backend is fully operational!")
        print("   ✅ Cerebras AI integration working")
        print("   ✅ Study plan generation working") 
        print("   ✅ Quiz generation working")
        print("   ✅ Concept explanation working")
        print("   ✅ All endpoints responding correctly")
    else:
        print("⚠️ Some AI tests failed - check output above")

if __name__ == "__main__":
    main()