import Head from 'next/head'
import { Clock, Target, TrendingUp, BookOpen } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppShell from '@/components/AppShell'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - AI Study Companion</title>
        <meta name="description" content="Your personalized learning dashboard" />
      </Head>

      <AppShell>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Good morning! 🌅
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="flex space-x-3">
              <Button>Start Today's Quiz</Button>
              <Button variant="outline">Generate New Plan</Button>
              <Button variant="outline">Ask Question</Button>
            </div>
          </div>

          {/* Today's Focus Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Today's Focus
              </h2>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  React Components & State Management
                </h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Estimated: 90 minutes</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-blue-600">67%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: '67%' }}
                  ></div>
                </div>
              </div>

              {/* Adaptive Tip */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Adaptive Tip:</strong> Try building a small project to practice component composition and state lifting. This will solidify your understanding of React patterns.
                </p>
              </div>
            </div>
          </div>

          {/* Learning Rings & Memory Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Learning Rings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Learning Rings
              </h2>
              
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Strength Ring (Outer) */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${85 * 2.83} ${(100 - 85) * 2.83}`}
                      opacity="0.3"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${85 * 2.83} 283`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Practice Ring (Middle) */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${72 * 2.2} ${(100 - 72) * 2.2}`}
                      opacity="0.3"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${72 * 2.2} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Review Ring (Inner) */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="25"
                      stroke="rgb(249, 115, 22)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${58 * 1.57} ${(100 - 58) * 1.57}`}
                      opacity="0.3"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="25"
                      stroke="rgb(249, 115, 22)"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${58 * 1.57} 157`}
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Center Labels */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">85%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Overall</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Strength</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">85%</div>
                </div>
                <div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Practice</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">72%</div>
                </div>
                <div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Review</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">58%</div>
                </div>
              </div>
            </div>

            {/* Memory Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Memory Timeline
              </h2>
              
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {[
                  { topic: 'React', date: 'Sep 28', score: 92, color: 'bg-green-500' },
                  { topic: 'TypeScript', date: 'Sep 27', score: 88, color: 'bg-blue-500' },
                  { topic: 'Next.js', date: 'Sep 26', score: 85, color: 'bg-purple-500' },
                  { topic: 'Tailwind', date: 'Sep 25', score: 90, color: 'bg-cyan-500' },
                  { topic: 'Node.js', date: 'Sep 24', score: 78, color: 'bg-green-600' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 group cursor-pointer"
                    title={`${item.topic} - ${item.date} (Score: ${item.score}%)`}
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-medium text-sm group-hover:scale-110 transition-transform`}>
                      {item.topic.slice(0, 2)}
                    </div>
                    <div className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400">
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Study Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">7 days</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-xs text-green-600 mt-2">+2 from last week</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Topics Mastered</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs text-blue-600 mt-2">+5 this week</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quiz Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">89%</p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
              <p className="text-xs text-purple-600 mt-2">+4% improvement</p>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
