-- NOTEacher Learning Platform - Database Schema Enhancement
-- Run this migration in Supabase SQL Editor

-- ============================================================
-- 1. ASSIGNMENTS TABLE
-- Stores assignment definitions linked to lesson nodes
-- ============================================================

CREATE TABLE IF NOT EXISTS assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    node_id UUID REFERENCES nodes(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT,
    submission_types TEXT[] DEFAULT ARRAY['text'], -- 'text', 'photo', 'audio'
    is_required BOOLEAN DEFAULT false,
    max_file_size_mb INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups by node
CREATE INDEX IF NOT EXISTS idx_assignments_node ON assignments(node_id);

-- RLS Policies for assignments
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Everyone can read assignments
CREATE POLICY "Assignments are viewable by authenticated users" ON assignments
    FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can manage assignments
CREATE POLICY "Admins can manage assignments" ON assignments
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================================
-- 2. SUBMISSIONS TABLE
-- Stores user submissions for assignments (text, photo, audio)
-- ============================================================

CREATE TABLE IF NOT EXISTS submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    submission_type TEXT NOT NULL CHECK (submission_type IN ('text', 'photo', 'audio')),
    text_content TEXT,
    file_url TEXT,
    file_name TEXT,
    ai_feedback TEXT,
    ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    
    -- One submission per user per assignment (can be updated)
    UNIQUE(assignment_id, user_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- RLS Policies for submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own submissions
CREATE POLICY "Users can view own submissions" ON submissions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can insert their own submissions
CREATE POLICY "Users can create own submissions" ON submissions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending submissions
CREATE POLICY "Users can update own pending submissions" ON submissions
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id);

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions" ON submissions
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Admins can update submissions (for review)
CREATE POLICY "Admins can review submissions" ON submissions
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================================
-- 3. AI_SUMMARIES TABLE
-- Caches AI-generated summaries per node section
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    node_id UUID REFERENCES nodes(id) ON DELETE CASCADE NOT NULL,
    section_index INTEGER NOT NULL,
    summary_text TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One summary per section per node
    UNIQUE(node_id, section_index)
);

CREATE INDEX IF NOT EXISTS idx_ai_summaries_node ON ai_summaries(node_id);

-- RLS Policies for ai_summaries
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;

-- Summaries are publicly readable
CREATE POLICY "AI summaries are viewable by authenticated users" ON ai_summaries
    FOR SELECT
    TO authenticated
    USING (true);

-- System can insert/update summaries (via service role)
-- No user-level write access needed

-- ============================================================
-- 4. STORAGE BUCKETS FOR ASSIGNMENTS
-- ============================================================

-- Create storage buckets (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('assignment-photos', 'assignment-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('assignment-audio', 'assignment-audio', false, 20971520, ARRAY['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for assignment-photos
CREATE POLICY "Users can upload own photos" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'assignment-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view own photos" ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'assignment-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete own photos" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'assignment-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Storage policies for assignment-audio
CREATE POLICY "Users can upload own audio" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'assignment-audio' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view own audio" ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'assignment-audio' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete own audio" ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'assignment-audio' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================================
-- 5. HELPER FUNCTIONS
-- ============================================================

-- Function to get user's submission for an assignment
CREATE OR REPLACE FUNCTION get_user_submission(
    p_assignment_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
    id UUID,
    submission_type TEXT,
    text_content TEXT,
    file_url TEXT,
    ai_feedback TEXT,
    ai_score INTEGER,
    status TEXT,
    submitted_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.submission_type,
        s.text_content,
        s.file_url,
        s.ai_feedback,
        s.ai_score,
        s.status,
        s.submitted_at
    FROM submissions s
    WHERE s.assignment_id = p_assignment_id
    AND s.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get node assignments with user submissions
CREATE OR REPLACE FUNCTION get_node_assignments_with_submissions(
    p_node_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS TABLE (
    assignment_id UUID,
    title TEXT,
    instructions TEXT,
    submission_types TEXT[],
    is_required BOOLEAN,
    submission_id UUID,
    submission_status TEXT,
    submitted_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id AS assignment_id,
        a.title,
        a.instructions,
        a.submission_types,
        a.is_required,
        s.id AS submission_id,
        s.status AS submission_status,
        s.submitted_at
    FROM assignments a
    LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = p_user_id
    WHERE a.node_id = p_node_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
