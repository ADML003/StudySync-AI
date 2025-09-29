"""
Memory Manager for StudySync AI

This module provides persistent memory capabilities for AI chains, allowing them to:
- Store user interaction history with context awareness
- Retrieve relevant past interactions to enhance AI responses
- Maintain conversation continuity across sessions
- Support both ChromaDB (vector storage) and Redis (fast caching)

Features:
- Vector-based similarity search for relevant context retrieval
- User-scoped memory isolation
- Chain-type specific storage (plans, quizzes, explanations)
- Configurable memory retention and limits
- Hybrid storage: ChromaDB for semantic search + Redis for recent interactions
"""

import json
import logging
import hashlib
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Union
from uuid import UUID
import asyncio
from dataclasses import dataclass

try:
    import chromadb
    from chromadb.config import Settings
    CHROMADB_AVAILABLE = True
except ImportError:
    CHROMADB_AVAILABLE = False
    logging.warning("ChromaDB not available. Install with: pip install chromadb")

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logging.warning("Redis not available. Install with: pip install redis")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class InteractionRecord:
    """Represents a single user interaction with an AI chain"""
    user_id: str
    chain_type: str  # 'plan', 'quiz', 'explain'
    input_data: Dict[str, Any]
    output_data: Dict[str, Any]
    timestamp: datetime
    session_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for storage"""
        return {
            "user_id": self.user_id,
            "chain_type": self.chain_type,
            "input_data": self.input_data,
            "output_data": self.output_data,
            "timestamp": self.timestamp.isoformat(),
            "session_id": self.session_id,
            "metadata": self.metadata or {}
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'InteractionRecord':
        """Create from dictionary"""
        return cls(
            user_id=data["user_id"],
            chain_type=data["chain_type"],
            input_data=data["input_data"],
            output_data=data["output_data"],
            timestamp=datetime.fromisoformat(data["timestamp"]),
            session_id=data.get("session_id"),
            metadata=data.get("metadata", {})
        )
    
    def get_text_content(self) -> str:
        """Extract text content for vector embedding"""
        content_parts = []
        
        # Extract input text
        if isinstance(self.input_data, dict):
            for key, value in self.input_data.items():
                if isinstance(value, str):
                    content_parts.append(f"{key}: {value}")
                elif isinstance(value, list):
                    content_parts.append(f"{key}: {', '.join(str(v) for v in value)}")
        
        # Extract output text
        if isinstance(self.output_data, dict):
            # Handle different chain output formats
            if "title" in self.output_data:
                content_parts.append(f"title: {self.output_data['title']}")
            if "description" in self.output_data:
                content_parts.append(f"description: {self.output_data['description']}")
            if "explanation" in self.output_data:
                content_parts.append(f"explanation: {self.output_data['explanation']}")
            if "questions" in self.output_data:
                questions = self.output_data["questions"]
                if isinstance(questions, list):
                    for q in questions[:3]:  # First 3 questions
                        if isinstance(q, dict) and "question" in q:
                            content_parts.append(f"question: {q['question']}")
        
        return " | ".join(content_parts)


class ChromaMemoryStore:
    """ChromaDB-based vector memory storage for semantic similarity search"""
    
    def __init__(self, persist_directory: str = "./data/chroma_memory"):
        if not CHROMADB_AVAILABLE:
            raise ImportError("ChromaDB is required. Install with: pip install chromadb")
        
        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name="studysync_memory",
            metadata={"description": "StudySync AI user interaction history"}
        )
        
        logger.info(f"ChromaDB memory store initialized: {persist_directory}")
    
    def store_interaction(self, record: InteractionRecord) -> str:
        """Store interaction record in ChromaDB"""
        try:
            # Create unique ID
            record_id = self._generate_record_id(record)
            
            # Get text content for embedding
            text_content = record.get_text_content()
            
            # Store in ChromaDB
            self.collection.add(
                documents=[text_content],
                metadatas=[record.to_dict()],
                ids=[record_id]
            )
            
            logger.info(f"Stored interaction in ChromaDB: {record_id}")
            return record_id
            
        except Exception as e:
            logger.error(f"Failed to store interaction in ChromaDB: {e}")
            raise
    
    def retrieve_similar_interactions(
        self, 
        user_id: str, 
        query_text: str, 
        chain_type: Optional[str] = None,
        max_results: int = 5
    ) -> List[InteractionRecord]:
        """Retrieve similar interactions using vector similarity"""
        try:
            # Build where clause for filtering
            where_clause = {"user_id": user_id}
            if chain_type:
                where_clause["chain_type"] = chain_type
            
            # Query ChromaDB
            results = self.collection.query(
                query_texts=[query_text],
                n_results=max_results,
                where=where_clause
            )
            
            # Convert to InteractionRecord objects
            interactions = []
            if results['metadatas'] and results['metadatas'][0]:
                for metadata in results['metadatas'][0]:
                    interactions.append(InteractionRecord.from_dict(metadata))
            
            logger.info(f"Retrieved {len(interactions)} similar interactions for user {user_id}")
            return interactions
            
        except Exception as e:
            logger.error(f"Failed to retrieve similar interactions: {e}")
            return []
    
    def get_recent_interactions(
        self, 
        user_id: str, 
        chain_type: Optional[str] = None,
        hours_back: int = 24,
        max_results: int = 10
    ) -> List[InteractionRecord]:
        """Get recent interactions for a user"""
        try:
            # Calculate time threshold
            cutoff_time = datetime.now() - timedelta(hours=hours_back)
            
            # Build where clause
            where_clause = {
                "user_id": user_id,
                "timestamp": {"$gte": cutoff_time.isoformat()}
            }
            if chain_type:
                where_clause["chain_type"] = chain_type
            
            # Get all records (ChromaDB doesn't support time-based filtering directly)
            results = self.collection.get(
                where={"user_id": user_id} if not chain_type else {"user_id": user_id, "chain_type": chain_type},
                limit=max_results * 2  # Get more to filter by time
            )
            
            # Filter by time and convert to InteractionRecord
            interactions = []
            if results['metadatas']:
                for metadata in results['metadatas']:
                    record = InteractionRecord.from_dict(metadata)
                    if record.timestamp >= cutoff_time:
                        interactions.append(record)
            
            # Sort by timestamp (newest first) and limit
            interactions.sort(key=lambda x: x.timestamp, reverse=True)
            interactions = interactions[:max_results]
            
            logger.info(f"Retrieved {len(interactions)} recent interactions for user {user_id}")
            return interactions
            
        except Exception as e:
            logger.error(f"Failed to retrieve recent interactions: {e}")
            return []
    
    def _generate_record_id(self, record: InteractionRecord) -> str:
        """Generate unique ID for interaction record"""
        content = f"{record.user_id}_{record.chain_type}_{record.timestamp.isoformat()}"
        return hashlib.md5(content.encode()).hexdigest()


class RedisMemoryCache:
    """Redis-based fast cache for recent interactions"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379/0"):
        if not REDIS_AVAILABLE:
            raise ImportError("Redis is required. Install with: pip install redis")
        
        self.redis_client = redis.from_url(redis_url, decode_responses=True)
        self.default_ttl = 86400  # 24 hours
        
        logger.info(f"Redis memory cache initialized: {redis_url}")
    
    def store_interaction(self, record: InteractionRecord, ttl: Optional[int] = None) -> str:
        """Store interaction in Redis with TTL"""
        try:
            record_id = f"interaction:{record.user_id}:{record.chain_type}:{record.timestamp.isoformat()}"
            
            # Store the record
            self.redis_client.setex(
                record_id,
                ttl or self.default_ttl,
                json.dumps(record.to_dict())
            )
            
            # Add to user's recent interactions list
            recent_key = f"recent:{record.user_id}:{record.chain_type}"
            self.redis_client.lpush(recent_key, record_id)
            self.redis_client.ltrim(recent_key, 0, 49)  # Keep last 50
            self.redis_client.expire(recent_key, ttl or self.default_ttl)
            
            logger.info(f"Stored interaction in Redis: {record_id}")
            return record_id
            
        except Exception as e:
            logger.error(f"Failed to store interaction in Redis: {e}")
            raise
    
    def get_recent_interactions(
        self, 
        user_id: str, 
        chain_type: Optional[str] = None,
        max_results: int = 10
    ) -> List[InteractionRecord]:
        """Get recent interactions from Redis"""
        try:
            interactions = []
            
            if chain_type:
                # Get recent interactions for specific chain type
                recent_key = f"recent:{user_id}:{chain_type}"
                record_ids = self.redis_client.lrange(recent_key, 0, max_results - 1)
                
                for record_id in record_ids:
                    record_data = self.redis_client.get(record_id)
                    if record_data:
                        record_dict = json.loads(record_data)
                        interactions.append(InteractionRecord.from_dict(record_dict))
            else:
                # Get recent interactions for all chain types
                for ct in ['plan', 'quiz', 'explain']:
                    recent_key = f"recent:{user_id}:{ct}"
                    record_ids = self.redis_client.lrange(recent_key, 0, max_results // 3)
                    
                    for record_id in record_ids:
                        record_data = self.redis_client.get(record_id)
                        if record_data:
                            record_dict = json.loads(record_data)
                            interactions.append(InteractionRecord.from_dict(record_dict))
            
            # Sort by timestamp (newest first)
            interactions.sort(key=lambda x: x.timestamp, reverse=True)
            interactions = interactions[:max_results]
            
            logger.info(f"Retrieved {len(interactions)} recent interactions from Redis for user {user_id}")
            return interactions
            
        except Exception as e:
            logger.error(f"Failed to retrieve recent interactions from Redis: {e}")
            return []


class MemoryManager:
    """
    Unified memory management system for StudySync AI
    
    Combines ChromaDB (vector storage) and Redis (fast cache) for optimal performance:
    - Recent interactions cached in Redis for fast access
    - All interactions stored in ChromaDB for semantic similarity search
    - Automatic fallback between storage systems
    """
    
    def __init__(
        self, 
        chroma_persist_dir: str = "./data/chroma_memory",
        redis_url: str = "redis://localhost:6379/0",
        enable_chroma: bool = True,
        enable_redis: bool = True
    ):
        self.chroma_store = None
        self.redis_cache = None
        
        # Initialize ChromaDB if available and enabled
        if enable_chroma and CHROMADB_AVAILABLE:
            try:
                self.chroma_store = ChromaMemoryStore(chroma_persist_dir)
            except Exception as e:
                logger.warning(f"Failed to initialize ChromaDB: {e}")
        
        # Initialize Redis if available and enabled
        if enable_redis and REDIS_AVAILABLE:
            try:
                self.redis_cache = RedisMemoryCache(redis_url)
            except Exception as e:
                logger.warning(f"Failed to initialize Redis: {e}")
        
        if not self.chroma_store and not self.redis_cache:
            logger.warning("No memory storage available. Memory features will be disabled.")
        
        logger.info(f"MemoryManager initialized (ChromaDB: {self.chroma_store is not None}, Redis: {self.redis_cache is not None})")
    
    def store_interaction(
        self,
        user_id: Union[str, UUID],
        chain_type: str,
        input_data: Dict[str, Any],
        output_data: Dict[str, Any],
        session_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Store user interaction in available storage systems"""
        try:
            # Create interaction record
            record = InteractionRecord(
                user_id=str(user_id),
                chain_type=chain_type,
                input_data=input_data,
                output_data=output_data,
                timestamp=datetime.now(),
                session_id=session_id,
                metadata=metadata or {}
            )
            
            stored = False
            
            # Store in Redis cache
            if self.redis_cache:
                try:
                    self.redis_cache.store_interaction(record)
                    stored = True
                except Exception as e:
                    logger.warning(f"Failed to store in Redis: {e}")
            
            # Store in ChromaDB
            if self.chroma_store:
                try:
                    self.chroma_store.store_interaction(record)
                    stored = True
                except Exception as e:
                    logger.warning(f"Failed to store in ChromaDB: {e}")
            
            if stored:
                logger.info(f"Stored interaction for user {user_id}, chain {chain_type}")
            else:
                logger.error("Failed to store interaction in any storage system")
            
            return stored
            
        except Exception as e:
            logger.error(f"Error storing interaction: {e}")
            return False
    
    def get_context_for_chain(
        self,
        user_id: Union[str, UUID],
        chain_type: str,
        current_input: Dict[str, Any],
        max_context_items: int = 3
    ) -> List[Dict[str, Any]]:
        """Get relevant context for AI chain prompts"""
        try:
            user_id_str = str(user_id)
            context_items = []
            
            # First, try to get recent interactions from Redis (fast)
            if self.redis_cache:
                try:
                    recent_interactions = self.redis_cache.get_recent_interactions(
                        user_id_str, chain_type, max_context_items
                    )
                    context_items.extend(self._format_interactions_for_context(recent_interactions))
                except Exception as e:
                    logger.warning(f"Failed to get context from Redis: {e}")
            
            # If we need more context, search ChromaDB for similar interactions
            if len(context_items) < max_context_items and self.chroma_store:
                try:
                    # Create query text from current input
                    query_text = self._extract_query_text(current_input)
                    
                    similar_interactions = self.chroma_store.retrieve_similar_interactions(
                        user_id_str, query_text, chain_type, max_context_items - len(context_items)
                    )
                    
                    # Add similar interactions that aren't already in context
                    similar_context = self._format_interactions_for_context(similar_interactions)
                    for item in similar_context:
                        if item not in context_items:
                            context_items.append(item)
                            if len(context_items) >= max_context_items:
                                break
                                
                except Exception as e:
                    logger.warning(f"Failed to get context from ChromaDB: {e}")
            
            logger.info(f"Retrieved {len(context_items)} context items for user {user_id_str}")
            return context_items[:max_context_items]
            
        except Exception as e:
            logger.error(f"Error getting context for chain: {e}")
            return []
    
    def get_user_learning_history(
        self,
        user_id: Union[str, UUID],
        days_back: int = 30
    ) -> Dict[str, Any]:
        """Get comprehensive learning history for user analytics"""
        try:
            user_id_str = str(user_id)
            history = {
                "study_plans": [],
                "quiz_attempts": [],
                "concepts_explored": [],
                "learning_patterns": {},
                "total_interactions": 0
            }
            
            # Get recent interactions from all chain types
            for chain_type in ['plan', 'quiz', 'explain']:
                if self.chroma_store:
                    interactions = self.chroma_store.get_recent_interactions(
                        user_id_str, chain_type, hours_back=days_back * 24, max_results=50
                    )
                    
                    if chain_type == 'plan':
                        history["study_plans"] = [
                            {
                                "timestamp": i.timestamp.isoformat(),
                                "subject": i.input_data.get("subject", "Unknown"),
                                "goals": i.input_data.get("goals", []),
                                "timeline": i.input_data.get("timeline", "Unknown")
                            }
                            for i in interactions
                        ]
                    elif chain_type == 'quiz':
                        history["quiz_attempts"] = [
                            {
                                "timestamp": i.timestamp.isoformat(),
                                "topic": i.input_data.get("topic", "Unknown"),
                                "difficulty": i.input_data.get("difficulty", "Unknown"),
                                "question_count": len(i.output_data.get("questions", []))
                            }
                            for i in interactions
                        ]
                    elif chain_type == 'explain':
                        history["concepts_explored"] = [
                            {
                                "timestamp": i.timestamp.isoformat(),
                                "concept": i.input_data.get("concept", "Unknown"),
                                "complexity_level": i.input_data.get("complexity_level", "Unknown")
                            }
                            for i in interactions
                        ]
                    
                    history["total_interactions"] += len(interactions)
            
            # Calculate learning patterns
            history["learning_patterns"] = self._analyze_learning_patterns(history)
            
            logger.info(f"Retrieved learning history for user {user_id_str}: {history['total_interactions']} interactions")
            return history
            
        except Exception as e:
            logger.error(f"Error getting user learning history: {e}")
            return {"error": str(e)}
    
    def _format_interactions_for_context(self, interactions: List[InteractionRecord]) -> List[Dict[str, Any]]:
        """Format interactions for use as AI context"""
        context_items = []
        
        for interaction in interactions:
            context_item = {
                "timestamp": interaction.timestamp.isoformat(),
                "chain_type": interaction.chain_type,
                "input_summary": self._summarize_input(interaction.input_data),
                "output_summary": self._summarize_output(interaction.output_data, interaction.chain_type)
            }
            context_items.append(context_item)
        
        return context_items
    
    def _extract_query_text(self, input_data: Dict[str, Any]) -> str:
        """Extract text for similarity search from input data"""
        text_parts = []
        
        for key, value in input_data.items():
            if isinstance(value, str):
                text_parts.append(value)
            elif isinstance(value, list):
                text_parts.extend(str(v) for v in value if isinstance(v, str))
        
        return " ".join(text_parts)
    
    def _summarize_input(self, input_data: Dict[str, Any]) -> str:
        """Create a brief summary of input data"""
        if "subject" in input_data:
            return f"Study plan for {input_data['subject']}"
        elif "topic" in input_data:
            return f"Quiz on {input_data['topic']} ({input_data.get('difficulty', 'unknown')} difficulty)"
        elif "concept" in input_data:
            return f"Explanation of {input_data['concept']}"
        else:
            return "User interaction"
    
    def _summarize_output(self, output_data: Dict[str, Any], chain_type: str) -> str:
        """Create a brief summary of output data"""
        if chain_type == "plan" and "title" in output_data:
            return output_data["title"]
        elif chain_type == "quiz" and "questions" in output_data:
            return f"Generated {len(output_data['questions'])} questions"
        elif chain_type == "explain" and "explanation" in output_data:
            explanation = output_data["explanation"]
            return explanation[:100] + "..." if len(explanation) > 100 else explanation
        else:
            return "AI response generated"
    
    def _analyze_learning_patterns(self, history: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user learning patterns from history"""
        patterns = {
            "preferred_subjects": {},
            "difficulty_progression": [],
            "learning_frequency": "unknown",
            "conceptual_interests": {}
        }
        
        # Analyze study plan subjects
        for plan in history.get("study_plans", []):
            subject = plan.get("subject", "Unknown")
            patterns["preferred_subjects"][subject] = patterns["preferred_subjects"].get(subject, 0) + 1
        
        # Analyze quiz difficulties over time
        quiz_attempts = sorted(history.get("quiz_attempts", []), key=lambda x: x["timestamp"])
        for attempt in quiz_attempts:
            patterns["difficulty_progression"].append(attempt.get("difficulty", "unknown"))
        
        # Analyze concept exploration
        for concept in history.get("concepts_explored", []):
            concept_name = concept.get("concept", "Unknown")
            patterns["conceptual_interests"][concept_name] = patterns["conceptual_interests"].get(concept_name, 0) + 1
        
        # Calculate learning frequency
        total_interactions = history.get("total_interactions", 0)
        if total_interactions > 20:
            patterns["learning_frequency"] = "high"
        elif total_interactions > 5:
            patterns["learning_frequency"] = "moderate"
        else:
            patterns["learning_frequency"] = "low"
        
        return patterns


# Global memory manager instance
memory_manager: Optional[MemoryManager] = None


def initialize_memory_manager(
    chroma_persist_dir: str = "./data/chroma_memory",
    redis_url: str = "redis://localhost:6379/0",
    enable_chroma: bool = True,
    enable_redis: bool = True
) -> MemoryManager:
    """Initialize global memory manager"""
    global memory_manager
    
    memory_manager = MemoryManager(
        chroma_persist_dir=chroma_persist_dir,
        redis_url=redis_url,
        enable_chroma=enable_chroma,
        enable_redis=enable_redis
    )
    
    return memory_manager


def get_memory_manager() -> Optional[MemoryManager]:
    """Get the global memory manager instance"""
    return memory_manager


# Convenience functions for easy integration
def store_user_interaction(
    user_id: Union[str, UUID],
    chain_type: str,
    input_data: Dict[str, Any],
    output_data: Dict[str, Any],
    session_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
) -> bool:
    """Store user interaction using global memory manager"""
    if memory_manager:
        return memory_manager.store_interaction(
            user_id, chain_type, input_data, output_data, session_id, metadata
        )
    return False


def get_context_for_ai_chain(
    user_id: Union[str, UUID],
    chain_type: str,
    current_input: Dict[str, Any],
    max_context_items: int = 3
) -> List[Dict[str, Any]]:
    """Get context for AI chain using global memory manager"""
    if memory_manager:
        return memory_manager.get_context_for_chain(
            user_id, chain_type, current_input, max_context_items
        )
    return []


def get_user_learning_history(
    user_id: Union[str, UUID],
    days_back: int = 30
) -> Dict[str, Any]:
    """Get user learning history using global memory manager"""
    if memory_manager:
        return memory_manager.get_user_learning_history(user_id, days_back)
    return {"error": "Memory manager not initialized"}


# Initialize memory manager on module import
try:
    # Check environment variables for configuration
    chroma_dir = os.getenv("CHROMA_PERSIST_DIR", "./data/chroma_memory")
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    enable_chroma = os.getenv("ENABLE_CHROMA", "true").lower() == "true"
    enable_redis = os.getenv("ENABLE_REDIS", "false").lower() == "true"  # Disabled by default
    
    # Only initialize if at least one storage system is available
    if (enable_chroma and CHROMADB_AVAILABLE) or (enable_redis and REDIS_AVAILABLE):
        memory_manager = initialize_memory_manager(
            chroma_persist_dir=chroma_dir,
            redis_url=redis_url,
            enable_chroma=enable_chroma,
            enable_redis=enable_redis
        )
        logger.info("Memory manager auto-initialized on module import")
    else:
        logger.info("Memory manager not initialized - no storage systems available or enabled")

except Exception as e:
    logger.warning(f"Failed to auto-initialize memory manager: {e}")
    memory_manager = None