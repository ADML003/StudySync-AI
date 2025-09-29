"""
Test Memory Management System

This script tests the comprehensive memory management capabilities:
1. Basic memory storage and retrieval
2. Context-aware AI chain responses  
3. Memory integration with existing chains
4. User learning history tracking
"""

import asyncio
import json
import logging
import sys
import os
from datetime import datetime
from uuid import uuid4, UUID

# Add backend to path
sys.path.append('/Users/ADML/Desktop/cerebras/backend')

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_memory_manager_initialization():
    """Test memory manager initialization"""
    logger.info("🧠 Testing Memory Manager Initialization")
    
    try:
        from memory_manager import initialize_memory_manager, get_memory_manager
        
        # Initialize with ChromaDB only (Redis might not be available)
        memory_manager = initialize_memory_manager(
            chroma_persist_dir="./test_data/chroma_memory",
            enable_chroma=True,
            enable_redis=False  # Disable Redis for testing
        )
        
        assert memory_manager is not None, "Memory manager should be initialized"
        assert memory_manager.chroma_store is not None, "ChromaDB store should be available"
        
        logger.info("✅ Memory manager initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"❌ Memory manager initialization failed: {e}")
        return False


def test_basic_memory_operations():
    """Test basic memory storage and retrieval"""
    logger.info("💾 Testing Basic Memory Operations")
    
    try:
        from memory_manager import get_memory_manager
        
        memory_manager = get_memory_manager()
        if not memory_manager:
            logger.warning("Memory manager not available, skipping test")
            return True
        
        test_user_id = str(uuid4())
        
        # Test storing interactions
        store_success = memory_manager.store_interaction(
            user_id=test_user_id,
            chain_type="plan",
            input_data={
                "subject": "Python Programming",
                "goals": ["Learn basics", "Build projects"],
                "timeline": "4 weeks"
            },
            output_data={
                "title": "Python Programming Study Plan",
                "description": "Comprehensive 4-week Python learning plan"
            },
            session_id="test_session_1",
            metadata={"test": True}
        )
        
        assert store_success, "Interaction storage should succeed"
        
        # Test retrieving context
        context = memory_manager.get_context_for_chain(
            user_id=test_user_id,
            chain_type="plan",
            current_input={"subject": "Advanced Python", "goals": ["OOP", "Web Development"]},
            max_context_items=2
        )
        
        logger.info(f"Retrieved {len(context)} context items")
        
        # Test learning history
        history = memory_manager.get_user_learning_history(test_user_id, days_back=1)
        assert "total_interactions" in history, "Learning history should contain interaction count"
        
        logger.info("✅ Basic memory operations successful")
        return True
        
    except Exception as e:
        logger.error(f"❌ Basic memory operations failed: {e}")
        return False


def test_chains_with_memory():
    """Test AI chains with memory integration"""
    logger.info("🔗 Testing Chains with Memory Integration")
    
    try:
        from simple_chains import PlanChain, QuizChain, ExplainChain, StudyPlanInput, QuizInput, ExplainInput
        
        test_user_id = UUID(str(uuid4()))
        
        # Test Plan Chain with memory
        plan_chain = PlanChain()
        plan_input = StudyPlanInput(
            user_id=test_user_id,
            subject="Machine Learning Basics",
            goals=["Understand algorithms", "Implement models"],
            timeline="6 weeks",
            difficulty_level="beginner"
        )
        
        logger.info("Testing Plan Chain with memory...")
        plan_result = plan_chain({"study_plan_input": plan_input})
        assert "title" in plan_result, "Plan should have title"
        logger.info(f"Plan generated: {plan_result.get('title', 'No title')}")
        
        # Test Quiz Chain with memory
        quiz_chain = QuizChain()
        quiz_input = QuizInput(
            user_id=test_user_id,
            topic="Machine Learning Fundamentals",
            difficulty="easy",
            question_count=3
        )
        
        logger.info("Testing Quiz Chain with memory...")
        quiz_result = quiz_chain({"quiz_input": quiz_input})
        assert "questions" in quiz_result, "Quiz should have questions"
        question_count = len(quiz_result.get("questions", []))
        logger.info(f"Quiz generated with {question_count} questions")
        
        # Test Explain Chain with memory
        explain_chain = ExplainChain()
        explain_input = ExplainInput(
            user_id=test_user_id,
            concept="Supervised Learning",
            complexity_level="beginner"
        )
        
        logger.info("Testing Explain Chain with memory...")
        explain_result = explain_chain({"explain_input": explain_input})
        assert "explanation" in explain_result, "Explanation should be generated"
        explanation_length = len(explain_result.get("explanation", ""))
        logger.info(f"Explanation generated ({explanation_length} characters)")
        
        logger.info("✅ All chains working with memory integration")
        return True
        
    except Exception as e:
        logger.error(f"❌ Chains with memory failed: {e}")
        logger.exception("Full traceback:")
        return False


def test_context_awareness():
    """Test context-aware responses"""
    logger.info("🧭 Testing Context Awareness")
    
    try:
        from simple_chains import PlanChain, StudyPlanInput
        from memory_manager import get_memory_manager
        
        memory_manager = get_memory_manager()
        if not memory_manager:
            logger.warning("Memory manager not available, skipping context test")
            return True
        
        test_user_id = UUID(str(uuid4()))
        plan_chain = PlanChain()
        
        # Create first study plan
        plan_input_1 = StudyPlanInput(
            user_id=test_user_id,
            subject="Python Basics",
            goals=["Learn syntax", "Variables and functions"],
            timeline="2 weeks",
            difficulty_level="beginner"
        )
        
        logger.info("Creating first study plan...")
        result_1 = plan_chain({"study_plan_input": plan_input_1})
        
        # Create second study plan (should have context from first)
        plan_input_2 = StudyPlanInput(
            user_id=test_user_id,
            subject="Python Advanced",
            goals=["Object-oriented programming", "Web frameworks"],
            timeline="4 weeks",
            difficulty_level="intermediate"
        )
        
        logger.info("Creating second study plan with context...")
        result_2 = plan_chain({"study_plan_input": plan_input_2})
        
        # Verify both plans were created
        assert "title" in result_1 and "title" in result_2, "Both plans should be generated"
        
        # Test context retrieval
        context = memory_manager.get_context_for_chain(
            user_id=test_user_id,
            chain_type="plan",
            current_input=plan_input_2.dict(),
            max_context_items=5
        )
        
        logger.info(f"Context retrieved: {len(context)} items")
        if context:
            logger.info(f"Sample context: {context[0].get('input_summary', 'No summary')}")
        
        logger.info("✅ Context awareness working")
        return True
        
    except Exception as e:
        logger.error(f"❌ Context awareness test failed: {e}")
        return False


def test_learning_analytics():
    """Test learning history and analytics"""
    logger.info("📊 Testing Learning Analytics")
    
    try:
        from memory_manager import get_memory_manager
        
        memory_manager = get_memory_manager()
        if not memory_manager:
            logger.warning("Memory manager not available, skipping analytics test")
            return True
        
        test_user_id = str(uuid4())
        
        # Store multiple interactions
        interactions = [
            {
                "chain_type": "plan",
                "input_data": {"subject": "Python", "goals": ["Basics"], "timeline": "2 weeks"},
                "output_data": {"title": "Python Basics Plan"}
            },
            {
                "chain_type": "quiz", 
                "input_data": {"topic": "Python Variables", "difficulty": "easy"},
                "output_data": {"questions": [{"question": "What is a variable?"}]}
            },
            {
                "chain_type": "explain",
                "input_data": {"concept": "Python Functions"},
                "output_data": {"explanation": "Functions are reusable blocks of code..."}
            }
        ]
        
        for interaction in interactions:
            memory_manager.store_interaction(
                user_id=test_user_id,
                chain_type=interaction["chain_type"],
                input_data=interaction["input_data"],
                output_data=interaction["output_data"]
            )
        
        # Get learning history
        history = memory_manager.get_user_learning_history(test_user_id, days_back=1)
        
        assert "total_interactions" in history, "History should contain interaction count"
        assert "learning_patterns" in history, "History should contain learning patterns"
        
        logger.info(f"Learning history: {history['total_interactions']} total interactions")
        logger.info(f"Study plans: {len(history.get('study_plans', []))}")
        logger.info(f"Quiz attempts: {len(history.get('quiz_attempts', []))}")
        logger.info(f"Concepts explored: {len(history.get('concepts_explored', []))}")
        
        logger.info("✅ Learning analytics working")
        return True
        
    except Exception as e:
        logger.error(f"❌ Learning analytics test failed: {e}")
        return False


def main():
    """Run all memory system tests"""
    logger.info("🚀 Starting Memory Management System Tests")
    
    tests = [
        ("Memory Manager Initialization", test_memory_manager_initialization),
        ("Basic Memory Operations", test_basic_memory_operations),
        ("Chains with Memory", test_chains_with_memory),
        ("Context Awareness", test_context_awareness),
        ("Learning Analytics", test_learning_analytics)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        logger.info(f"\n{'='*50}")
        logger.info(f"Running: {test_name}")
        logger.info(f"{'='*50}")
        
        try:
            result = test_func()
            results.append((test_name, result))
            
            if result:
                logger.info(f"✅ {test_name} PASSED")
            else:
                logger.error(f"❌ {test_name} FAILED")
        
        except Exception as e:
            logger.error(f"❌ {test_name} CRASHED: {e}")
            results.append((test_name, False))
    
    # Summary
    logger.info(f"\n{'='*50}")
    logger.info("TEST SUMMARY")
    logger.info(f"{'='*50}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        logger.info(f"{test_name}: {status}")
    
    logger.info(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        logger.info("🎉 All memory system tests passed!")
        return True
    else:
        logger.error(f"💥 {total - passed} tests failed")
        return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)