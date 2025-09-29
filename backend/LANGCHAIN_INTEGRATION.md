# 🔗 LangChain Study Plan Generation

## ✅ PlanChain Implementation

### `chains/plan_chain.py` - AI-Powered Study Plan Chain

- **LangChain Integration**: Professional chain-based AI orchestration
- **Cerebras AI Backend**: Uses your configured Cerebras client
- **Structured Input/Output**: Type-safe with Pydantic models
- **JSON Response Parsing**: Robust parsing with error handling
- **Comprehensive Plans**: Detailed weekly/daily schedules with resources

## 🔧 Key Components

### StudyPlanInput Model

```python
class StudyPlanInput(BaseModel):
    user_id: UUID                    # Unique user identifier
    subject: str                     # Subject to study
    exam_date: Optional[str]         # Target date (YYYY-MM-DD)
    current_level: str               # beginner/intermediate/advanced
    available_hours_per_day: float  # Daily study time
    preferred_study_style: str       # Learning preferences
    specific_goals: Optional[str]    # Custom objectives
```

### PlanChain Features

- **Smart Prompting**: Comprehensive prompt template
- **JSON Output**: Structured study plan format
- **Error Handling**: Graceful fallbacks for parsing errors
- **Logging**: Detailed operation tracking
- **Metadata**: Generation details and timestamps

## 🚀 Usage Examples

### Basic Usage

```python
from chains import create_plan_chain, StudyPlanInput
from uuid import uuid4

# Create the chain
plan_chain = create_plan_chain()

# Prepare input
plan_input = StudyPlanInput(
    user_id=uuid4(),
    subject="Data Science with Python",
    exam_date="2025-12-15",
    current_level="intermediate",
    available_hours_per_day=2.5,
    preferred_study_style="hands-on",
    specific_goals="Prepare for data scientist role"
)

# Generate study plan
result = plan_chain({"plan_input": plan_input})
study_plan = result["study_plan"]

print(f"Generated plan: {study_plan['title']}")
print(f"Duration: {study_plan['duration_weeks']} weeks")
```

### Integration with FastAPI

```python
from fastapi import APIRouter
from chains import create_plan_chain

router = APIRouter()
plan_chain = create_plan_chain()

@router.post("/generate-plan")
async def generate_study_plan(plan_request: StudyPlanInput):
    result = plan_chain({"plan_input": plan_request})
    return result["study_plan"]
```

## 📊 Generated Plan Structure

### Complete JSON Output

```json
{
  "title": "Comprehensive Data Science Study Plan",
  "subject": "Data Science with Python",
  "duration_weeks": 12,
  "daily_hours": 2.5,
  "learning_objectives": [
    "Master Python data manipulation",
    "Understand statistical analysis",
    "Build machine learning models"
  ],
  "weekly_breakdown": {
    "week_1": {
      "title": "Python Fundamentals",
      "topics": ["Pandas", "NumPy"],
      "objectives": ["Data manipulation", "Array operations"],
      "estimated_hours": 17.5
    }
  },
  "daily_schedule": {
    "monday": [
      {
        "time": "09:00-10:30",
        "activity": "Reading and notes",
        "topic": "Pandas basics"
      }
    ]
  },
  "resources": [
    {
      "type": "textbook",
      "title": "Python for Data Analysis",
      "priority": "high"
    }
  ],
  "milestones": [
    {
      "week": 3,
      "description": "Complete data manipulation basics",
      "assessment": "Pandas project"
    }
  ],
  "study_tips": [
    "Practice with real datasets",
    "Join online communities",
    "Build portfolio projects"
  ]
}
```

## 🎯 Advanced Features

### Error Handling

- **JSON Parsing**: Robust response parsing with fallbacks
- **API Failures**: Graceful handling of Cerebras API issues
- **Validation**: Input validation with clear error messages
- **Logging**: Comprehensive operation tracking

### Customization

- **Template Flexibility**: Easy prompt template modifications
- **Model Parameters**: Configurable temperature and token limits
- **Output Format**: Extensible JSON structure
- **Learning Styles**: Support for multiple learning preferences

### Performance

- **Efficient Parsing**: Fast JSON processing
- **Memory Optimized**: Minimal resource usage
- **Async Ready**: Compatible with FastAPI async patterns
- **Caching Ready**: Easy to integrate with caching layers

## 🔍 Integration Points

### With FastAPI Routes

```python
# In main.py or routes
from chains import create_plan_chain

plan_chain = create_plan_chain()

@app.post("/ai/generate-plan")
async def ai_generate_plan(
    plan_data: StudyPlanInput,
    current_user_id: UUID = Depends(get_current_user)
):
    # Override user_id with authenticated user
    plan_data.user_id = current_user_id

    # Generate plan
    result = plan_chain({"plan_input": plan_data})
    study_plan = result["study_plan"]

    # Save to database
    # ... supabase integration ...

    return study_plan
```

### With Database Storage

```python
# Save generated plan to Supabase
def save_generated_plan(user_id: UUID, plan_data: dict):
    result = supabase.from_("study_plans").insert({
        "user_id": str(user_id),
        "plan": plan_data,
        "ai_generated": True,
        "generation_model": "cerebras-llama3.1-8b"
    }).execute()
    return result.data[0]
```

## ✅ Ready for Production

Your StudySync AI now has:

- ✅ Professional LangChain integration
- ✅ AI-powered study plan generation
- ✅ Structured input/output handling
- ✅ Comprehensive error management
- ✅ Production-ready logging and monitoring

Perfect for creating intelligent, personalized study experiences! 🎓
