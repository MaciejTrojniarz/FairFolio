import { supabase } from '../supabaseClient';
import type { Sale, SaleItem, Product, DetailedSaleItem } from '../types'; // Added Product, DetailedSaleItem

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const MOCK_API_BASE_URL = 'http://localhost:3001';

export const saleService = {
  async recordSale(sale: Omit<Sale, 'id' | 'user_id' | 'timestamp'>, items: Omit<SaleItem, 'id' | 'sale_id'>[]): Promise<Sale> {
    if (USE_MOCK_DATA) {
      console.log('Recording sale to mock server...');
      const newSale: Sale = {
        ...sale,
        id: `mock-sale-${Date.now()}`,
        user_id: 'mock-user-id',
        timestamp: new Date().toISOString(),
      } as Sale; // Cast to Sale to satisfy type, as id and timestamp are generated

      // Simulate adding sale to mock server
      const saleResponse = await fetch(`${MOCK_API_BASE_URL}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSale),
      });
      if (!saleResponse.ok) throw new Error('Failed to record mock sale');

      // Simulate adding sale items to mock server
      const itemsToInsert = items.map(item => ({
        ...item,
        id: `mock-sale-item-${Date.now()}-${Math.random()}`,
        sale_id: newSale.id,
      }));

      for (const item of itemsToInsert) {
        const itemResponse = await fetch(`${MOCK_API_BASE_URL}/sale_items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!itemResponse.ok) throw new Error('Failed to record mock sale item');
      }

      return newSale;
    }

    // In a real app, user_id would come from auth.uid()
    // For now, we'll use a placeholder or assume it's handled by RLS/Supabase functions

    // Start a transaction (Supabase doesn't have native transactions for RPC, so this is a basic approach)
    // For more robust transactions, consider Supabase Functions or database functions.
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([{ ...sale, timestamp: new Date().toISOString() }])
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

    return newSale;
  },

  async fetchSales(): Promise<(Sale & { items: DetailedSaleItem[] })[]> {
    if (USE_MOCK_DATA) {
      console.log('Fetching sales with items from mock server...');
      const salesResponse = await fetch(`${MOCK_API_BASE_URL}/sales`);
      if (!salesResponse.ok) throw new Error('Failed to fetch mock sales');
      const sales: Sale[] = await salesResponse.json();

      const itemsResponse = await fetch(`${MOCK_API_BASE_URL}/sale_items`);
      if (!itemsResponse.ok) throw new Error('Failed to fetch mock sale items');
      const allSaleItems: SaleItem[] = await itemsResponse.json();

      const productsResponse = await fetch(`${MOCK_API_BASE_URL}/products`);
      if (!productsResponse.ok) throw new Error('Failed to fetch mock products');
      const products: Product[] = await productsResponse.json();

      const salesWithItems: (Sale & { items: DetailedSaleItem[] })[] = sales.map(sale => {
        const saleItems = allSaleItems.filter(item => item.sale_id === sale.id);
        const detailedItems: DetailedSaleItem[] = saleItems.map(item => {
          const product = products.find(p => p.id === item.product_id);
          return {
            ...item,
            product_name: product?.name || 'Unknown Product',
            product_image_url: product?.image_url || 'https://via.placeholder.com/50?text=N/A',
            product_cost: product?.cost || 0,
          };
        });
        return { ...sale, items: detailedItems };
      });
      return salesWithItems;
    }

    const { data, error } = await supabase
      .from('sales')
      .select('*, items:sale_items(*, products(name, image_url, cost))'); // Fetch sales with related items and product details
    if (error) throw error;

    const salesWithItems: (Sale & { items: DetailedSaleItem[] })[] = data.map((sale: any) => ({
      ...sale,
      items: sale.items.map((item: any) => ({
        id: item.id,
        sale_id: item.sale_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_sale: item.price_at_sale,
        product_name: item.products.name,
        product_image_url: item.products.image_url,
        product_cost: item.products.cost,
      })),
    }));
    return salesWithItems;
  },

  async fetchSaleItems(saleId: string): Promise<SaleItem[]> {
    if (USE_MOCK_DATA) {
      console.log(`Fetching sale items for sale ${saleId} from mock server...`);
      const response = await fetch(`${MOCK_API_BASE_URL}/sale_items?sale_id=${saleId}`);
      if (!response.ok) throw new Error('Failed to fetch mock sale items');
      return response.json();
    }

    const { data, error } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', saleId);
    if (error) throw error;
    return data as SaleItem[];
  },

  async fetchSaleDetails(saleId: string): Promise<{ sale: Sale; items: DetailedSaleItem[] }> {
    if (USE_MOCK_DATA) {
      console.log(`Fetching sale details for sale ${saleId} from mock server...`);
      const saleResponse = await fetch(`${MOCK_API_BASE_URL}/sales/${saleId}`);
      if (!saleResponse.ok) throw new Error('Failed to fetch mock sale');
      const sale = await saleResponse.json();

      const itemsResponse = await fetch(`${MOCK_API_BASE_URL}/sale_items?sale_id=${saleId}`);
      if (!itemsResponse.ok) throw new Error('Failed to fetch mock sale items');
      const saleItems = await itemsResponse.json();

      // Fetch all products to get details for sale items
      const productsResponse = await fetch(`${MOCK_API_BASE_URL}/products`);
      if (!productsResponse.ok) throw new Error('Failed to fetch mock products');
      const products: Product[] = await productsResponse.json();

      const detailedItems: DetailedSaleItem[] = saleItems.map((item: SaleItem) => {
        const product = products.find(p => p.id === item.product_id);
        return {
          ...item,
          product_name: product?.name || 'Unknown Product',
          product_image_url: product?.image_url || 'https://via.placeholder.com/50?text=N/A',
          product_cost: product?.cost || 0,
        };
      });

      return { sale, items: detailedItems };
    }

    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();

    if (saleError) throw saleError;

    const { data: itemsData, error: itemsError } = await supabase
      .from('sale_items')
      .select('*, products(name, image_url, cost)') // Fetch product details directly
      .eq('sale_id', saleId);

    if (itemsError) throw itemsError;

    const detailedItems: DetailedSaleItem[] = itemsData.map((item: any) => ({
      id: item.id,
      sale_id: item.sale_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_sale: item.price_at_sale,
      product_name: item.products.name,
      product_image_url: item.products.image_url,
      product_cost: item.products.cost,
    }));

    return { sale: saleData as Sale, items: detailedItems };
  },

  async updateSale(
    saleId: string,
    updatedSaleData: Partial<Sale>,
    updatedSaleItems: DetailedSaleItem[],
    originalSaleItems: DetailedSaleItem[]
  ): Promise<Sale> {
    if (USE_MOCK_DATA) {
      console.log(`Updating sale ${saleId} on mock server...`);
      // Simulate updating sale data
      const saleResponse = await fetch(`${MOCK_API_BASE_URL}/sales/${saleId}`, {
        method: 'PATCH', // Use PATCH for partial updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSaleData),
      });
      if (!saleResponse.ok) throw new Error('Failed to update mock sale data');
      const updatedSale = await saleResponse.json();

      // Simulate updating sale items
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

      for (const item of itemsToAdd) {
        await fetch(`${MOCK_API_BASE_URL}/sale_items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, sale_id: saleId, id: `mock-sale-item-${Date.now()}-${Math.random()}` }),
        });
      }

      for (const item of itemsToUpdate) {
        const oldItem = originalSaleItems.find(oi => oi.product_id === item.product_id);
        if (oldItem) {
          await fetch(`${MOCK_API_BASE_URL}/sale_items/${oldItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
        }
      }

      for (const item of itemsToDelete) {
        await fetch(`${MOCK_API_BASE_URL}/sale_items/${item.id}`, {
          method: 'DELETE',
        });
      }

      return updatedSale;
    }

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

    return saleData as Sale;
  },
};