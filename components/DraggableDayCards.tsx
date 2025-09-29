import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { motion } from "framer-motion";
import {
  GripVertical,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DayCard {
  id: string;
  day: string;
  date: string;
  tasks: number;
  completedTasks: number;
  totalMinutes: number;
  focus: string;
  difficulty: "easy" | "medium" | "hard";
  priority: "low" | "medium" | "high";
}

interface DraggableDayCardsProps {
  initialCards: DayCard[];
  onReorder: (reorderedCards: DayCard[]) => void;
  className?: string;
}

const DraggableDayCards: React.FC<DraggableDayCardsProps> = ({
  initialCards,
  onReorder,
  className,
}) => {
  const [cards, setCards] = useState<DayCard[]>(initialCards);

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCards(items);
    onReorder(items);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIndicator = (priority: string) => {
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

  const getCompletionPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDayIcon = (day: string) => {
    const dayIcons: { [key: string]: string } = {
      Monday: "🌟",
      Tuesday: "🚀",
      Wednesday: "⚡",
      Thursday: "🎯",
      Friday: "🔥",
      Saturday: "🌈",
      Sunday: "🌅",
    };
    return dayIcons[day] || "📅";
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Weekly Study Plan</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop to reorder your study days
        </p>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="day-cards">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "space-y-3 transition-colors duration-200",
                snapshot.isDraggingOver && "bg-blue-50 rounded-lg p-2"
              )}
            >
              {cards.map((card, index) => (
                <Draggable key={card.id} draggableId={card.id} index={index}>
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "bg-white rounded-lg border-l-4 border border-gray-200 shadow-sm transition-all duration-200",
                        getPriorityIndicator(card.priority),
                        snapshot.isDragging &&
                          "shadow-lg scale-105 rotate-2 z-50",
                        !snapshot.isDragging && "hover:shadow-md"
                      )}
                    >
                      <div className="p-4">
                        <div className="flex items-start space-x-4">
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-grab active:cursor-grabbing",
                              snapshot.isDragging
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                            )}
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>

                          {/* Card Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {getDayIcon(card.day)}
                                </span>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {card.day}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {card.date}
                                  </p>
                                </div>
                              </div>

                              {/* Difficulty Badge */}
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium border",
                                  getDifficultyColor(card.difficulty)
                                )}
                              >
                                {card.difficulty}
                              </span>
                            </div>

                            {/* Focus Area */}
                            <div className="flex items-center space-x-2 mb-3 p-2 bg-blue-50 rounded-md">
                              <Target className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">
                                Focus: {card.focus}
                              </span>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              {/* Time */}
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Duration
                                  </p>
                                  <p className="text-sm font-medium">
                                    {formatDuration(card.totalMinutes)}
                                  </p>
                                </div>
                              </div>

                              {/* Tasks */}
                              <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-xs text-gray-600">Tasks</p>
                                  <p className="text-sm font-medium">
                                    {card.completedTasks}/{card.tasks}
                                  </p>
                                </div>
                              </div>

                              {/* Progress */}
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-xs text-gray-600">
                                    Progress
                                  </p>
                                  <p
                                    className={cn(
                                      "text-sm font-medium",
                                      getProgressColor(
                                        getCompletionPercentage(
                                          card.completedTasks,
                                          card.tasks
                                        )
                                      )
                                    )}
                                  >
                                    {getCompletionPercentage(
                                      card.completedTasks,
                                      card.tasks
                                    )}
                                    %
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                              <motion.div
                                className={cn(
                                  "h-2 rounded-full transition-all duration-500",
                                  getCompletionPercentage(
                                    card.completedTasks,
                                    card.tasks
                                  ) >= 80
                                    ? "bg-green-500"
                                    : getCompletionPercentage(
                                        card.completedTasks,
                                        card.tasks
                                      ) >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                )}
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${getCompletionPercentage(
                                    card.completedTasks,
                                    card.tasks
                                  )}%`,
                                }}
                                transition={{
                                  delay: index * 0.2,
                                  duration: 0.6,
                                }}
                              />
                            </div>

                            {/* Status Indicators */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {card.completedTasks === card.tasks ? (
                                  <div className="flex items-center space-x-1 text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-xs font-medium">
                                      Completed
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center space-x-1 text-amber-600">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-xs font-medium">
                                      In Progress
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center space-x-1 text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span className="text-xs">Day {index + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <GripVertical className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              How to reorder
            </h4>
            <p className="text-xs text-blue-700">
              Click and drag the grip icon to reorder your study days. Organize
              them based on your schedule and priorities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraggableDayCards;
