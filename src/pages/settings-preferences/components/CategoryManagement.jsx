import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Food & Dining', icon: 'UtensilsCrossed', color: 'bg-red-500', type: 'expense', isDefault: true },
    { id: 2, name: 'Transportation', icon: 'Car', color: 'bg-blue-500', type: 'expense', isDefault: true },
    { id: 3, name: 'Shopping', icon: 'ShoppingBag', color: 'bg-purple-500', type: 'expense', isDefault: true },
    { id: 4, name: 'Entertainment', icon: 'Film', color: 'bg-pink-500', type: 'expense', isDefault: true },
    { id: 5, name: 'Bills & Utilities', icon: 'Receipt', color: 'bg-orange-500', type: 'expense', isDefault: true },
    { id: 6, name: 'Healthcare', icon: 'Heart', color: 'bg-green-500', type: 'expense', isDefault: true },
    { id: 7, name: 'Salary', icon: 'Briefcase', color: 'bg-emerald-500', type: 'income', isDefault: true },
    { id: 8, name: 'Freelance', icon: 'Laptop', color: 'bg-teal-500', type: 'income', isDefault: true },
    { id: 9, name: 'Investment', icon: 'TrendingUp', color: 'bg-indigo-500', type: 'income', isDefault: true }
  ]);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    icon: 'Tag',
    color: 'bg-gray-500',
    type: 'expense'
  });

  const iconOptions = [
    { value: 'Tag', label: 'Tag' },
    { value: 'Home', label: 'Home' },
    { value: 'Car', label: 'Car' },
    { value: 'Plane', label: 'Plane' },
    { value: 'ShoppingBag', label: 'Shopping Bag' },
    { value: 'UtensilsCrossed', label: 'Food' },
    { value: 'Film', label: 'Entertainment' },
    { value: 'Gamepad2', label: 'Gaming' },
    { value: 'Heart', label: 'Healthcare' },
    { value: 'GraduationCap', label: 'Education' },
    { value: 'Briefcase', label: 'Work' },
    { value: 'Laptop', label: 'Technology' },
    { value: 'Coffee', label: 'Coffee' },
    { value: 'Gift', label: 'Gifts' },
    { value: 'Shirt', label: 'Clothing' },
    { value: 'Book', label: 'Books' },
    { value: 'Music', label: 'Music' },
    { value: 'Camera', label: 'Photography' },
    { value: 'Dumbbell', label: 'Fitness' },
    { value: 'PawPrint', label: 'Pets' }
  ];

  const colorOptions = [
    { value: 'bg-red-500', label: 'Red', color: '#ef4444' },
    { value: 'bg-orange-500', label: 'Orange', color: '#f97316' },
    { value: 'bg-amber-500', label: 'Amber', color: '#f59e0b' },
    { value: 'bg-yellow-500', label: 'Yellow', color: '#eab308' },
    { value: 'bg-lime-500', label: 'Lime', color: '#84cc16' },
    { value: 'bg-green-500', label: 'Green', color: '#22c55e' },
    { value: 'bg-emerald-500', label: 'Emerald', color: '#10b981' },
    { value: 'bg-teal-500', label: 'Teal', color: '#14b8a6' },
    { value: 'bg-cyan-500', label: 'Cyan', color: '#06b6d4' },
    { value: 'bg-sky-500', label: 'Sky', color: '#0ea5e9' },
    { value: 'bg-blue-500', label: 'Blue', color: '#3b82f6' },
    { value: 'bg-indigo-500', label: 'Indigo', color: '#6366f1' },
    { value: 'bg-violet-500', label: 'Violet', color: '#8b5cf6' },
    { value: 'bg-purple-500', label: 'Purple', color: '#a855f7' },
    { value: 'bg-fuchsia-500', label: 'Fuchsia', color: '#d946ef' },
    { value: 'bg-pink-500', label: 'Pink', color: '#ec4899' },
    { value: 'bg-rose-500', label: 'Rose', color: '#f43f5e' },
    { value: 'bg-gray-500', label: 'Gray', color: '#6b7280' }
  ];

  const typeOptions = [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' }
  ];

  const handleAddCategory = () => {
    if (newCategory?.name?.trim()) {
      const category = {
        id: Date.now(),
        ...newCategory,
        isDefault: false
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', icon: 'Tag', color: 'bg-gray-500', type: 'expense' });
      setIsAddingCategory(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category?.id);
    setNewCategory({
      name: category?.name,
      icon: category?.icon,
      color: category?.color,
      type: category?.type
    });
  };

  const handleUpdateCategory = () => {
    if (newCategory?.name?.trim()) {
      setCategories(categories?.map(cat => 
        cat?.id === editingCategory 
          ? { ...cat, ...newCategory }
          : cat
      ));
      setEditingCategory(null);
      setNewCategory({ name: '', icon: 'Tag', color: 'bg-gray-500', type: 'expense' });
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const category = categories?.find(cat => cat?.id === categoryId);
    if (category?.isDefault) {
      alert('Default categories cannot be deleted.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategories(categories?.filter(cat => cat?.id !== categoryId));
    }
  };

  const handleCancelEdit = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
    setNewCategory({ name: '', icon: 'Tag', color: 'bg-gray-500', type: 'expense' });
  };

  const expenseCategories = categories?.filter(cat => cat?.type === 'expense');
  const incomeCategories = categories?.filter(cat => cat?.type === 'income');

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FolderOpen" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Categories</h3>
            <p className="text-sm text-muted-foreground">Organize your transactions with custom categories</p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddingCategory(true)}
          iconName="Plus"
          iconPosition="left"
          disabled={isAddingCategory || editingCategory}
        >
          Add Category
        </Button>
      </div>
      {/* Add/Edit Category Form */}
      {(isAddingCategory || editingCategory) && (
        <div className="bg-muted rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Category Name"
              type="text"
              placeholder="Enter category name"
              value={newCategory?.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e?.target?.value })}
              required
            />
            <Select
              label="Category Type"
              options={typeOptions}
              value={newCategory?.type}
              onChange={(value) => setNewCategory({ ...newCategory, type: value })}
            />
            <Select
              label="Icon"
              options={iconOptions}
              value={newCategory?.icon}
              onChange={(value) => setNewCategory({ ...newCategory, icon: value })}
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Color</label>
              <div className="grid grid-cols-6 gap-2">
                {colorOptions?.map((color) => (
                  <button
                    key={color?.value}
                    onClick={() => setNewCategory({ ...newCategory, color: color?.value })}
                    className={`w-8 h-8 rounded-lg ${color?.value} ${
                      newCategory?.color === color?.value ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    title={color?.label}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Preview */}
          <div className="mt-4 p-3 bg-background rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Preview:</p>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${newCategory?.color} rounded-lg flex items-center justify-center`}>
                <Icon name={newCategory?.icon} size={20} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-foreground">{newCategory?.name || 'Category Name'}</p>
                <p className="text-sm text-muted-foreground capitalize">{newCategory?.type}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Button
              onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
              disabled={!newCategory?.name?.trim()}
              iconName={editingCategory ? "Save" : "Plus"}
              iconPosition="left"
            >
              {editingCategory ? 'Update Category' : 'Add Category'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {/* Categories List */}
      <div className="space-y-6">
        {/* Expense Categories */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Minus" size={16} className="text-error mr-2" />
            Expense Categories ({expenseCategories?.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {expenseCategories?.map((category) => (
              <div key={category?.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${category?.color} rounded-lg flex items-center justify-center`}>
                    <Icon name={category?.icon} size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{category?.name}</p>
                    {category?.isDefault && (
                      <p className="text-xs text-muted-foreground">Default</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCategory(category)}
                    disabled={isAddingCategory || editingCategory}
                    className="w-8 h-8"
                  >
                    <Icon name="Edit2" size={14} />
                  </Button>
                  {!category?.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category?.id)}
                      disabled={isAddingCategory || editingCategory}
                      className="w-8 h-8 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div>
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <Icon name="Plus" size={16} className="text-success mr-2" />
            Income Categories ({incomeCategories?.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {incomeCategories?.map((category) => (
              <div key={category?.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${category?.color} rounded-lg flex items-center justify-center`}>
                    <Icon name={category?.icon} size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{category?.name}</p>
                    {category?.isDefault && (
                      <p className="text-xs text-muted-foreground">Default</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCategory(category)}
                    disabled={isAddingCategory || editingCategory}
                    className="w-8 h-8"
                  >
                    <Icon name="Edit2" size={14} />
                  </Button>
                  {!category?.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category?.id)}
                      disabled={isAddingCategory || editingCategory}
                      className="w-8 h-8 text-error hover:text-error"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;