-- Status enum
CREATE TYPE public.registration_status AS ENUM ('accepted', 'waitlisted');

-- Registrations table
CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  school text NOT NULL,
  grad_year text NOT NULL,
  exp_level text NOT NULL,
  dietary text NOT NULL,
  tshirt text NOT NULL,
  idea text,
  github text,
  linkedin text,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text NOT NULL,
  emergency_contact text NOT NULL,
  team_name text,
  teammate_emails text[] NOT NULL DEFAULT '{}',
  code_of_conduct boolean NOT NULL DEFAULT false,
  photo_release boolean NOT NULL DEFAULT false,
  parent_signature boolean NOT NULL DEFAULT false,
  status public.registration_status NOT NULL DEFAULT 'accepted',
  confirmed boolean NOT NULL DEFAULT false
);

-- Waitlist table (mirrors registrations + position)
CREATE TABLE public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  position bigserial NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  school text NOT NULL,
  grad_year text NOT NULL,
  exp_level text NOT NULL,
  dietary text NOT NULL,
  tshirt text NOT NULL,
  idea text,
  github text,
  linkedin text,
  parent_name text NOT NULL,
  parent_email text NOT NULL,
  parent_phone text NOT NULL,
  emergency_contact text NOT NULL,
  team_name text,
  teammate_emails text[] NOT NULL DEFAULT '{}',
  code_of_conduct boolean NOT NULL DEFAULT false,
  photo_release boolean NOT NULL DEFAULT false,
  parent_signature boolean NOT NULL DEFAULT false,
  confirmed boolean NOT NULL DEFAULT false
);

-- Public count function (no PII exposure)
CREATE OR REPLACE FUNCTION public.get_registration_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.registrations;
$$;

GRANT EXECUTE ON FUNCTION public.get_registration_count() TO anon, authenticated;

-- RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (form is public)
CREATE POLICY "Anyone can register"
  ON public.registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies = locked down.
-- Admin route uses the service role key (bypasses RLS).

CREATE INDEX idx_registrations_created_at ON public.registrations (created_at DESC);
CREATE INDEX idx_waitlist_position ON public.waitlist (position);
