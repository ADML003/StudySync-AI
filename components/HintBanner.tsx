"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

interface HintBannerProps {
  wrongAnswerCount: number;
  hints: string[];
  onDismiss: () => void;
  isVisible?: boolean;
}

export default function HintBanner({
  wrongAnswerCount,
  hints,
  onDismiss,
  isVisible = true,
}: HintBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Show banner when user answers wrong twice or more
  const shouldShowBanner = wrongAnswerCount >= 2 && !isDismissed && isVisible;

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsExpanded(false);
    onDismiss();
  };

  const toggleHints = () => {
    setIsExpanded(!isExpanded);
  };

  // Reset when wrong answer count changes
  useEffect(() => {
    if (wrongAnswerCount === 0) {
      setIsDismissed(false);
      setIsExpanded(false);
    }
  }, [wrongAnswerCount]);

  return (
    <AnimatePresence>
      {shouldShowBanner && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg"
        >
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    Having trouble? Don&apos;t worry, we&apos;ve got some hints
                    to help you out!
                  </p>
                  <p className="text-xs text-yellow-100 mt-1">
                    You&apos;ve answered {wrongAnswerCount} questions
                    incorrectly
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={toggleHints}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-white/20 hover:bg-white/30 rounded-md transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isExpanded ? (
                    <>
                      Hide Hints
                      <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show Hints
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </motion.button>

                <button
                  onClick={handleDismiss}
                  className="text-white hover:text-yellow-100 transition-colors duration-200"
                  aria-label="Dismiss hint banner"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Expandable Hints Panel */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Helpful Hints:
                    </h4>

                    <div className="space-y-2">
                      {hints.map((hint, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: index * 0.1,
                            ease: "easeOut",
                          }}
                          className="flex items-start space-x-2"
                        >
                          <div className="flex-shrink-0 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-xs font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-sm text-white leading-relaxed">
                            {hint}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: hints.length * 0.1 + 0.2 }}
                      className="mt-4 p-3 bg-white/10 rounded-lg"
                    >
                      <p className="text-xs text-yellow-100 text-center">
                        💡 Take your time to read each option carefully before
                        selecting your answer
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Example usage component to demonstrate how to integrate with quiz logic
export function HintBannerExample() {
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  const sampleHints = [
    "Read the question carefully and identify key terms or concepts",
    "Eliminate obviously incorrect answers to narrow down your choices",
    "Look for context clues within the question that might guide you to the right answer",
    "Consider what you know about the topic and apply logical reasoning",
    "If unsure, make an educated guess rather than leaving it blank",
  ];

  const handleWrongAnswer = () => {
    setWrongAnswers((prev) => prev + 1);
    setShowBanner(true);
  };

  const handleDismissHint = () => {
    setShowBanner(false);
  };

  const resetQuiz = () => {
    setWrongAnswers(0);
    setShowBanner(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <HintBanner
        wrongAnswerCount={wrongAnswers}
        hints={sampleHints}
        onDismiss={handleDismissHint}
        isVisible={showBanner}
      />

      {/* Demo controls */}
      <div className="pt-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Hint Banner Demo</h2>
          <p className="text-gray-600 mb-4">
            Wrong answers:{" "}
            <span className="font-bold text-red-600">{wrongAnswers}</span>
          </p>
          <div className="space-y-3">
            <button
              onClick={handleWrongAnswer}
              className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Simulate Wrong Answer
            </button>
            <button
              onClick={resetQuiz}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reset Quiz
            </button>
          </div>
          {!showBanner && wrongAnswers >= 2 && (
            <button
              onClick={() => setShowBanner(true)}
              className="w-full mt-3 py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Show Hint Banner Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
