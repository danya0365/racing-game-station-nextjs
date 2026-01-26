-- Shop Queue Seed Data - Users
-- Created: 2025-06-19
-- Author: Marosdee Uma
-- Description: Sample user data for testing Shop Queue application

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set app password for testing
set session my.app_password = '12345678';

-- เพิ่มผู้ใช้ทดสอบใน auth.users
-- ใช้ฟังก์ชัน crypt และ gen_salt เพื่อเข้ารหัสรหัสผ่าน
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES 
    -- Admin user
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'admin@racing.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "admin",
          "full_name": "Admin User",
          "role": "admin",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    ),
    -- Regular user 1
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000003',
        'authenticated',
        'authenticated',
        'user1@racinggamestation.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '20 days',
        NULL,
        NOW() - INTERVAL '3 days',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "user1",
          "full_name": "Regular User 1",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '20 days',
        NOW() - INTERVAL '20 days',
        '',
        '',
        '',
        ''
    ),
    -- Regular user 2
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000004',
        'authenticated',
        'authenticated',
        'user2@racinggamestation.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '15 days',
        NULL,
        NOW() - INTERVAL '4 days',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "user2",
          "full_name": "Regular User 2",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '15 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for each user using subquery from auth.users
INSERT INTO
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
SELECT
    extensions.uuid_generate_v4(),
    id,
    id,
    format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
    'email',
    last_sign_in_at,
    created_at,
    updated_at
FROM
    auth.users
ON CONFLICT (provider_id, provider) DO NOTHING;

--  Racing Game Station Seed Data - Profiles
-- Created: 2025-06-19
-- Author: Marosdee Uma
-- Description: Sample profile data for testing Racing Game Station application with multiple profiles per user

-- Insert profiles for admin user (2 profiles)
INSERT INTO public.profiles (
  id,
  auth_id,
  username,
  full_name,
  avatar_url,
  is_active,
  created_at,
  updated_at
)
VALUES
  (
    '10000000-1000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'admin_personal',
    'Admin Personal Account',
    '',
    FALSE,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  
  -- Insert profiles for regular user 1 (3 profiles)
  (
    '10000000-1000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000003',
    'user1_gaming',
    'User1 Gaming Channel',
    '',
    FALSE,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days'
  ),
  (
    '10000000-1000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000003',
    'user1_movies',
    'User1 Movie Reviews',
    '',
    FALSE,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  
  -- Insert profiles for regular user 2 (2 profiles)
  (
    '10000000-1000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000004',
    'user2_tech',
    'User2 Tech Channel',
    '',
    FALSE,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Created at: 2025-06-21T10:15:00+07:00
-- Author: Marosdee Uma
-- Description: Seed initial profile_roles data for Racing Game Station application

-- Insert initial admin role for the first user's active profile
-- This assumes the first user in auth.users is the system admin
INSERT INTO public.profile_roles (profile_id, role, granted_by)
SELECT 
  p.id, 
  'admin'::public.profile_role, 
  p.auth_id
FROM 
  public.profiles p
  JOIN auth.users u ON p.auth_id = u.id
WHERE
  p.is_active = true
ORDER BY u.created_at
LIMIT 1
ON CONFLICT (profile_id) DO UPDATE
SET role = 'admin'::public.profile_role;

-- Execute the migration function
SELECT public.migrate_profile_roles();

-- ============================================================================
-- RACING GAME STATION: Seed Machines
-- ============================================================================
INSERT INTO public.machines (id, name, description, position, status, is_active)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'Game Station 1', 'เครื่อง Formula Racing Game Station พร้อมพวงมาลัย Fanatec GT DD Pro', 1, 'available', TRUE),
  ('00000000-0000-0000-0000-000000000102', 'Game Station 2', 'เครื่อง GT Racing Game Station พร้อมพวงมาลัย Thrustmaster T300RS', 2, 'available', TRUE),
  ('00000000-0000-0000-0000-000000000103', 'Game Station 3', 'เครื่อง Rally Racing Game Station พร้อมพวงมาลัย Logitech G923', 3, 'available', TRUE),
  ('00000000-0000-0000-0000-000000000104', 'Game Station 4', 'เครื่อง Drift Game Station พร้อมจอโค้ง Ultrawide 49 นิ้ว', 4, 'available', TRUE),
  ('00000000-0000-0000-0000-000000000105', 'Game Station 5', 'เครื่อง F1 Game Station VIP พร้อมระบบ Motion Platform', 5, 'available', TRUE),
  ('00000000-0000-0000-0000-000000000106', 'Game Station 6', 'เครื่อง Endurance Game Station ระดับ Pro สำหรับ E-Sports', 6, 'maintenance', FALSE)
ON CONFLICT (id) DO NOTHING;
