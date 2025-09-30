import Head from 'next/head'
import { TrendingUp, Target, Clock, Brain, Award, BookOpen } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppShell from '@/components/AppShell'

export default function Analytics() {
  const learningData = [
    { week: 'Week 1', hours: 12, topics: 3, accuracy: 78 },
    { week: 'Week 2', hours: 15, topics: 4, accuracy: 82 },
    { week: 'Week 3', hours: 18, topics: 5, accuracy: 85 },
    { week: 'Week 4', hours: 22, topics: 6, accuracy: 89 },
  ]

  const topicProgress = [
    { topic: 'React', mastery: 92, timeSpent: 45, lastStudied: '2 days ago' },
    { topic: 'TypeScript', mastery: 88, timeSpent: 38, lastStudied: '1 day ago' },
    { topic: 'Next.js', mastery: 85, timeSpent: 42, lastStudied: '3 days ago' },
    { topic: 'Node.js', mastery: 78, timeSpent: 35, lastStudied: '5 days ago' },
    { topic: 'Tailwind CSS', mastery: 90, timeSpent: 28, lastStudied: '1 day ago' },
  ]

  const achievements = [
    { title: '7-Day Streak', description: 'Studied for 7 consecutive days', date: 'Sep 28', icon: '🔥' },
    { title: 'Quiz Master', description: 'Scored 90%+ on 5 quizzes', date: 'Sep 26', icon: '🏆' },
    { title: 'Fast Learner', description: 'Completed 5 topics in one week', date: 'Sep 24', icon: '⚡' },
    { title: 'Deep Dive', description: 'Spent 3+ hours on React fundamentals', date: 'Sep 22', icon: '📚' },
  ]

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/20'
    if (mastery >= 80) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    if (mastery >= 70) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
    return 'text-red-600 bg-red-100 dark:bg-red-900/20'
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Analytics - AI Study Companion</title>
        <meta name="description" content="Track your learning progress and insights" />
      </Head>

      <AppShell>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Learning Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Insights into your learning journey and progress
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">67h</p>
                  <p className="text-xs text-green-600 mt-1">+5h this week</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Topics Mastered</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                  <p className="text-xs text-green-600 mt-1">+3 this week</p>
                </div>
                <BookOpen className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">87%</p>
                  <p className="text-xs text-green-600 mt-1">+4% improvement</p>
                </div>
                <Target className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Learning Velocity</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">4.2</p>
                  <p className="text-xs text-green-600 mt-1">topics/week</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Learning Progress
            </h2>
            
            <div className="space-y-4">
              {learningData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white w-16">
                      {data.week}
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{data.hours}h</span> studied
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{data.topics}</span> topics
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">{data.accuracy}%</span> accuracy
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(data.hours / 25) * 100}%` }}
                      ></div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Mastery & Recent Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Topic Mastery */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Topic Mastery
              </h2>
              
              <div className="space-y-4">
                {topicProgress.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{topic.topic}</span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {topic.timeSpent}h • Last studied {topic.lastStudied}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMasteryColor(topic.mastery)}`}>
                        {topic.mastery}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${topic.mastery}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Achievements
              </h2>
              
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {achievement.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              AI Learning Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Brain className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Optimal Study Time</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You perform best between 9-11 AM with 87% average accuracy during this window.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Target className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Strong Areas</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Frontend technologies (React, CSS) show consistent high performance. Consider advanced topics.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Improvement Areas</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Backend concepts need more practice. Recommend 30 minutes daily on Node.js fundamentals.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Learning Velocity</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your learning speed has increased 23% this month. Great momentum!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </ProtectedRoute>
  )
}
