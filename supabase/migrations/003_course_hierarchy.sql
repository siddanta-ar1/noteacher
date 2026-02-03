-- NOTEacher Course Hierarchy - Levels and Missions Schema
-- This creates a proper 3-tier hierarchy: Course → Level → Mission → Node

-- ============================================================
-- 1. LEVELS TABLE
-- Top-level groupings within a course (e.g., "Level 0: Statistical Thinking")
-- ============================================================

CREATE TABLE IF NOT EXISTS levels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    position_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(course_id, position_index)
);

CREATE INDEX IF NOT EXISTS idx_levels_course ON levels(course_id);
CREATE INDEX IF NOT EXISTS idx_levels_position ON levels(course_id, position_index);

-- RLS Policies for levels
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Levels are viewable by everyone" ON levels
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage levels" ON levels
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
-- 2. MISSIONS TABLE
-- Sub-groupings within levels (e.g., "Mission 0.1: Why statistics exists")
-- ============================================================

CREATE TABLE IF NOT EXISTS missions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level_id UUID REFERENCES levels(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    position_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(level_id, position_index)
);

CREATE INDEX IF NOT EXISTS idx_missions_level ON missions(level_id);
CREATE INDEX IF NOT EXISTS idx_missions_position ON missions(level_id, position_index);

-- RLS Policies for missions
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Missions are viewable by everyone" ON missions
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage missions" ON missions
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
-- 3. UPDATE NODES TABLE
-- Add mission_id foreign key to link nodes to missions
-- ============================================================

-- Add mission_id column to nodes (nullable for backward compatibility)
ALTER TABLE nodes ADD COLUMN IF NOT EXISTS mission_id UUID REFERENCES missions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_nodes_mission ON nodes(mission_id);

-- ============================================================
-- 4. HELPER VIEWS
-- Convenient views for fetching hierarchical data
-- ============================================================

-- View: Course structure with full hierarchy
CREATE OR REPLACE VIEW course_hierarchy AS
SELECT 
    c.id AS course_id,
    c.title AS course_title,
    c.description AS course_description,
    l.id AS level_id,
    l.title AS level_title,
    l.position_index AS level_position,
    m.id AS mission_id,
    m.title AS mission_title,
    m.position_index AS mission_position,
    n.id AS node_id,
    n.title AS node_title,
    n.type AS node_type,
    n.position_index AS node_position,
    n.content_json
FROM courses c
LEFT JOIN levels l ON l.course_id = c.id
LEFT JOIN missions m ON m.level_id = l.id
LEFT JOIN nodes n ON n.mission_id = m.id
ORDER BY 
    c.title,
    l.position_index,
    m.position_index,
    n.position_index;

-- ============================================================
-- 5. HELPER FUNCTIONS
-- ============================================================

-- Function to get full course structure
CREATE OR REPLACE FUNCTION get_course_hierarchy(p_course_id UUID)
RETURNS TABLE (
    level_id UUID,
    level_title TEXT,
    level_position INTEGER,
    mission_id UUID,
    mission_title TEXT,
    mission_position INTEGER,
    node_id UUID,
    node_title TEXT,
    node_type TEXT,
    node_position INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id AS level_id,
        l.title AS level_title,
        l.position_index AS level_position,
        m.id AS mission_id,
        m.title AS mission_title,
        m.position_index AS mission_position,
        n.id AS node_id,
        n.title AS node_title,
        n.type::TEXT AS node_type,
        n.position_index AS node_position
    FROM levels l
    LEFT JOIN missions m ON m.level_id = l.id
    LEFT JOIN nodes n ON n.mission_id = m.id
    WHERE l.course_id = p_course_id
    ORDER BY 
        l.position_index,
        m.position_index,
        n.position_index;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
