import React, { useState } from "react";
import Head from "next/head";
import {
  LayoutDashboard,
  TrendingUp,
  Clock,
  BookOpen,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TodaysFocus from "@/components/TodaysFocus";
import ConcentricRings from "@/components/ConcentricRings";
import OnboardingWizard from "@/components/OnboardingWizard";

const Dashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleOnboardingComplete = (data: any) => {
    console.log("Onboarding completed:", data);
    setShowOnboarding(false);
    // Here you would typically save the data to your backend or state management
  };

  return (
    <>
      <Head>
        <title>Dashboard - Cerebras Learning</title>
        <meta name="description" content="Your learning dashboard" />
      </Head>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your learning progress.
            </p>
          </div>
          <Button
            onClick={() => setShowOnboarding(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Personalize</span>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Total Courses
              </h3>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Study Hours
              </h3>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">
                +12% from last week
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Quiz Score</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last attempt
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Certificates
              </h3>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 new this month</p>
            </div>
          </div>
        </div>

        {/* New Components Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Today's Focus */}
          <TodaysFocus
            topic="React Components & State Management"
            timeEstimate={90}
            progress={67}
            adaptiveTip="Try building a small project to practice component composition and state lifting. This will solidify your understanding of React patterns."
          />

          {/* Concentric Rings */}
          <div className="flex items-center justify-center">
            <ConcentricRings
              strength={85}
              practice={72}
              review={58}
              size={280}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium">Recent Activity</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Completed "Introduction to Machine Learning"
                    </p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Started "Advanced Python Programming"
                    </p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Quiz completed: "Data Structures Quiz" - 92%
                    </p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium">Upcoming Deadlines</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Algorithm Design Assignment
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due in 3 days
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Database Quiz
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due in 1 week
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </>
  );
};

export default Dashboard;
