# Quiz System Components

A complete, interactive quiz system built with React, TypeScript, HeadlessUI, Framer Motion, and Swiper.js. This system includes three main components that work together to create an engaging quiz experience.

## 🎯 Components Overview

### 1. QuizModal

**Purpose**: Modal dialog for quiz setup with topic selection and difficulty choice.

**Features**:

- HeadlessUI Dialog for accessibility
- Autocomplete topic selection (15 predefined subjects)
- Difficulty level selector (Easy, Medium, Hard)
- Smooth Framer Motion animations
- Form validation

**Props**:

```typescript
interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (topic: string, difficulty: string) => void;
}
```

### 2. QuestionCarousel

**Purpose**: Interactive question display with navigation and feedback system.

**Features**:

- Swiper.js carousel for question navigation
- Multiple choice option selection
- Instant feedback with animated badges (✓/✗)
- Detailed explanations after answers
- Progress tracking and scoring
- Smooth transitions between questions

**Props**:

```typescript
interface QuestionCarouselProps {
  questions: Question[];
  onQuestionAnswer?: (
    questionId: string,
    selectedOptionId: string,
    isCorrect: boolean
  ) => void;
  onQuizComplete?: (score: number) => void;
}
```

### 3. HintBanner

**Purpose**: Contextual help system that appears after multiple wrong answers.

**Features**:

- Appears after 2+ wrong answers
- Dismissible banner with slide animation
- Expandable hint panel with bullet points
- Collapsible interface
- Smart positioning

**Props**:

```typescript
interface HintBannerProps {
  wrongAnswerCount: number;
  hints: string[];
  onDismiss: () => void;
  isVisible: boolean;
}
```

## 🚀 Getting Started

### Prerequisites

Install the required dependencies:

```bash
npm install @headlessui/react framer-motion swiper lucide-react
# or
yarn add @headlessui/react framer-motion swiper lucide-react
```

### Usage Example

```tsx
import { useState } from "react";
import QuizModal from "@/components/QuizModal";
import QuestionCarousel from "@/components/QuestionCarousel";
import HintBanner from "@/components/HintBanner";

export default function QuizApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);

  const handleStartQuiz = (topic, difficulty) => {
    // Load questions based on topic and difficulty
    const questions = loadQuestions(topic, difficulty);
    setCurrentQuiz({ topic, difficulty, questions });
  };

  const handleQuestionAnswer = (questionId, selectedOptionId, isCorrect) => {
    if (!isCorrect) {
      setWrongAnswerCount((prev) => prev + 1);
    }
  };

  return (
    <div>
      <HintBanner
        wrongAnswerCount={wrongAnswerCount}
        hints={["Tip 1", "Tip 2", "Tip 3"]}
        onDismiss={() => setShowHints(false)}
        isVisible={true}
      />

      {currentQuiz && (
        <QuestionCarousel
          questions={currentQuiz.questions}
          onQuestionAnswer={handleQuestionAnswer}
          onQuizComplete={(score) => console.log("Quiz complete:", score)}
        />
      )}

      <QuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartQuiz={handleStartQuiz}
      />
    </div>
  );
}
```

## 📱 Demo Page

A complete demo implementation is available in `pages/quiz-demo.tsx` that shows:

- Full integration of all three components
- Sample quiz data structure
- State management for quiz flow
- Results display and scoring
- Responsive design

### Running the Demo

1. Ensure all dependencies are installed
2. Place the component files in your `components/` directory
3. Navigate to `/quiz-demo` in your application

## 🎨 Styling

The components use Tailwind CSS with the following design system:

**Colors**:

- Primary: Teal (600, 700)
- Success: Green (500, 600)
- Error: Red (500, 600)
- Warning: Yellow (500, 600)
- Neutral: Gray (100-900)

**Animations**:

- Framer Motion for component transitions
- Smooth scaling and opacity changes
- Slide animations for panels and banners

## 📊 Data Structure

### Question Format

```typescript
interface Question {
  id: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  explanation: string;
}
```

### Quiz Data Structure

```typescript
interface QuizData {
  [topic: string]: {
    [difficulty: string]: Question[];
  };
}
```

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and roles
- **Focus Management**: Logical focus flow and visible focus indicators
- **Color Contrast**: WCAG-compliant color combinations
- **Semantic HTML**: Proper heading hierarchy and landmarks

## 🔧 Customization

### Adding New Topics

Add topics to the QuizModal's autocomplete list:

```typescript
const topics = [
  "Mathematics",
  "Science",
  "History",
  "Geography",
  "Literature",
  // Add your topics here
];
```

### Custom Styling

Override Tailwind classes or extend the theme:

```typescript
// Custom classes example
const customStyles = {
  modal: "bg-gradient-to-r from-purple-500 to-blue-500",
  button: "bg-custom-primary hover:bg-custom-primary-dark",
  // ... more customizations
};
```

### Animation Timing

Adjust Framer Motion animations:

```typescript
const customAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" },
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Icons not displaying**: Ensure `lucide-react` is installed
2. **Animations not working**: Check Framer Motion installation
3. **Carousel not sliding**: Verify Swiper.js modules are imported
4. **TypeScript errors**: Ensure all interface definitions are correct

### Browser Compatibility

- Modern browsers (Chrome 88+, Firefox 85+, Safari 14+)
- CSS Grid and Flexbox support required
- JavaScript ES2020+ features used

## 📝 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built with ❤️ using React, TypeScript, and modern UI libraries**
