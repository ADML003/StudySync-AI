"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import FloatingChatWidget from "@/components/FloatingChatWidget";
import ConceptOverlay from "@/components/ConceptOverlay";
import {
  Eye,
  MessageSquare,
  BarChart3,
  BookOpen,
  Code,
  Lightbulb,
} from "lucide-react";

// Sample concept data
const sampleConcepts = [
  {
    title: "React Hooks Fundamentals",
    category: "React Development",
    explanation: `React Hooks are functions that let you "hook into" React state and lifecycle features from function components.

## What are Hooks?

Hooks were introduced in React 16.8 as a way to use state and other React features without writing class components. They provide a more direct API to the React concepts you already know.

### Key Benefits:
- Simpler component logic
- Better code reuse between components
- Easier testing and debugging
- No confusion around \`this\` binding

### Basic Rules:
1. Only call Hooks at the top level of your function
2. Only call Hooks from React function components or custom Hooks
3. Hook names should start with \`use\`

## Common Hooks

### useState
The most commonly used Hook for managing component state.

### useEffect
Lets you perform side effects in function components (data fetching, subscriptions, manually changing the DOM).

### useContext
Accepts a context object and returns the current context value for that context.`,
    codeBlocks: [
      {
        language: "javascript",
        filename: "useState-example.js",
        code: `import React, { useState } from 'react';

function Counter() {
  // Declare a new state variable called "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default Counter;`,
      },
      {
        language: "javascript",
        filename: "useEffect-example.js",
        code: `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Effect runs after every render
    fetchUser(userId)
      .then(userData => {
        setUser(userData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        setLoading(false);
      });
  }, [userId]); // Dependencies array

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
    </div>
  );
}`,
      },
    ],
  },
  {
    title: "JavaScript Async/Await",
    category: "JavaScript",
    explanation: `Async/await is a syntax feature in JavaScript that makes it easier to work with asynchronous code and Promises.

## Understanding Promises

Before async/await, we used Promises and \`.then()\` chains to handle asynchronous operations. While powerful, this could lead to complex nested code.

## Async/Await Syntax

The \`async\` keyword is used to declare an asynchronous function, while \`await\` is used to pause the execution until a Promise resolves.

### Key Features:
- Makes asynchronous code look synchronous
- Better error handling with try/catch
- Improved readability and maintainability
- Still uses Promises under the hood

### Error Handling
Use try/catch blocks to handle errors in async functions, providing a cleaner alternative to \`.catch()\`.`,
    codeBlocks: [
      {
        language: "javascript",
        filename: "async-await-example.js",
        code: `// Traditional Promise approach
function fetchUserData(userId) {
  return fetch(\`/api/users/\${userId}\`)
    .then(response => response.json())
    .then(user => {
      return fetch(\`/api/posts/\${user.id}\`);
    })
    .then(response => response.json())
    .catch(error => {
      console.error('Error:', error);
    });
}

// Async/await approach
async function fetchUserData(userId) {
  try {
    const userResponse = await fetch(\`/api/users/\${userId}\`);
    const user = await userResponse.json();
    
    const postsResponse = await fetch(\`/api/posts/\${user.id}\`);
    const posts = await postsResponse.json();
    
    return { user, posts };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}`,
      },
    ],
  },
  {
    title: "CSS Grid Layout",
    category: "CSS",
    explanation: `CSS Grid Layout is a two-dimensional layout system for the web that allows you to create complex responsive layouts with ease.

## Grid vs Flexbox

While Flexbox is designed for one-dimensional layouts (either rows or columns), CSS Grid is designed for two-dimensional layouts (rows and columns simultaneously).

### When to Use Grid:
- Complex two-dimensional layouts
- When you need precise control over both rows and columns
- Creating responsive layouts without media queries
- Aligning items in both axes simultaneously

### Basic Grid Concepts:
- **Grid Container**: The parent element with \`display: grid\`
- **Grid Items**: The direct children of the grid container
- **Grid Lines**: The lines that make up the structure of the grid
- **Grid Tracks**: The space between two grid lines (rows or columns)
- **Grid Areas**: Rectangular areas made up of one or more grid cells

## Grid Properties

### Container Properties:
- \`grid-template-columns\` and \`grid-template-rows\`
- \`grid-gap\` (or \`gap\`)
- \`justify-items\` and \`align-items\`

### Item Properties:
- \`grid-column\` and \`grid-row\`
- \`justify-self\` and \`align-self\``,
    codeBlocks: [
      {
        language: "css",
        filename: "grid-layout.css",
        code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
  padding: 20px;
}

.grid-item {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}

/* Responsive grid */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}

/* Advanced grid areas */
.layout-grid {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }`,
      },
      {
        language: "html",
        filename: "grid-example.html",
        code: `<div class="layout-grid">
  <header class="header">
    <h1>Website Header</h1>
  </header>
  
  <aside class="sidebar">
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </aside>
  
  <main class="main">
    <h2>Main Content</h2>
    <p>This is the main content area.</p>
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 My Website</p>
  </footer>
</div>`,
      },
    ],
  },
];

export default function ComponentDemoPage() {
  const [selectedConcept, setSelectedConcept] = useState<
    (typeof sampleConcepts)[0] | null
  >(null);

  const handleSendMessage = async (message: string): Promise<string> => {
    // Simulate AI response delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Generate contextual responses
    if (message.toLowerCase().includes("analytics")) {
      return "I see you're interested in analytics! The analytics page shows your learning progress with interactive charts including a heatmap calendar, topic performance bars, and improvement trends. You can track your study habits and identify areas for improvement. Would you like me to explain any specific chart or metric?";
    }

    if (
      message.toLowerCase().includes("concept") ||
      message.toLowerCase().includes("overlay")
    ) {
      return "The concept overlay is perfect for deep-dive learning! It shows detailed explanations with formatted text, code examples, and interactive features. You can copy code snippets directly and the content is fully accessible. Try clicking on one of the concept cards to see it in action!";
    }

    if (message.toLowerCase().includes("quiz")) {
      return "Great question about quizzes! The quiz system includes topic selection, difficulty levels, interactive questions with instant feedback, and helpful hints when you need them. The system tracks your progress and provides detailed explanations for each answer.";
    }

    // Default responses
    const responses = [
      "That's a great question! I can help you understand any of these components better. The floating chat widget (that's me!), concept overlay, and analytics page all work together to create a comprehensive learning experience.",
      "I'd be happy to help! You can explore the interactive demos on this page - try opening a concept overlay or checking out the analytics features. What would you like to learn more about?",
      "Excellent! This demo showcases three key components: persistent chat support, detailed concept explanations, and comprehensive analytics. Each one is designed to enhance your learning experience in different ways.",
      "I'm here to assist with any questions about these components or how they work together. The system is built with React, TypeScript, and modern UI libraries to provide a smooth, accessible experience.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Interactive Component Demo
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              Experience three powerful learning components: a floating chat
              widget for instant help, detailed concept overlays for deep
              learning, and comprehensive analytics for tracking progress.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Component Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Floating Chat Widget
            </h3>
            <p className="text-gray-600 mb-4">
              Persistent AI assistant available anywhere on the page. Features
              expandable chat panel, streaming responses, and contextual help.
            </p>
            <div className="text-sm text-gray-500">
              ✓ Minimizable interface
              <br />
              ✓ Streaming AI responses
              <br />
              ✓ Message history
              <br />✓ Accessible design
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Concept Overlay
            </h3>
            <p className="text-gray-600 mb-4">
              Full-screen learning overlay with rich content, syntax-highlighted
              code blocks, and copy functionality.
            </p>
            <div className="text-sm text-gray-500">
              ✓ Rich text formatting
              <br />
              ✓ Code syntax highlighting
              <br />
              ✓ Copy-to-clipboard
              <br />✓ Smooth transitions
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600 mb-4">
              Comprehensive learning analytics with heatmap calendar,
              performance charts, and improvement trends.
            </p>
            <div className="text-sm text-gray-500">
              ✓ Activity heatmap
              <br />
              ✓ Topic performance
              <br />
              ✓ Improvement trends
              <br />✓ Key insights
            </div>
          </div>
        </motion.div>

        {/* Interactive Demos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Try the Components
          </h2>

          {/* Concept Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sampleConcepts.map((concept, index) => (
              <motion.div
                key={concept.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedConcept(concept)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                      {concept.category === "React Development" && (
                        <Code className="w-5 h-5 text-purple-600" />
                      )}
                      {concept.category === "JavaScript" && (
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      )}
                      {concept.category === "CSS" && (
                        <Lightbulb className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {concept.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {concept.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {concept.explanation.split("\n")[0].substring(0, 120)}...
                  </p>
                  <div className="flex items-center text-teal-600 text-sm font-medium">
                    <Eye className="w-4 h-4 mr-2" />
                    View Concept
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => window.open("/analytics", "_blank")}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-colors"
              >
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">
                    View Analytics Dashboard
                  </p>
                  <p className="text-sm text-gray-600">
                    See the full analytics page with interactive charts
                  </p>
                </div>
              </button>

              <button
                onClick={() => window.open("/quiz-demo", "_blank")}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors"
              >
                <BookOpen className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Try Quiz System</p>
                  <p className="text-sm text-gray-600">
                    Experience the complete quiz workflow
                  </p>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Implementation Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Implementation Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Technologies Used
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• React 18 with TypeScript</li>
                <li>• Framer Motion for animations</li>
                <li>• HeadlessUI for accessibility</li>
                <li>• Recharts for data visualization</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Lucide React for icons</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fully accessible components</li>
                <li>• Responsive design</li>
                <li>• Smooth animations</li>
                <li>• TypeScript for type safety</li>
                <li>• Modular component architecture</li>
                <li>• Copy-to-clipboard functionality</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Chat Widget */}
      <FloatingChatWidget onSendMessage={handleSendMessage} />

      {/* Concept Overlay */}
      <ConceptOverlay
        isOpen={selectedConcept !== null}
        onClose={() => setSelectedConcept(null)}
        title={selectedConcept?.title || ""}
        explanation={selectedConcept?.explanation || ""}
        codeBlocks={selectedConcept?.codeBlocks || []}
        category={selectedConcept?.category}
      />
    </div>
  );
}
