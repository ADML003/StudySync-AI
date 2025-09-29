# StudySync AI Backend

A FastAPI-based backend for the StudySync AI learning platform.

## Features

- ✅ FastAPI framework with automatic API documentation
- ✅ CORS enabled for frontend integration
- ✅ Environment variable configuration
- ✅ Supabase integration ready
- ✅ Pydantic data validation
- ✅ Health check endpoints
- ✅ Development-ready setup

## Quick Start

### Prerequisites

- Python 3.8+
- pip or pipenv

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration values
   ```

5. Run the development server:

   ```bash
   python main.py
   ```

   Or alternatively:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### API Documentation

Once the server is running, you can access:

- **API Documentation (Swagger UI)**: http://localhost:8000/docs
- **Alternative Documentation (ReDoc)**: http://localhost:8000/redoc
- **API Root**: http://localhost:8000/
- **Health Check**: http://localhost:8000/health

## Available Endpoints

### Core Endpoints

- `GET /` - Root endpoint with API status
- `GET /health` - Health check endpoint
- `GET /api/info` - API information endpoint
- `GET /api/config` - Configuration status check

### Study Plan Endpoints

- `POST /api/study-plans` - Create a new study plan
- `GET /api/study-plans` - Get all study plans (optional user_id filter)
- `GET /api/study-plans/{plan_id}` - Get a specific study plan
- `PUT /api/study-plans/{plan_id}` - Update an existing study plan
- `DELETE /api/study-plans/{plan_id}` - Delete a study plan

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

- `SUPABASE_URL` - Your Supabase project URL (e.g., https://your-project-id.supabase.co)
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key
- `SECRET_KEY` - JWT secret key (generate a secure random string)
- `FRONTEND_URL` - Frontend application URL (default: http://localhost:3000)

## Database Setup

1. Create a new Supabase project at https://supabase.com
2. Run the SQL script in `schema.sql` in your Supabase SQL editor to create the required tables
3. Update your `.env` file with the Supabase URL and service key

## Development

The API runs with auto-reload enabled in development mode. Any changes to the code will automatically restart the server.

### Testing the API

You can test the API endpoints using:

1. **Browser**: Navigate to http://localhost:8000/
2. **curl**:
   ```bash
   curl http://localhost:8000/
   ```
3. **Frontend Integration**: The CORS is configured to allow requests from http://localhost:3000

## Project Structure

```
backend/
├── main.py              # FastAPI application entry point
├── models.py            # Pydantic data models and schemas
├── requirements.txt     # Python dependencies
├── schema.sql          # Database schema for Supabase
├── .env.example        # Environment variables template
├── .env               # Environment variables (create from .env.example)
├── .gitignore         # Git ignore file
├── start.sh           # Development start script
└── README.md          # This file
```

## Data Models

The API uses the following Pydantic models:

### StudyPlanCreate

- `user_id: UUID` - User identifier
- `plan: Dict[str, Any]` - Study plan data structure

### StudyPlan

- `id: int` - Plan identifier
- `user_id: UUID` - User identifier
- `plan: Dict[str, Any]` - Study plan data structure
- `created_at: datetime` - Creation timestamp
- `updated_at: datetime` - Last update timestamp

## Next Steps

1. Configure your Supabase database connection
2. Add authentication endpoints
3. Implement your specific API routes
4. Add database models and schemas
5. Implement business logic for your learning platform

## Dependencies

- **FastAPI**: Modern, fast web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI
- **Supabase**: Database and authentication services
- **Pydantic**: Data validation and serialization
- **python-dotenv**: Environment variable management
- **Additional utilities**: JWT, password hashing, email validation
