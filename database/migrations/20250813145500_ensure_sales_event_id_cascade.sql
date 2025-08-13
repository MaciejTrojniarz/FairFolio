ALTER TABLE public.sales
DROP CONSTRAINT IF EXISTS sales_event_id_fkey;

ALTER TABLE public.sales
DROP CONSTRAINT IF EXISTS fk_sales_event_id;

ALTER TABLE public.sales
ADD CONSTRAINT fk_sales_event_id
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;