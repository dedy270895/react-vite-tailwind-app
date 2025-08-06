import { supabase } from '../lib/supabase';

export const authService = {
  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        };
      }
      return { 
        success: false, 
        error: 'Something went wrong during sign in. Please try again.' 
      };
    }
  },

  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return { 
          success: false, 
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        };
      }
      return { 
        success: false, 
        error: 'Something went wrong during sign up. Please try again.' 
      };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      if (error) {
        return { success: false, error: error?.message };
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: 'Something went wrong during sign out. Please try again.' 
      };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase?.auth?.getUser();
      if (error) {
        return { success: false, error: error?.message };
      }
      return { success: true, data: user };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to get current user' 
      };
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession();
      if (error) {
        return { success: false, error: error?.message };
      }
      return { success: true, data: session };
    } catch (error) {
      return { 
        success: false, 
        error: 'Failed to get session' 
      };
    }
  }
};