-- Fix RLS policy for visitors table to allow anon inserts
-- The current policy is blocking anonymous users from inserting

-- Drop existing policy
DROP POLICY IF EXISTS "Allow public insert on visitors" ON public.visitors;

-- Create new policy that actually allows anon inserts
CREATE POLICY "Enable insert for anon users" 
ON public.visitors 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Ensure anon can insert
GRANT INSERT ON public.visitors TO anon;
GRANT INSERT ON public.visitors TO authenticated;
