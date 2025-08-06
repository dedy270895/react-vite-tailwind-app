import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CategorySelector = ({ selectedCategory, onCategoryChange, transactionType, error }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Tag');

  const expenseCategories = [
    { id: 'food', name: 'Food & Dining', icon: 'Utensils', color: 'text-orange-500' },
    { id: 'transport', name: 'Transportation', icon: 'Car', color: 'text-blue-500' },
    { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'text-purple-500' },
    { id: 'entertainment', name: 'Entertainment', icon: 'Film', color: 'text-pink-500' },
    { id: 'bills', name: 'Bills & Utilities', icon: 'Receipt', color: 'text-red-500' },
    { id: 'healthcare', name: 'Healthcare', icon: 'Heart', color: 'text-green-500' },
    { id: 'education', name: 'Education', icon: 'BookOpen', color: 'text-indigo-500' },
    { id: 'travel', name: 'Travel', icon: 'Plane', color: 'text-cyan-500' }
  ];

  const incomeCategories = [
    { id: 'salary', name: 'Salary', icon: 'Briefcase', color: 'text-green-600' },
    { id: 'freelance', name: 'Freelance', icon: 'Laptop', color: 'text-blue-600' },
    { id: 'investment', name: 'Investment', icon: 'TrendingUp', color: 'text-emerald-600' },
    { id: 'business', name: 'Business', icon: 'Building', color: 'text-purple-600' },
    { id: 'rental', name: 'Rental Income', icon: 'Home', color: 'text-orange-600' },
    { id: 'gift', name: 'Gift/Bonus', icon: 'Gift', color: 'text-pink-600' }
  ];

  const availableIcons = [
    'Tag', 'Star', 'Heart', 'Coffee', 'Car', 'Home', 'Briefcase', 'Gift',
    'Music', 'Camera', 'Book', 'Gamepad2', 'Plane', 'Bike', 'Pizza', 'Shirt'
  ];

  const categories = transactionType === 'income' ? incomeCategories : expenseCategories;
  
  const filteredCategories = categories?.filter(category =>
    category?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const handleCategorySelect = (category) => {
    onCategoryChange(category);
    setIsModalOpen(false);
    setSearchTerm('');
  };

  const handleAddCategory = () => {
    if (newCategoryName?.trim()) {
      const newCategory = {
        id: newCategoryName?.toLowerCase()?.replace(/\s+/g, '-'),
        name: newCategoryName,
        icon: newCategoryIcon,
        color: 'text-gray-500'
      };
      onCategoryChange(newCategory);
      setIsModalOpen(false);
      setNewCategoryName('');
      setNewCategoryIcon('Tag');
    }
  };

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Category *
        </label>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`w-full flex items-center justify-between p-3 bg-input border border-border rounded-lg hover:bg-muted transition-colors ${
            error ? 'border-error' : ''
          }`}
        >
          {selectedCategory ? (
            <div className="flex items-center space-x-3">
              <Icon name={selectedCategory?.icon} size={20} className={selectedCategory?.color} />
              <span className="text-foreground">{selectedCategory?.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select a category</span>
          )}
          <Icon name="ChevronDown" size={20} className="text-muted-foreground" />
        </button>
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
      {/* Category Selection Modal */}
      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 bg-card border border-border rounded-lg shadow-elevated z-50 max-h-[80vh] overflow-hidden md:inset-x-auto md:w-96 md:left-1/2 md:-translate-x-1/2">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Select Category</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsModalOpen(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              <Input
                type="search"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto p-4">
              <div className="space-y-2">
                {filteredCategories?.map((category) => (
                  <button
                    key={category?.id}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <Icon name={category?.icon} size={20} className={category?.color} />
                    <span className="text-foreground">{category?.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-border">
              <div className="space-y-3">
                <Input
                  label="New Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e?.target?.value)}
                  placeholder="Enter category name"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Icon</label>
                  <div className="grid grid-cols-8 gap-2">
                    {availableIcons?.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setNewCategoryIcon(iconName)}
                        className={`p-2 rounded-md border transition-colors ${
                          newCategoryIcon === iconName
                            ? 'border-primary bg-primary/10' :'border-border hover:bg-muted'
                        }`}
                      >
                        <Icon name={iconName} size={16} />
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleAddCategory}
                  disabled={!newCategoryName?.trim()}
                  className="w-full"
                >
                  Add Category
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CategorySelector;