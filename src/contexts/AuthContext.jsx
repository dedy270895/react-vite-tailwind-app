import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase?.auth?.getSession();
        if (error) {
          setError(error?.message);
          return;
        }
        setUser(session?.user ?? null);
      } catch (error) {
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('AuthRetryableFetchError')) {
          setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.');
          return;
        }
        setError('Authentication service unavailable. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        setError(null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email, password, userData = {}) => {
    try {
      setError(null);
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        setError(error?.message);
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        const message = 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.';
        setError(message);
        return { success: false, error: message };
      }
      const message = 'Something went wrong during sign up. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error?.message);
        return { success: false, error: error?.message };
      }

      return { success: true, data };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        const message = 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.';
        setError(message);
        return { success: false, error: message };
      }
      const message = 'Something went wrong during sign in. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase?.auth?.signOut();
      if (error) {
        setError(error?.message);
        return { success: false, error: error?.message };
      }
      return { success: true };
    } catch (error) {
      const message = 'Something went wrong during sign out. Please try again.';
      setError(message);
      return { success: false, error: message };
    }
  };

  const getUserProfile = async () => {
    try {
      if (!user) return null;

      const { data, error } = await supabase?.from('user_profiles')?.select('*')?.eq('id', user?.id)?.single();

      if (error) {
        setError(error?.message);
        return null;
      }

      return data;
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        setError('Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.');
        return null;
      }
      setError('Failed to load user profile');
      return null;
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    getUserProfile,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};