-- Create a new storage bucket for animations
INSERT INTO storage.buckets (id, name, public)
VALUES ('animations', 'animations', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the animations bucket
-- Allow public read access to all files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'animations' );

-- Allow authenticated users to upload files (optional, depending on your needs)
-- For now, let's assume only service role or admins might upload, but 
-- if you need user uploads for some reason, you can adjust this.
-- This policy allows authenticated users to insert files.
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'animations' );
