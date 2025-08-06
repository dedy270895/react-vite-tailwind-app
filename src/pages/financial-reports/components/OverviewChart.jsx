import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const OverviewChart = ({ selectedPeriod }) => {
  const spendingData = [
    { name: 'Food & Dining', value: 1250, color: '#EF4444' },
    { name: 'Transportation', value: 850, color: '#F59E0B' },
    { name: 'Shopping', value: 650, color: '#8B5CF6' },
    { name: 'Entertainment', value: 420, color: '#10B981' },
    { name: 'Utilities', value: 380, color: '#3B82F6' },
    { name: 'Healthcare', value: 280, color: '#F97316' }
  ];

  const monthlyData = [
    { month: 'Jan', income: 4500, expenses: 3200 },
    { month: 'Feb', income: 4200, expenses: 3100 },
    { month: 'Mar', income: 4800, expenses: 3400 },
    { month: 'Apr', income: 4600, expenses: 3300 },
    { month: 'May', income: 5000, expenses: 3800 },
    { month: 'Jun', income: 4700, expenses: 3500 }
  ];

  const totalSpending = spendingData?.reduce((sum, item) => sum + item?.value, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: ${entry?.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card p-4 md:p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm text-muted-foreground">Total Income</span>
          </div>
          <p className="text-xl font-semibold text-foreground">$28,800</p>
          <p className="text-xs text-success">+12% from last period</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="TrendingDown" size={16} className="text-error" />
            <span className="text-sm text-muted-foreground">Total Expenses</span>
          </div>
          <p className="text-xl font-semibold text-foreground">$20,300</p>
          <p className="text-xs text-error">+8% from last period</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Wallet" size={16} className="text-primary" />
            <span className="text-sm text-muted-foreground">Net Savings</span>
          </div>
          <p className="text-xl font-semibold text-foreground">$8,500</p>
          <p className="text-xs text-success">+18% from last period</p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Target" size={16} className="text-warning" />
            <span className="text-sm text-muted-foreground">Savings Rate</span>
          </div>
          <p className="text-xl font-semibold text-foreground">29.5%</p>
          <p className="text-xs text-success">+2.1% from last period</p>
        </div>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Breakdown - Mobile: Donut, Desktop: Enhanced */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Spending Breakdown</h4>
            <span className="text-sm text-muted-foreground">${totalSpending?.toLocaleString()}</span>
          </div>
          
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={window.innerWidth < 768 ? 40 : 60}
                  outerRadius={window.innerWidth < 768 ? 80 : 100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {spendingData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2 mt-4">
            {spendingData?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-muted-foreground flex-1">{item?.name}</span>
                <span className="text-sm font-medium text-foreground">${item?.value?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Income vs Expenses Trend */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">Income vs Expenses</h4>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span className="text-muted-foreground">Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full" />
                <span className="text-muted-foreground">Expenses</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#10B981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;