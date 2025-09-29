-- StudySync AI - Database Schema for Interaction Tracking
-- Creates tables to store user interactions with AI features

-- Enable Row Level Security (RLS) for all tables
-- This ensures users can only access their own data

-- 1. Study Plans Table
-- Stores generated study plans with full details
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    goals JSONB DEFAULT '[]'::jsonb,
    timeline TEXT,
    difficulty_level TEXT DEFAULT 'intermediate',
    sections JSONB DEFAULT '[]'::jsonb,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    recommended_resources JSONB DEFAULT '[]'::jsonb,
    input_data JSONB NOT NULL, -- Original request data
    output_data JSONB NOT NULL, -- Generated plan data
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Question History Table  
-- Stores generated quiz questions and user responses
CREATE TABLE IF NOT EXISTS question_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    question_count INTEGER DEFAULT 0,
    question_types JSONB DEFAULT '["multiple_choice"]'::jsonb,
    focus_areas JSONB DEFAULT '[]'::jsonb,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb, -- Generated questions
    input_data JSONB NOT NULL, -- Original request data
    output_data JSONB NOT NULL, -- Generated quiz data
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Explanation Requests Table
-- Stores concept explanations and user context
CREATE TABLE IF NOT EXISTS explanation_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    concept TEXT NOT NULL,
    complexity_level TEXT DEFAULT 'intermediate',
    target_audience TEXT DEFAULT 'general',
    format_preference TEXT DEFAULT 'detailed',
    context TEXT,
    explanation_content TEXT NOT NULL,
    key_points JSONB DEFAULT '[]'::jsonb,
    examples JSONB DEFAULT '[]'::jsonb,
    related_concepts JSONB DEFAULT '[]'::jsonb,
    further_reading JSONB DEFAULT '[]'::jsonb,
    input_data JSONB NOT NULL, -- Original request data
    output_data JSONB NOT NULL, -- Generated explanation data
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE explanation_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Users can only access their own records

-- Study Plans Policies
CREATE POLICY "Users can view own study plans" ON study_plans
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study plans" ON study_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study plans" ON study_plans
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own study plans" ON study_plans
    FOR DELETE USING (auth.uid() = user_id);

-- Question History Policies  
CREATE POLICY "Users can view own question history" ON question_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own question history" ON question_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own question history" ON question_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own question history" ON question_history
    FOR DELETE USING (auth.uid() = user_id);

-- Explanation Requests Policies
CREATE POLICY "Users can view own explanation requests" ON explanation_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own explanation requests" ON explanation_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own explanation requests" ON explanation_requests
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own explanation requests" ON explanation_requests
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_created_at ON study_plans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_plans_subject ON study_plans(subject);

CREATE INDEX IF NOT EXISTS idx_question_history_user_id ON question_history(user_id);
CREATE INDEX IF NOT EXISTS idx_question_history_created_at ON question_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_history_topic ON question_history(topic);

CREATE INDEX IF NOT EXISTS idx_explanation_requests_user_id ON explanation_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_explanation_requests_created_at ON explanation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_explanation_requests_concept ON explanation_requests(concept);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamps
CREATE TRIGGER update_study_plans_updated_at 
    BEFORE UPDATE ON study_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_history_updated_at 
    BEFORE UPDATE ON question_history 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_explanation_requests_updated_at 
    BEFORE UPDATE ON explanation_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create useful views for analytics
CREATE OR REPLACE VIEW user_interaction_summary AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(sp.id) as total_study_plans,
    COUNT(qh.id) as total_quizzes,
    COUNT(er.id) as total_explanations,
    COUNT(sp.id) + COUNT(qh.id) + COUNT(er.id) as total_interactions,
    MAX(GREATEST(
        COALESCE(sp.created_at, '1970-01-01'::timestamp),
        COALESCE(qh.created_at, '1970-01-01'::timestamp),
        COALESCE(er.created_at, '1970-01-01'::timestamp)
    )) as last_interaction,
    MIN(LEAST(
        COALESCE(sp.created_at, '2999-12-31'::timestamp),
        COALESCE(qh.created_at, '2999-12-31'::timestamp),
        COALESCE(er.created_at, '2999-12-31'::timestamp)
    )) as first_interaction
FROM auth.users u
LEFT JOIN study_plans sp ON u.id = sp.user_id
LEFT JOIN question_history qh ON u.id = qh.user_id  
LEFT JOIN explanation_requests er ON u.id = er.user_id
GROUP BY u.id, u.email;

-- Grant necessary permissions (adjust as needed for your setup)
-- Note: These grants may need to be adjusted based on your Supabase role configuration

-- Grant select on the summary view for authenticated users
GRANT SELECT ON user_interaction_summary TO authenticated;