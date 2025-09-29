from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from dotenv import load_dotenv
import os
from models import StudyPlanCreate, StudyPlan, StudyPlanUpdate, StudyPlanResponse
from auth import get_current_user
from supabase_client import supabase, validate_supabase_config
from cerebras_client import cerebras_client, validate_cerebras_config
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from routes import study_router

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="StudySync AI Backend",
    description="Backend API for StudySync AI Learning Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend
    "http://127.0.0.1:3000",  # Alternative localhost
    "http://localhost:3001",  # Alternative port
    "http://127.0.0.1:3001",  # Alternative localhost and port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(study_router)

# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint returning API status
    """
    return JSONResponse(
        status_code=200,
        content={
            "status": "OK",
            "message": "StudySync AI Backend is running",
            "version": "1.0.0",
            "docs": "/docs"
        }
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return JSONResponse(
        status_code=200,
        content={
            "status": "healthy",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    )

# API Info endpoint
@app.get("/api/info")
async def api_info():
    """
    API information endpoint
    """
    config_status = validate_supabase_config()
    cerebras_status = validate_cerebras_config()
    return JSONResponse(
        status_code=200,
        content={
            "api_name": "StudySync AI Backend",
            "version": "1.0.0",
            "description": "Backend API for StudySync AI Learning Platform",
            "supabase_configured": config_status["all_required_configured"],
            "cerebras_configured": cerebras_status["configuration_complete"],
            "ai_features_available": cerebras_client is not None,
            "endpoints": {
                "root": "/",
                "health": "/health",
                "config": "/api/config",
                "docs": "/docs",
                "redoc": "/redoc",
                "study_plans": "/study/plans",
                "quiz_questions": "/study/questions", 
                "concept_explanations": "/study/explain",
                "study_health": "/study/health"
            }
        }
    )

# Configuration check endpoint
@app.get("/api/config")
async def config_check():
    """
    Configuration status endpoint
    """
    config_status = validate_supabase_config()
    cerebras_status = validate_cerebras_config()
    return JSONResponse(
        status_code=200,
        content={
            **config_status,
            **cerebras_status,
            "supabase_client_initialized": supabase is not None,
            "cerebras_client_initialized": cerebras_client is not None,
            "app_name": os.getenv("APP_NAME", "StudySync AI Backend"),
            "debug_mode": os.getenv("DEBUG", "False").lower() == "true"
        }
    )

# Study Plan Endpoints
@app.post("/plans", response_model=StudyPlanResponse)
async def create_study_plan(
    plan_data: StudyPlanCreate,
    current_user_id: UUID = Depends(get_current_user)
):
    """
    Create a new study plan for the authenticated user.
    
    Args:
        plan_data: Study plan creation data
        current_user_id: Authenticated user ID from JWT token
        
    Returns:
        StudyPlanResponse: The created study plan with success message
        
    Raises:
        HTTPException: If creation fails
    """
    try:
        if not supabase:
            raise HTTPException(status_code=503, detail="Database not configured")
        
        # Insert the study plan into Supabase
        result = supabase.from_("study_plans").insert({
            "user_id": str(current_user_id),
            "plan": plan_data.plan
        }).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create study plan"
            )
        
        created_plan = result.data[0]
        
        # Convert to StudyPlan model
        study_plan = StudyPlan(
            id=created_plan["id"],
            user_id=UUID(created_plan["user_id"]),
            plan=created_plan["plan"],
            created_at=datetime.fromisoformat(created_plan["created_at"].replace('Z', '+00:00'))
        )
        
        return StudyPlanResponse(
            success=True,
            message="Study plan created successfully",
            data=study_plan
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create study plan: {str(e)}"
        )

@app.get("/plans", response_model=List[StudyPlan])
async def get_user_study_plans(
    current_user_id: UUID = Depends(get_current_user)
):
    """
    Retrieve all study plans for the authenticated user.
    
    Args:
        current_user_id: Authenticated user ID from JWT token
        
    Returns:
        List[StudyPlan]: List of study plans belonging to the user
        
    Raises:
        HTTPException: If retrieval fails
    """
    try:
        if not supabase:
            raise HTTPException(status_code=503, detail="Database not configured")
        
        # Query study plans for the authenticated user
        result = supabase.from_("study_plans").select("*").eq(
            "user_id", str(current_user_id)
        ).order("created_at", desc=True).execute()
        
        # Convert to StudyPlan models
        study_plans = []
        for plan_data in result.data:
            study_plan = StudyPlan(
                id=plan_data["id"],
                user_id=UUID(plan_data["user_id"]),
                plan=plan_data["plan"],
                created_at=datetime.fromisoformat(plan_data["created_at"].replace('Z', '+00:00'))
            )
            study_plans.append(study_plan)
        
        return study_plans
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve study plans: {str(e)}"
        )

if __name__ == "__main__":
    # Run the app with uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
        log_level="info"
    )