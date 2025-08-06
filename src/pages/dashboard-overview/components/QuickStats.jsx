import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const getStatIcon = (type) => {
    const iconMap = {
      'income': 'TrendingUp',
      'expenses': 'TrendingDown',
      'savings': 'PiggyBank',
      'transactions': 'Receipt'
    };
    return iconMap?.[type] || 'DollarSign';
  };

  const getStatColor = (type) => {
    const colorMap = {
      'income': 'text-success',
      'expenses': 'text-error',
      'savings': 'text-primary',
      'transactions': 'text-muted-foreground'
    };
    return colorMap?.[type] || 'text-foreground';
  };

  const getStatBgColor = (type) => {
    const bgColorMap = {
      'income': 'bg-success/10',
      'expenses': 'bg-error/10',
      'savings': 'bg-primary/10',
      'transactions': 'bg-muted'
    };
    return bgColorMap?.[type] || 'bg-muted';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((stat) => (
        <div key={stat?.type} className="bg-card rounded-xl p-4 shadow-soft border border-border">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getStatBgColor(stat?.type)}`}>
              <Icon 
                name={getStatIcon(stat?.type)} 
                size={18} 
                className={getStatColor(stat?.type)}
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {stat?.label}
              </p>
              <p className="text-lg font-bold text-foreground truncate">
                {stat?.type === 'transactions' ? stat?.value : formatCurrency(stat?.value)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;