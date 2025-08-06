import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickAction from '../../components/ui/QuickAction';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BudgetCard from './components/BudgetCard';
import BudgetOverview from './components/BudgetOverview';
import CreateBudgetModal from './components/CreateBudgetModal';
import BudgetHistory from './components/BudgetHistory';

const BudgetManagement = () => {
  const [budgets, setBudgets] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock budget data
  useEffect(() => {
    const mockBudgets = [
      {
        id: 1,
        category: 'Food & Dining',
        description: 'Restaurants, groceries, takeout',
        allocated: 800,
        spent: 650,
        alertThreshold: 80,
        icon: 'Utensils',
        color: 'bg-orange-500',
        createdAt: '2024-12-01T00:00:00Z'
      },
      {
        id: 2,
        category: 'Transportation',
        description: 'Gas, public transit, rideshare',
        allocated: 400,
        spent: 320,
        alertThreshold: 85,
        icon: 'Car',
        color: 'bg-blue-500',
        createdAt: '2024-12-01T00:00:00Z'
      },
      {
        id: 3,
        category: 'Shopping',
        description: 'Clothing, electronics, misc',
        allocated: 600,
        spent: 720,
        alertThreshold: 75,
        icon: 'ShoppingBag',
        color: 'bg-purple-500',
        createdAt: '2024-12-01T00:00:00Z'
      },
      {
        id: 4,
        category: 'Entertainment',
        description: 'Movies, games, subscriptions',
        allocated: 300,
        spent: 180,
        alertThreshold: 80,
        icon: 'Film',
        color: 'bg-pink-500',
        createdAt: '2024-12-01T00:00:00Z'
      },
      {
        id: 5,
        category: 'Bills & Utilities',
        description: 'Rent, electricity, internet',
        allocated: 1200,
        spent: 1150,
        alertThreshold: 90,
        icon: 'Receipt',
        color: 'bg-red-500',
        createdAt: '2024-12-01T00:00:00Z'
      },
      {
        id: 6,
        category: 'Healthcare',
        description: 'Medical, pharmacy, insurance',
        allocated: 200,
        spent: 45,
        alertThreshold: 70,
        icon: 'Heart',
        color: 'bg-green-500',
        createdAt: '2024-12-01T00:00:00Z'
      }
    ];

    setBudgets(mockBudgets);
  }, []);

  const tabs = [
    { id: 'current', label: 'Current Budgets', icon: 'Target' },
    { id: 'history', label: 'History', icon: 'History' }
  ];

  const handleCreateBudget = (newBudget) => {
    setBudgets(prev => [...prev, newBudget]);
  };

  const handleEditBudget = (budgetId, newAmount) => {
    setBudgets(prev => prev?.map(budget => 
      budget?.id === budgetId 
        ? { ...budget, allocated: newAmount }
        : budget
    ));
  };

  const handleDeleteBudget = (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      setBudgets(prev => prev?.filter(budget => budget?.id !== budgetId));
    }
  };

  const filteredBudgets = budgets?.filter(budget =>
    budget?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    budget?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const sortedBudgets = [...filteredBudgets]?.sort((a, b) => {
    const aPercentage = (a?.spent / a?.allocated) * 100;
    const bPercentage = (b?.spent / b?.allocated) * 100;
    return bPercentage - aPercentage; // Sort by usage percentage (highest first)
  });

  return (
    <>
      <Helmet>
        <title>Budget Management - MoneyTracker</title>
        <meta name="description" content="Set, monitor, and adjust spending limits across categories with visual progress tracking and alerts." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Budget Management</h1>
              <p className="text-muted-foreground">
                Set spending limits and track your progress across different categories
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <QuickAction className="hidden md:flex" />
              <Button
                variant="default"
                onClick={() => setIsCreateModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
              >
                New Budget
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab?.id
                    ? 'bg-background text-foreground shadow-soft'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Current Budgets Tab */}
          {activeTab === 'current' && (
            <>
              {/* Budget Overview */}
              <BudgetOverview budgets={budgets} />

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                <div className="relative flex-1 max-w-md">
                  <Icon 
                    name="Search" 
                    size={20} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                  />
                  <input
                    type="text"
                    placeholder="Search budgets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e?.target?.value)}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Filter" size={16} />
                  <span>Sorted by usage</span>
                </div>
              </div>

              {/* Budget Cards Grid */}
              {sortedBudgets?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedBudgets?.map((budget) => (
                    <BudgetCard
                      key={budget?.id}
                      budget={budget}
                      onEdit={handleEditBudget}
                      onDelete={handleDeleteBudget}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Target" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {searchTerm ? 'No budgets found' : 'No budgets created yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm 
                      ? `No budgets match "${searchTerm}". Try a different search term.`
                      : 'Create your first budget to start tracking your spending limits.'
                    }
                  </p>
                  {!searchTerm && (
                    <Button
                      variant="default"
                      onClick={() => setIsCreateModalOpen(true)}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Create Budget
                    </Button>
                  )}
                </div>
              )}
            </>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <BudgetHistory budgets={budgets} />
          )}
        </main>

        {/* Quick Action FAB for Mobile */}
        <QuickAction />

        {/* Create Budget Modal */}
        <CreateBudgetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateBudget}
        />
      </div>
    </>
  );
};

export default BudgetManagement;