-- Backfill creator_id and finalize constraints for events

-- If events.user_id exists, copy values into creator_id where missing
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'user_id'
  ) THEN
    UPDATE public.events SET creator_id = COALESCE(creator_id, user_id::uuid)
    WHERE creator_id IS NULL;
  END IF;
END $$;

-- Optionally set NOT NULL if no remaining nulls
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.events WHERE creator_id IS NULL
  ) THEN
    ALTER TABLE public.events ALTER COLUMN creator_id SET NOT NULL;
  END IF;
END $$;

-- Re-assert RLS creator-only policy (idempotent)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own events" ON public.events;
CREATE POLICY "Users can manage their own events" ON public.events
FOR ALL TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());
