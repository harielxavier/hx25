-- Create admin user in Supabase
-- Email: mauricio@harielxavier.com
-- Password: Vamos!!86

-- First, check if user exists
SELECT id, email, role 
FROM auth.users 
WHERE email = 'mauricio@harielxavier.com';

-- If user doesn't exist, you'll need to create it through Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Email: mauricio@harielxavier.com
-- 4. Password: Vamos!!86
-- 5. Auto Confirm User: YES
-- 6. Click "Create User"

-- After creating, verify the user was created:
SELECT id, email, role, created_at, confirmed_at
FROM auth.users 
WHERE email = 'mauricio@harielxavier.com';

-- Grant admin role (if you have a custom role system)
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'mauricio@harielxavier.com';
