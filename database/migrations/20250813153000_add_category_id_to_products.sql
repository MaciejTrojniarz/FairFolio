ALTER TABLE public.products
ADD COLUMN category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;