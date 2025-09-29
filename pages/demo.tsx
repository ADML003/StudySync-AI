import React, { useState } from "react";
import { motion } from "framer-motion";
import OnboardingWizard from "@/components/OnboardingWizard";
import TodaysFocus from "@/components/TodaysFocus";
import ConcentricRings from "@/components/ConcentricRings";
import Timeline from "@/components/Timeline";
import StudyPlan from "@/components/StudyPlan";
import DraggableDayCards from "@/components/DraggableDayCards";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  Users,
  Award,
  Zap,
} from "lucide-react";

// Sample data for components
const sampleTimelineEvents = [
  {
    id: "1",
    date: "2024-01-15",
    topic: "React Fundamentals",
    type: "study" as const,
    score: 85,
    icon: "⚛️",
    completed: true,
  },
  {
    id: "2",
    date: "2024-01-16",
    topic: "Component State",
    type: "quiz" as const,
    score: 92,
    icon: "🧠",
    completed: true,
  },
  {
    id: "3",
    date: "2024-01-17",
    topic: "Hooks Deep Dive",
    type: "study" as const,
    score: 78,
    icon: "🪝",
    completed: true,
  },
  {
    id: "4",
    date: "2024-01-18",
    topic: "Context API",
    type: "milestone" as const,
    score: 88,
    icon: "🌐",
    completed: false,
  },
  {
    id: "5",
    date: "2024-01-19",
    topic: "Performance Optimization",
    type: "achievement" as const,
    score: 95,
    icon: "⚡",
    completed: false,
  },
];

const sampleStudyData = [
  {
    date: "2024-01-15",
    tasks: [
      {
        id: "1",
        title: "React Components Overview",
        duration: 45,
        completed: true,
        priority: "high" as const,
        type: "study" as const,
      },
      {
        id: "2",
        title: "JSX Syntax Quiz",
        duration: 15,
        completed: true,
        priority: "medium" as const,
        type: "quiz" as const,
      },
      {
        id: "3",
        title: "Props Practice",
        duration: 30,
        completed: false,
        priority: "low" as const,
        type: "practice" as const,
      },
    ],
    totalMinutes: 90,
    completedMinutes: 60,
  },
  {
    date: "2024-01-16",
    tasks: [
      {
        id: "4",
        title: "State Management",
        duration: 60,
        completed: true,
        priority: "high" as const,
        type: "study" as const,
      },
      {
        id: "5",
        title: "useState Hook",
        duration: 30,
        completed: true,
        priority: "medium" as const,
        type: "practice" as const,
      },
      {
        id: "6",
        title: "State Quiz",
        duration: 20,
        completed: true,
        priority: "low" as const,
        type: "quiz" as const,
      },
    ],
    totalMinutes: 110,
    completedMinutes: 110,
  },
  {
    date: "2024-01-17",
    tasks: [
      {
        id: "7",
        title: "useEffect Patterns",
        duration: 75,
        completed: false,
        priority: "high" as const,
        type: "study" as const,
      },
      {
        id: "8",
        title: "Cleanup Functions",
        duration: 25,
        completed: false,
        priority: "medium" as const,
        type: "practice" as const,
      },
    ],
    totalMinutes: 100,
    completedMinutes: 0,
  },
  {
    date: "2024-01-18",
    tasks: [
      {
        id: "9",
        title: "Context API Deep Dive",
        duration: 90,
        completed: false,
        priority: "high" as const,
        type: "study" as const,
      },
      {
        id: "10",
        title: "Provider Pattern",
        duration: 45,
        completed: false,
        priority: "medium" as const,
        type: "practice" as const,
      },
    ],
    totalMinutes: 135,
    completedMinutes: 0,
  },
];

const sampleDayCards = [
  {
    id: "mon",
    day: "Monday",
    date: "Jan 15, 2024",
    tasks: 3,
    completedTasks: 2,
    totalMinutes: 90,
    focus: "React Fundamentals",
    difficulty: "easy" as const,
    priority: "high" as const,
  },
  {
    id: "tue",
    day: "Tuesday",
    date: "Jan 16, 2024",
    tasks: 3,
    completedTasks: 3,
    totalMinutes: 110,
    focus: "State Management",
    difficulty: "medium" as const,
    priority: "high" as const,
  },
  {
    id: "wed",
    day: "Wednesday",
    date: "Jan 17, 2024",
    tasks: 2,
    completedTasks: 0,
    totalMinutes: 100,
    focus: "useEffect Patterns",
    difficulty: "hard" as const,
    priority: "medium" as const,
  },
  {
    id: "thu",
    day: "Thursday",
    date: "Jan 18, 2024",
    tasks: 2,
    completedTasks: 0,
    totalMinutes: 135,
    focus: "Context API",
    difficulty: "hard" as const,
    priority: "high" as const,
  },
  {
    id: "fri",
    day: "Friday",
    date: "Jan 19, 2024",
    tasks: 4,
    completedTasks: 1,
    totalMinutes: 120,
    focus: "Performance",
    difficulty: "medium" as const,
    priority: "medium" as const,
  },
];

const Demo = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dayCards, setDayCards] = useState(sampleDayCards);

  const handleOnboardingComplete = (data: any) => {
    console.log("Onboarding completed:", data);
    setShowOnboarding(false);
  };

  const handleTaskToggle = (date: string, taskId: string) => {
    console.log("Task toggled:", date, taskId);
  };

  const handleDayCardsReorder = (reorderedCards: any) => {
    setDayCards(reorderedCards);
    console.log("Cards reordered:", reorderedCards);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learning Platform
              <span className="block text-2xl md:text-3xl font-medium mt-2 text-blue-200">
                Component Showcase
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Explore our comprehensive collection of interactive learning
              components designed to enhance your educational experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => setShowOnboarding(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
              >
                <Users className="h-5 w-5 mr-2" />
                Start Onboarding
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Learning Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each component is carefully designed to provide engaging and
            effective learning experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: Target,
              title: "Focused Learning",
              desc: "Track daily goals and progress",
            },
            {
              icon: TrendingUp,
              title: "Progress Analytics",
              desc: "Visualize your learning journey",
            },
            {
              icon: Calendar,
              title: "Smart Planning",
              desc: "Organize study schedules",
            },
            {
              icon: Zap,
              title: "Interactive Tools",
              desc: "Engage with dynamic content",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Component Showcase */}
        <div className="space-y-16">
          {/* Today's Focus */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Target className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Today's Focus Card
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Interactive daily learning card with adaptive recommendations and
              progress tracking.
            </p>
            <TodaysFocus
              topic="React Component Patterns"
              timeEstimate={45}
              progress={0.65}
            />
          </motion.section>

          {/* Concentric Rings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Award className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Progress Visualization
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Animated concentric rings showing strength, practice, and review
              metrics.
            </p>
            <div className="flex justify-center">
              <ConcentricRings
                strength={85}
                practice={72}
                review={91}
                className="max-w-md"
              />
            </div>
          </motion.section>

          {/* Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Clock className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Learning Timeline
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Horizontal scrollable timeline with interactive tooltips showing
              learning progress.
            </p>
            <Timeline events={sampleTimelineEvents} />
          </motion.section>

          {/* Study Plan */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Study Plan Manager
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Toggle between calendar and list views to manage your study
              schedule effectively.
            </p>
            <StudyPlan
              studyData={sampleStudyData}
              onTaskToggle={handleTaskToggle}
            />
          </motion.section>

          {/* Draggable Day Cards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">
                Draggable Weekly Planner
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Reorder your weekly study plan with drag-and-drop functionality
              and progress tracking.
            </p>
            <DraggableDayCards
              initialCards={dayCards}
              onReorder={handleDayCardsReorder}
            />
          </motion.section>
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <OnboardingWizard
              onComplete={handleOnboardingComplete}
              onClose={() => setShowOnboarding(false)}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">
              Ready to Start Learning?
            </h4>
            <p className="text-gray-300 mb-6">
              Experience the power of our interactive learning platform
            </p>
            <Button
              onClick={() => setShowOnboarding(true)}
              className="bg-blue-600 hover:bg-blue-700 font-semibold px-8 py-3"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Demo;
