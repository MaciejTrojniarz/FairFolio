-- Migration: Drop category column from costs table
BEGIN;

-- Remove obsolete category text column
ALTER TABLE public.costs DROP COLUMN IF EXISTS category;

COMMIT;
