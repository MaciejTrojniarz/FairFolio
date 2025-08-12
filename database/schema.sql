-- Schema for FaireFolio Application

-- Table for Categories
-- Groups products into different categories (e.g., Books, Jewelry)
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id), -- Tenant ID
    name varchar(120) NOT NULL,
    -- Add a unique constraint for category names per user
    CONSTRAINT unique_category_name_per_user UNIQUE (user_id, name)
);

-- RLS for categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own categories." ON public.categories
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own categories." ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories." ON public.categories
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories." ON public.categories
  FOR DELETE USING (auth.uid() = user_id);


-- Table for Products
-- Stores product details for each merchant
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id), -- Tenant ID
    category_id uuid REFERENCES public.categories(id), -- Optional, for grouping products
    name varchar(120) NOT NULL,
    description text, -- Max 4000 characters
    price numeric(10, 2) NOT NULL,
    cost numeric(10, 2) NOT NULL,
    -- Add a unique constraint for product names per user
    CONSTRAINT unique_product_name_per_user UNIQUE (user_id, name)
);

-- RLS for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own products." ON public.products
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own products." ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products." ON public.products
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products." ON public.products
  FOR DELETE USING (auth.uid() = user_id);


-- Table for Events
-- Stores global event information, not tenant-aware
CREATE TABLE public.events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(180) NOT NULL,
    description text, -- Max 3000 characters
    link text, -- Optional link to event website
    start_date date NOT NULL,
    end_date date NOT NULL,
    venue text,
    city text
);
-- RLS is not applied to events table as it's globally accessible.


-- Table for Sales
-- Records individual sales transactions
CREATE TABLE public.sales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id), -- Tenant ID
    event_id uuid REFERENCES public.events(id), -- Optional, link sale to an event
    timestamp timestamptz NOT NULL DEFAULT now(),
    total_amount numeric(10, 2) NOT NULL -- Calculated at application level
);

-- RLS for sales table
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sales." ON public.sales
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sales." ON public.sales
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sales." ON public.sales
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sales." ON public.sales
  FOR DELETE USING (auth.uid() = user_id);


-- Table for Sale Items
-- Details of products included in each sale
CREATE TABLE public.sale_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id uuid NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE, -- If sale is deleted, items are too
    product_id uuid NOT NULL REFERENCES public.products(id),
    quantity integer NOT NULL,
    price_at_sale numeric(10, 2) NOT NULL -- Price at the time of sale for historical accuracy
);

-- RLS for sale_items table (inherits from sales via sale_id)
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own sale items." ON public.sale_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_id AND sales.user_id = auth.uid()));
CREATE POLICY "Users can insert their own sale items." ON public.sale_items
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_id AND sales.user_id = auth.uid()));
CREATE POLICY "Users can update their own sale items." ON public.sale_items
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_id AND sales.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_id AND sales.user_id = auth.uid()));
CREATE POLICY "Users can delete their own sale items." ON public.sale_items
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.sales WHERE sales.id = sale_id AND sales.user_id = auth.uid()));


-- Table for Costs
-- Tracks expenses related to events or general business
CREATE TABLE public.costs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id), -- Tenant ID
    event_id uuid REFERENCES public.events(id), -- Optional, link cost to an event
    description varchar(300) NOT NULL,
    amount numeric(10, 2) NOT NULL,
    date date NOT NULL
);

-- RLS for costs table
ALTER TABLE public.costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own costs." ON public.costs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own costs." ON public.costs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own costs." ON public.costs
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own costs." ON public.costs
  FOR DELETE USING (auth.uid() = user_id);
