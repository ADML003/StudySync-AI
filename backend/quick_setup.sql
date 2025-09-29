-- Quick Setup: Essential study_plans table for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create study_plans table
CREATE TABLE study_plans (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own study plans
CREATE POLICY "Users can insert own plans" ON study_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to select their own study plans  
CREATE POLICY "Users can select own plans" ON study_plans
    FOR SELECT USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON study_plans TO authenticated;
GRANT USAGE ON SEQUENCE study_plans_id_seq TO authenticated;