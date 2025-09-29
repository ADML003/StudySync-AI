# StudySync AI Backend API Documentation

## Overview

This FastAPI backend provides authenticated endpoints for managing study plans with Supabase integration.

## Authentication

All study plan endpoints require JWT authentication using Supabase auth tokens.

### Authentication Header

```
Authorization: Bearer <your-supabase-jwt-token>
```

## Endpoints

### Health & Info Endpoints

#### `GET /`

- **Description**: Root endpoint with API information
- **Authentication**: None required
- **Response**: Basic API info and status

#### `GET /health`

- **Description**: Health check endpoint
- **Authentication**: None required
- **Response**: Health status and timestamp

#### `GET /api/info`

- **Description**: Detailed API information
- **Authentication**: None required
- **Response**: API metadata and endpoint list

#### `GET /api/config`

- **Description**: Configuration status
- **Authentication**: None required
- **Response**: Configuration validation status

### Study Plan Endpoints

#### `POST /plans`

- **Description**: Create a new study plan for the authenticated user
- **Authentication**: Required (JWT token)
- **Request Body**:
  ```json
  {
    "plan": {
      "title": "Data Science Fundamentals",
      "subjects": ["Python", "Statistics", "ML"],
      "duration_weeks": 20,
      "daily_hours": 2.5,
      "goals": ["Learn Python", "Understand stats"]
    }
  }
  ```
- **Response**: Created study plan with metadata
- **Security**: Automatically uses authenticated user's ID

#### `GET /plans`

- **Description**: Retrieve all study plans for the authenticated user
- **Authentication**: Required (JWT token)
- **Response**: Array of study plans belonging to the user
- **Security**: Row-level security ensures users only see their own plans

## Data Models

### StudyPlanCreate

```json
{
  "plan": {
    "title": "string",
    "subjects": ["string"],
    "duration_weeks": "number",
    "daily_hours": "number",
    "goals": ["string"],
    "schedule": {},
    "progress": {}
  }
}
```

### StudyPlan (Response)

```json
{
  "id": 1,
  "user_id": "uuid",
  "plan": {},
  "created_at": "datetime"
}
```

## Authentication Flow

1. **Frontend**: User authenticates with Supabase auth
2. **Frontend**: Receives JWT token from Supabase
3. **Frontend**: Includes token in Authorization header for API calls
4. **Backend**: Validates JWT using SUPABASE_JWT_SECRET
5. **Backend**: Extracts user_id from token payload
6. **Backend**: Uses user_id for database operations

## Security Features

- **JWT Token Validation**: All study plan operations require valid Supabase JWT
- **Row-Level Security**: Database policies ensure user data isolation
- **Automatic User Context**: Routes automatically use authenticated user's ID
- **CORS Protection**: Configured for frontend domain only

## Database Integration

- **Supabase Integration**: Direct connection to Supabase PostgreSQL
- **Row-Level Security**: Enabled on study_plans table
- **User Isolation**: Users can only access their own study plans
- **Automatic Timestamps**: created_at managed by database

## Environment Variables Required

```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret_from_supabase_settings
```

## Testing

1. **Start the server**: `./start.sh`
2. **Access documentation**: `http://localhost:8000/docs`
3. **Test endpoints**: Use the interactive Swagger UI
4. **Authentication**: Include JWT token in Authorize button

## Error Handling

- **401 Unauthorized**: Invalid or missing JWT token
- **403 Forbidden**: User doesn't have access to resource
- **404 Not Found**: Study plan doesn't exist
- **500 Internal Server Error**: Database or server issues

## Next Steps

1. Set up Supabase project and run `schema.sql`
2. Configure environment variables in `.env`
3. Install dependencies: `pip install -r requirements.txt`
4. Start server: `./start.sh`
5. Test with frontend authentication flow
