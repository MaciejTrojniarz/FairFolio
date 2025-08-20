import { supabase } from '../supabaseClient';
import type { CostCategory } from '../types';

export const costCategoryService = {
  async fetchCostCategories(): Promise<CostCategory[]> {
    const { data, error } = await supabase
      .from('cost_categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return data as CostCategory[];
  },
  async addCostCategory(name: string): Promise<CostCategory> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated.');
    const { data, error } = await supabase
      .from('cost_categories')
      .insert([{ user_id: user.id, name }])
      .select()
      .single();
    if (error) throw error;
    return data as CostCategory;
  },
};
