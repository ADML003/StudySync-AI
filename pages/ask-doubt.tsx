import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Paperclip, Bot, User, Sparkles } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppShell from '@/components/AppShell'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  typing?: boolean
}

export default function AskDoubt() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI Study Companion. Ask me anything about programming, web development, or any topic you're learning. I'm here to help! 🚀",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const quickQuestions = [
    "Explain React hooks",
    "What is TypeScript?",
    "How does async/await work?",
    "CSS Grid vs Flexbox",
    "What is Next.js?",
    "JavaScript closures"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Simple response simulation based on keywords
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('react')) {
      return "React is a JavaScript library for building user interfaces. It uses a component-based architecture where you can create reusable UI components. Key concepts include:\n\n• **Components**: Reusable pieces of UI\n• **Props**: Data passed to components\n• **State**: Internal component data\n• **Hooks**: Functions that let you use state and lifecycle features\n\nWould you like me to explain any of these concepts in more detail?"
    }
    
    if (lowerMessage.includes('typescript')) {
      return "TypeScript is a superset of JavaScript that adds static type definitions. Benefits include:\n\n• **Type Safety**: Catch errors at compile time\n• **Better IDE Support**: Autocomplete and refactoring\n• **Self-documenting Code**: Types serve as documentation\n• **Easier Refactoring**: Confidence when changing code\n\nExample:\n```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = {\n  name: 'Alice',\n  age: 30\n};\n```"
    }
    
    if (lowerMessage.includes('async') || lowerMessage.includes('await')) {
      return "Async/await is a way to handle asynchronous operations in JavaScript:\n\n• **async**: Marks a function as asynchronous\n• **await**: Pauses execution until Promise resolves\n• **Benefits**: Cleaner than callbacks or .then() chains\n\nExample:\n```javascript\nasync function fetchUser(id) {\n  try {\n    const response = await fetch(`/api/users/${id}`);\n    const user = await response.json();\n    return user;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n```"
    }
    
    return `Great question about "${userMessage}"! I understand you're looking for help with this topic. While I'd love to provide a comprehensive answer, I'm currently in demo mode. In a real implementation, I would:\n\n• Analyze your question using advanced NLP\n• Provide detailed explanations with examples\n• Suggest related topics to explore\n• Offer practice exercises\n\nIs there a specific aspect of this topic you'd like to focus on?`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      typing: true
    }
    setMessages(prev => [...prev, typingMessage])

    try {
      const response = await simulateAIResponse(inputValue)
      
      // Remove typing indicator and add real response
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== 'typing'))
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg mt-2 mb-2 overflow-x-auto"><code>$2</code></pre>')
      .replace(/•\s(.*?)(?=\n|$)/g, '<li class="ml-4">$1</li>')
      .replace(/(<li.*<\/li>)/g, '<ul class="list-disc ml-4 space-y-1">$1</ul>')
      .replace(/\n/g, '<br>')
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Ask Doubt - AI Study Companion</title>
        <meta name="description" content="Get instant help with your learning questions" />
      </Head>

      <AppShell>
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ask Your Doubt
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Get instant help from your AI study companion
            </p>
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Quick Questions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="p-3 text-left bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-purple-600 text-white'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className={`rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}>
                    {message.typing ? (
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
                      </div>
                    ) : (
                      <div 
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                    )}
                    
                    {!message.typing && (
                      <div className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your doubt here... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2"
                  disabled={isLoading}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2"
                  disabled={isLoading}
                >
                  <Mic className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2"
                >
                  {isLoading ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
