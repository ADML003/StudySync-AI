"""
Authentication utilities for StudySync AI FastAPI backend.
Handles Supabase JWT token verification and user authentication.
"""

import os
import jwt
from uuid import UUID
from typing import Optional
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

# Initialize HTTP Bearer token security
security = HTTPBearer()

class UserPayload(BaseModel):
    """Pydantic model for JWT user payload"""
    sub: str  # User ID from Supabase auth
    email: Optional[str] = None
    role: Optional[str] = None
    exp: int  # Expiration timestamp

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
    Verify and decode Supabase JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        UserPayload: Decoded user information
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        secret = get_supabase_secret()
        
        # Decode JWT token using Supabase secret
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            options={"verify_signature": True, "verify_exp": True}
        )
        
        return UserPayload(**payload)
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UUID:
    """
    FastAPI dependency to get the current authenticated user ID.
    
    Args:
        credentials: HTTP Authorization credentials from FastAPI security
        
    Returns:
        UUID: The authenticated user's ID
        
    Raises:
        HTTPException: If authentication fails
    """
    try:
        # Extract token from Authorization header
        token = credentials.credentials
        
        # Verify token and get user payload
        user_payload = verify_token(token)
        
        # Convert user ID to UUID
        user_id = UUID(user_payload.sub)
        
        return user_id
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid user ID format: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Optional: Alternative dependency for when user might be optional
def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[UUID]:
    """
    FastAPI dependency to optionally get the current authenticated user.
    Returns None if no valid authentication is provided.
    
    Args:
        credentials: Optional HTTP Authorization credentials
        
    Returns:
        Optional[UUID]: The authenticated user's ID or None
    """
    if not credentials:
        return None
    
    try:
        return get_current_user(credentials)
    except HTTPException:
        return None