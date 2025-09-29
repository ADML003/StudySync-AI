import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import {
  Send,
  Bot,
  User,
  Loader,
  Sparkles,
  BookOpen,
  Brain,
  Lightbulb,
  MessageSquare,
  ChevronDown,
  Mic,
  Paperclip,
  Star,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  model?: string;
  isTyping?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama3.1-8b");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const availableModels = [
    {
      id: "llama3.1-8b",
      name: "Llama 3.1 8B",
      description: "Fast and efficient for quick answers",
      icon: "⚡",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "llama3.1-70b",
      name: "Llama 3.1 70B",
      description: "Advanced reasoning and detailed explanations",
      icon: "🧠",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const suggestions = [
    {
      text: "Explain quantum mechanics in simple terms",
      icon: <Brain className="h-4 w-4" />,
      category: "Physics",
    },
    {
      text: "Help me solve calculus problems",
      icon: <BookOpen className="h-4 w-4" />,
      category: "Math",
    },
    {
      text: "Create a study plan for biology",
      icon: <Lightbulb className="h-4 w-4" />,
      category: "Study",
    },
    {
      text: "Explain photosynthesis step by step",
      icon: <Sparkles className="h-4 w-4" />,
      category: "Biology",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputMessage]);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: Message = {
      id: `typing-${Date.now()}`,
      content: "",
      role: "assistant",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          context: "StudySync AI - Full screen tutor interface",
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();

      // Remove typing indicator and add actual response
      setMessages((prev) =>
        prev
          .filter((msg) => !msg.isTyping)
          .concat([
            {
              id: (Date.now() + 1).toString(),
              content: data.response,
              role: "assistant",
              timestamp: new Date(),
              model: data.model_used,
            },
          ])
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev
          .filter((msg) => !msg.isTyping)
          .concat([
            {
              id: (Date.now() + 1).toString(),
              content:
                "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
              role: "assistant",
              timestamp: new Date(),
            },
          ])
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const selectedModelData = availableModels.find((m) => m.id === selectedModel);

  return (
    <>
      <Head>
        <title>AI Chat - StudySync AI</title>
        <meta
          name="description"
          content="Chat with your AI tutor for personalized learning"
        />
      </Head>

      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"
        >
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Back to Home"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      StudySync AI Tutor
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your personal learning assistant
                    </p>
                  </div>
                </div>
              </div>

              {/* Model Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r ${selectedModelData?.color} text-white shadow-lg hover:shadow-xl transition-all duration-200`}
                >
                  <span className="text-lg">{selectedModelData?.icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {selectedModelData?.name}
                    </div>
                    <div className="text-xs opacity-90">
                      {selectedModelData?.description}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {showModelPicker && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
                    >
                      <div className="p-2">
                        {availableModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model.id);
                              setShowModelPicker(false);
                            }}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                              selectedModel === model.id
                                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{model.icon}</span>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {model.name}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {model.description}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {messages.length === 0 ? (
              // Welcome Screen
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 py-12"
              >
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome to your AI Tutor!
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    I'm here to help you learn, understand complex topics, and
                    achieve your academic goals. Ask me anything or choose from
                    the suggestions below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-200 hover:shadow-lg text-left"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900 dark:to-blue-900 rounded-lg flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                          {suggestion.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {suggestion.text}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {suggestion.category}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              // Messages
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start space-x-4 ${
                    message.role === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    {message.role === "assistant" ? (
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-3xl ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                      } shadow-lg`}
                    >
                      {message.isTyping ? (
                        <div className="flex items-center space-x-2">
                          <Loader className="h-4 w-4 animate-spin text-teal-600" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Thinking...
                          </span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      )}
                    </div>
                    {message.model && !message.isTyping && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Powered by {message.model}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"
          >
            <div className="px-6 py-4">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about your studies..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none shadow-lg placeholder-gray-500 dark:placeholder-gray-400 min-h-[52px] max-h-[120px]"
                    rows={1}
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                    <button
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Attach file"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Voice input"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm transform hover:scale-105 disabled:scale-100"
                >
                  {isLoading ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
