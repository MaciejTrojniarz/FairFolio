ALTER TABLE public.sales
DROP CONSTRAINT IF EXISTS fk_sales_event_id, -- Drop existing FK if it exists
ADD CONSTRAINT fk_sales_event_id
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE RESTRICT;