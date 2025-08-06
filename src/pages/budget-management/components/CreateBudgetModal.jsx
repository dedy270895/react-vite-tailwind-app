import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CreateBudgetModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    allocated: '',
    alertThreshold: 80,
    icon: 'DollarSign',
    color: 'bg-primary'
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { name: 'Food & Dining', icon: 'Utensils', color: 'bg-orange-500', description: 'Restaurants, groceries, takeout' },
    { name: 'Transportation', icon: 'Car', color: 'bg-blue-500', description: 'Gas, public transit, rideshare' },
    { name: 'Shopping', icon: 'ShoppingBag', color: 'bg-purple-500', description: 'Clothing, electronics, misc' },
    { name: 'Entertainment', icon: 'Film', color: 'bg-pink-500', description: 'Movies, games, subscriptions' },
    { name: 'Bills & Utilities', icon: 'Receipt', color: 'bg-red-500', description: 'Rent, electricity, internet' },
    { name: 'Healthcare', icon: 'Heart', color: 'bg-green-500', description: 'Medical, pharmacy, insurance' },
    { name: 'Education', icon: 'BookOpen', color: 'bg-indigo-500', description: 'Courses, books, training' },
    { name: 'Travel', icon: 'Plane', color: 'bg-cyan-500', description: 'Flights, hotels, vacation' },
    { name: 'Personal Care', icon: 'Scissors', color: 'bg-yellow-500', description: 'Haircuts, cosmetics, spa' },
    { name: 'Other', icon: 'MoreHorizontal', color: 'bg-gray-500', description: 'Miscellaneous expenses' }
  ];

  const suggestedAmounts = [100, 200, 300, 500, 750, 1000, 1500, 2000];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({
      ...prev,
      category: category?.name,
      description: category?.description,
      icon: category?.icon,
      color: category?.color
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData?.allocated || parseFloat(formData?.allocated) <= 0) {
      newErrors.allocated = 'Budget amount must be greater than 0';
    }

    if (formData?.alertThreshold < 0 || formData?.alertThreshold > 100) {
      newErrors.alertThreshold = 'Alert threshold must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      const newBudget = {
        id: Date.now(),
        category: formData?.category,
        description: formData?.description,
        allocated: parseFloat(formData?.allocated),
        spent: 0,
        alertThreshold: formData?.alertThreshold,
        icon: formData?.icon,
        color: formData?.color,
        createdAt: new Date()?.toISOString()
      };
      onSave(newBudget);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      category: '',
      description: '',
      allocated: '',
      alertThreshold: 80,
      icon: 'DollarSign',
      color: 'bg-primary'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Create New Budget</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories?.map((category) => (
                <button
                  key={category?.name}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    formData?.category === category?.name
                      ? 'border-primary bg-primary/10' :'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${category?.color} flex items-center justify-center`}>
                      <Icon name={category?.icon} size={16} color="white" />
                    </div>
                    <span className="font-medium text-foreground text-sm">{category?.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{category?.description}</p>
                </button>
              ))}
            </div>
            {errors?.category && (
              <p className="text-sm text-error mt-1">{errors?.category}</p>
            )}
          </div>

          {/* Custom Category */}
          {formData?.category && !categories?.find(c => c?.name === formData?.category) && (
            <Input
              label="Custom Category Name"
              type="text"
              value={formData?.category}
              onChange={(e) => handleInputChange('category', e?.target?.value)}
              placeholder="Enter category name"
              error={errors?.category}
            />
          )}

          {/* Budget Amount */}
          <div>
            <Input
              label="Budget Amount"
              type="number"
              value={formData?.allocated}
              onChange={(e) => handleInputChange('allocated', e?.target?.value)}
              placeholder="0.00"
              error={errors?.allocated}
              step="0.01"
              min="0"
            />
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-2">Suggested amounts:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedAmounts?.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleInputChange('allocated', amount?.toString())}
                    className="px-3 py-1 text-sm bg-muted hover:bg-muted-foreground/10 text-foreground rounded-full transition-colors duration-200"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <Input
            label="Description (Optional)"
            type="text"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            placeholder="Brief description of this budget category"
          />

          {/* Alert Threshold */}
          <div>
            <Input
              label="Alert Threshold (%)"
              type="number"
              value={formData?.alertThreshold}
              onChange={(e) => handleInputChange('alertThreshold', e?.target?.value)}
              placeholder="80"
              error={errors?.alertThreshold}
              min="0"
              max="100"
              description="Get notified when spending reaches this percentage"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Create Budget
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBudgetModal;