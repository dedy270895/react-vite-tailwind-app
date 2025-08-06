import { supabase } from '../lib/supabase';

export const categoryService = {
  async getCategories(userId, type = null) {
    try {
      let query = supabase?.from('categories')?.select('*')?.eq('user_id', userId)?.eq('is_active', true)?.order('name', { ascending: true });

      if (type) {
        query = query?.eq('category_type', type);
      }

      const { data, error } = await query;

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { 
        success: false, 
        error: 'Failed to load categories' 
      };
    }
  },

  async createCategory(categoryData) {
    try {
      const { data, error } = await supabase?.from('categories')?.insert(categoryData)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { 
        success: false, 
        error: 'Failed to create category' 
      };
    }
  },

  async updateCategory(categoryId, updates) {
    try {
      const { data, error } = await supabase?.from('categories')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', categoryId)?.select()?.single();

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { 
        success: false, 
        error: 'Failed to update category' 
      };
    }
  },

  async deleteCategory(categoryId) {
    try {
      const { error } = await supabase?.from('categories')?.update({ is_active: false })?.eq('id', categoryId);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      return { 
        success: false, 
        error: 'Failed to delete category' 
      };
    }
  }
};