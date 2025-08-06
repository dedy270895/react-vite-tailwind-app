import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const CategoryAnalysis = ({ selectedPeriod }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryData = [
    { 
      name: 'Food & Dining', 
      amount: 1250, 
      percentage: 31, 
      budget: 1500,
      transactions: 45,
      color: '#EF4444',
      subcategories: [
        { name: 'Restaurants', amount: 750 },
        { name: 'Groceries', amount: 350 },
        { name: 'Coffee & Snacks', amount: 150 }
      ]
    },
    { 
      name: 'Transportation', 
      amount: 850, 
      percentage: 21, 
      budget: 900,
      transactions: 28,
      color: '#F59E0B',
      subcategories: [
        { name: 'Gas', amount: 450 },
        { name: 'Public Transit', amount: 250 },
        { name: 'Parking', amount: 150 }
      ]
    },
    { 
      name: 'Shopping', 
      amount: 650, 
      percentage: 16, 
      budget: 800,
      transactions: 22,
      color: '#8B5CF6',
      subcategories: [
        { name: 'Clothing', amount: 350 },
        { name: 'Electronics', amount: 200 },
        { name: 'Home & Garden', amount: 100 }
      ]
    },
    { 
      name: 'Entertainment', 
      amount: 420, 
      percentage: 10, 
      budget: 500,
      transactions: 18,
      color: '#10B981',
      subcategories: [
        { name: 'Movies & Shows', amount: 180 },
        { name: 'Games', amount: 140 },
        { name: 'Events', amount: 100 }
      ]
    },
    { 
      name: 'Utilities', 
      amount: 380, 
      percentage: 9, 
      budget: 400,
      transactions: 8,
      color: '#3B82F6',
      subcategories: [
        { name: 'Electricity', amount: 150 },
        { name: 'Internet', amount: 120 },
        { name: 'Water', amount: 110 }
      ]
    },
    { 
      name: 'Healthcare', 
      amount: 280, 
      percentage: 7, 
      budget: 350,
      transactions: 6,
      color: '#F97316',
      subcategories: [
        { name: 'Doctor Visits', amount: 150 },
        { name: 'Medications', amount: 80 },
        { name: 'Insurance', amount: 50 }
      ]
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-success">Amount: ${data?.amount?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Budget: ${data?.budget?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{data?.transactions} transactions</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card p-4 md:p-6 space-y-6">
      {/* Category Overview Chart */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Category Spending</h4>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            View All Categories
          </button>
        </div>
        
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                type="number" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill="#3B82F6" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Category Details List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-foreground">Category Breakdown</h4>
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort by Amount</span>
          </div>
        </div>

        <div className="space-y-3">
          {categoryData?.map((category, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category?.color }}
                  />
                  <div>
                    <h5 className="font-medium text-foreground">{category?.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {category?.transactions} transactions
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-foreground">${category?.amount?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{category?.percentage}% of total</p>
                </div>
                
                <Icon 
                  name={selectedCategory === index ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground ml-2" 
                />
              </div>

              {/* Budget Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Budget Progress</span>
                  <span className="text-muted-foreground">
                    ${category?.amount?.toLocaleString()} / ${category?.budget?.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      category?.amount > category?.budget ? 'bg-error' : 'bg-success'
                    }`}
                    style={{ 
                      width: `${Math.min((category?.amount / category?.budget) * 100, 100)}%` 
                    }}
                  />
                </div>
                {category?.amount > category?.budget && (
                  <p className="text-xs text-error mt-1">
                    Over budget by ${(category?.amount - category?.budget)?.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Subcategories Expansion */}
              {selectedCategory === index && (
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <h6 className="text-sm font-medium text-foreground mb-2">Subcategories</h6>
                  {category?.subcategories?.map((sub, subIndex) => (
                    <div key={subIndex} className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">{sub?.name}</span>
                      <span className="text-sm font-medium text-foreground">
                        ${sub?.amount?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <button className="w-full mt-3 py-2 text-sm text-primary hover:text-primary/80 transition-colors border border-primary/20 rounded-lg hover:bg-primary/5">
                    View Transactions
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalysis;