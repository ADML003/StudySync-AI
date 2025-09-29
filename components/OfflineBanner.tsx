"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi, X } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useState } from "react";

interface OfflineBannerProps {
  className?: string;
  dismissible?: boolean;
}

export default function OfflineBanner({
  className = "",
  dismissible = true,
}: OfflineBannerProps) {
  const { isOnline, wasOffline } = useOnlineStatus();
  const [isDismissed, setIsDismissed] = useState(false);

  const shouldShow = (!isOnline || (isOnline && wasOffline)) && !isDismissed;

  const handleDismiss = () => {
    setIsDismissed(true);
    // Reset dismissed state when going offline again
    if (!isOnline) {
      setTimeout(() => setIsDismissed(false), 100);
    }
  };

  // Reset dismissed state when going offline
  if (!isOnline && isDismissed) {
    setIsDismissed(false);
  }

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -50, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -50, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`relative z-50 ${className}`}
        >
          <div
            className={`w-full px-4 py-3 ${
              isOnline
                ? "bg-green-500 dark:bg-green-600"
                : "bg-orange-500 dark:bg-orange-600"
            } text-white shadow-lg`}
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: isOnline ? [0, 0, 0] : [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {isOnline ? (
                    <Wifi className="w-5 h-5" />
                  ) : (
                    <WifiOff className="w-5 h-5" />
                  )}
                </motion.div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                  <span className="font-medium text-sm sm:text-base">
                    {isOnline ? "Connection Restored" : "Offline Mode Enabled"}
                  </span>
                  <span className="text-xs sm:text-sm opacity-90">
                    {isOnline
                      ? "You're back online!"
                      : "Some features may be limited while offline"}
                  </span>
                </div>
              </div>

              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Progress bar for offline mode */}
            {!isOnline && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-30"
              >
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-full w-1/3 bg-white"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
