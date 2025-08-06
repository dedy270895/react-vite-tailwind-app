import { supabase } from '../lib/supabase';

export const accountService = {
  async getAccounts(userId) {
    try {
      const { data, error } = await supabase?.from('accounts')?.select('*')?.eq('user_id', userId)?.eq('is_active', true)?.order('created_at', { ascending: false });

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
        error: 'Failed to load accounts' 
      };
    }
  },

  async createAccount(accountData) {
    try {
      const { data, error } = await supabase?.from('accounts')?.insert(accountData)?.select()?.single();

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
        error: 'Failed to create account' 
      };
    }
  },

  async updateAccount(accountId, updates) {
    try {
      const { data, error } = await supabase?.from('accounts')?.update({ ...updates, updated_at: new Date()?.toISOString() })?.eq('id', accountId)?.select()?.single();

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
        error: 'Failed to update account' 
      };
    }
  },

  async deleteAccount(accountId) {
    try {
      const { error } = await supabase?.from('accounts')?.update({ is_active: false })?.eq('id', accountId);

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
        error: 'Failed to delete account' 
      };
    }
  },

  async getTotalBalance(userId) {
    try {
      const { data, error } = await supabase?.from('accounts')?.select('balance, account_type')?.eq('user_id', userId)?.eq('is_active', true);

      if (error) {
        return { success: false, error: error?.message };
      }

      let totalBalance = 0;
      data?.forEach(account => {
        // Credit cards show negative balance, so add them as negative
        if (account?.account_type === 'credit_card') {
          totalBalance += parseFloat(account?.balance || 0);
        } else {
          totalBalance += parseFloat(account?.balance || 0);
        }
      });

      return { success: true, data: totalBalance };
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
        error: 'Failed to calculate total balance' 
      };
    }
  }
};