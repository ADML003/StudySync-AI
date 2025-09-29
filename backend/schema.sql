-- StudySync AI Database Schema
-- SQL script to create study_plans table in Supabase

-- Enable UUID extension (required for auth.uid())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create study_plans table
CREATE TABLE study_plans (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX idx_study_plans_created_at ON study_plans(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own study plans
CREATE POLICY "Users can insert their own study plans" ON study_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to select their own study plans
CREATE POLICY "Users can select their own study plans" ON study_plans
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update their own study plans
CREATE POLICY "Users can update their own study plans" ON study_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own study plans
CREATE POLICY "Users can delete their own study plans" ON study_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT ALL ON study_plans TO authenticated;
GRANT USAGE ON SEQUENCE study_plans_id_seq TO authenticated;