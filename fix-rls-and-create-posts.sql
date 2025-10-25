-- Fix Row Level Security to allow blog post creation
-- Run this in your Supabase SQL Editor

-- First, let's update the RLS policies to be more permissive for content creation

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON posts;

-- Create a new policy that allows service role to insert
CREATE POLICY "Service role can manage all posts"
  ON posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon key to insert posts (for your scripts)
CREATE POLICY "Allow insert for all authenticated operations"
  ON posts
  FOR INSERT
  WITH CHECK (true);

-- Allow anon key to update posts
CREATE POLICY "Allow update for all authenticated operations"
  ON posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- The public read policy stays the same (only published posts)
-- This policy should already exist from earlier

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'posts';

