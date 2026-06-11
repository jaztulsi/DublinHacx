-- Link registrations/waitlist rows to authenticated users so the dashboard can
-- pull a hacker's own registration. Registration itself is still anonymous, so
-- user_id is nullable and backfilled (by email) once the hacker signs in.

ALTER TABLE public.registrations
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.waitlist
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_registrations_user_id ON public.registrations (user_id);

-- A signed-in hacker can read their own registration row directly with the
-- anon/publishable key. Inserts still go through the service-role server fn.
CREATE POLICY "Users can read own registration"
  ON public.registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
