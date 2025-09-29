import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConcentricRingsProps {
  strength: number; // 0-100
  practice: number; // 0-100
  review: number; // 0-100
  size?: number; // SVG size in pixels
  className?: string;
}

interface RingData {
  label: string;
  value: number;
  color: string;
  radius: number;
  strokeWidth: number;
}

const ConcentricRings: React.FC<ConcentricRingsProps> = ({
  strength,
  practice,
  review,
  size = 240,
  className,
}) => {
  const [animationStarted, setAnimationStarted] = useState(false);

  const center = size / 2;
  const rings: RingData[] = [
    {
      label: "Strength",
      value: Math.min(Math.max(strength, 0), 100),
      color: "#10b981", // green-500
      radius: center - 20,
      strokeWidth: 16,
    },
    {
      label: "Practice",
      value: Math.min(Math.max(practice, 0), 100),
      color: "#3b82f6", // blue-500
      radius: center - 45,
      strokeWidth: 14,
    },
    {
      label: "Review",
      value: Math.min(Math.max(review, 0), 100),
      color: "#f59e0b", // amber-500
      radius: center - 68,
      strokeWidth: 12,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const calculateCircumference = (radius: number) => 2 * Math.PI * radius;

  const calculateStrokeDasharray = (radius: number, percentage: number) => {
    const circumference = calculateCircumference(radius);
    const strokeLength = (percentage / 100) * circumference;
    return `${strokeLength} ${circumference}`;
  };

  const getRingVariants = (delay: number) => ({
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay,
          duration: 1.5,
          ease: "easeInOut",
        },
        opacity: {
          delay,
          duration: 0.3,
        },
      },
    },
  });

  const getLabelVariants = (delay: number) => ({
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: delay + 0.5,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  });

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      {/* SVG Rings */}
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {rings.map((ring, index) => {
            const circumference = calculateCircumference(ring.radius);
            const strokeDasharray = `${circumference} ${circumference}`;
            const strokeDashoffset =
              circumference - (ring.value / 100) * circumference;

            return (
              <g key={ring.label}>
                {/* Background circle */}
                <circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke="#e5e7eb" // gray-200
                  strokeWidth={ring.strokeWidth}
                  opacity={0.3}
                />

                {/* Animated progress circle */}
                <motion.circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  variants={getRingVariants(index * 0.2)}
                  initial="hidden"
                  animate={animationStarted ? "visible" : "hidden"}
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  }}
                />

                {/* Glow effect */}
                <motion.circle
                  cx={center}
                  cy={center}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth + 2}
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  opacity={0.3}
                  variants={getRingVariants(index * 0.2)}
                  initial="hidden"
                  animate={animationStarted ? "visible" : "hidden"}
                />
              </g>
            );
          })}

          {/* Center text */}
          <g
            className="transform rotate-90"
            transform={`translate(${center}, ${center})`}
          >
            <motion.text
              x="0"
              y="-10"
              textAnchor="middle"
              className="text-2xl font-bold fill-current"
              variants={getLabelVariants(0.6)}
              initial="hidden"
              animate={animationStarted ? "visible" : "hidden"}
            >
              Learning
            </motion.text>
            <motion.text
              x="0"
              y="10"
              textAnchor="middle"
              className="text-sm fill-muted-foreground"
              variants={getLabelVariants(0.8)}
              initial="hidden"
              animate={animationStarted ? "visible" : "hidden"}
            >
              Progress
            </motion.text>
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        {rings.map((ring, index) => (
          <motion.div
            key={ring.label}
            className="text-center"
            variants={getLabelVariants(index * 0.1 + 1)}
            initial="hidden"
            animate={animationStarted ? "visible" : "hidden"}
          >
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ring.color }}
              />
              <span className="text-sm font-medium">{ring.label}</span>
            </div>
            <div className="text-lg font-bold" style={{ color: ring.color }}>
              {ring.value}%
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        className="text-center p-4 bg-muted/30 rounded-lg w-full max-w-sm"
        variants={getLabelVariants(1.5)}
        initial="hidden"
        animate={animationStarted ? "visible" : "hidden"}
      >
        <div className="text-sm text-muted-foreground mb-1">
          Overall Progress
        </div>
        <div className="text-xl font-bold">
          {Math.round((strength + practice + review) / 3)}%
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {strength + practice + review < 150
            ? "Keep building momentum!"
            : strength + practice + review < 240
            ? "Great progress!"
            : "Excellent mastery!"}
        </div>
      </motion.div>
    </div>
  );
};

export default ConcentricRings;
