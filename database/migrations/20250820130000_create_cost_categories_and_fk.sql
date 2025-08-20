-- Migration: Create cost_categories table and link costs via FK

BEGIN;

-- 1) Create cost_categories table (tenant-scoped)
CREATE TABLE IF NOT EXISTS public.cost_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name varchar(120) NOT NULL,
  CONSTRAINT unique_cost_category_name_per_user UNIQUE (user_id, name)
);

-- RLS
ALTER TABLE public.cost_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can view their own cost categories." ON public.cost_categories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert their own cost categories." ON public.cost_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can update their own cost categories." ON public.cost_categories
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can delete their own cost categories." ON public.cost_categories
  FOR DELETE USING (auth.uid() = user_id);

-- 2) Add cost_category_id to costs
ALTER TABLE public.costs
  ADD COLUMN IF NOT EXISTS cost_category_id uuid REFERENCES public.cost_categories(id);

-- 3) Backfill: create categories from existing costs.category text
INSERT INTO public.cost_categories (user_id, name)
SELECT DISTINCT user_id, category
FROM public.costs
WHERE category IS NOT NULL AND category <> ''
ON CONFLICT (user_id, name) DO NOTHING;

-- 4) Link costs to cost_categories by name
UPDATE public.costs c
SET cost_category_id = cc.id
FROM public.cost_categories cc
WHERE c.category IS NOT NULL AND c.category <> ''
  AND cc.user_id = c.user_id
  AND cc.name = c.category
  AND (c.cost_category_id IS NULL);

-- 5) Helpful index
CREATE INDEX IF NOT EXISTS idx_costs_cost_category_id ON public.costs(cost_category_id);

COMMIT;
