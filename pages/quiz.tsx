import Head from 'next/head'
import { useState } from 'react'
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Timer, Target } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppShell from '@/components/AppShell'
import { Button } from '@/components/ui/button'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutes

  const questions: Question[] = [
    {
      id: 1,
      question: "What is the correct way to create a functional component in React?",
      options: [
        "function MyComponent() { return <div>Hello</div>; }",
        "class MyComponent extends React.Component { render() { return <div>Hello</div>; } }",
        "const MyComponent = () => { return <div>Hello</div>; }",
        "Both A and C are correct"
      ],
      correctAnswer: 3,
      explanation: "Both function declaration and arrow function syntax are valid ways to create functional components in React.",
      difficulty: 'easy',
      topic: 'React Fundamentals'
    },
    {
      id: 2,
      question: "Which TypeScript feature allows you to define the shape of an object?",
      options: [
        "Type",
        "Interface",
        "Class",
        "Both A and B"
      ],
      correctAnswer: 3,
      explanation: "Both 'type' aliases and 'interface' declarations can be used to define object shapes in TypeScript.",
      difficulty: 'medium',
      topic: 'TypeScript'
    },
    {
      id: 3,
      question: "What is the purpose of the getStaticProps function in Next.js?",
      options: [
        "To fetch data at runtime on each request",
        "To fetch data at build time for static generation",
        "To handle API routes",
        "To manage client-side state"
      ],
      correctAnswer: 1,
      explanation: "getStaticProps runs at build time and allows you to fetch data for static generation, improving performance.",
      difficulty: 'hard',
      topic: 'Next.js'
    }
  ]

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <ProtectedRoute>
        <Head>
          <title>Quiz Results - AI Study Companion</title>
          <meta name="description" content="Your quiz results and performance analysis" />
        </Head>

        <AppShell>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Results Header */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6">
                {score >= 80 ? (
                  <div className="w-full h-full bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                ) : (
                  <div className="w-full h-full bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                    <Target className="w-12 h-12 text-orange-600" />
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz Complete!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Your Score: <span className="font-bold text-blue-600">{score}%</span>
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-green-600">
                  {questions.filter((_, index) => selectedAnswers[index] === questions[index].correctAnswer).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-red-600">
                  {questions.filter((_, index) => selectedAnswers[index] !== questions[index].correctAnswer && selectedAnswers[index] !== undefined).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect Answers</div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-600">
                  {questions.filter((_, index) => selectedAnswers[index] === undefined).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Unanswered</div>
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Question Review
              </h2>
              
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index]
                const isCorrect = userAnswer === question.correctAnswer
                
                return (
                  <div key={question.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Question {index + 1}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {question.topic}
                          </span>
                        </div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {question.question}
                        </h3>
                      </div>
                      
                      <div className="ml-4">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            optionIndex === question.correctAnswer
                              ? 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                              : optionIndex === userAnswer && !isCorrect
                              ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                              : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button onClick={() => {
                setCurrentQuestion(0)
                setSelectedAnswers({})
                setShowResults(false)
              }}>
                Retake Quiz
              </Button>
              <Button variant="outline">
                Generate New Quiz
              </Button>
            </div>
          </div>
        </AppShell>
      </ProtectedRoute>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <ProtectedRoute>
      <Head>
        <title>Quiz - AI Study Companion</title>
        <meta name="description" content="Test your knowledge with adaptive quizzes" />
      </Head>

      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Quiz Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Knowledge Quiz
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Timer className="w-4 h-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQ.difficulty)}`}>
                  {currentQ.difficulty}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {currentQ.topic}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
