import React from "react";
import Head from "next/head";
import { HelpCircle, MessageCircle, Search, Send } from "lucide-react";

const AskDoubt = () => {
  return (
    <>
      <Head>
        <title>Ask Doubt - Cerebras Learning</title>
        <meta
          name="description"
          content="Get help with your learning questions"
        />
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ask a Doubt</h1>
          <p className="text-muted-foreground">
            Get instant help with your questions from our AI assistant and
            community.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Ask Your Question</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <select 
                      className="w-full mt-1 p-2 border rounded-md"
                      aria-label="Select subject for your question"
                    >
                      <option>Select a subject...</option>
                      <option>Python Programming</option>
                      <option>Data Structures</option>
                      <option>Machine Learning</option>
                      <option>Algorithms</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Your Question</label>
                    <textarea
                      className="w-full mt-1 p-3 border rounded-md"
                      rows={6}
                      placeholder="Describe your question in detail..."
                    />
                  </div>
                  <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
                    <Send className="h-4 w-4" />
                    <span>Submit Question</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Quick Help</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-2 p-3 text-left hover:bg-muted rounded-md">
                    <Search className="h-4 w-4" />
                    <span className="text-sm">Search FAQ</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 p-3 text-left hover:bg-muted rounded-md">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">Live Chat Support</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 p-3 text-left hover:bg-muted rounded-md">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-sm">Help Center</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent Questions</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">
                      How to implement binary search?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Answered 2 hours ago
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">
                      Difference between list and tuple?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Answered 5 hours ago
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">
                      Machine learning algorithms comparison
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Answered 1 day ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AskDoubt;
