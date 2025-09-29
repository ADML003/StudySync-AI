import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, List, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StudyTask {
  id: string;
  title: string;
  duration: number; // in minutes
  completed: boolean;
  priority: "low" | "medium" | "high";
  type: "study" | "quiz" | "review" | "practice";
}

export interface StudyDay {
  date: string;
  tasks: StudyTask[];
  totalMinutes: number;
  completedMinutes: number;
}

interface StudyPlanProps {
  studyData: StudyDay[];
  onTaskToggle: (date: string, taskId: string) => void;
  className?: string;
}

const StudyPlan: React.FC<StudyPlanProps> = ({
  studyData,
  onTaskToggle,
  className,
}) => {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const getDayIntensity = (day: StudyDay) => {
    const intensity = day.totalMinutes / 180; // Normalize to 3 hours max
    return Math.min(intensity, 1);
  };

  const getDayColor = (day: StudyDay) => {
    const intensity = getDayIntensity(day);
    const completion =
      day.totalMinutes > 0 ? day.completedMinutes / day.totalMinutes : 0;

    if (day.totalMinutes === 0) return "bg-gray-50";

    if (completion >= 0.8) {
      return intensity > 0.7
        ? "bg-green-500"
        : intensity > 0.4
        ? "bg-green-400"
        : "bg-green-300";
    } else if (completion >= 0.5) {
      return intensity > 0.7
        ? "bg-yellow-500"
        : intensity > 0.4
        ? "bg-yellow-400"
        : "bg-yellow-300";
    } else {
      return intensity > 0.7
        ? "bg-red-500"
        : intensity > 0.4
        ? "bg-red-400"
        : "bg-red-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "study":
        return "📚";
      case "quiz":
        return "🧠";
      case "review":
        return "📝";
      case "practice":
        return "💪";
      default:
        return "📖";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-gray-500";
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Generate calendar weeks
  const generateCalendarWeeks = () => {
    if (studyData.length === 0) return [];

    const weeks = [];
    let currentWeek = [];

    // Get the first day of the month
    const firstDate = new Date(studyData[0].date);
    const firstDayOfMonth = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      1
    );
    const startOfWeek = new Date(firstDayOfMonth);
    startOfWeek.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    for (let i = 0; i < 42; i++) {
      // 6 weeks max
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      const dateString = currentDate.toISOString().split("T")[0];
      const dayData = studyData.find((day) => day.date === dateString);

      currentWeek.push({
        date: dateString,
        displayDate: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === firstDate.getMonth(),
        data: dayData,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeks.slice(0, Math.ceil(studyData.length / 7) + 1);
  };

  const calendarWeeks = generateCalendarWeeks();

  return (
    <div className={cn("w-full", className)}>
      {/* Header with Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Study Plan</h3>
          <p className="text-sm text-muted-foreground">
            {viewMode === "calendar"
              ? "Calendar view of your study schedule"
              : "List of daily tasks"}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
              viewMode === "calendar"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
              viewMode === "list"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* Animated View Container */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* Calendar Grid */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-3 text-center text-sm font-medium text-gray-600"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Weeks */}
                {calendarWeeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="grid grid-cols-7 border-b border-gray-200 last:border-b-0"
                  >
                    {week.map((day, dayIndex) => (
                      <motion.div
                        key={`${weekIndex}-${dayIndex}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: (weekIndex * 7 + dayIndex) * 0.02,
                        }}
                        className="relative p-2 h-24 border-r border-gray-200 last:border-r-0"
                      >
                        <div
                          className={cn(
                            "w-full h-full rounded-md flex flex-col items-center justify-center transition-all",
                            day.data ? getDayColor(day.data) : "bg-gray-50",
                            !day.isCurrentMonth && "opacity-40",
                            day.data && "cursor-pointer hover:scale-105"
                          )}
                        >
                          <span
                            className={cn(
                              "text-sm font-medium",
                              day.data && getDayIntensity(day.data) > 0.5
                                ? "text-white"
                                : "text-gray-700"
                            )}
                          >
                            {day.displayDate}
                          </span>
                          {day.data && (
                            <span
                              className={cn(
                                "text-xs mt-1",
                                getDayIntensity(day.data) > 0.5
                                  ? "text-white/80"
                                  : "text-gray-600"
                              )}
                            >
                              {formatDuration(day.data.totalMinutes)}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Calendar Legend */}
              <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded"></div>
                  <span>Behind Schedule</span>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {studyData.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayIndex * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  {/* Day Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        {formatFullDate(day.date)}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(day.totalMinutes)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{formatDuration(day.completedMinutes)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="p-4 space-y-3">
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "flex items-center space-x-3 p-3 rounded-lg border-l-4 transition-all cursor-pointer",
                          getPriorityColor(task.priority),
                          task.completed
                            ? "bg-green-50 opacity-75"
                            : "bg-gray-50 hover:bg-gray-100"
                        )}
                        onClick={() => onTaskToggle(day.date, task.id)}
                      >
                        <div className="text-lg">{getTaskIcon(task.type)}</div>
                        <div className="flex-1">
                          <h5
                            className={cn(
                              "font-medium",
                              task.completed && "line-through text-gray-500"
                            )}
                          >
                            {task.title}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {formatDuration(task.duration)} • {task.type}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudyPlan;
