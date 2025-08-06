import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BudgetHistory = ({ budgets }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('3months');

  const periods = [
    { value: '1month', label: '1 Month' },
    { value: '3months', label: '3 Months' },
    { value: '6months', label: '6 Months' },
    { value: '1year', label: '1 Year' }
  ];

  // Mock historical data
  const historicalData = [
    {
      month: 'December 2024',
      totalAllocated: 3500,
      totalSpent: 3200,
      categories: [
        { name: 'Food & Dining', allocated: 800, spent: 750, trend: 'down' },
        { name: 'Transportation', allocated: 400, spent: 380, trend: 'stable' },
        { name: 'Shopping', allocated: 600, spent: 720, trend: 'up' },
        { name: 'Entertainment', allocated: 300, spent: 250, trend: 'down' },
        { name: 'Bills & Utilities', allocated: 1200, spent: 1100, trend: 'stable' },
        { name: 'Healthcare', allocated: 200, spent: 0, trend: 'down' }
      ]
    },
    {
      month: 'November 2024',
      totalAllocated: 3500,
      totalSpent: 3450,
      categories: [
        { name: 'Food & Dining', allocated: 800, spent: 820, trend: 'up' },
        { name: 'Transportation', allocated: 400, spent: 390, trend: 'stable' },
        { name: 'Shopping', allocated: 600, spent: 580, trend: 'stable' },
        { name: 'Entertainment', allocated: 300, spent: 350, trend: 'up' },
        { name: 'Bills & Utilities', allocated: 1200, spent: 1200, trend: 'stable' },
        { name: 'Healthcare', allocated: 200, spent: 110, trend: 'down' }
      ]
    },
    {
      month: 'October 2024',
      totalAllocated: 3400,
      totalSpent: 3100,
      categories: [
        { name: 'Food & Dining', allocated: 750, spent: 680, trend: 'down' },
        { name: 'Transportation', allocated: 400, spent: 420, trend: 'up' },
        { name: 'Shopping', allocated: 650, spent: 600, trend: 'stable' },
        { name: 'Entertainment', allocated: 250, spent: 200, trend: 'down' },
        { name: 'Bills & Utilities', allocated: 1200, spent: 1200, trend: 'stable' },
        { name: 'Healthcare', allocated: 150, spent: 0, trend: 'down' }
      ]
    }
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return 'text-error';
      case 'down': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPerformanceStatus = (allocated, spent) => {
    const percentage = (spent / allocated) * 100;
    if (percentage <= 80) return { status: 'Good', color: 'text-success', bg: 'bg-success/10' };
    if (percentage <= 100) return { status: 'Warning', color: 'text-warning', bg: 'bg-warning/10' };
    return { status: 'Over', color: 'text-error', bg: 'bg-error/10' };
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-soft">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-foreground">Budget Performance History</h2>
        <div className="flex items-center space-x-2">
          {periods?.map((period) => (
            <Button
              key={period?.value}
              variant={selectedPeriod === period?.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedPeriod(period?.value)}
            >
              {period?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Historical Data */}
      <div className="space-y-6">
        {historicalData?.map((monthData, index) => {
          const overallPerformance = getPerformanceStatus(monthData?.totalAllocated, monthData?.totalSpent);
          const savingsAmount = monthData?.totalAllocated - monthData?.totalSpent;
          
          return (
            <div key={index} className="border border-border rounded-lg p-4">
              {/* Month Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{monthData?.month}</h3>
                <div className={`px-3 py-1 rounded-full ${overallPerformance?.bg}`}>
                  <span className={`text-sm font-medium ${overallPerformance?.color}`}>
                    {overallPerformance?.status}
                  </span>
                </div>
              </div>
              {/* Month Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground">Allocated</p>
                  <p className="text-lg font-semibold text-foreground">
                    ${monthData?.totalAllocated?.toLocaleString()}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="text-lg font-semibold text-foreground">
                    ${monthData?.totalSpent?.toLocaleString()}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground">
                    {savingsAmount >= 0 ? 'Saved' : 'Over Budget'}
                  </p>
                  <p className={`text-lg font-semibold ${savingsAmount >= 0 ? 'text-success' : 'text-error'}`}>
                    ${Math.abs(savingsAmount)?.toLocaleString()}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground">Usage</p>
                  <p className="text-lg font-semibold text-foreground">
                    {((monthData?.totalSpent / monthData?.totalAllocated) * 100)?.toFixed(1)}%
                  </p>
                </div>
              </div>
              {/* Category Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Category Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {monthData?.categories?.map((category, catIndex) => {
                    const categoryPerformance = getPerformanceStatus(category?.allocated, category?.spent);
                    const usagePercentage = (category?.spent / category?.allocated) * 100;
                    
                    return (
                      <div key={catIndex} className="flex items-center justify-between p-3 bg-background rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-foreground">{category?.name}</span>
                            <Icon 
                              name={getTrendIcon(category?.trend)} 
                              size={14} 
                              className={getTrendColor(category?.trend)} 
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            ${category?.spent} / ${category?.allocated}
                          </p>
                          <p className={`text-xs ${categoryPerformance?.color}`}>
                            {usagePercentage?.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Summary Insights */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Insights & Recommendations</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your shopping budget has been consistently exceeded. Consider increasing allocation or reducing spending.</li>
              <li>• Great job staying under budget for Food & Dining in the last two months!</li>
              <li>• Healthcare budget is underutilized. Consider reallocating funds to other categories.</li>
              <li>• Overall budget performance has improved by 15% compared to last quarter.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetHistory;