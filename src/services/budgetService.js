import { supabase } from '../lib/supabase';

export const budgetService = {
  async getBudgets(userId) {
    try {
      const { data, error } = await supabase?.from('budgets')?.select(`
          id,
          name,
          amount,
          period,
          start_date,
          end_date,
          is_active,
          created_at,
          updated_at,
          categories!inner(id, name, color, icon, category_type)
        `)?.eq('user_id', userId)?.eq('is_active', true)?.order('created_at', { ascending: false });

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
        error: 'Failed to load budgets' 
      };
    }
  },

  async createBudget(budgetData) {
    try {
      const { data, error } = await supabase?.from('budgets')?.insert(budgetData)?.select(`
          id,
          name,
          amount,
          period,
          start_date,
          end_date,
          is_active,
          created_at,
          updated_at,
          categories!inner(id, name, color, icon, category_type)
        `)?.single();

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
        error: 'Failed to create budget' 
      };
    }
  },

  async updateBudget(budgetId, updates) {
    try {
      const { data, error } = await supabase?.from('budgets')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', budgetId)?.select(`
          id,
          name,
          amount,
          period,
          start_date,
          end_date,
          is_active,
          created_at,
          updated_at,
          categories!inner(id, name, color, icon, category_type)
        `)?.single();

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
        error: 'Failed to update budget' 
      };
    }
  },

  async deleteBudget(budgetId) {
    try {
      const { error } = await supabase?.from('budgets')?.update({ is_active: false })?.eq('id', budgetId);

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
        error: 'Failed to delete budget' 
      };
    }
  },

  async getBudgetSpending(userId, budgetId, startDate, endDate) {
    try {
      const { data, error } = await supabase?.from('transactions')?.select('amount')?.eq('user_id', userId)?.eq('transaction_type', 'expense')?.eq('status', 'completed')?.gte('transaction_date', startDate)?.lte('transaction_date', endDate)?.in('category_id', [budgetId]);

      if (error) {
        return { success: false, error: error?.message };
      }

      const totalSpent = data?.reduce((sum, transaction) => {
        return sum + Math.abs(parseFloat(transaction?.amount || 0));
      }, 0) || 0;

      return { success: true, data: totalSpent };
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
        error: 'Failed to calculate budget spending' 
      };
    }
  }
};