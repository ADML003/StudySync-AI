"use client";

import { useState, useEffect } from "react";

interface UseOnlineStatusReturn {
  isOnline: boolean;
  wasOffline: boolean;
}

export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [wasOffline, setWasOffline] = useState<boolean>(false);

  useEffect(() => {
    // Set initial state
    const updateOnlineStatus = () => {
      const online = typeof navigator !== "undefined" ? navigator.onLine : true;
      setIsOnline(online);

      // Track if user was offline to show reconnection message
      if (!online) {
        setWasOffline(true);
      }
    };

    // Set initial status
    updateOnlineStatus();

    // Add event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Keep wasOffline true to show "back online" message briefly
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Cleanup
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  // Reset wasOffline flag after a delay when back online
  useEffect(() => {
    if (isOnline && wasOffline) {
      const timer = setTimeout(() => {
        setWasOffline(false);
      }, 3000); // Show "back online" message for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return { isOnline, wasOffline };
}
