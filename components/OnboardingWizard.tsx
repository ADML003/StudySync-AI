import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Target,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onClose: () => void;
}

interface OnboardingData {
  subject: string;
  proficiency: string;
  dailyHours: number;
}

const subjects = [
  {
    id: "python",
    name: "Python Programming",
    icon: "🐍",
    description: "Learn Python from basics to advanced",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "⚡",
    description: "Master modern JavaScript and web development",
  },
  {
    id: "react",
    name: "React",
    icon: "⚛️",
    description: "Build dynamic user interfaces",
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    icon: "🤖",
    description: "Dive into AI and data science",
  },
  {
    id: "data-structures",
    name: "Data Structures",
    icon: "🏗️",
    description: "Master algorithms and data structures",
  },
  {
    id: "web-development",
    name: "Web Development",
    icon: "🌐",
    description: "Full-stack web development",
  },
];

const proficiencyLevels = [
  {
    id: "beginner",
    name: "Beginner",
    description: "Just starting out",
    icon: "🌱",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "Some experience",
    icon: "🌿",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Experienced learner",
    icon: "🌳",
  },
];

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState("");
  const [dailyHours, setDailyHours] = useState(1);

  const totalSteps = 3;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      onComplete({
        subject: selectedSubject,
        proficiency: selectedProficiency,
        dailyHours,
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedSubject !== "";
      case 1:
        return selectedProficiency !== "";
      case 2:
        return dailyHours > 0;
      default:
        return false;
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Welcome to Cerebras Learning
              </h2>
              <p className="text-muted-foreground">
                Let's personalize your learning experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex space-x-2 mt-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  index <= currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 1: Subject Selection */}
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Choose Your Subject
                  </h3>
                  <p className="text-muted-foreground">
                    What would you like to learn today?
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <motion.div
                      key={subject.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-colors",
                        selectedSubject === subject.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                      onClick={() => setSelectedSubject(subject.id)}
                    >
                      <div className="text-2xl mb-2">{subject.icon}</div>
                      <h4 className="font-medium mb-1">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {subject.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Proficiency Level */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Your Proficiency Level
                  </h3>
                  <p className="text-muted-foreground">
                    How would you describe your current skill level?
                  </p>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                  {proficiencyLevels.map((level) => (
                    <motion.label
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "flex items-center p-4 border rounded-lg cursor-pointer transition-colors",
                        selectedProficiency === level.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="proficiency"
                        value={level.id}
                        checked={selectedProficiency === level.id}
                        onChange={(e) => setSelectedProficiency(e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-2xl mr-4">{level.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium">{level.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {level.description}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 transition-colors",
                          selectedProficiency === level.id
                            ? "border-primary bg-primary"
                            : "border-muted-foreground"
                        )}
                      />
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Daily Hours */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Daily Study Time
                  </h3>
                  <p className="text-muted-foreground">
                    How much time can you dedicate daily?
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {dailyHours} {dailyHours === 1 ? "hour" : "hours"}
                    </div>
                    <p className="text-muted-foreground">per day</p>
                  </div>

                  <div className="px-4">
                    <input
                      type="range"
                      min="0.5"
                      max="8"
                      step="0.5"
                      value={dailyHours}
                      onChange={(e) =>
                        setDailyHours(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>30 min</span>
                      <span>8 hours</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-center">
                      {dailyHours < 1
                        ? "Perfect for busy schedules! Short, focused sessions."
                        : dailyHours <= 2
                        ? "Great balance! Sustainable learning pace."
                        : dailyHours <= 4
                        ? "Intensive learning! Make sure to take breaks."
                        : "Very intensive! Consider splitting into multiple sessions."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center space-x-2"
          >
            <span>{currentStep === totalSteps - 1 ? "Complete" : "Next"}</span>
            {currentStep !== totalSteps - 1 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </motion.div>
  );
};

export default OnboardingWizard;
