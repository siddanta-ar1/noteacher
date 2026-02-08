-- Add parent_id to comments for replies
ALTER TABLE comments 
ADD COLUMN parent_id uuid REFERENCES comments(id) ON DELETE CASCADE;

-- Index parent_id for faster lookups
CREATE INDEX comments_parent_id_idx ON comments(parent_id);
