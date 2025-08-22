-- Migration: Rename description column to name on costs table
BEGIN;

-- Rename the description column to name for consistency
ALTER TABLE public.costs RENAME COLUMN description TO name;

COMMIT;
