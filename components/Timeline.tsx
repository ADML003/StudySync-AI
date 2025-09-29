import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Trophy,
  Target,
  CheckCircle,
  Clock,
  Star,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  date: string;
  topic: string;
  type: "study" | "quiz" | "achievement" | "milestone";
  score?: number;
  completed: boolean;
  icon?: React.ReactNode;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const getEventIcon = (event: TimelineEvent) => {
  if (event.icon) return event.icon;

  switch (event.type) {
    case "study":
      return <BookOpen className="h-4 w-4" />;
    case "quiz":
      return <Brain className="h-4 w-4" />;
    case "achievement":
      return <Trophy className="h-4 w-4" />;
    case "milestone":
      return <Target className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getEventColor = (event: TimelineEvent) => {
  if (!event.completed) return "bg-gray-100 text-gray-400 border-gray-200";

  switch (event.type) {
    case "study":
      return "bg-blue-100 text-blue-600 border-blue-200 hover:bg-blue-200";
    case "quiz":
      return event.score && event.score >= 80
        ? "bg-green-100 text-green-600 border-green-200 hover:bg-green-200"
        : "bg-yellow-100 text-yellow-600 border-yellow-200 hover:bg-yellow-200";
    case "achievement":
      return "bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200";
    case "milestone":
      return "bg-indigo-100 text-indigo-600 border-indigo-200 hover:bg-indigo-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
};

const getScoreDisplay = (score?: number) => {
  if (score === undefined) return "";
  return `${score}%`;
};

const getScoreColor = (score?: number) => {
  if (score === undefined) return "";
  if (score >= 90) return "text-green-600";
  if (score >= 80) return "text-blue-600";
  if (score >= 70) return "text-yellow-600";
  return "text-red-600";
};

const Timeline: React.FC<TimelineProps> = ({ events, className }) => {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  return (
    <div className={cn("w-full", className)}>
      {/* Timeline Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Learning Timeline</h3>
        <p className="text-sm text-muted-foreground">
          Track your learning journey and progress over time
        </p>
      </div>

      {/* Scrollable Timeline */}
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex-shrink-0">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
                className={cn(
                  "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  getEventColor(event),
                  event.completed && "shadow-sm"
                )}
              >
                {event.completed ? (
                  getEventIcon(event)
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </motion.button>

              {/* Custom Tooltip */}
              {hoveredEvent === event.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-10 w-64 p-3 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 left-1/2 transform -translate-x-1/2"
                >
                  <div className="space-y-2">
                    {/* Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(event.date)}
                      </span>
                      {event.completed && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>

                    {/* Topic */}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {event.topic}
                      </h4>
                      <p className="text-sm text-gray-500 capitalize">
                        {event.type}
                      </p>
                    </div>

                    {/* Quiz Score */}
                    {event.score !== undefined && (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Score:</span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            getScoreColor(event.score)
                          )}
                        >
                          {getScoreDisplay(event.score)}
                          {event.score >= 90 && (
                            <Star className="inline h-3 w-3 ml-1" />
                          )}
                        </span>
                      </div>
                    )}

                    {/* Status */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          event.completed ? "text-green-600" : "text-gray-500"
                        )}
                      >
                        {event.completed ? "Completed" : "Upcoming"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Date Label */}
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Line */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-gray-200 via-blue-200 to-gray-200 -z-10" />
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200" />
          <span className="text-gray-600">Study Session</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-200" />
          <span className="text-gray-600">Quiz (Good Score)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-200" />
          <span className="text-gray-600">Achievement</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-200" />
          <span className="text-gray-600">Milestone</span>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Timeline;
