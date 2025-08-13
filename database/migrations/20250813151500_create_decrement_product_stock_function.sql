CREATE OR REPLACE FUNCTION decrement_product_stock(product_id_param UUID, quantity_param INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = stock_quantity - quantity_param
  WHERE id = product_id_param;
END;
$$ LANGUAGE plpgsql;