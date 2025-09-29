"use client";

import { ReactNode } from "react";
import Header from "./Header";
import OfflineBanner from "./OfflineBanner";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  showOfflineBanner?: boolean;
}

export default function Layout({
  children,
  className = "",
  showHeader = true,
  showOfflineBanner = true,
}: LayoutProps) {
  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-black transition-colors ${className}`}
    >
      {/* Offline Banner */}
      {showOfflineBanner && <OfflineBanner />}

      {/* Header */}
      {showHeader && <Header />}

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 StudySync AI. Built with modern web technologies.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <a
                href="#"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
