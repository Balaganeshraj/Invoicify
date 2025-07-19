import React, { useState } from 'react';
import { FileText, Eye, Edit3, Sparkles, Settings, Copy } from 'lucide-react';
import { useInvoice } from './hooks/useInvoice';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { AIAssistant } from './components/AIAssistant';
import { ExportActions } from './components/ExportActions';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { generateAIIntelligence } from './utils/aiIntelligence';

function App() {
  const { invoice, updateInvoice, addItem, updateTheme, resetInvoice, duplicateInvoice } = useInvoice();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'customize'>('edit');
  const [aiEnabled, setAiEnabled] = useState(true);

  const suggestions = generateAIIntelligence(invoice, updateInvoice, addItem);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                  style={{ 
                    background: `linear-gradient(135deg, ${invoice.theme.primaryColor}, ${invoice.theme.secondaryColor})` 
                  }}
                >
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">AI Invoice Generator Pro</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'edit'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('customize')}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'customize'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Customize
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={duplicateInvoice}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </button>
                <button
                  onClick={resetInvoice}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  New Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'edit' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Form Section */}
            <div className="xl:col-span-3">
              <InvoiceForm invoice={invoice} updateInvoice={updateInvoice} />
            </div>
            
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* AI Assistant */}
              <AIAssistant 
                suggestions={suggestions} 
                enabled={aiEnabled}
                onToggle={setAiEnabled}
              />
              
              {/* Summary */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium capitalize">{invoice.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium">{invoice.currency.code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{invoice.items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">
                      {invoice.currency.symbol}{invoice.subtotal.toFixed(invoice.currency.decimal_digits)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{invoice.taxType}:</span>
                    <span className="font-medium">
                      {invoice.currency.symbol}{invoice.tax.toFixed(invoice.currency.decimal_digits)}
                    </span>
                  </div>
                  <div 
                    className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3"
                    style={{ color: invoice.theme.primaryColor }}
                  >
                    <span>Total:</span>
                    <span>
                      {invoice.currency.symbol}{invoice.total.toFixed(invoice.currency.decimal_digits)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Preview Section */}
            <div className="xl:col-span-3">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Invoice Preview</h2>
                  <div className="flex items-center text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Ready to export
                  </div>
                </div>
                <p className="text-gray-600 mt-1">
                  This is how your invoice will appear when printed or exported.
                </p>
              </div>
              <InvoicePreview invoice={invoice} />
            </div>
            
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Export Actions */}
              <ExportActions invoice={invoice} />
              
              {/* Preview Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Guide</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">PDF Export</p>
                      <p>Professional format, perfect for email and archiving</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">JPEG Export</p>
                      <p>Image format, great for quick sharing and previews</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp Share</p>
                      <p>Instant delivery with image attachment</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Email Share</p>
                      <p>Professional HTML email with PDF attachment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customize' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Customization Section */}
            <div className="xl:col-span-3">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customize Your Invoice</h2>
                <p className="text-gray-600 mt-1">
                  Personalize your invoice with custom colors, fonts, and branding.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ThemeCustomizer theme={invoice.theme} onThemeChange={updateTheme} />
                
                {/* Live Preview */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                  <div 
                    className="border rounded-lg p-4 min-h-96"
                    style={{ fontFamily: invoice.theme.fontFamily }}
                  >
                    <div 
                      className="text-2xl font-bold mb-4"
                      style={{ color: invoice.theme.primaryColor }}
                    >
                      INVOICE
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div 
                          className="font-semibold mb-2"
                          style={{ color: invoice.theme.primaryColor }}
                        >
                          From:
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{invoice.from.name || 'Your Company'}</p>
                          <p>{invoice.from.email || 'your@email.com'}</p>
                        </div>
                      </div>
                      <div>
                        <div 
                          className="font-semibold mb-2"
                          style={{ color: invoice.theme.primaryColor }}
                        >
                          To:
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{invoice.to.name || 'Client Name'}</p>
                          <p>{invoice.to.email || 'client@email.com'}</p>
                        </div>
                      </div>
                    </div>
                    <div 
                      className="border-t pt-4"
                      style={{ borderColor: invoice.theme.secondaryColor }}
                    >
                      <div className="flex justify-between">
                        <span>Sample Item</span>
                        <span style={{ color: invoice.theme.primaryColor }}>
                          {invoice.currency.symbol}100.00
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Theme Presets */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Themes</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateTheme({
                      primaryColor: '#3b82f6',
                      secondaryColor: '#64748b',
                      fontFamily: 'Inter, sans-serif'
                    })}
                    className="p-3 border rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="w-full h-4 bg-gradient-to-r from-blue-500 to-slate-500 rounded mb-2"></div>
                    <span className="text-xs">Professional</span>
                  </button>
                  <button
                    onClick={() => updateTheme({
                      primaryColor: '#059669',
                      secondaryColor: '#10b981',
                      fontFamily: 'Roboto, sans-serif'
                    })}
                    className="p-3 border rounded-lg hover:border-green-500 transition-colors"
                  >
                    <div className="w-full h-4 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded mb-2"></div>
                    <span className="text-xs">Nature</span>
                  </button>
                  <button
                    onClick={() => updateTheme({
                      primaryColor: '#dc2626',
                      secondaryColor: '#ef4444',
                      fontFamily: 'Montserrat, sans-serif'
                    })}
                    className="p-3 border rounded-lg hover:border-red-500 transition-colors"
                  >
                    <div className="w-full h-4 bg-gradient-to-r from-red-600 to-red-400 rounded mb-2"></div>
                    <span className="text-xs">Bold</span>
                  </button>
                  <button
                    onClick={() => updateTheme({
                      primaryColor: '#7c3aed',
                      secondaryColor: '#a855f7',
                      fontFamily: 'Poppins, sans-serif'
                    })}
                    className="p-3 border rounded-lg hover:border-purple-500 transition-colors"
                  >
                    <div className="w-full h-4 bg-gradient-to-r from-violet-600 to-purple-400 rounded mb-2"></div>
                    <span className="text-xs">Creative</span>
                  </button>
                </div>
              </div>

              {/* Customization Tips */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Tips</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Use your brand colors for consistency across all business documents</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Choose readable fonts that reflect your business personality</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Upload your logo for professional branding</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Ensure good contrast between text and background colors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;