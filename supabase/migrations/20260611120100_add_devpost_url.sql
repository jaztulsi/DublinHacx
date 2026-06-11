-- Devpost has no public API, so hackers paste their project URL from the
-- dashboard once their documents are signed. Nullable, no constraints.

ALTER TABLE public.registrations
  ADD COLUMN devpost_url text;
