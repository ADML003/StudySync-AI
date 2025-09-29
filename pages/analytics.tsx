"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Target,
  Award,
  ChevronDown,
  Filter,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  subDays,
  subWeeks,
} from "date-fns";

// Types
interface HeatmapData {
  date: string;
  value: number;
  day: number;
  week: number;
}

interface TopicPerformanceData {
  topic: string;
  score: number;
  attempts: number;
  improvement: number;
}

interface ImprovementTrendData {
  date: string;
  score: number;
  sessionsCompleted: number;
}

interface AnalyticsPageProps {
  className?: string;
}

// Sample data generators
const generateHeatmapData = (): HeatmapData[] => {
  const data: HeatmapData[] = [];
  const today = new Date();

  for (let week = 0; week < 52; week++) {
    for (let day = 0; day < 7; day++) {
      const date = subDays(today, (51 - week) * 7 + (6 - day));
      data.push({
        date: format(date, "yyyy-MM-dd"),
        value: Math.floor(Math.random() * 5), // 0-4 activity level
        day,
        week,
      });
    }
  }

  return data;
};

const generateTopicPerformanceData = (): TopicPerformanceData[] => [
  { topic: "Mathematics", score: 85, attempts: 45, improvement: 12 },
  { topic: "Science", score: 78, attempts: 32, improvement: 8 },
  { topic: "History", score: 92, attempts: 28, improvement: 15 },
  { topic: "Geography", score: 73, attempts: 38, improvement: 5 },
  { topic: "Literature", score: 88, attempts: 25, improvement: 18 },
  { topic: "Programming", score: 91, attempts: 52, improvement: 22 },
  { topic: "Physics", score: 76, attempts: 29, improvement: 9 },
  { topic: "Chemistry", score: 82, attempts: 34, improvement: 14 },
];

const generateImprovementTrendData = (): ImprovementTrendData[] => {
  const data: ImprovementTrendData[] = [];
  const today = new Date();

  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    const baseScore = 60 + (30 - i) * 0.8; // Gradual improvement
    const noise = (Math.random() - 0.5) * 10; // Random variation

    data.push({
      date: format(date, "MMM dd"),
      score: Math.max(0, Math.min(100, Math.round(baseScore + noise))),
      sessionsCompleted: Math.floor(Math.random() * 5) + 1,
    });
  }

  return data;
};

export default function AnalyticsPage({ className = "" }: AnalyticsPageProps) {
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [topicData, setTopicData] = useState<TopicPerformanceData[]>([]);
  const [trendData, setTrendData] = useState<ImprovementTrendData[]>([]);
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("score");

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setHeatmapData(generateHeatmapData());
      setTopicData(generateTopicPerformanceData());
      setTrendData(generateImprovementTrendData());
    }, 500);
  }, []);

  const getHeatmapColor = (value: number) => {
    const colors = ["#f3f4f6", "#d1fae5", "#6ee7b7", "#34d399", "#10b981"];
    return colors[value] || colors[0];
  };

  const HeatmapCalendar = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-teal-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Activity Heatmap
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((level) => {
              const colorClasses = {
                0: "bg-gray-200",
                1: "bg-green-100",
                2: "bg-green-300",
                3: "bg-green-500",
                4: "bg-green-600",
              };
              return (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${
                    colorClasses[level as keyof typeof colorClasses]
                  }`}
                />
              );
            })}
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-53 gap-1 overflow-x-auto">
        {heatmapData.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.001 }}
            className={`w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-teal-400 transition-all ${
              day.value === 0
                ? "bg-gray-200"
                : day.value === 1
                ? "bg-green-100"
                : day.value === 2
                ? "bg-green-300"
                : day.value === 3
                ? "bg-green-500"
                : "bg-green-600"
            }`}
            title={`${day.date}: ${day.value} activities`}
          />
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          Total sessions this year:{" "}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            247
          </span>
        </p>
        <p>
          Current streak:{" "}
          <span className="font-semibold text-teal-600">12 days</span>
        </p>
      </div>
    </div>
  );

  const TopicPerformanceChart = () => (
    <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Target className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Topic Performance
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Select metric to display"
          >
            <option value="score">Score</option>
            <option value="attempts">Attempts</option>
            <option value="improvement">Improvement</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={topicData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="topic"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar dataKey={selectedMetric} fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(
              topicData.reduce((acc, item) => acc + item.score, 0) /
                topicData.length
            )}
            %
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-600">
            {topicData.reduce((acc, item) => acc + item.attempts, 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Attempts
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(
              topicData.reduce((acc, item) => acc + item.improvement, 0) /
                topicData.length
            )}
            %
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Avg Improvement
          </p>
        </div>
      </div>
    </div>
  );

  const ImprovementTrendChart = () => (
    <div className="bg-white dark:bg-black rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Improvement Trend
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            aria-label="Select time range"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={trendData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-green-600">
            +
            {Math.round(
              trendData[trendData.length - 1]?.score - trendData[0]?.score || 0
            )}
            %
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Score Improvement
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">
            {trendData.reduce((acc, item) => acc + item.sessionsCompleted, 0)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sessions Completed
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-black ${className}`}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Learning Analytics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Track your progress, identify strengths, and discover areas for
            improvement
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Score",
              value: "87%",
              change: "+5%",
              color: "text-blue-600",
              bg: "bg-blue-50",
              icon: Award,
            },
            {
              title: "Quizzes Taken",
              value: "234",
              change: "+12",
              color: "text-green-600",
              bg: "bg-green-50",
              icon: Target,
            },
            {
              title: "Study Streak",
              value: "12 days",
              change: "Personal best!",
              color: "text-purple-600",
              bg: "bg-purple-50",
              icon: Calendar,
            },
            {
              title: "Topics Mastered",
              value: "8/12",
              change: "+2 this week",
              color: "text-orange-600",
              bg: "bg-orange-50",
              icon: TrendingUp,
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              className="bg-white dark:bg-black rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <p className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {metric.change}
                  </p>
                </div>
                <div className={`${metric.bg} p-3 rounded-lg`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* Heatmap Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <HeatmapCalendar />
          </motion.div>

          {/* Topic Performance and Improvement Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <TopicPerformanceChart />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ImprovementTrendChart />
            </motion.div>
          </div>
        </div>

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 bg-white dark:bg-black rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Strongest Subject
              </p>
              <p className="text-blue-900 dark:text-blue-100">
                History (92% average score)
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 p-4 rounded">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                Needs Improvement
              </p>
              <p className="text-orange-900 dark:text-orange-100">
                Geography (73% average score)
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 p-4 rounded">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Best Study Time
              </p>
              <p className="text-green-900 dark:text-green-100">
                Evenings (6-8 PM)
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
