import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AccountSelector = ({ selectedAccount, onAccountChange, label, error }) => {
  const [isOpen, setIsOpen] = useState(false);

  const accounts = [
    {
      id: 'checking',
      name: 'Checking Account',
      type: 'Bank Account',
      balance: 2450.75,
      icon: 'CreditCard',
      color: 'text-blue-500'
    },
    {
      id: 'savings',
      name: 'Savings Account',
      type: 'Bank Account',
      balance: 8920.30,
      icon: 'PiggyBank',
      color: 'text-green-500'
    },
    {
      id: 'cash',
      name: 'Cash Wallet',
      type: 'Cash',
      balance: 125.00,
      icon: 'Wallet',
      color: 'text-orange-500'
    },
    {
      id: 'credit',
      name: 'Credit Card',
      type: 'Credit Card',
      balance: -1250.45,
      icon: 'CreditCard',
      color: 'text-purple-500'
    }
  ];

  const handleAccountSelect = (account) => {
    onAccountChange(account);
    setIsOpen(false);
  };

  const formatBalance = (balance) => {
    const absBalance = Math.abs(balance);
    const sign = balance < 0 ? '-' : '';
    return `${sign}$${absBalance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-medium text-foreground">
        {label} *
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 bg-input border border-border rounded-lg hover:bg-muted transition-colors ${
          error ? 'border-error' : ''
        }`}
      >
        {selectedAccount ? (
          <div className="flex items-center space-x-3">
            <Icon name={selectedAccount?.icon} size={20} className={selectedAccount?.color} />
            <div className="text-left">
              <div className="text-foreground font-medium">{selectedAccount?.name}</div>
              <div className="text-sm text-muted-foreground">
                {formatBalance(selectedAccount?.balance)}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground">Select an account</span>
        )}
        <Icon 
          name="ChevronDown" 
          size={20} 
          className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-elevated z-50 max-h-60 overflow-y-auto">
            {accounts?.map((account) => (
              <button
                key={account?.id}
                onClick={() => handleAccountSelect(account)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-muted transition-colors text-left border-b border-border last:border-b-0"
              >
                <Icon name={account?.icon} size={20} className={account?.color} />
                <div className="flex-1">
                  <div className="text-foreground font-medium">{account?.name}</div>
                  <div className="text-sm text-muted-foreground">{account?.type}</div>
                </div>
                <div className={`text-sm font-medium ${
                  account?.balance < 0 ? 'text-error' : 'text-success'
                }`}>
                  {formatBalance(account?.balance)}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AccountSelector;