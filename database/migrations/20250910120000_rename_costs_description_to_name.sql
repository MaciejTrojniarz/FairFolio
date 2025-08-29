-- Migration: Rename description column to name on costs table
BEGIN;

DO $$
BEGIN
  -- Rename if description exists and name does not
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'costs' AND column_name = 'description'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'costs' AND column_name = 'name'
  ) THEN
    ALTER TABLE public.costs RENAME COLUMN description TO name;
  END IF;
  -- Drop description if name already exists (post-rename)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'costs' AND column_name = 'name'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'costs' AND column_name = 'description'
  ) THEN
    ALTER TABLE public.costs DROP COLUMN description;
  END IF;
END
$$;

COMMIT;
