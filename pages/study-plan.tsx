import React from "react";
import Head from "next/head";
import { BookOpen, Clock, CheckCircle } from "lucide-react";

const StudyPlan = () => {
  return (
    <>
      <Head>
        <title>Study Plan - Cerebras Learning</title>
        <meta name="description" content="Your personalized study plan" />
      </Head>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Study Plan</h1>
          <p className="text-muted-foreground">
            Your personalized learning roadmap to achieve your goals.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Current Week's Goals</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Complete Python Basics Module</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">
                    Practice Data Structures Problems (5/10)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">
                    Read Algorithm Design Chapter 3
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Upcoming Milestones</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Machine Learning Fundamentals</h4>
                  <p className="text-sm text-muted-foreground">
                    Expected completion: 2 weeks
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium">Data Science Project</h4>
                  <p className="text-sm text-muted-foreground">
                    Expected completion: 1 month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyPlan;
