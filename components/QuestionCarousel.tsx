"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  explanation: string;
}

interface QuestionCarouselProps {
  questions: Question[];
  onQuestionAnswer: (
    questionId: string,
    selectedOptionId: string,
    isCorrect: boolean
  ) => void;
  onQuizComplete: (score: number) => void;
}

interface QuestionState {
  selectedOption: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  showExplanation: boolean;
}

export default function QuestionCarousel({
  questions,
  onQuestionAnswer,
  onQuizComplete,
}: QuestionCarouselProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<
    Record<string, QuestionState>
  >({});
  const [swiper, setSwiper] = useState<any>(null);

  useEffect(() => {
    // Initialize question states
    const initialStates: Record<string, QuestionState> = {};
    questions.forEach((question) => {
      initialStates[question.id] = {
        selectedOption: null,
        isAnswered: false,
        isCorrect: null,
        showExplanation: false,
      };
    });
    setQuestionStates(initialStates);
  }, [questions]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentState = questionStates[currentQuestion?.id] || {
    selectedOption: null,
    isAnswered: false,
    isCorrect: null,
    showExplanation: false,
  };

  const handleOptionSelect = (optionId: string) => {
    if (currentState.isAnswered) return;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOption: optionId,
      },
    }));
  };

  const handleSubmitAnswer = () => {
    if (!currentState.selectedOption || currentState.isAnswered) return;

    const selectedOption = currentQuestion.options.find(
      (option) => option.id === currentState.selectedOption
    );
    const isCorrect = selectedOption?.isCorrect || false;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        isAnswered: true,
        isCorrect,
        showExplanation: true,
      },
    }));

    onQuestionAnswer(
      currentQuestion.id,
      currentState.selectedOption,
      isCorrect
    );

    // Auto advance to next question after showing feedback
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        swiper?.slideNext();
      } else {
        // Quiz completed
        const score = Object.values(questionStates).filter(
          (state) => state.isCorrect
        ).length;
        onQuizComplete(score + (isCorrect ? 1 : 0));
      }
    }, 3000);
  };

  const handleSlideChange = (swiper: any) => {
    setCurrentQuestionIndex(swiper.activeIndex);
  };

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        onSwiper={setSwiper}
        onSlideChange={handleSlideChange}
        allowTouchMove={false} // Disable manual swiping
        className="quiz-swiper"
      >
        {questions.map((question, index) => (
          <SwiperSlide key={question.id}>
            <div className="bg-white rounded-xl shadow-lg p-8 min-h-[500px]">
              {/* Question Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Question {index + 1} of {questions.length}
                  </span>
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 ml-4">
                    <div
                      className={`bg-teal-600 h-2 rounded-full transition-all duration-300`}
                      style={{
                        width: `${((index + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {question.text}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {question.options.map((option) => {
                  const isSelected =
                    questionStates[question.id]?.selectedOption === option.id;
                  const isAnswered = questionStates[question.id]?.isAnswered;
                  const isCorrect = option.isCorrect;

                  let optionClass =
                    "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ";

                  if (isAnswered) {
                    if (isCorrect) {
                      optionClass +=
                        "border-green-500 bg-green-50 text-green-900";
                    } else if (isSelected && !isCorrect) {
                      optionClass += "border-red-500 bg-red-50 text-red-900";
                    } else {
                      optionClass += "border-gray-200 bg-gray-50 text-gray-600";
                    }
                  } else {
                    if (isSelected) {
                      optionClass += "border-teal-500 bg-teal-50 text-teal-900";
                    } else {
                      optionClass +=
                        "border-gray-200 hover:border-teal-300 hover:bg-teal-50";
                    }
                  }

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={isAnswered}
                      className={optionClass}
                      whileHover={!isAnswered ? { scale: 1.02 } : {}}
                      whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.text}</span>
                        {isAnswered && (
                          <div className="ml-2">
                            {isCorrect ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : isSelected ? (
                              <XCircle className="h-6 w-6 text-red-600" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Submit Button */}
              {!questionStates[question.id]?.isAnswered && (
                <motion.button
                  onClick={handleSubmitAnswer}
                  disabled={!questionStates[question.id]?.selectedOption}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    questionStates[question.id]?.selectedOption
                      ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  whileHover={
                    questionStates[question.id]?.selectedOption
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    questionStates[question.id]?.selectedOption
                      ? { scale: 0.98 }
                      : {}
                  }
                >
                  Submit Answer
                </motion.button>
              )}

              {/* Feedback Badge */}
              <AnimatePresence>
                {questionStates[question.id]?.isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-6"
                  >
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        questionStates[question.id]?.isCorrect
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {questionStates[question.id]?.isCorrect ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Correct!
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 mr-2" />
                          Incorrect
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Explanation */}
              <AnimatePresence>
                {questionStates[question.id]?.showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Explanation:
                    </h4>
                    <p className="text-sm text-blue-800">
                      {question.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="swiper-button-prev !relative !left-0 !right-auto !top-auto !mt-0 !w-10 !h-10 !bg-white !border !border-gray-300 !rounded-full !text-gray-600 hover:!bg-gray-50 !after:!text-sm disabled:!opacity-50 disabled:!cursor-not-allowed"
          aria-label="Previous question"
        />
        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentQuestionIndex
                  ? "bg-teal-600"
                  : index < currentQuestionIndex
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <button
          className="swiper-button-next !relative !left-0 !right-auto !top-auto !mt-0 !w-10 !h-10 !bg-white !border !border-gray-300 !rounded-full !text-gray-600 hover:!bg-gray-50 !after:!text-sm disabled:!opacity-50 disabled:!cursor-not-allowed"
          aria-label="Next question"
        />
      </div>
    </div>
  );
}
