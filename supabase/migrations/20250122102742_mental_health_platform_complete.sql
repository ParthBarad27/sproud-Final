-- Location: supabase/migrations/20250122102742_mental_health_platform_complete.sql
-- Schema Analysis: Fresh project - no existing tables
-- Integration Type: Complete mental health platform implementation
-- Dependencies: None - creating complete schema

-- 1. Extensions & Types
CREATE TYPE public.user_role AS ENUM ('admin', 'therapist', 'student');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.appointment_type AS ENUM ('individual', 'group', 'crisis', 'wellness_check');
CREATE TYPE public.session_type AS ENUM ('video', 'chat', 'in_person');
CREATE TYPE public.mood_value AS ENUM ('very_poor', 'poor', 'neutral', 'good', 'excellent');
CREATE TYPE public.crisis_severity AS ENUM ('low', 'moderate', 'high', 'critical');
CREATE TYPE public.resource_type AS ENUM ('article', 'video', 'audio', 'exercise', 'assessment');
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'audio', 'system');
CREATE TYPE public.notification_type AS ENUM ('appointment', 'message', 'crisis', 'reminder', 'achievement');

-- 2. Core Tables
-- User profiles table (intermediary for public schema)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role,
    phone TEXT,
    date_of_birth DATE,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    specialization TEXT, -- For therapists
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    anonymous_id TEXT UNIQUE DEFAULT ('MB' || EXTRACT(YEAR FROM NOW()) || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Therapist availability
CREATE TABLE public.therapist_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Appointments
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 50,
    appointment_type public.appointment_type DEFAULT 'individual'::public.appointment_type,
    session_type public.session_type DEFAULT 'video'::public.session_type,
    status public.appointment_status DEFAULT 'scheduled'::public.appointment_status,
    notes TEXT,
    session_url TEXT, -- For video sessions
    location TEXT, -- For in-person sessions
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Chat sessions
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
    title TEXT DEFAULT 'Chat Session',
    is_active BOOLEAN DEFAULT true,
    is_crisis BOOLEAN DEFAULT false,
    crisis_severity public.crisis_severity,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ
);

-- Chat messages
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type public.message_type DEFAULT 'text'::public.message_type,
    attachment_url TEXT,
    is_ai_response BOOLEAN DEFAULT false,
    metadata JSONB, -- For storing additional message context
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Mood tracking
CREATE TABLE public.mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    mood_value public.mood_value NOT NULL,
    notes TEXT,
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
    sleep_hours DECIMAL(3,1),
    activities TEXT[], -- Array of activities
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Mental health assessments
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL, -- Store assessment questions
    scoring_system JSONB, -- How to calculate scores
    category TEXT,
    estimated_duration_minutes INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Assessment results
CREATE TABLE public.assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    responses JSONB NOT NULL, -- User's answers
    score DECIMAL(5,2),
    interpretation TEXT,
    recommendations TEXT[],
    completed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Wellness resources
CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    resource_type public.resource_type DEFAULT 'article'::public.resource_type,
    category TEXT,
    tags TEXT[],
    url TEXT,
    duration_minutes INTEGER, -- For videos/audio
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User progress tracking
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed BOOLEAN DEFAULT false,
    notes TEXT,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    last_accessed TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Wellness goals
CREATE TABLE public.wellness_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit TEXT, -- 'minutes', 'hours', 'days', 'count'
    target_date DATE,
    category TEXT, -- 'meditation', 'sleep', 'exercise', 'mood'
    is_active BOOLEAN DEFAULT true,
    achieved BOOLEAN DEFAULT false,
    achieved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Community posts
CREATE TABLE public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    tags TEXT[],
    is_anonymous BOOLEAN DEFAULT true,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Community comments
CREATE TABLE public.community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT true,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type public.notification_type DEFAULT 'reminder'::public.notification_type,
    related_id UUID, -- Reference to appointment, message, etc.
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_anonymous_id ON public.user_profiles(anonymous_id);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX idx_appointments_therapist_id ON public.appointments(therapist_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX idx_mood_entries_created_at ON public.mood_entries(created_at);
CREATE INDEX idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX idx_resources_category ON public.resources(category);
CREATE INDEX idx_resources_type ON public.resources(resource_type);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_wellness_goals_user_id ON public.wellness_goals(user_id);
CREATE INDEX idx_community_posts_category ON public.community_posts(category);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- 4. Functions (MUST BE BEFORE RLS POLICIES)
-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Auto profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- Crisis detection function
CREATE OR REPLACE FUNCTION public.detect_crisis_keywords(message_content TEXT)
RETURNS public.crisis_severity
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    crisis_keywords TEXT[] := ARRAY['suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm'];
    high_risk_keywords TEXT[] := ARRAY['hopeless', 'worthless', 'alone', 'pain'];
    content_lower TEXT := LOWER(message_content);
    keyword TEXT;
BEGIN
    -- Check for critical keywords
    FOREACH keyword IN ARRAY crisis_keywords LOOP
        IF content_lower LIKE '%' || keyword || '%' THEN
            RETURN 'critical'::public.crisis_severity;
        END IF;
    END LOOP;
    
    -- Check for high risk keywords
    FOREACH keyword IN ARRAY high_risk_keywords LOOP
        IF content_lower LIKE '%' || keyword || '%' THEN
            RETURN 'high'::public.crisis_severity;
        END IF;
    END LOOP;
    
    RETURN 'low'::public.crisis_severity;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
-- Pattern 1: Core user table (user_profiles)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for personal data
CREATE POLICY "users_manage_own_mood_entries"
ON public.mood_entries
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_assessment_results"
ON public.assessment_results
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_progress"
ON public.user_progress
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_wellness_goals"
ON public.wellness_goals
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public read, private write for resources
CREATE POLICY "public_can_read_resources"
ON public.resources
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_users_manage_resources"
ON public.resources
FOR ALL
TO authenticated
USING (created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'therapist')
))
WITH CHECK (created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'therapist')
));

CREATE POLICY "public_can_read_assessments"
ON public.assessments
FOR SELECT
TO public
USING (is_active = true);

CREATE POLICY "therapists_manage_assessments"
ON public.assessments
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'therapist')
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'therapist')
));

-- Appointment policies - complex relationships
CREATE POLICY "users_access_own_appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (client_id = auth.uid() OR therapist_id = auth.uid())
WITH CHECK (client_id = auth.uid() OR therapist_id = auth.uid());

-- Therapist availability
CREATE POLICY "therapists_manage_own_availability"
ON public.therapist_availability
FOR ALL
TO authenticated
USING (therapist_id = auth.uid())
WITH CHECK (therapist_id = auth.uid());

CREATE POLICY "public_can_view_therapist_availability"
ON public.therapist_availability
FOR SELECT
TO public
USING (is_active = true);

-- Chat session policies
CREATE POLICY "users_access_own_chat_sessions"
ON public.chat_sessions
FOR ALL
TO authenticated
USING (client_id = auth.uid() OR therapist_id = auth.uid())
WITH CHECK (client_id = auth.uid() OR therapist_id = auth.uid());

CREATE POLICY "users_access_session_messages"
ON public.chat_messages
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.chat_sessions cs
    WHERE cs.id = session_id
    AND (cs.client_id = auth.uid() OR cs.therapist_id = auth.uid())
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.chat_sessions cs
    WHERE cs.id = session_id
    AND (cs.client_id = auth.uid() OR cs.therapist_id = auth.uid())
));

-- Community policies
CREATE POLICY "authenticated_users_manage_own_community_posts"
ON public.community_posts
FOR ALL
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY "public_can_read_community_posts"
ON public.community_posts
FOR SELECT
TO public
USING (true);

CREATE POLICY "authenticated_users_manage_own_comments"
ON public.community_comments
FOR ALL
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

CREATE POLICY "public_can_read_community_comments"
ON public.community_comments
FOR SELECT
TO public
USING (true);

-- 7. Triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at
    BEFORE UPDATE ON public.community_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Auto profile creation trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 8. Complete Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    therapist1_uuid UUID := gen_random_uuid();
    therapist2_uuid UUID := gen_random_uuid();
    student1_uuid UUID := gen_random_uuid();
    student2_uuid UUID := gen_random_uuid();
    assessment1_uuid UUID := gen_random_uuid();
    resource1_uuid UUID := gen_random_uuid();
    resource2_uuid UUID := gen_random_uuid();
    appointment1_uuid UUID := gen_random_uuid();
    chat_session_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@mindcare.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Admin", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (therapist1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'therapist@mindcare.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Sarah Wilson", "role": "therapist"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (therapist2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'therapist2@mindcare.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Dr. Michael Chen", "role": "therapist"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student@mindcare.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Anonymous Student", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (student2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'student2@mindcare.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Another Student", "role": "student"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Add additional user profile data
    UPDATE public.user_profiles 
    SET 
        specialization = 'Cognitive Behavioral Therapy',
        bio = 'Experienced CBT therapist specializing in anxiety and depression'
    WHERE id = therapist1_uuid;

    UPDATE public.user_profiles 
    SET 
        specialization = 'Mindfulness & Stress Management',
        bio = 'Mindfulness-based therapy and stress reduction techniques'
    WHERE id = therapist2_uuid;

    -- Insert therapist availability
    INSERT INTO public.therapist_availability (therapist_id, day_of_week, start_time, end_time) VALUES
        (therapist1_uuid, 1, '09:00:00', '17:00:00'), -- Monday
        (therapist1_uuid, 2, '09:00:00', '17:00:00'), -- Tuesday
        (therapist1_uuid, 3, '09:00:00', '17:00:00'), -- Wednesday
        (therapist2_uuid, 1, '10:00:00', '18:00:00'), -- Monday
        (therapist2_uuid, 4, '10:00:00', '18:00:00'), -- Thursday
        (therapist2_uuid, 5, '10:00:00', '16:00:00'); -- Friday

    -- Insert sample appointments
    INSERT INTO public.appointments (id, client_id, therapist_id, appointment_date, appointment_type, session_type, status) VALUES
        (appointment1_uuid, student1_uuid, therapist1_uuid, CURRENT_TIMESTAMP + INTERVAL '2 hours', 'individual', 'video', 'confirmed'),
        (gen_random_uuid(), student1_uuid, therapist2_uuid, CURRENT_TIMESTAMP + INTERVAL '1 day', 'individual', 'chat', 'scheduled'),
        (gen_random_uuid(), student2_uuid, therapist1_uuid, CURRENT_TIMESTAMP + INTERVAL '3 days', 'wellness_check', 'video', 'scheduled');

    -- Insert sample assessments
    INSERT INTO public.assessments (id, name, description, questions, category) VALUES
        (assessment1_uuid, 'Depression Screening', 'Brief depression assessment questionnaire', 
         '[{"question": "How often have you felt down or hopeless?", "type": "scale", "scale": 5}]', 'mental_health'),
        (gen_random_uuid(), 'Anxiety Assessment', 'General anxiety disorder screening', 
         '[{"question": "How often do you worry excessively?", "type": "scale", "scale": 5}]', 'mental_health');

    -- Insert sample resources
    INSERT INTO public.resources (id, title, description, resource_type, category, created_by) VALUES
        (resource1_uuid, 'Breathing Exercises for Anxiety', 'Simple breathing techniques to manage anxiety', 'exercise', 'anxiety', therapist1_uuid),
        (resource2_uuid, 'Understanding Depression', 'Educational article about depression symptoms and treatment', 'article', 'depression', therapist2_uuid),
        (gen_random_uuid(), 'Mindfulness Meditation Guide', '10-minute guided meditation for stress relief', 'audio', 'meditation', therapist2_uuid);

    -- Insert sample mood entries
    INSERT INTO public.mood_entries (user_id, mood_value, notes, energy_level, stress_level, sleep_hours) VALUES
        (student1_uuid, 'good', 'Feeling better after therapy session', 4, 2, 7.5),
        (student1_uuid, 'neutral', 'Average day, some work stress', 3, 3, 6.8),
        (student2_uuid, 'excellent', 'Great day with friends', 5, 1, 8.2);

    -- Insert sample wellness goals
    INSERT INTO public.wellness_goals (user_id, title, description, target_value, current_value, unit, category) VALUES
        (student1_uuid, 'Daily Meditation', 'Meditate for 10 minutes each day', 10, 7, 'minutes', 'meditation'),
        (student1_uuid, 'Better Sleep', 'Get 8 hours of sleep per night', 8, 7.2, 'hours', 'sleep'),
        (student2_uuid, 'Mood Tracking', 'Log mood daily for better awareness', 7, 5, 'days', 'mood');

    -- Insert chat session and messages
    INSERT INTO public.chat_sessions (id, client_id, therapist_id, appointment_id, title) VALUES
        (chat_session_uuid, student1_uuid, therapist1_uuid, appointment1_uuid, 'Anxiety Support Session');

    INSERT INTO public.chat_messages (session_id, sender_id, content) VALUES
        (chat_session_uuid, student1_uuid, 'Hi Dr. Wilson, I have been feeling really anxious lately'),
        (chat_session_uuid, therapist1_uuid, 'I understand. Can you tell me more about what triggers your anxiety?'),
        (chat_session_uuid, student1_uuid, 'Mostly work deadlines and social situations'),
        (chat_session_uuid, therapist1_uuid, 'Let us work on some coping strategies together');

    -- Insert sample community posts
    INSERT INTO public.community_posts (author_id, title, content, category, is_anonymous) VALUES
        (student1_uuid, 'My Journey with Anxiety', 'Sharing my experience with managing anxiety through therapy', 'anxiety', true),
        (student2_uuid, 'Meditation Tips for Beginners', 'Here are some simple meditation techniques that helped me', 'meditation', true);

    -- Insert sample notifications
    INSERT INTO public.notifications (user_id, title, message, notification_type, related_id) VALUES
        (student1_uuid, 'Appointment Reminder', 'You have an appointment with Dr. Sarah Wilson in 2 hours', 'appointment', appointment1_uuid),
        (student1_uuid, 'New Resource Available', 'Dr. Wilson shared a new breathing exercise', 'reminder', resource1_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;