import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { transactionService } from '../../services/transactionService';
import { accountService } from '../../services/accountService';
import Header from '../../components/ui/Header';
import QuickAction from '../../components/ui/QuickAction';
import AccountBalanceCard from './components/AccountBalanceCard';
import RecentTransactions from './components/RecentTransactions';
import MonthlySpendingChart from './components/MonthlySpendingChart';
import BudgetProgress from './components/BudgetProgress';
import QuickStats from './components/QuickStats';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data state
  const [accountBalance, setAccountBalance] = useState({ balance: 0, trend: 'neutral', trendPercentage: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [monthlySpendingData, setMonthlySpendingData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [quickStatsData, setQuickStatsData] = useState([
    { type: 'income', label: 'This Month', value: 0 },
    { type: 'expenses', label: 'This Month', value: 0 },
    { type: 'savings', label: 'This Month', value: 0 },
    { type: 'transactions', label: 'This Month', value: 0 }
  ]);

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!user?.id) {
      // Show preview data for non-authenticated users
      setAccountBalance({ balance: 15420.50, trend: 'up', trendPercentage: 12.5 });
      setRecentTransactions([
        {
          id: 1,
          description: "Grocery Shopping",
          categories: { name: "Food & Dining" },
          amount: -85.50,
          transaction_type: "expense",
          transaction_date: "2025-01-05"
        },
        {
          id: 2,
          description: "Salary Deposit",
          categories: { name: "Salary" },
          amount: 3500.00,
          transaction_type: "income",
          transaction_date: "2025-01-04"
        }
      ]);
      setQuickStatsData([
        { type: 'income', label: 'This Month', value: 4250 },
        { type: 'expenses', label: 'This Month', value: 1850 },
        { type: 'savings', label: 'This Month', value: 2400 },
        { type: 'transactions', label: 'This Month', value: 47 }
      ]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Load account balance
      const balanceResult = await accountService?.getTotalBalance(user?.id);
      if (balanceResult?.success) {
        setAccountBalance({
          balance: balanceResult?.data || 0,
          trend: balanceResult?.data > 0 ? 'up' : 'neutral',
          trendPercentage: 0
        });
      }

      // Load recent transactions
      const transactionsResult = await transactionService?.getTransactions(user?.id, { limit: 10 });
      if (transactionsResult?.success) {
        setRecentTransactions(transactionsResult?.data?.slice(0, 5) || []);
      }

      // Load monthly stats
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const statsResult = await transactionService?.getTransactionStats(
        user?.id, 
        firstDayOfMonth?.toISOString()?.split('T')?.[0], 
        lastDayOfMonth?.toISOString()?.split('T')?.[0]
      );

      if (statsResult?.success) {
        const stats = statsResult?.data;
        setQuickStatsData([
          { type: 'income', label: 'This Month', value: stats?.income || 0 },
          { type: 'expenses', label: 'This Month', value: stats?.expenses || 0 },
          { type: 'savings', label: 'This Month', value: stats?.savings || 0 },
          { type: 'transactions', label: 'This Month', value: stats?.total_transactions || 0 }
        ]);
      }

    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Pull to refresh functionality
  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let isScrolling = false;

    const handleTouchStart = (e) => {
      startY = e?.touches?.[0]?.clientY;
      isScrolling = false;
    };

    const handleTouchMove = (e) => {
      currentY = e?.touches?.[0]?.clientY;
      const diff = currentY - startY;
      
      if (diff > 0 && window.scrollY === 0 && !isScrolling) {
        isScrolling = true;
        if (diff > 100) {
          handleRefresh();
        }
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading dashboard...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Preview Mode Banner */}
        {!user && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
            <p className="text-primary font-medium">Preview Mode - Sign in to access your real financial data</p>
          </div>
        )}

        {/* Refresh Indicator */}
        {isRefreshing && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Refreshing...</span>
          </div>
        )}

        {/* Quick Stats - Mobile First */}
        <div className="lg:hidden">
          <QuickStats stats={quickStatsData} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Account Balance */}
            <AccountBalanceCard 
              balance={accountBalance?.balance}
              trend={accountBalance?.trend}
              trendPercentage={accountBalance?.trendPercentage}
            />

            {/* Recent Transactions */}
            <RecentTransactions transactions={recentTransactions} />

            {/* Monthly Spending Chart */}
            <MonthlySpendingChart data={monthlySpendingData} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Stats - Desktop */}
            <div className="hidden lg:block">
              <QuickStats stats={quickStatsData} />
            </div>

            {/* Budget Progress */}
            <BudgetProgress budgets={budgetData} />

            {/* Additional Quick Actions for Desktop */}
            <div className="hidden lg:block">
              <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <QuickAction className="flex-col space-y-2 space-x-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Spacing for FAB */}
        <div className="h-20 lg:hidden" />
      </main>
      {/* Floating Action Button - Mobile Only */}
      <QuickAction />
    </div>
  );
};

export default DashboardOverview;