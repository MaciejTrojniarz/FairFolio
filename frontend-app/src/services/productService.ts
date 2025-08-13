import { supabase } from '../supabaseClient';
import type { Product } from '../types';

const PRODUCT_IMAGES_BUCKET = 'product-images'; // Define your Supabase Storage bucket name

export const productService = {
  async uploadProductImage(file: File, productId: string): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated for image upload.');
    }

    const fileExtension = file.name.split('.').pop();
    // Store images in a user-specific folder: user_id/product_id.extension
    const filePath = `${user.id}/${productId}.${fileExtension}`;

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
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) throw error;
    return data as Product[];
  },

  async addProduct(product: Omit<Product, 'id' | 'user_id'>): Promise<Product> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const productWithUserId = { ...product, user_id: user.id };

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          user_id: user.id,
          name: product.name,
          description: product.description,
          price: product.price,
          cost: product.cost,
          image_url: product.image_url,
          notes: product.notes,
          link: product.link,
        },
      ])
      .select();
    if (error) throw error;

    return data[0] as Product;
  },

  async updateProduct(product: Product): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        cost: product.cost,
        image_url: product.image_url,
        notes: product.notes,
        link: product.link,
      })
      .eq('id', product.id)
      .select();
    if (error) throw error;
    return data[0] as Product;
  },

  async deleteProduct(id: string): Promise<void> {
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