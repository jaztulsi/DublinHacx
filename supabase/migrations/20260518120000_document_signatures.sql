-- Per-user signed status for the dashboard "documents to sign" flow.
CREATE TABLE public.document_signatures (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_key text NOT NULL,
  signed_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, document_key)
);

ALTER TABLE public.document_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own signatures"
  ON public.document_signatures
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own signatures"
  ON public.document_signatures
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own signatures"
  ON public.document_signatures
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_document_signatures_user ON public.document_signatures (user_id);
