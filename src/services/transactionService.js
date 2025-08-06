import { supabase } from '../lib/supabase';

export const transactionService = {
  async getTransactions(userId, filters = {}) {
    try {
      let query = supabase?.from('transactions')?.select(`
          id,
          transaction_type,
          amount,
          description,
          notes,
          transaction_date,
          status,
          created_at,
          updated_at,
          accounts!inner(id, name, account_type),
          to_account:to_account_id(id, name, account_type),
          categories(id, name, color, icon, category_type)
        `)?.eq('user_id', userId)?.order('transaction_date', { ascending: false });

      // Apply filters
      if (filters?.type && filters?.type !== 'all') {
        query = query?.eq('transaction_type', filters?.type);
      }

      if (filters?.category && filters?.category !== 'all') {
        query = query?.eq('category_id', filters?.category);
      }

      if (filters?.dateFrom) {
        query = query?.gte('transaction_date', filters?.dateFrom);
      }

      if (filters?.dateTo) {
        query = query?.lte('transaction_date', filters?.dateTo);
      }

      if (filters?.amountMin) {
        query = query?.gte('amount', Math.abs(parseFloat(filters?.amountMin)));
      }

      if (filters?.amountMax) {
        query = query?.lte('amount', Math.abs(parseFloat(filters?.amountMax)));
      }

      if (filters?.search) {
        query = query?.or(`description.ilike.%${filters?.search}%,notes.ilike.%${filters?.search}%`);
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
        error: 'Failed to load transactions' 
      };
    }
  },

  async createTransaction(transactionData) {
    try {
      const { data, error } = await supabase?.from('transactions')?.insert(transactionData)?.select(`
          id,
          transaction_type,
          amount,
          description,
          notes,
          transaction_date,
          status,
          created_at,
          updated_at,
          accounts!inner(id, name, account_type),
          to_account:to_account_id(id, name, account_type),
          categories(id, name, color, icon, category_type)
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
        error: 'Failed to create transaction' 
      };
    }
  },

  async updateTransaction(transactionId, updates) {
    try {
      const { data, error } = await supabase?.from('transactions')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', transactionId)?.select(`
          id,
          transaction_type,
          amount,
          description,
          notes,
          transaction_date,
          status,
          created_at,
          updated_at,
          accounts!inner(id, name, account_type),
          to_account:to_account_id(id, name, account_type),
          categories(id, name, color, icon, category_type)
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
        error: 'Failed to update transaction' 
      };
    }
  },

  async deleteTransaction(transactionId) {
    try {
      const { error } = await supabase?.from('transactions')?.delete()?.eq('id', transactionId);

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
        error: 'Failed to delete transaction' 
      };
    }
  },

  async getTransactionStats(userId, dateFrom, dateTo) {
    try {
      const { data, error } = await supabase?.from('transactions')?.select('transaction_type, amount')?.eq('user_id', userId)?.gte('transaction_date', dateFrom)?.lte('transaction_date', dateTo)?.eq('status', 'completed');

      if (error) {
        return { success: false, error: error?.message };
      }

      const stats = {
        income: 0,
        expenses: 0,
        transfers: 0,
        total_transactions: data?.length || 0
      };

      data?.forEach(transaction => {
        switch (transaction?.transaction_type) {
          case 'income':
            stats.income += parseFloat(transaction?.amount || 0);
            break;
          case 'expense':
            stats.expenses += Math.abs(parseFloat(transaction?.amount || 0));
            break;
          case 'transfer':
            stats.transfers += parseFloat(transaction?.amount || 0);
            break;
        }
      });

      stats.savings = stats?.income - stats?.expenses;

      return { success: true, data: stats };
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
        error: 'Failed to load transaction stats' 
      };
    }
  }
};