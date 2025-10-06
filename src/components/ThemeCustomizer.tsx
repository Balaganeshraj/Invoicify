import React, { useState } from 'react';
import { InvoiceTheme } from '../types/invoice';
import { Palette, Upload, Type } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface ThemeCustomizerProps {
  theme: InvoiceTheme;
  onThemeChange: (theme: InvoiceTheme) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ theme, onThemeChange }) => {
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);

  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Courier New', value: 'Courier New, monospace' }
  ];

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onThemeChange({ ...theme, logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <Palette className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Theme Customization</h3>
      </div>

      <div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div className="flex items-center space-x-4">
            {theme.logo && (
              <div className="w-24 h-24 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                <img 
                  src={theme.logo} 
                  alt="Company Logo" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {theme.logo && (
              <button
                onClick={() => onThemeChange({ ...theme, logo: undefined })}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm"
              >
                Remove
              </button>
            )}
          </div>
          {theme.logo && (
            <p className="text-xs text-gray-500 mt-2">
              Logo will appear larger in the invoice preview and print output
            </p>
          )}
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Color
          </label>
          <div className="relative">
            <button
              onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md"
            >
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded border mr-3"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <span>{theme.primaryColor}</span>
              </div>
            </button>
            {showPrimaryPicker && (
              <div className="absolute z-10 mt-2">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowPrimaryPicker(false)}
                />
                <div className="relative bg-white p-3 rounded-lg shadow-lg border">
                  <HexColorPicker
                    color={theme.primaryColor}
                    onChange={(color) => onThemeChange({ ...theme, primaryColor: color })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secondary Color
          </label>
          <div className="relative">
            <button
              onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md"
            >
              <div className="flex items-center">
                <div
                  className="w-6 h-6 rounded border mr-3"
                  style={{ backgroundColor: theme.secondaryColor }}
                />
                <span>{theme.secondaryColor}</span>
              </div>
            </button>
            {showSecondaryPicker && (
              <div className="absolute z-10 mt-2">
                <div
                  className="fixed inset-0"
                  onClick={() => setShowSecondaryPicker(false)}
                />
                <div className="relative bg-white p-3 rounded-lg shadow-lg border">
                  <HexColorPicker
                    color={theme.secondaryColor}
                    onChange={(color) => onThemeChange({ ...theme, secondaryColor: color })}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Type className="w-4 h-4 inline mr-1" />
            Font Family
          </label>
          <select
            value={theme.fontFamily}
            onChange={(e) => onThemeChange({ ...theme, fontFamily: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        {/* Preview */}
        <div className="p-4 border rounded-lg" style={{ 
          backgroundColor: theme.secondaryColor + '10',
          fontFamily: theme.fontFamily 
        }}>
          <div 
            className="text-lg font-bold mb-2"
            style={{ color: theme.primaryColor }}
          >
            Preview
          </div>
          <p className="text-sm text-gray-600">
            This is how your invoice will look with the selected theme.
          </p>
        </div>
      </div>
    </div>
  );
};