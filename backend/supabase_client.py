"""
Supabase client initialization and configuration module.
Centralizes Supabase connection management for the StudySync AI backend.
"""

import os
import sys
from typing import Optional
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

def get_supabase_client() -> Optional[Client]:
    """
    Initialize and return a Supabase client instance.
    
    Returns:
        Client: Configured Supabase client instance
        None: If configuration is missing or invalid
        
    Raises:
        SystemExit: If critical environment variables are missing
    """
    # Get environment variables
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    
    # Validate required environment variables
    missing_vars = []
    if not supabase_url:
        missing_vars.append("SUPABASE_URL")
    if not supabase_key:
        missing_vars.append("SUPABASE_SERVICE_KEY")
    
    if missing_vars:
        error_msg = f"""
        ❌ Missing required Supabase environment variables: {', '.join(missing_vars)}
        
        Please check your .env file and ensure these variables are set:
        - SUPABASE_URL: Your Supabase project URL
        - SUPABASE_SERVICE_KEY: Your Supabase service role key
        
        Current configuration status:
        - SUPABASE_URL: {'✅ Set' if supabase_url else '❌ Missing'}
        - SUPABASE_SERVICE_KEY: {'✅ Set' if supabase_key else '❌ Missing'}
        
        See SUPABASE_SETUP.md for detailed setup instructions.
        """
        print(error_msg, file=sys.stderr)
        return None
    
    try:
        # Initialize Supabase client
        client = create_client(supabase_url, supabase_key)
        
        # Verify connection (optional health check)
        # Note: This doesn't make an actual request but validates the client creation
        if client:
            print(f"✅ Supabase client initialized successfully")
            print(f"   Project URL: {supabase_url}")
            print(f"   Service Key: {'*' * 20}...{supabase_key[-4:] if len(supabase_key) > 4 else '****'}")
        
        return client
        
    except Exception as e:
        error_msg = f"""
        ❌ Failed to initialize Supabase client: {str(e)}
        
        Please verify:
        1. SUPABASE_URL is a valid Supabase project URL
        2. SUPABASE_SERVICE_KEY is a valid service role key
        3. Your Supabase project is active and accessible
        
        Current configuration:
        - URL: {supabase_url}
        - Key: {'*' * 20}...{supabase_key[-4:] if supabase_key and len(supabase_key) > 4 else 'invalid'}
        """
        print(error_msg, file=sys.stderr)
        return None

def validate_supabase_config() -> dict:
    """
    Validate Supabase configuration without initializing client.
    
    Returns:
        dict: Configuration validation status
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
    
    return {
        "supabase_url_configured": bool(supabase_url),
        "supabase_service_key_configured": bool(supabase_key),
        "supabase_jwt_secret_configured": bool(jwt_secret),
        "all_required_configured": bool(supabase_url and supabase_key),
        "supabase_url": supabase_url if supabase_url else "Not configured",
        "configuration_complete": bool(supabase_url and supabase_key and jwt_secret)
    }

# Initialize the global Supabase client instance
print("🔄 Initializing Supabase client...")
supabase: Optional[Client] = get_supabase_client()

# Export configuration validation function for use in health checks
__all__ = ["supabase", "validate_supabase_config", "get_supabase_client"]

# Print initialization status
if supabase:
    print("🚀 Supabase client ready for use")
else:
    print("⚠️  Supabase client not available - check configuration")