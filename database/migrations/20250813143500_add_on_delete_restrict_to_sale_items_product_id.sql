ALTER TABLE public.sale_items
DROP CONSTRAINT IF EXISTS fk_sale_items_product_id, -- Drop existing FK if it exists
ADD CONSTRAINT fk_sale_items_product_id
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;