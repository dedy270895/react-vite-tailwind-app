import React from 'react';

const RecentTransactions = ({ transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })?.format(Math.abs(amount));
  };

  const formatDate = (date) => {
    try {
      if (!date) return 'N/A';
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      })?.format(dateObj);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  const getCategoryIcon = (category) => {
    // Using text-based icons instead of imported icons
    const iconMap = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Bills & Utilities': '📄',
      'Healthcare': '❤️',
      'Salary': '💼',
      'Freelance': '💻',
      'Investment': '📈',
      'Transfer': '↔️'
    };
    return iconMap?.[category] || '💰';
  };

  const getAmountColor = (type) => {
    if (type === 'income') return 'text-success';
    if (type === 'expense') return 'text-error';
    return 'text-foreground';
  };

  const getAmountPrefix = (type) => {
    if (type === 'income') return '+';
    if (type === 'expense') return '-';
    return '';
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No transactions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {transactions?.map((transaction) => {
          const categoryName = transaction?.categories?.name || 'Uncategorized';
          const transactionType = transaction?.transaction_type || 'expense';
          const transactionDate = transaction?.transaction_date;
          
          return (
            <div key={transaction?.id} className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                transactionType === 'income' ? 'bg-success/10' :
                transactionType === 'expense' ? 'bg-error/10' : 'bg-primary/10'
              }`}>
                <span className="text-lg">
                  {getCategoryIcon(categoryName)}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {transaction?.description || 'No description'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {categoryName} • {formatDate(transactionDate)}
                </p>
              </div>
              
              <div className={`text-sm font-semibold ${getAmountColor(transactionType)}`}>
                {getAmountPrefix(transactionType)}{formatCurrency(transaction?.amount || 0)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactions;
