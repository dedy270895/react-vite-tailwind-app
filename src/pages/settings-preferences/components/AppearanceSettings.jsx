import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AppearanceSettings = () => {
  const [theme, setTheme] = useState('system');
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [numberFormat, setNumberFormat] = useState('1,000.00');

  const themeOptions = [
    { value: 'light', label: 'Light Mode' },
    { value: 'dark', label: 'Dark Mode' },
    { value: 'system', label: 'System Preference' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2024)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2024)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2024-12-31)' },
    { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY (Dec 31, 2024)' }
  ];

  const numberFormatOptions = [
    { value: '1,000.00', label: '1,000.00 (US Format)' },
    { value: '1.000,00', label: '1.000,00 (European Format)' },
    { value: '1 000.00', label: '1 000.00 (Space Separator)' },
    { value: '1000.00', label: '1000.00 (No Separator)' }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system';
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    const savedDateFormat = localStorage.getItem('dateFormat') || 'MM/DD/YYYY';
    const savedNumberFormat = localStorage.getItem('numberFormat') || '1,000.00';

    setTheme(savedTheme);
    setCurrency(savedCurrency);
    setDateFormat(savedDateFormat);
    setNumberFormat(savedNumberFormat);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)')?.matches;
      document.documentElement?.classList?.toggle('dark', systemPrefersDark);
    } else {
      document.documentElement?.classList?.toggle('dark', newTheme === 'dark');
    }
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const handleDateFormatChange = (newFormat) => {
    setDateFormat(newFormat);
    localStorage.setItem('dateFormat', newFormat);
  };

  const handleNumberFormatChange = (newFormat) => {
    setNumberFormat(newFormat);
    localStorage.setItem('numberFormat', newFormat);
  };

  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$'
    };
    return symbols?.[currencyCode] || '$';
  };

  const formatPreviewAmount = (amount) => {
    const symbol = getCurrencySymbol(currency);
    switch (numberFormat) {
      case '1.000,00':
        return `${symbol}1.234,56`;
      case '1 000.00':
        return `${symbol}1 234.56`;
      case '1000.00':
        return `${symbol}1234.56`;
      default:
        return `${symbol}1,234.56`;
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Palette" size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          <p className="text-sm text-muted-foreground">Customize how the app looks and feels</p>
        </div>
      </div>
      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Theme</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleThemeChange(option?.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  theme === option?.value
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    theme === option?.value ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {theme === option?.value && (
                      <Icon name="Check" size={14} className="text-primary-foreground m-0.5" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-foreground">{option?.label}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {option?.value === 'light' && (
                        <Icon name="Sun" size={12} className="text-muted-foreground" />
                      )}
                      {option?.value === 'dark' && (
                        <Icon name="Moon" size={12} className="text-muted-foreground" />
                      )}
                      {option?.value === 'system' && (
                        <Icon name="Monitor" size={12} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Settings */}
        <div>
          <Select
            label="Currency"
            description="Choose your preferred currency for all transactions"
            options={currencyOptions}
            value={currency}
            onChange={handleCurrencyChange}
          />
          <div className="mt-2 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Preview: {formatPreviewAmount(1234.56)}</p>
          </div>
        </div>

        {/* Date Format */}
        <div>
          <Select
            label="Date Format"
            description="How dates will be displayed throughout the app"
            options={dateFormatOptions}
            value={dateFormat}
            onChange={handleDateFormatChange}
          />
        </div>

        {/* Number Format */}
        <div>
          <Select
            label="Number Format"
            description="How numbers and amounts will be formatted"
            options={numberFormatOptions}
            value={numberFormat}
            onChange={handleNumberFormatChange}
          />
          <div className="mt-2 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Preview: {formatPreviewAmount(1234.56)}</p>
          </div>
        </div>

        {/* Reset to Defaults */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => {
              handleThemeChange('system');
              handleCurrencyChange('USD');
              handleDateFormatChange('MM/DD/YYYY');
              handleNumberFormatChange('1,000.00');
            }}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;