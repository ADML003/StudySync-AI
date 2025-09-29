"""
Authentication utilities for StudySync AI FastAPI backend.
Handles Supabase JWT token verification and user authentication.
"""

import os
import jwt
import logging
from uuid import UUID
from typing import Optional
from datetime import datetime
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

# Import User model for authentication responses
from models import User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize HTTP Bearer token security
security = HTTPBearer()

class UserPayload(BaseModel):
    """Pydantic model for JWT user payload from Supabase"""
    sub: str  # User ID from Supabase auth
    email: Optional[str] = None
    role: Optional[str] = None
    exp: int  # Expiration timestamp
    iat: Optional[int] = None  # Issued at
    aud: Optional[str] = None  # Audience
    user_metadata: Optional[dict] = None
    app_metadata: Optional[dict] = None

def get_supabase_secret() -> str:
    """
    Get Supabase JWT secret from environment variables.
    This is used to verify JWT tokens issued by Supabase.
    """
    secret = os.getenv("SUPABASE_JWT_SECRET")
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="SUPABASE_JWT_SECRET not configured"
        )
    return secret

def verify_token(token: str) -> UserPayload:
    """
    Verify and decode Supabase JWT token with comprehensive validation.
    
    Args:
        token: JWT token string from Authorization header
        
    Returns:
        UserPayload: Decoded and validated user information
        
    Raises:
        HTTPException: If token is invalid, expired, or malformed
    """
    try:
        secret = get_supabase_secret()
        
        # Log authentication attempt (without token details for security)
        logger.info("Attempting JWT token verification")
        
        # Decode JWT token using Supabase secret with strict validation
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            options={
                "verify_signature": True, 
                "verify_exp": True,
                "verify_aud": False,  # Supabase may not always include audience
                "require": ["sub", "exp"]  # Require essential fields
            }
        )
        
        # Validate required fields
        if not payload.get("sub"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing user identifier",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_payload = UserPayload(**payload)
        logger.info(f"JWT verification successful for user: {user_payload.sub}")
        
        return user_payload
        
    except jwt.ExpiredSignatureError:
        logger.warning("JWT token has expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please login again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"JWT verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """
    FastAPI dependency to get the current authenticated user.
    
    This function:
    1. Extracts JWT token from Authorization header
    2. Verifies token signature and expiration with Supabase
    3. Extracts user_id and other user information
    4. Returns User model for authenticated requests
    
    Args:
        credentials: HTTP Authorization credentials from FastAPI security
        
    Returns:
        User: The authenticated user's information
        
    Raises:
        HTTPException: 401 if authentication fails
    """
    try:
        # Extract token from Authorization header
        token = credentials.credentials
        
        if not token:
            logger.warning("No token provided in Authorization header")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authorization token required",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Verify token and get user payload
        user_payload = verify_token(token)
        
        # Convert user ID to UUID and validate format
        try:
            user_id = UUID(user_payload.sub)
        except ValueError as e:
            logger.error(f"Invalid UUID format in token: {user_payload.sub}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user identifier format",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Create User model from JWT payload
        user = User(
            id=user_id,
            email=user_payload.email,
            name=user_payload.user_metadata.get("name") if user_payload.user_metadata else None,
            created_at=datetime.now()  # We don't have this from JWT, using current time
        )
        
        logger.info(f"Authentication successful for user: {user.id}")
        return user
        
    except HTTPException:
        # Re-raise HTTP exceptions (already logged in verify_token)
        raise
    except Exception as e:
        logger.error(f"Unexpected authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Optional: Alternative dependency for when user might be optional
def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[User]:
    """
    FastAPI dependency to optionally get the current authenticated user.
    Returns None if no valid authentication is provided.
    
    Args:
        credentials: Optional HTTP Authorization credentials
        
    Returns:
        Optional[User]: The authenticated user or None
    """
    if not credentials:
        return None
    
    try:
        return get_current_user(credentials)
    except HTTPException:
        return None


def get_user_id(current_user: User = Depends(get_current_user)) -> UUID:
    """
    FastAPI dependency to extract just the user ID from authenticated user.
    Useful when you only need the user ID and not the full User model.
    
    Args:
        current_user: Authenticated user from get_current_user dependency
        
    Returns:
        UUID: The authenticated user's ID
    """
    return current_user.id


def require_auth(current_user: User = Depends(get_current_user)) -> User:
    """
    Explicit authentication requirement dependency.
    Alias for get_current_user with clearer naming for protected endpoints.
    
    Args:
        current_user: Authenticated user from get_current_user dependency
        
    Returns:
        User: The authenticated user
    """
    return current_user


# Security configuration
def get_auth_header_scheme() -> str:
    """Get the authentication header scheme"""
    return "Bearer"


def validate_user_access(user_id: UUID, resource_user_id: UUID) -> None:
    """
    Validate that a user can access a resource.
    Raises 403 if user tries to access another user's resources.
    
    Args:
        user_id: ID of the authenticated user
        resource_user_id: ID of the user who owns the resource
        
    Raises:
        HTTPException: 403 if access is denied
    """
    if user_id != resource_user_id:
        logger.warning(f"User {user_id} attempted to access resource owned by {resource_user_id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own resources"
        )