import Head from 'next/head'
import { useState } from 'react'
import { Calendar, List, Plus, MoreVertical, ArrowUp, ArrowDown } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppShell from '@/components/AppShell'
import { Button } from '@/components/ui/button'

export default function StudyPlan() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [adjustmentValue, setAdjustmentValue] = useState(100)

  const studyItems = [
    {
      id: 1,
      title: 'React Fundamentals',
      description: 'Learn components, props, and state management',
      date: '2024-01-15',
      duration: 90,
      completed: true,
      priority: 'high'
    },
    {
      id: 2,
      title: 'TypeScript Basics',
      description: 'Type annotations, interfaces, and generics',
      date: '2024-01-16',
      duration: 75,
      completed: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Next.js Routing',
      description: 'Pages, dynamic routes, and API routes',
      date: '2024-01-17',
      duration: 60,
      completed: false,
      priority: 'high'
    },
    {
      id: 4,
      title: 'CSS Grid & Flexbox',
      description: 'Modern layout techniques',
      date: '2024-01-18',
      duration: 45,
      completed: false,
      priority: 'low'
    }
  ]

  const generateCalendar = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayItems = studyItems.filter(item => item.date === dateStr)
      days.push({ day, items: dayItems })
    }

    return days
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Study Plan - AI Study Companion</title>
        <meta name="description" content="Your personalized study schedule" />
      </Head>

      <AppShell>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Study Plan
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Organize and track your learning schedule
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Topic
              </Button>
              <Button variant="outline">Generate New Plan</Button>
            </div>
          </div>

          {/* View Toggle & Plan Adjustment */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </button>
            </div>

            {/* Plan Adjustment Slider */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Plan Intensity
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setAdjustmentValue(Math.max(50, adjustmentValue - 10))}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <div className="w-32">
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={adjustmentValue}
                    onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <button
                  onClick={() => setAdjustmentValue(Math.min(150, adjustmentValue + 10))}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {adjustmentValue}%
              </span>
            </div>
          </div>

          {/* Calendar View */}
          {viewMode === 'calendar' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-3 text-center font-medium text-gray-500 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendar().map((day, index) => (
                    <div
                      key={index}
                      className="min-h-24 p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750"
                    >
                      {day && (
                        <>
                          <div className="font-medium text-gray-900 dark:text-white mb-1">
                            {day.day}
                          </div>
                          <div className="space-y-1">
                            {day.items.map(item => (
                              <div
                                key={item.id}
                                className={`text-xs p-1 rounded text-white ${getPriorityColor(item.priority)} ${
                                  item.completed ? 'opacity-50 line-through' : ''
                                }`}
                              >
                                {item.title}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {studyItems.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(item.priority)}`}></div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-gray-900 dark:text-white ${
                          item.completed ? 'line-through opacity-50' : ''
                        }`}>
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                          <span>⏱️ {item.duration} minutes</span>
                          <span className="capitalize">📊 {item.priority} priority</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Plan Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Plan Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{studyItems.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Topics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {studyItems.filter(item => item.completed).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {studyItems.reduce((total, item) => total + item.duration, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((studyItems.filter(item => item.completed).length / studyItems.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
