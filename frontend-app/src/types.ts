export interface Product {
  id: string;
  user_id: string;
  category_id?: string | null;
  name: string;
  description?: string;
  price: number;
  cost: number;
  image_url?: string; // New field for product image
  notes?: string;
  link?: string;
  stock_quantity?: number;
  category_name?: string; // New field for category name
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
}

export interface Sale {
  id: string;
  user_id: string;
  event_id?: string | null; // New: Optional link to an event
  timestamp: string; // ISO date string
  total_amount: number;
  comment?: string;
}

export interface SaleWithSaleItems extends Sale {
  items: DetailedSaleItem[];
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  price_at_sale: number;
}

// New type for detailed sale items
export interface DetailedSaleItem extends SaleItem {
  product_name: string;
  product_image_url?: string;
  product_cost: number;
}

export interface Event {
  id: string;
  creator_id?: string;
  name: string;
  description?: string;
  link?: string;
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  venue: string;
  city: string;
}

// UI specific type for items in the basket
export interface BasketItem extends Product {
  quantity: number;
}



export interface Cost {
  id: string;
  user_id: string;
  event_id?: string | null;
  name: string; // Short label for the expense
  category?: string | null; // e.g., Booth, Travel, Lodging
  amount: number;
  date: string; // ISO date string
}

export interface Profile {
  id: string;
  name: string;
  language: string;
  theme: string;
}