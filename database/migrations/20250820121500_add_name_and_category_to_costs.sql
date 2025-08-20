-- Migration: Add name and category to costs, backfill, and indexes

BEGIN;

-- 1) Add new columns if they do not exist
ALTER TABLE public.costs
  ADD COLUMN IF NOT EXISTS name varchar(180),
  ADD COLUMN IF NOT EXISTS category varchar(120);

-- 2) Backfill name from existing description for legacy rows
UPDATE public.costs
SET name = LEFT(description, 180)
WHERE name IS NULL;

-- 3) Enforce NOT NULL on name after backfill
ALTER TABLE public.costs
  ALTER COLUMN name SET NOT NULL;

-- 4) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_costs_event_id ON public.costs(event_id);
CREATE INDEX IF NOT EXISTS idx_costs_user_id_date ON public.costs(user_id, date DESC);

COMMIT;
