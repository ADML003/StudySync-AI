# 🚀 StudySync AI - Complete API Documentation

## ✅ AI-Powered Study Routes

Your StudySync AI backend now includes **three powerful AI endpoints** that integrate with LangChain and Cerebras AI:

### 🌟 New Study Endpoints

#### 1. `POST /study/plans` - AI Study Plan Generation

- **Purpose**: Generate personalized study plans using PlanChain
- **Authentication**: JWT token required
- **Input**: StudyPlanInput model
- **AI Backend**: Cerebras AI via LangChain

#### 2. `POST /study/questions` - AI Quiz Generation

- **Purpose**: Create practice questions using QuizChain
- **Authentication**: JWT token required
- **Input**: QuizInput model
- **AI Backend**: Cerebras AI via LangChain

#### 3. `POST /study/explain` - AI Concept Explanation

- **Purpose**: Generate detailed explanations using ExplainChain
- **Authentication**: JWT token required
- **Input**: ExplainInput model
- **AI Backend**: Cerebras AI via LangChain

## 📋 API Endpoint Reference

### Study Plan Generation

```http
POST /study/plans
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "subject": "Python Programming",
  "goals": ["Learn web development", "Build portfolio projects"],
  "timeline": "8 weeks",
  "difficulty_level": "intermediate",
  "learning_style": "hands-on",
  "time_commitment": "10 hours per week",
  "focus_areas": ["FastAPI", "React", "Database integration"],
  "current_knowledge": "Basic Python syntax and OOP concepts"
}
```

**Response:**

```json
{
  "success": true,
  "plan": {
    "title": "8-Week Python Web Development Mastery",
    "description": "Comprehensive study plan...",
    "sections": [
      {
        "week": 1,
        "title": "FastAPI Fundamentals",
        "topics": ["API basics", "Route handlers", "Request/Response"],
        "activities": ["Build simple API", "Practice exercises"],
        "estimated_hours": 10,
        "resources": ["FastAPI docs", "Tutorial videos"]
      }
    ],
    "total_duration": "8 weeks",
    "difficulty_level": "intermediate",
    "learning_objectives": ["Master FastAPI", "Build full-stack apps"],
    "recommended_resources": ["Official docs", "Community tutorials"]
  },
  "metadata": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "generated_at": "2024-01-15T10:30:00Z",
    "model_used": "llama3.1-8b"
  },
  "user_id": "123e4567-e89b-12d3-a456-426614174000"
}
```

### Quiz Question Generation

```http
POST /study/questions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "topic": "FastAPI Fundamentals",
  "difficulty": "medium",
  "question_count": 5,
  "question_types": ["multiple_choice", "short_answer"],
  "focus_areas": ["route handlers", "request validation"],
  "learning_objectives": ["Apply FastAPI concepts", "Debug common issues"]
}
```

**Response:**

```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "question": "What decorator is used to define a GET endpoint in FastAPI?",
      "type": "multiple_choice",
      "difficulty": "medium",
      "topic": "FastAPI Fundamentals",
      "options": ["@app.get", "@app.route", "@app.endpoint", "@app.handler"],
      "correct_answer": "@app.get",
      "explanation": "The @app.get decorator is used to define GET endpoints...",
      "learning_objective": "Apply FastAPI routing concepts",
      "estimated_time": 90
    }
  ],
  "metadata": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "generated_at": "2024-01-15T10:30:00Z",
    "model_used": "llama3.1-8b"
  },
  "quiz_info": {
    "topic": "FastAPI Fundamentals",
    "difficulty": "medium",
    "question_count": 5,
    "question_types": ["multiple_choice", "short_answer"]
  }
}
```

### Concept Explanation

```http
POST /study/explain
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "concept": "FastAPI Dependency Injection",
  "complexity_level": "intermediate",
  "format_preference": "detailed",
  "target_audience": "student",
  "context": "Building REST APIs for web applications"
}
```

**Response:**

```json
{
  "success": true,
  "explanation": {
    "content": "FastAPI's dependency injection system is a powerful feature that allows you to declare dependencies that will be automatically resolved and injected into your path operation functions...",
    "key_points": [
      "Dependencies are declared using the Depends() function",
      "Can inject database connections, authentication, validation",
      "Supports hierarchical dependency trees",
      "Automatically handles cleanup and resource management"
    ],
    "examples": [
      "Database connection injection",
      "User authentication dependencies",
      "Configuration parameter injection"
    ],
    "related_concepts": [
      "Inversion of Control",
      "Dependency Inversion Principle",
      "FastAPI Security",
      "Python Type Hints"
    ],
    "further_reading": [
      "FastAPI Dependencies Documentation",
      "Dependency Injection Patterns",
      "Clean Architecture Principles"
    ]
  },
  "metadata": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "concept": "FastAPI Dependency Injection",
    "complexity_level": "intermediate",
    "generated_at": "2024-01-15T10:30:00Z"
  },
  "concept_info": {
    "concept": "FastAPI Dependency Injection",
    "complexity_level": "intermediate",
    "format_preference": "detailed",
    "target_audience": "student"
  }
}
```

## 🔐 Authentication

All study endpoints require JWT authentication:

```http
Authorization: Bearer <jwt_token>
```

The user_id is automatically extracted from the JWT token and used for:

- Personalizing AI responses
- Tracking learning progress
- Ensuring data privacy

## 🏥 Health Monitoring

### Study Routes Health Check

```http
GET /study/health
```

**Response:**

```json
{
  "status": "healthy",
  "chains": {
    "plan_chain": true,
    "quiz_chain": true,
    "explain_chain": true
  },
  "message": "All AI chains are ready"
}
```

### Global API Health

```http
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## ⚙️ Configuration Status

```http
GET /api/config
```

**Response:**

```json
{
  "supabase_configured": true,
  "cerebras_configured": true,
  "supabase_client_initialized": true,
  "cerebras_client_initialized": true,
  "app_name": "StudySync AI Backend",
  "debug_mode": false
}
```

## 🔧 Error Handling

All endpoints include comprehensive error handling:

### Common Error Responses

#### Authentication Error

```json
{
  "detail": "Could not validate credentials",
  "status_code": 401
}
```

#### AI Generation Error

```json
{
  "detail": "Failed to generate study plan: API rate limit exceeded",
  "status_code": 500
}
```

#### Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "subject"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ],
  "status_code": 422
}
```

## 🚀 Integration Examples

### Frontend React Integration

```javascript
// Generate study plan
const generateStudyPlan = async (planData) => {
  const response = await fetch("/study/plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(planData),
  });
  return response.json();
};

// Generate quiz questions
const generateQuiz = async (quizData) => {
  const response = await fetch("/study/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(quizData),
  });
  return response.json();
};

// Get concept explanation
const explainConcept = async (explainData) => {
  const response = await fetch("/study/explain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(explainData),
  });
  return response.json();
};
```

### Python Client Integration

```python
import requests

class StudySyncClient:
    def __init__(self, base_url: str, auth_token: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {auth_token}',
            'Content-Type': 'application/json'
        }

    def generate_study_plan(self, plan_data: dict):
        response = requests.post(
            f'{self.base_url}/study/plans',
            json=plan_data,
            headers=self.headers
        )
        return response.json()

    def generate_quiz(self, quiz_data: dict):
        response = requests.post(
            f'{self.base_url}/study/questions',
            json=quiz_data,
            headers=self.headers
        )
        return response.json()

    def explain_concept(self, explain_data: dict):
        response = requests.post(
            f'{self.base_url}/study/explain',
            json=explain_data,
            headers=self.headers
        )
        return response.json()
```

## ✅ Production Ready Features

Your StudySync AI backend now includes:

- ✅ **3 AI-Powered Endpoints** - Plans, Questions, Explanations
- ✅ **LangChain Integration** - Professional AI orchestration
- ✅ **Cerebras AI Backend** - High-performance inference
- ✅ **JWT Authentication** - Secure user-based access
- ✅ **Comprehensive Error Handling** - Graceful failure management
- ✅ **Health Monitoring** - System status tracking
- ✅ **Production Logging** - Request/response monitoring

Perfect for building intelligent educational applications! 🎓✨
