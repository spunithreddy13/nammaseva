-- ==============================================================================
-- NammaSeva - PostgreSQL Database Schema (Supabase)
-- Description: Multi-tier welfare scheme recommendation & application tracker
-- ==============================================================================

-- 1. PROFILES TABLE
-- Stores citizen demographics, socio-economic criteria, and state/caste records
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  dob DATE,
  gender TEXT,
  marital_status TEXT,
  state TEXT DEFAULT 'Karnataka',
  district TEXT,
  language TEXT DEFAULT 'en',
  caste TEXT, -- 'General', 'EWS', 'OBC', 'SC', 'ST'
  income TEXT, -- e.g. 'Below ₹1 Lakh', '₹1 – 2.5 Lakhs'
  occupation TEXT, -- e.g. 'student', 'farmer', 'business'
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. APPLICATIONS TABLE
-- Stores real citizen application acknowledgments and tracking timelines
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY DEFAULT ('app_' || floor(random() * 1000000)::text),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  scheme_id INTEGER NOT NULL,
  scheme_name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_color TEXT DEFAULT '#4F46E5',
  reference_no TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  applied_date DATE DEFAULT CURRENT_DATE,
  last_updated DATE DEFAULT CURRENT_DATE,
  timeline JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SAVED SCHEMES TABLE (BOOKMARKS)
-- Stores bookmarked schemes for quick citizen access
CREATE TABLE IF NOT EXISTS public.saved_schemes (
  id TEXT PRIMARY KEY DEFAULT ('saved_' || floor(random() * 1000000)::text),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  scheme_id INTEGER NOT NULL,
  scheme_name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_color TEXT DEFAULT '#4F46E5',
  type TEXT DEFAULT 'Government',
  match_score INTEGER DEFAULT 0,
  deadline TEXT,
  description TEXT,
  state TEXT DEFAULT 'Central',
  saved_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, scheme_id)
);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR DATA PRIVACY

-- Profiles Policies: Users can only view & update their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Applications Policies: Users can only manage their own tracked applications
CREATE POLICY "Users can view own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own applications"
  ON public.applications FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Saved Schemes Policies: Users can only manage their own bookmarks
CREATE POLICY "Users can view own saved schemes"
  ON public.saved_schemes FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own saved schemes"
  ON public.saved_schemes FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own saved schemes"
  ON public.saved_schemes FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 6. AUTOMATIC TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
