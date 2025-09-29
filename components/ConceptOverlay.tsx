"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

interface ConceptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  explanation: string;
  codeBlocks?: CodeBlock[];
  category?: string;
  className?: string;
}

export default function ConceptOverlay({
  isOpen,
  onClose,
  title,
  explanation,
  codeBlocks = [],
  category,
  className = "",
}: ConceptOverlayProps) {
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const formatExplanation = (text: string) => {
    // Convert markdown-like syntax to HTML
    return text.split("\n\n").map((paragraph, index) => {
      // Handle headers
      if (paragraph.startsWith("## ")) {
        return (
          <h3
            key={index}
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3"
          >
            {paragraph.replace("## ", "")}
          </h3>
        );
      }

      if (paragraph.startsWith("### ")) {
        return (
          <h4
            key={index}
            className="text-lg font-medium text-gray-800 dark:text-gray-200 mt-5 mb-2"
          >
            {paragraph.replace("### ", "")}
          </h4>
        );
      }

      // Handle bullet points
      if (paragraph.includes("\n- ")) {
        const items = paragraph.split("\n- ").filter((item) => item.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-4">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700 dark:text-gray-300">
                {item.replace(/^\- /, "")}
              </li>
            ))}
          </ul>
        );
      }

      // Handle numbered lists
      if (/^\d+\. /.test(paragraph)) {
        const items = paragraph.split(/\n\d+\. /).filter((item) => item.trim());
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-4">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700 dark:text-gray-300">
                {item.replace(/^\d+\. /, "")}
              </li>
            ))}
          </ol>
        );
      }

      // Handle inline code
      const processInlineCode = (text: string) => {
        return text.split(/(`[^`]+`)/).map((part, partIndex) => {
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code
                key={partIndex}
                className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });
      };

      // Regular paragraph
      return (
        <p
          key={index}
          className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
        >
          {processInlineCode(paragraph)}
        </p>
      );
    });
  };

  const getLanguageColor = (language: string) => {
    const colors = {
      javascript: "bg-yellow-100 text-yellow-800",
      typescript: "bg-blue-100 text-blue-800",
      python: "bg-green-100 text-green-800",
      html: "bg-orange-100 text-orange-800",
      css: "bg-pink-100 text-pink-800",
      jsx: "bg-cyan-100 text-cyan-800",
      tsx: "bg-indigo-100 text-indigo-800",
      json: "bg-gray-100 text-gray-800",
      bash: "bg-purple-100 text-purple-800",
      sql: "bg-red-100 text-red-800",
    };
    return (
      colors[language.toLowerCase() as keyof typeof colors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`relative z-50 ${className}`}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-8"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-8"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-black shadow-2xl transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-700 dark:to-blue-700 px-6 py-8 text-white">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                    aria-label="Close overlay"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {category && (
                    <div className="mb-2">
                      <span className="inline-block bg-white bg-opacity-20 text-white text-sm px-3 py-1 rounded-full font-medium">
                        {category}
                      </span>
                    </div>
                  )}

                  <Dialog.Title className="text-3xl font-bold leading-tight pr-12">
                    {title}
                  </Dialog.Title>
                </div>

                {/* Content */}
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className="p-6">
                    {/* Explanation */}
                    <div className="prose prose-lg max-w-none mb-8">
                      {formatExplanation(explanation)}
                    </div>

                    {/* Code Blocks */}
                    {codeBlocks.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Code Examples
                        </h3>

                        {codeBlocks.map((block, index) => (
                          <div key={index} className="relative">
                            {/* Code Block Header */}
                            <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 text-white px-4 py-3 rounded-t-lg">
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${getLanguageColor(
                                    block.language
                                  )}`}
                                >
                                  {block.language.toUpperCase()}
                                </span>
                                {block.filename && (
                                  <span className="text-gray-300 text-sm font-mono">
                                    {block.filename}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  handleCopyCode(block.code, index)
                                }
                                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                                aria-label="Copy code"
                              >
                                {copiedStates[index] ? (
                                  <>
                                    <Check className="w-4 h-4" />
                                    <span className="text-sm">Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-4 h-4" />
                                    <span className="text-sm">Copy</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Code Content */}
                            <div className="bg-gray-900 dark:bg-black rounded-b-lg overflow-x-auto">
                              <pre className="p-4 text-sm text-gray-100 dark:text-gray-200 font-mono leading-relaxed">
                                <code>{block.code}</code>
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-6 py-4">
                  <div className="flex justify-end">
                    <button
                      onClick={onClose}
                      className="bg-teal-600 dark:bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-800 transition-colors font-medium"
                    >
                      Got it!
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
