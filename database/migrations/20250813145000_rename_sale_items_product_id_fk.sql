ALTER TABLE public.sale_items
DROP CONSTRAINT IF EXISTS sale_items_product_id_fkey; -- Drop the default/existing FK name

ALTER TABLE public.sale_items
ADD CONSTRAINT fk_sale_items_to_products_via_product_id -- Add a new, unique FK name
FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;