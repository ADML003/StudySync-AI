"use client";

import { Dialog, Transition, Combobox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUpDownIcon, CheckIcon, XMarkIcon } from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (topic: string, difficulty: string) => void;
}

// Sample topics for autocomplete
const topics = [
  "Mathematics",
  "Science",
  "History",
  "Geography",
  "Literature",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Art History",
  "Philosophy",
  "Psychology",
  "Economics",
  "Political Science",
  "Astronomy",
];

const difficulties = [
  { id: "easy", name: "Easy" },
  { id: "medium", name: "Medium" },
  { id: "hard", name: "Hard" },
];

export default function QuizModal({
  isOpen,
  onClose,
  onStartQuiz,
}: QuizModalProps) {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [query, setQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);

  const filteredTopics =
    query === ""
      ? topics
      : topics.filter((topic) =>
          topic
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  const handleStartQuiz = () => {
    if (selectedTopic && selectedDifficulty) {
      onStartQuiz(selectedTopic, selectedDifficulty.id);
      setSelectedTopic("");
      setQuery("");
      setSelectedDifficulty(difficulties[0]);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={onClose}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-black p-6 text-left align-middle shadow-xl transition-all">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                        >
                          Start New Quiz
                        </Dialog.Title>
                        <button
                          onClick={onClose}
                          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          aria-label="Close modal"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        {/* Topic Autocomplete */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Choose Topic
                          </label>
                          <Combobox
                            value={selectedTopic}
                            onChange={setSelectedTopic}
                          >
                            <div className="relative">
                              <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white dark:bg-gray-700 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                                <Combobox.Input
                                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 dark:text-gray-100 bg-transparent focus:ring-0"
                                  displayValue={(topic: string) => topic}
                                  onChange={(event) =>
                                    setQuery(event.target.value)
                                  }
                                  placeholder="Search for a topic..."
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </Combobox.Button>
                              </div>
                              <Transition
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                afterLeave={() => setQuery("")}
                              >
                                <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                  {filteredTopics.length === 0 &&
                                  query !== "" ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                                      Nothing found.
                                    </div>
                                  ) : (
                                    filteredTopics.map((topic) => (
                                      <Combobox.Option
                                        key={topic}
                                        className={({ active }) =>
                                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active
                                              ? "bg-teal-600 text-white"
                                              : "text-gray-900 dark:text-gray-100"
                                          }`
                                        }
                                        value={topic}
                                      >
                                        {({ selected, active }) => (
                                          <>
                                            <span
                                              className={`block truncate ${
                                                selected
                                                  ? "font-medium"
                                                  : "font-normal"
                                              }`}
                                            >
                                              {topic}
                                            </span>
                                            {selected ? (
                                              <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                  active
                                                    ? "text-white"
                                                    : "text-teal-600"
                                                }`}
                                              >
                                                <CheckIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </span>
                                            ) : null}
                                          </>
                                        )}
                                      </Combobox.Option>
                                    ))
                                  )}
                                </Combobox.Options>
                              </Transition>
                            </div>
                          </Combobox>
                        </div>

                        {/* Difficulty Select */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Difficulty Level
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {difficulties.map((difficulty) => (
                              <button
                                key={difficulty.id}
                                onClick={() =>
                                  setSelectedDifficulty(difficulty)
                                }
                                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  selectedDifficulty.id === difficulty.id
                                    ? "bg-teal-600 text-white shadow-md"
                                    : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                                }`}
                              >
                                {difficulty.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Start Quiz Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStartQuiz}
                          disabled={!selectedTopic}
                          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                            selectedTopic
                              ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl"
                              : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Start Quiz
                        </motion.button>
                      </div>
                    </motion.div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </AnimatePresence>
  );
}
