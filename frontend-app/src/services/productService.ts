import { supabase } from '../supabaseClient';
import type { Product } from '../types';

const PRODUCT_IMAGES_BUCKET = 'product-images'; // Define your Supabase Storage bucket name
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const MOCK_API_BASE_URL = 'http://localhost:3001';

export const productService = {
  async uploadProductImage(file: File, productId: string): Promise<string> {
    if (USE_MOCK_DATA) {
      console.warn('Mock data in use: Image upload is simulated.');
      // Simulate upload and return a placeholder URL
      return `https://via.placeholder.com/150?text=Mock+Image+${productId}`;
    }

    const fileExtension = file.name.split('.').pop();
    const filePath = `${productId}.${fileExtension}`; // Unique path for each product image

    const { data, error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite if file with same name exists
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    if (!publicUrlData) throw new Error('Could not get public URL for image.');

    return publicUrlData.publicUrl;
  },

  async fetchProducts(): Promise<Product[]> {
    if (USE_MOCK_DATA) {
      console.log('Fetching products from mock server...');
      const response = await fetch(`${MOCK_API_BASE_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch mock products');
      return response.json();
    }

    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) throw error;
    return data as Product[];
  },

  async addProduct(product: Omit<Product, 'id' | 'user_id' | 'image_url'>, imageFile?: File): Promise<Product> {
    if (USE_MOCK_DATA) {
      console.log('Adding product to mock server...');
      const newProduct = {
        ...product,
        id: `mock-${Date.now()}`, // Generate a mock ID
        user_id: 'mock-user-id',
        image_url: imageFile ? await this.uploadProductImage(imageFile, `mock-${Date.now()}`) : 'https://via.placeholder.com/150?text=No+Image',
      };
      const response = await fetch(`${MOCK_API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error('Failed to add mock product');
      return response.json();
    }

    // In a real app, user_id would come from auth.uid()
    // For now, we'll use a placeholder or assume it's handled by RLS/Supabase functions
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    if (error) throw error;

    let newProduct = data[0] as Product;

    if (imageFile) {
      const imageUrl = await this.uploadProductImage(imageFile, newProduct.id);
      const { data: updatedData, error: updateError } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', newProduct.id)
        .select();
      if (updateError) throw updateError;
      newProduct = updatedData[0] as Product;
    }
    return newProduct;
  },

  async updateProduct(product: Product, imageFile?: File): Promise<Product> {
    if (USE_MOCK_DATA) {
      console.log('Updating product on mock server...');
      let updatedProduct = product;
      if (imageFile) {
        const imageUrl = await this.uploadProductImage(imageFile, product.id);
        updatedProduct = { ...product, image_url: imageUrl };
      }
      const response = await fetch(`${MOCK_API_BASE_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) throw new Error('Failed to update mock product');
      return response.json();
    }

    let updatedProduct = product;
    if (imageFile) {
      const imageUrl = await this.uploadProductImage(imageFile, product.id);
      updatedProduct = { ...product, image_url: imageUrl };
    }

    const { data, error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', updatedProduct.id)
      .select();
    if (error) throw error;
    return data[0] as Product;
  },

  async deleteProduct(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      console.log('Deleting product from mock server...');
      const response = await fetch(`${MOCK_API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete mock product');
      return;
    }

    // Optional: Delete image from storage when product is deleted
    // This would require fetching the product first to get the image_url
    // For simplicity, we'll just delete the product record for now.
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};