import { useState } from "react";
import QuizModal from "@/components/QuizModal";
import QuestionCarousel from "@/components/QuestionCarousel";
import HintBanner from "@/components/HintBanner";

// Types
interface QuizQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

interface QuizData {
  [topic: string]: {
    [difficulty: string]: QuizQuestion[];
  };
}

// Sample quiz data
const sampleQuestions: QuizData = {
  Mathematics: {
    easy: [
      {
        id: "1",
        text: "What is 2 + 2?",
        options: [
          { id: "a", text: "3", isCorrect: false },
          { id: "b", text: "4", isCorrect: true },
          { id: "c", text: "5", isCorrect: false },
          { id: "d", text: "6", isCorrect: false },
        ],
        explanation:
          "Basic addition: 2 + 2 equals 4. This is fundamental arithmetic.",
      },
      {
        id: "2",
        text: "What is 10 - 3?",
        options: [
          { id: "a", text: "6", isCorrect: false },
          { id: "b", text: "7", isCorrect: true },
          { id: "c", text: "8", isCorrect: false },
          { id: "d", text: "9", isCorrect: false },
        ],
        explanation:
          "Subtraction: 10 - 3 = 7. Count backwards from 10: 9, 8, 7.",
      },
      {
        id: "3",
        text: "What is 3 × 4?",
        options: [
          { id: "a", text: "10", isCorrect: false },
          { id: "b", text: "11", isCorrect: false },
          { id: "c", text: "12", isCorrect: true },
          { id: "d", text: "13", isCorrect: false },
        ],
        explanation:
          "Multiplication: 3 × 4 = 12. This means 3 groups of 4 or 4 + 4 + 4.",
      },
    ],
    medium: [
      {
        id: "4",
        text: "What is the square root of 16?",
        options: [
          { id: "a", text: "2", isCorrect: false },
          { id: "b", text: "3", isCorrect: false },
          { id: "c", text: "4", isCorrect: true },
          { id: "d", text: "8", isCorrect: false },
        ],
        explanation: "The square root of 16 is 4 because 4 × 4 = 16.",
      },
    ],
  },
  Science: {
    easy: [
      {
        id: "5",
        text: "What planet is closest to the Sun?",
        options: [
          { id: "a", text: "Venus", isCorrect: false },
          { id: "b", text: "Mercury", isCorrect: true },
          { id: "c", text: "Earth", isCorrect: false },
          { id: "d", text: "Mars", isCorrect: false },
        ],
        explanation:
          "Mercury is the closest planet to the Sun in our solar system.",
      },
    ],
    medium: [], // Add medium difficulty science questions here
  },
};

const quizHints = [
  "Read each question carefully and identify key terms",
  "Eliminate obviously wrong answers first",
  "Use logical reasoning based on what you know about the topic",
  "Look for context clues within the question",
  "Take your time - there's no rush to answer quickly",
];

export default function QuizPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<{
    topic: string;
    difficulty: string;
    questions: QuizQuestion[];
  } | null>(null);
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
  const [showHints, setShowHints] = useState(true);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const handleStartQuiz = (topic: string, difficulty: string) => {
    const topicQuestions = sampleQuestions[topic];
    const questions = topicQuestions?.[difficulty] || [];

    setCurrentQuiz({
      topic,
      difficulty,
      questions,
    });
    setWrongAnswerCount(0);
    setShowHints(true);
    setQuizScore(null);
  };

  const handleQuestionAnswer = (
    questionId: string,
    selectedOptionId: string,
    isCorrect: boolean
  ) => {
    if (!isCorrect) {
      setWrongAnswerCount((prev) => prev + 1);
    }
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setCurrentQuiz(null);
  };

  const handleDismissHints = () => {
    setShowHints(false);
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setWrongAnswerCount(0);
    setShowHints(true);
    setQuizScore(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Hint Banner */}
      <HintBanner
        wrongAnswerCount={wrongAnswerCount}
        hints={quizHints}
        onDismiss={handleDismissHints}
        isVisible={showHints}
      />

      {/* Main Content */}
      <div
        className={`container mx-auto px-4 py-8 ${
          wrongAnswerCount >= 2 && showHints ? "pt-32" : ""
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quiz Platform
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your knowledge across various subjects with our interactive
            quiz system. Get helpful hints when you need them and track your
            progress.
          </p>
        </div>

        {/* Quiz Content */}
        {!currentQuiz && quizScore === null && (
          <div className="text-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start New Quiz
            </button>
          </div>
        )}

        {/* Active Quiz */}
        {currentQuiz && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {currentQuiz.topic} Quiz
              </h2>
              <p className="text-gray-600 capitalize">
                Difficulty: {currentQuiz.difficulty}
              </p>
              {wrongAnswerCount > 0 && (
                <p className="text-red-600 mt-2">
                  Wrong answers: {wrongAnswerCount}
                </p>
              )}
            </div>

            <QuestionCarousel
              questions={currentQuiz.questions}
              onQuestionAnswer={handleQuestionAnswer}
              onQuizComplete={handleQuizComplete}
            />

            <div className="text-center mt-8">
              <button
                onClick={resetQuiz}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                End Quiz
              </button>
            </div>
          </div>
        )}

        {/* Quiz Results */}
        {quizScore !== null && (
          <div className="text-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Quiz Complete!
              </h2>
              <div className="text-4xl font-bold text-teal-600 mb-4">
                {quizScore}/{currentQuiz?.questions.length || 0}
              </div>
              <p className="text-gray-600 mb-6">
                {quizScore === (currentQuiz?.questions.length || 0)
                  ? "Perfect score! Well done!"
                  : quizScore >= (currentQuiz?.questions.length || 0) * 0.7
                  ? "Great job!"
                  : "Keep practicing!"}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors duration-200"
                >
                  Take Another Quiz
                </button>
                <button
                  onClick={resetQuiz}
                  className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {!currentQuiz && quizScore === null && (
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Multiple Topics
              </h3>
              <p className="text-gray-600">
                Choose from Mathematics, Science, History, and more subjects.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Hints
              </h3>
              <p className="text-gray-600">
                Get helpful hints when you need them most during challenging
                questions.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600">
                Monitor your performance and see detailed explanations for each
                answer.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartQuiz={handleStartQuiz}
      />
    </div>
  );
}
