import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type StudyPlan = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimated_hours: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  status: "active" | "completed" | "paused";
};

export type QuizResult = {
  id: string;
  user_id: string;
  topic: string;
  score: number;
  total_questions: number;
  difficulty: "easy" | "medium" | "hard";
  time_taken: number;
  completed_at: string;
};
