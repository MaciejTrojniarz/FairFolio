import { supabase } from '../supabaseClient';
import type { Category } from '../types';

export const categoryService = {
  async fetchCategories(): Promise<Category[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id);
    if (error) throw error;
    return data as Category[];
  },

  async addCategory(name: string): Promise<Category> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const { data, error } = await supabase
      .from('categories')
      .insert([{ user_id: user.id, name }])
      .select();
    if (error) throw error;
    return data[0] as Category;
  },

  async updateCategory(category: Category): Promise<Category> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const { data, error } = await supabase
      .from('categories')
      .update({ name: category.name })
      .eq('id', category.id)
      .eq('user_id', user.id)
      .select();
    if (error) throw error;
    return data[0] as Category;
  },

  async deleteCategory(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated.');
    }
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    if (error) throw error;
  },
};