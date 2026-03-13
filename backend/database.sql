-- Profiles table to extend Supabase Auth users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  career_goal TEXT,
  subscription_status TEXT DEFAULT 'free', -- 'free' or 'pro'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roadmaps table
CREATE TABLE public.roadmaps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  career_path TEXT NOT NULL,
  total_skills INTEGER DEFAULT 0,
  completed_skills INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stages table
CREATE TABLE public.stages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
  level INTEGER NOT NULL, -- 1, 2, 3
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_id UUID REFERENCES public.stages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tools TEXT[], -- Array of tools
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments (Future Ready)
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'success', 'failed'
  razorpay_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
-- INSERT done via backend service role, but this covers direct client inserts:
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own roadmaps" ON public.roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own roadmaps" ON public.roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roadmaps" ON public.roadmaps FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stages" ON public.stages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.roadmaps WHERE roadmaps.id = stages.roadmap_id AND roadmaps.user_id = auth.uid())
);
CREATE POLICY "Users can insert own stages" ON public.stages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.roadmaps WHERE roadmaps.id = stages.roadmap_id AND roadmaps.user_id = auth.uid())
);

CREATE POLICY "Users can view/update own skills" ON public.skills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stages s JOIN public.roadmaps r ON s.roadmap_id = r.id WHERE s.id = skills.stage_id AND r.user_id = auth.uid())
);

-- Payments RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
