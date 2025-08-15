-- Add creator_id column for ownership and RLS enforcement
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS creator_id uuid;

-- Set default so inserts via authenticated contexts auto-populate
ALTER TABLE public.events
  ALTER COLUMN creator_id SET DEFAULT auth.uid();

-- Add FK to auth.users (nullable to avoid breaking existing rows)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'events_creator_id_fkey'
  ) THEN
    ALTER TABLE public.events
      ADD CONSTRAINT events_creator_id_fkey
      FOREIGN KEY (creator_id)
      REFERENCES auth.users(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- Index for efficient per-user filtering
CREATE INDEX IF NOT EXISTS idx_events_creator_id ON public.events(creator_id);

-- Ensure RLS is enabled and restrictive policy is in place
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
-- Remove any public read policy
DROP POLICY IF EXISTS "Users can view public events" ON public.events;
-- Enforce creator-only access (select/update/delete/insert)
DROP POLICY IF EXISTS "Users can manage their own events" ON public.events;
CREATE POLICY "Users can manage their own events" ON public.events
FOR ALL TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());
