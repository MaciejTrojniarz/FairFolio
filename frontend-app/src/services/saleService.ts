import { supabase } from '../supabaseClient';
import type { Sale, SaleItem, Product, DetailedSaleItem } from '../types';

export const saleService = {
  async addSale(sale: Omit<Sale, 'id' | 'timestamp'>, items: SaleItem[]): Promise<Sale & { items: DetailedSaleItem[] }> { // Changed return type
    const { data: { user } } = await supabase.auth.getUser(); // Get authenticated user
    if (!user) {
      throw new Error('User not authenticated for sale recording.');
    }

    const saleWithUserId = { ...sale, timestamp: new Date().toISOString(), user_id: user.id }; // Add user_id

    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([saleWithUserId]) // Insert with user_id
      .select();

    if (saleError) throw saleError;
    const newSale = saleData[0] as Sale;

    const itemsToInsert = items.map(item => ({
      ...item,
      sale_id: newSale.id,
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(itemsToInsert);

    if (itemsError) {
      // If sale items fail, consider rolling back the sale (requires more complex logic or database functions)
      // For now, we'll just throw the error.
      throw itemsError;
    }

    // After all inserts, re-fetch the complete sale details with items
    const { sale: fetchedSale, items: fetchedItems } = await this.fetchSaleDetails(newSale.id); // Re-use fetchSaleDetails
    return { ...fetchedSale, items: fetchedItems }; // Return sale with items
  },

  async fetchSales(): Promise<(Sale & { items: DetailedSaleItem[] })[]> {
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('*, items:sale_items(*)'); // Fetch sales and sale_items, but not products yet
    if (salesError) throw salesError;

    // Get all product IDs from fetched sale items
    const productIds = new Set<string>();
    salesData.forEach(sale => {
      (sale.items || []).forEach((item: any) => {
        productIds.add(item.product_id);
      });
    });

    // Fetch all necessary product details in one go
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, image_url, cost')
      .in('id', Array.from(productIds));
    if (productsError) throw productsError;

    const productMap = new Map<string, Product>();
    (productsData || []).forEach(p => productMap.set(p.id, p as Product));

    const salesWithItems: (Sale & { items: DetailedSaleItem[] })[] = salesData.map((sale: any) => ({
      ...sale,
      items: (sale.items || []).map((item: any) => {
        const product = productMap.get(item.product_id);
        return {
          id: item.id,
          sale_id: item.sale_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_sale: item.price_at_sale,
          product_name: product?.name || 'Unknown Product',
          product_image_url: product?.image_url || 'https://via.placeholder.com/50?text=N/A',
          product_cost: product?.cost || 0,
        };
      }),
    }));
    return salesWithItems;
  },

  async fetchSaleItems(saleId: string): Promise<SaleItem[]> {
    const { data, error } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', saleId);
    if (error) throw error;
    return data as SaleItem[];
  },

  async fetchSaleDetails(saleId: string): Promise<{ sale: Sale; items: DetailedSaleItem[] }> {
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();

    if (saleError) throw saleError;

    const { data: itemsData, error: itemsError } = await supabase
      .from('sale_items')
      .select('*') // Fetch sale_items, but not products yet
      .eq('sale_id', saleId);

    if (itemsError) throw itemsError;

    // Get all product IDs from fetched sale items
    const productIds = new Set<string>();
    (itemsData || []).forEach((item: any) => {
      productIds.add(item.product_id);
    });

    // Fetch all necessary product details in one go
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, image_url, cost')
      .in('id', Array.from(productIds));
    if (productsError) throw productsError;

    const productMap = new Map<string, Product>();
    (productsData || []).forEach(p => productMap.set(p.id, p as Product));

    const detailedItems: DetailedSaleItem[] = (itemsData || []).map((item: any) => {
      const product = productMap.get(item.product_id);
      return {
        id: item.id,
        sale_id: item.sale_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_sale: item.price_at_sale,
        product_name: product?.name || 'Unknown Product',
        product_image_url: product?.image_url || 'https://via.placeholder.com/50?text=N/A',
        product_cost: product?.cost || 0,
      };
    });

    return { sale: saleData as Sale, items: detailedItems };
  },

  async updateSale(
    saleId: string,
    updatedSaleData: Partial<Sale>,
    updatedSaleItems: DetailedSaleItem[],
    originalSaleItems: DetailedSaleItem[]
  ): Promise<Sale & { items: DetailedSaleItem[] }> { // Changed return type
    // Supabase implementation
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .update(updatedSaleData)
      .eq('id', saleId)
      .select()
      .single();

    if (saleError) throw saleError;

    // Handle sale items: compare original with updated and perform necessary operations
    const itemsToAdd = updatedSaleItems.filter(
      (newItem) => !originalSaleItems.some((oldItem) => oldItem.product_id === newItem.product_id)
    );
    const itemsToUpdate = updatedSaleItems.filter((newItem) =>
      originalSaleItems.some(
        (oldItem) =>
          oldItem.product_id === newItem.product_id && oldItem.quantity !== newItem.quantity
      )
    );
    const itemsToDelete = originalSaleItems.filter(
      (oldItem) => !updatedSaleItems.some((newItem) => newItem.product_id === oldItem.product_id)
    );

    if (itemsToAdd.length > 0) {
      await supabase.from('sale_items').insert(itemsToAdd.map(item => ({
        sale_id: saleId,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_sale: item.price_at_sale,
      })));
    }

    for (const item of itemsToUpdate) {
      await supabase.from('sale_items')
        .update({ quantity: item.quantity })
        .eq('sale_id', saleId)
        .eq('product_id', item.product_id);
    }

    if (itemsToDelete.length > 0) {
      await supabase.from('sale_items')
        .delete()
        .eq('sale_id', saleId)
        .in('product_id', itemsToDelete.map(item => item.product_id));
    }

    // After all updates, re-fetch the complete sale details with items
    const { sale, items } = await this.fetchSaleDetails(saleId); // Re-use fetchSaleDetails
    return { ...sale, items }; // Return sale with items
  },
};