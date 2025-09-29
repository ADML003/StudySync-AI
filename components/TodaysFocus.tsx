import React from "react";
import { Clock, Target, TrendingUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodaysFocusProps {
  topic: string;
  timeEstimate: number; // in minutes
  progress: number; // 0-100 percentage
  adaptiveTip?: string;
  className?: string;
}

const getProgressColor = (progress: number): string => {
  if (progress < 30) return "bg-red-500";
  if (progress < 60) return "bg-yellow-500";
  if (progress < 85) return "bg-blue-500";
  return "bg-green-500";
};

const getProgressMessage = (progress: number): string => {
  if (progress < 30) return "Just getting started";
  if (progress < 60) return "Making progress";
  if (progress < 85) return "Almost there";
  return "Excellent work";
};

const getDefaultTip = (topic: string, progress: number): string => {
  const tips = {
    low: [
      "Start with small, manageable chunks to build momentum.",
      "Focus on understanding the fundamentals first.",
      "Don't worry about speed - consistency is key.",
    ],
    medium: [
      "You're on the right track! Keep practicing regularly.",
      "Try explaining the concept to someone else to deepen understanding.",
      "Consider working on a small project to apply what you've learned.",
    ],
    high: [
      "Great progress! Challenge yourself with advanced problems.",
      "Teaching others is a great way to master the topic.",
      "Consider exploring related advanced topics.",
    ],
    complete: [
      "Outstanding! You've mastered this topic.",
      "Ready to tackle more challenging material.",
      "Consider mentoring others or contributing to projects.",
    ],
  };

  let category: keyof typeof tips;
  if (progress < 30) category = "low";
  else if (progress < 60) category = "medium";
  else if (progress < 90) category = "high";
  else category = "complete";

  const categoryTips = tips[category];
  return categoryTips[Math.floor(Math.random() * categoryTips.length)];
};

const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
};

const TodaysFocus: React.FC<TodaysFocusProps> = ({
  topic,
  timeEstimate,
  progress,
  adaptiveTip,
  className,
}) => {
  const progressColor = getProgressColor(progress);
  const progressMessage = getProgressMessage(progress);
  const tip = adaptiveTip || getDefaultTip(topic, progress);

  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Today's Focus</span>
          </h3>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeEstimate)}</span>
          </div>
        </div>

        {/* Topic */}
        <div className="mb-4">
          <h4 className="text-xl font-medium text-foreground mb-1">{topic}</h4>
          <p className="text-sm text-muted-foreground">{progressMessage}</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out rounded-full",
                progressColor
              )}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Adaptive Tip Section */}
      <div className="px-6 pb-6">
        <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-sm mb-1">Smart Tip</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-3 w-3" />
            <span>
              {progress < 100
                ? `${100 - progress}% remaining`
                : "Topic completed!"}
            </span>
          </div>
          {progress > 0 && (
            <div
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                progress < 30
                  ? "bg-red-100 text-red-700"
                  : progress < 60
                  ? "bg-yellow-100 text-yellow-700"
                  : progress < 85
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              )}
            >
              {progress < 30
                ? "Starting"
                : progress < 60
                ? "In Progress"
                : progress < 85
                ? "Advanced"
                : "Expert"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodaysFocus;
