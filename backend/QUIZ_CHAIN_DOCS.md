# 🧠 QuizChain - AI-Powered Question Generation

## ✅ QuizChain Implementation

### `chains/quiz_chain.py` - Intelligent Quiz Generation

- **LangChain Integration**: Professional chain-based question generation
- **Cerebras AI Backend**: Uses your configured Cerebras client
- **Multiple Question Types**: Multiple choice, true/false, short answer
- **Difficulty Levels**: Easy, medium, hard with automatic calibration
- **JSON Response Parsing**: Robust parsing with comprehensive error handling

## 🔧 Key Components

### QuizInput Model

```python
class QuizInput(BaseModel):
    user_id: UUID                     # User identifier
    topic: str                        # Subject area
    difficulty: str                   # easy/medium/hard
    question_count: Optional[int]     # Number of questions (default: 5)
    question_types: Optional[List]    # Question format preferences
    focus_areas: Optional[List]       # Specific subtopics
    learning_objectives: Optional[List] # Assessment goals
```

### QuizChain Features

- **Smart Question Generation**: Context-aware educational questions
- **Multiple Formats**: MC, T/F, short answer, and more
- **Educational Explanations**: Detailed answer explanations
- **Difficulty Calibration**: Automatic difficulty level matching
- **Learning Objectives**: Aligned with educational goals

## 🚀 Usage Examples

### Basic Quiz Generation

```python
from chains import create_quiz_chain, QuizInput
from uuid import uuid4

# Create the chain
quiz_chain = create_quiz_chain()

# Prepare input
quiz_input = QuizInput(
    user_id=uuid4(),
    topic="Python Programming",
    difficulty="medium",
    question_count=5,
    question_types=["multiple_choice", "short_answer"],
    focus_areas=["functions", "data structures"],
    learning_objectives=["Apply functions", "Manipulate data"]
)

# Generate quiz questions
result = quiz_chain({"quiz_input": quiz_input})
questions = result["questions"]

print(f"Generated {len(questions)} questions")
for q in questions:
    print(f"Q: {q['question']}")
    print(f"Type: {q['type']}")
```

### FastAPI Integration

```python
from fastapi import APIRouter
from chains import create_quiz_chain

router = APIRouter()
quiz_chain = create_quiz_chain()

@router.post("/generate-quiz")
async def generate_quiz(quiz_request: QuizInput):
    result = quiz_chain({"quiz_input": quiz_request})
    return {"questions": result["questions"]}
```

## 📊 Generated Question Structure

### Complete Question Format

```json
{
  "id": 1,
  "question": "What is the primary purpose of Python's list comprehension?",
  "type": "multiple_choice",
  "difficulty": "medium",
  "topic": "Python Programming",
  "options": [
    "To create lists in a more readable way",
    "To improve performance over regular loops",
    "To provide a concise way to create lists",
    "All of the above"
  ],
  "correct_answer": "All of the above",
  "explanation": "List comprehensions provide a concise, readable, and often more performant way to create lists compared to traditional for loops. They combine filtering and transformation operations in a single, expressive syntax.",
  "learning_objective": "Understand Python list comprehension benefits",
  "estimated_time": 90,
  "difficulty_justification": "Requires understanding of multiple concepts and their relationships",
  "generation_metadata": {
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "generated_at": "2024-01-15T10:30:00Z",
    "model_used": "llama3.1-8b",
    "prompt_version": "1.0"
  }
}
```

### Question Types Supported

#### Multiple Choice

```json
{
  "type": "multiple_choice",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "Option B"
}
```

#### True/False

```json
{
  "type": "true_false",
  "options": ["True", "False"],
  "correct_answer": "True"
}
```

#### Short Answer

```json
{
  "type": "short_answer",
  "options": [],
  "correct_answer": "Sample ideal response with key points"
}
```

## 🎯 Advanced Features

### Difficulty Calibration

- **Easy**: Basic recall and recognition questions
- **Medium**: Application and analysis problems
- **Hard**: Synthesis, evaluation, and complex reasoning

### Educational Quality

- **Clear Questions**: Unambiguous, grammatically correct
- **Plausible Distractors**: Realistic wrong options
- **Educational Explanations**: Reinforce learning concepts
- **Misconception Addressing**: Cover common mistakes

### Customization Options

- **Focus Areas**: Target specific subtopics
- **Learning Objectives**: Align with curriculum goals
- **Question Count**: Flexible quiz length
- **Mixed Types**: Combine different question formats

## 🔍 Integration Examples

### With Authentication

```python
@app.post("/quiz/generate")
async def generate_authenticated_quiz(
    quiz_data: QuizInput,
    current_user_id: UUID = Depends(get_current_user)
):
    # Override user_id with authenticated user
    quiz_data.user_id = current_user_id

    # Generate questions
    result = quiz_chain({"quiz_input": quiz_data})
    questions = result["questions"]

    # Save quiz session to database
    quiz_session = {
        "user_id": str(current_user_id),
        "topic": quiz_data.topic,
        "difficulty": quiz_data.difficulty,
        "questions": questions,
        "created_at": datetime.now().isoformat()
    }

    # Store in Supabase
    supabase.from_("quiz_sessions").insert(quiz_session).execute()

    return {"questions": questions}
```

### With Progress Tracking

```python
def save_quiz_attempt(user_id: UUID, questions: List[dict], answers: List[str]):
    """Save quiz attempt and calculate score"""

    score = 0
    total = len(questions)

    for i, (question, user_answer) in enumerate(zip(questions, answers)):
        correct = user_answer == question["correct_answer"]
        if correct:
            score += 1

        # Save individual response
        supabase.from_("quiz_responses").insert({
            "user_id": str(user_id),
            "question_id": question["id"],
            "user_answer": user_answer,
            "correct_answer": question["correct_answer"],
            "is_correct": correct,
            "topic": question["topic"],
            "difficulty": question["difficulty"]
        }).execute()

    return {"score": score, "total": total, "percentage": (score/total)*100}
```

### Adaptive Difficulty

```python
def generate_adaptive_quiz(user_id: UUID, topic: str, performance_history: dict):
    """Generate quiz with adaptive difficulty based on user performance"""

    # Analyze user's past performance
    avg_score = performance_history.get("average_score", 0.7)

    # Adjust difficulty
    if avg_score > 0.8:
        difficulty = "hard"
    elif avg_score > 0.6:
        difficulty = "medium"
    else:
        difficulty = "easy"

    # Generate quiz
    quiz_input = QuizInput(
        user_id=user_id,
        topic=topic,
        difficulty=difficulty,
        question_count=5
    )

    result = quiz_chain({"quiz_input": quiz_input})
    return result["questions"]
```

## 🧪 Testing and Validation

### Question Quality Metrics

- **Clarity Score**: Question readability and comprehension
- **Difficulty Alignment**: Matches requested difficulty level
- **Educational Value**: Assesses meaningful learning objectives
- **Distractor Quality**: Plausible but incorrect options

### Error Handling

- **JSON Parsing**: Robust response parsing with fallbacks
- **API Failures**: Graceful handling of Cerebras API issues
- **Content Validation**: Question format and content verification
- **Fallback Questions**: Meaningful error questions when generation fails

## ✅ Production Ready

Your StudySync AI now includes:

- ✅ Professional quiz generation chain
- ✅ Multiple question type support
- ✅ Educational quality assurance
- ✅ Comprehensive error handling
- ✅ Integration with authentication
- ✅ Progress tracking capabilities

Perfect for creating engaging, educational assessments! 🎓
