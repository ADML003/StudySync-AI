"""
Cerebras AI client initialization and configuration module.
Provides OpenAI-compatible interface for Cerebras AI API integration.
"""

import os
import sys
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

def get_cerebras_client() -> Optional[OpenAI]:
    """
    Initialize and return a Cerebras AI client instance using OpenAI-compatible interface.
    
    Returns:
        OpenAI: Configured Cerebras AI client instance
        None: If API key is missing or invalid
        
    Raises:
        SystemExit: If critical environment variables are missing
    """
    # Get Cerebras API key from environment
    cerebras_api_key = os.getenv("CEREBRAS_API_KEY")
    
    # Validate required environment variable
    if not cerebras_api_key:
        error_msg = """
        ❌ Missing required Cerebras AI environment variable: CEREBRAS_API_KEY
        
        Please check your .env file and ensure this variable is set:
        - CEREBRAS_API_KEY: Your Cerebras AI API key
        
        To get your API key:
        1. Sign up at: https://cerebras.ai/
        2. Navigate to API settings
        3. Generate a new API key
        4. Add it to your .env file
        
        Current configuration status:
        - CEREBRAS_API_KEY: ❌ Missing
        """
        print(error_msg, file=sys.stderr)
        return None
    
    try:
        # Initialize Cerebras client using OpenAI-compatible interface
        client = OpenAI(
            api_key=cerebras_api_key,
            base_url="https://api.cerebras.ai/v1"
        )
        
        # Verify client creation
        if client:
            print(f"✅ Cerebras AI client initialized successfully")
            print(f"   Base URL: https://api.cerebras.ai/v1")
            print(f"   API Key: {'*' * 20}...{cerebras_api_key[-4:] if len(cerebras_api_key) > 4 else '****'}")
        
        return client
        
    except Exception as e:
        error_msg = f"""
        ❌ Failed to initialize Cerebras AI client: {str(e)}
        
        Please verify:
        1. CEREBRAS_API_KEY is a valid Cerebras AI API key
        2. Your API key has the necessary permissions
        3. The Cerebras AI service is accessible
        
        Current configuration:
        - API Key: {'*' * 20}...{cerebras_api_key[-4:] if cerebras_api_key and len(cerebras_api_key) > 4 else 'invalid'}
        - Base URL: https://api.cerebras.ai/v1
        """
        print(error_msg, file=sys.stderr)
        return None

def validate_cerebras_config() -> dict:
    """
    Validate Cerebras AI configuration without initializing client.
    
    Returns:
        dict: Configuration validation status
    """
    cerebras_api_key = os.getenv("CEREBRAS_API_KEY")
    
    return {
        "cerebras_api_key_configured": bool(cerebras_api_key),
        "cerebras_base_url": "https://api.cerebras.ai/v1",
        "configuration_complete": bool(cerebras_api_key),
        "api_key_preview": f"{'*' * 20}...{cerebras_api_key[-4:] if cerebras_api_key and len(cerebras_api_key) > 4 else 'Not configured'}"
    }

async def test_cerebras_connection(client: Optional[OpenAI] = None) -> dict:
    """
    Test Cerebras AI API connection with a simple request.
    
    Args:
        client: Optional client instance to test
        
    Returns:
        dict: Connection test results
    """
    if not client:
        return {
            "connection_test": "failed",
            "error": "No client instance provided",
            "details": "Cerebras client not initialized"
        }
    
    try:
        # Test with a simple completion request
        response = client.chat.completions.create(
            model="llama3.1-8b",  # Default Cerebras model
            messages=[
                {"role": "user", "content": "Hello, test connection."}
            ],
            max_tokens=10,
            temperature=0.1
        )
        
        return {
            "connection_test": "success",
            "model_used": "llama3.1-8b",
            "response_received": bool(response.choices),
            "api_accessible": True
        }
        
    except Exception as e:
        return {
            "connection_test": "failed",
            "error": str(e),
            "details": "Failed to make test request to Cerebras API"
        }

# Initialize the global Cerebras client instance
print("🔄 Initializing Cerebras AI client...")
cerebras_client: Optional[OpenAI] = get_cerebras_client()

# Export configuration validation and test functions
__all__ = ["cerebras_client", "validate_cerebras_config", "get_cerebras_client", "test_cerebras_connection"]

# Print initialization status
if cerebras_client:
    print("🚀 Cerebras AI client ready for use")
    print("📝 Available for study plan generation and AI-powered features")
else:
    print("⚠️  Cerebras AI client not available - check API key configuration")
    print("💡 AI-powered features will be disabled until configured")