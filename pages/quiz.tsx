import React from "react";
import Head from "next/head";
import { Brain, Trophy, Timer } from "lucide-react";

const Quiz = () => {
  return (
    <>
      <Head>
        <title>Quiz - Cerebras Learning</title>
        <meta
          name="description"
          content="Test your knowledge with interactive quizzes"
        />
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Center</h1>
          <p className="text-muted-foreground">
            Test your knowledge and track your progress with our interactive
            quizzes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Python Basics</h3>
                <Brain className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Test your understanding of Python fundamentals.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">15 Questions</span>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Data Structures</h3>
                <Brain className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Challenge yourself with advanced data structure concepts.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">20 Questions</span>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Machine Learning</h3>
                <Brain className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Evaluate your ML knowledge and understanding.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">25 Questions</span>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Quiz Results</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Python Basics Quiz</span>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Structures Quiz</span>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">88%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
