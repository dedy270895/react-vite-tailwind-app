import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  transaction = null, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    account: '',
    date: new Date()?.toISOString()?.split('T')?.[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction?.type,
        description: transaction?.description,
        amount: Math.abs(transaction?.amount)?.toString(),
        category: transaction?.category,
        account: transaction?.account || '',
        date: new Date(transaction.date)?.toISOString()?.split('T')?.[0],
        notes: transaction?.notes || ''
      });
    } else {
      setFormData({
        type: 'expense',
        description: '',
        amount: '',
        category: '',
        account: '',
        date: new Date()?.toISOString()?.split('T')?.[0],
        notes: ''
      });
    }
    setErrors({});
  }, [transaction, isOpen]);

  const transactionTypes = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
    { value: 'transfer', label: 'Transfer' }
  ];

  const expenseCategories = [
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'other', label: 'Other' }
  ];

  const incomeCategories = [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' }
  ];

  const transferCategories = [
    { value: 'savings', label: 'To Savings' },
    { value: 'checking', label: 'To Checking' },
    { value: 'credit', label: 'Credit Card Payment' },
    { value: 'other', label: 'Other' }
  ];

  const accounts = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'cash', label: 'Cash' }
  ];

  const getCategoriesByType = (type) => {
    switch (type) {
      case 'income':
        return incomeCategories;
      case 'transfer':
        return transferCategories;
      default:
        return expenseCategories;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData?.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData?.account) {
      newErrors.account = 'Account is required';
    }

    if (!formData?.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData?.amount),
        id: transaction?.id || Date.now()
      };

      await onSave(transactionData);
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="bg-card border border-border rounded-lg shadow-elevated max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">
          {transaction ? 'Edit Transaction' : 'Add Transaction'}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Transaction Type */}
        <Select
          label="Transaction Type"
          options={transactionTypes}
          value={formData?.type}
          onChange={(value) => {
            handleInputChange('type', value);
            handleInputChange('category', ''); // Reset category when type changes
          }}
          required
        />

        {/* Description */}
        <Input
          label="Description"
          type="text"
          placeholder="Enter transaction description"
          value={formData?.description}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          error={errors?.description}
          required
        />

        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          value={formData?.amount}
          onChange={(e) => handleInputChange('amount', e?.target?.value)}
          error={errors?.amount}
          required
          min="0"
          step="0.01"
        />

        {/* Category */}
        <Select
          label="Category"
          options={getCategoriesByType(formData?.type)}
          value={formData?.category}
          onChange={(value) => handleInputChange('category', value)}
          error={errors?.category}
          required
          searchable
        />

        {/* Account */}
        <Select
          label="Account"
          options={accounts}
          value={formData?.account}
          onChange={(value) => handleInputChange('account', value)}
          error={errors?.account}
          required
        />

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={formData?.date}
          onChange={(e) => handleInputChange('date', e?.target?.value)}
          error={errors?.date}
          required
        />

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Notes (Optional)
          </label>
          <textarea
            placeholder="Add any additional notes..."
            value={formData?.notes}
            onChange={(e) => handleInputChange('notes', e?.target?.value)}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            className="bg-primary text-primary-foreground"
          >
            {transaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </div>
      </form>
    </div>
  );

  // Mobile: Full screen modal
  if (window.innerWidth < 768) {
    return (
      <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
        <div className="min-h-full">
          {modalContent}
        </div>
      </div>
    );
  }

  // Desktop: Centered modal
  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {modalContent}
      </div>
    </>
  );
};

export default TransactionModal;