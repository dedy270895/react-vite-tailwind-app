-- Location: supabase/migrations/20250806090604_money_management_system.sql
-- Analysis: Fresh project with complete money management schema
-- Module: Complete money management with authentication
-- Dependencies: None (fresh project)

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense', 'transfer');
CREATE TYPE public.account_type AS ENUM ('checking', 'savings', 'credit_card', 'investment', 'cash');
CREATE TYPE public.category_type AS ENUM ('income', 'expense');
CREATE TYPE public.budget_period AS ENUM ('weekly', 'monthly', 'yearly');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'cancelled');
CREATE TYPE public.recurring_frequency AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- 2. Core Tables

-- User profiles (intermediary table for auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'user'::public.user_role,
    timezone TEXT DEFAULT 'UTC',
    currency TEXT DEFAULT 'USD',
    date_format TEXT DEFAULT 'MM/DD/YYYY',
    theme TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Account management
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    account_type public.account_type NOT NULL,
    balance DECIMAL(12,2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Categories for transactions
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category_type public.category_type NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT 'DollarSign',
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Budget management
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    period public.budget_period DEFAULT 'monthly'::public.budget_period,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    to_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    transaction_type public.transaction_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT NOT NULL,
    notes TEXT,
    transaction_date DATE NOT NULL,
    status public.transaction_status DEFAULT 'completed'::public.transaction_status,
    receipt_url TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Recurring transactions
CREATE TABLE public.recurring_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    to_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    transaction_type public.transaction_type NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT NOT NULL,
    notes TEXT,
    frequency public.recurring_frequency NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_occurrence DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_accounts_user_type ON public.accounts(user_id, account_type);
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_categories_user_type ON public.categories(user_id, category_type);
CREATE INDEX idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX idx_budgets_user_category ON public.budgets(user_id, category_id);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_recurring_transactions_user_id ON public.recurring_transactions(user_id);
CREATE INDEX idx_recurring_transactions_next_occurrence ON public.recurring_transactions(next_occurrence);

-- 4. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Using Pattern 1 and 2)

-- Pattern 1: Core user table (user_profiles)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership
CREATE POLICY "users_manage_own_accounts"
ON public.accounts
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_categories"
ON public.categories
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_budgets"
ON public.budgets
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_transactions"
ON public.transactions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_recurring_transactions"
ON public.recurring_transactions
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user profile timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Add triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recurring_transactions_updated_at
    BEFORE UPDATE ON public.recurring_transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Mock Data for testing
DO $$
DECLARE
    user1_auth_id UUID := gen_random_uuid();
    user2_auth_id UUID := gen_random_uuid();
    checking_account_id UUID := gen_random_uuid();
    savings_account_id UUID := gen_random_uuid();
    credit_card_id UUID := gen_random_uuid();
    food_category_id UUID := gen_random_uuid();
    transport_category_id UUID := gen_random_uuid();
    salary_category_id UUID := gen_random_uuid();
    entertainment_category_id UUID := gen_random_uuid();
    bills_category_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (user1_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'demo@example.com', crypt('demo123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Demo User"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (user2_auth_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'test@example.com', crypt('test123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Test User"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create accounts for demo user
    INSERT INTO public.accounts (id, user_id, name, account_type, balance) VALUES
        (checking_account_id, user1_auth_id, 'Main Checking', 'checking', 5420.50),
        (savings_account_id, user1_auth_id, 'Emergency Savings', 'savings', 15000.00),
        (credit_card_id, user1_auth_id, 'Visa Credit Card', 'credit_card', -850.25);

    -- Create categories for demo user
    INSERT INTO public.categories (id, user_id, name, category_type, color, icon) VALUES
        (food_category_id, user1_auth_id, 'Food & Dining', 'expense', '#FF6B6B', 'Utensils'),
        (transport_category_id, user1_auth_id, 'Transportation', 'expense', '#4ECDC4', 'Car'),
        (entertainment_category_id, user1_auth_id, 'Entertainment', 'expense', '#45B7D1', 'Film'),
        (bills_category_id, user1_auth_id, 'Bills & Utilities', 'expense', '#FFA07A', 'FileText'),
        (salary_category_id, user1_auth_id, 'Salary', 'income', '#98D8C8', 'DollarSign');

    -- Create budgets for demo user
    INSERT INTO public.budgets (user_id, category_id, name, amount, period, start_date) VALUES
        (user1_auth_id, food_category_id, 'Monthly Food Budget', 800.00, 'monthly', DATE('2025-01-01')),
        (user1_auth_id, transport_category_id, 'Monthly Transport', 300.00, 'monthly', DATE('2025-01-01')),
        (user1_auth_id, entertainment_category_id, 'Fun Money', 200.00, 'monthly', DATE('2025-01-01'));

    -- Create sample transactions
    INSERT INTO public.transactions (user_id, account_id, category_id, transaction_type, amount, description, transaction_date) VALUES
        (user1_auth_id, checking_account_id, salary_category_id, 'income', 5500.00, 'Monthly Salary', DATE('2025-01-01')),
        (user1_auth_id, checking_account_id, food_category_id, 'expense', -127.45, 'Grocery Shopping at Whole Foods', DATE('2025-01-05')),
        (user1_auth_id, credit_card_id, transport_category_id, 'expense', -65.20, 'Gas Station Fill-up', DATE('2025-01-04')),
        (user1_auth_id, checking_account_id, entertainment_category_id, 'expense', -28.00, 'Movie Tickets', DATE('2025-01-03')),
        (user1_auth_id, checking_account_id, bills_category_id, 'expense', -89.32, 'Electric Bill', DATE('2025-01-04')),
        (user1_auth_id, checking_account_id, food_category_id, 'expense', -4.75, 'Coffee Shop', DATE('2025-01-06')),
        (user1_auth_id, checking_account_id, salary_category_id, 'income', 850.00, 'Freelance Project Payment', DATE('2025-01-05'));

    -- Create transfer transaction
    INSERT INTO public.transactions (user_id, account_id, to_account_id, transaction_type, amount, description, transaction_date) VALUES
        (user1_auth_id, checking_account_id, savings_account_id, 'transfer', 1000.00, 'Monthly Savings Transfer', DATE('2025-01-03'));

    -- Create recurring transaction
    INSERT INTO public.recurring_transactions (user_id, account_id, category_id, transaction_type, amount, description, frequency, start_date, next_occurrence) VALUES
        (user1_auth_id, checking_account_id, salary_category_id, 'income', 5500.00, 'Monthly Salary', 'monthly', DATE('2025-01-01'), DATE('2025-02-01')),
        (user1_auth_id, checking_account_id, bills_category_id, 'expense', -89.32, 'Electric Bill', 'monthly', DATE('2025-01-04'), DATE('2025-02-04'));

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data insertion error: %', SQLERRM;
END $$;