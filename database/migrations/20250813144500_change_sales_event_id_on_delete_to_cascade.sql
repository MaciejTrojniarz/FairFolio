ALTER TABLE public.sales
DROP CONSTRAINT IF EXISTS fk_sales_event_id;

ALTER TABLE public.sales
ADD CONSTRAINT fk_sales_event_id
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;