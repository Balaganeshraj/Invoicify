import React, { useState } from 'react';
import { Invoice, InvoiceItem } from '../types/invoice';
import { Plus, Trash2, User, Building, FileText, ShoppingCart } from 'lucide-react';
import { ServiceSelector } from './ServiceSelector';
import { CurrencySelector } from './CurrencySelector';
import { CountrySelector } from './CountrySelector';
import { getTaxRuleByCountry } from '../data/taxRules';
import { currencies } from '../data/currencies';
import { countries } from '../data/countries';

interface InvoiceFormProps {
  invoice: Invoice;
  updateInvoice: (updates: Partial<Invoice>) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, updateInvoice }) => {

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
      category: invoice.type === 'service' ? 'service' : 'product'
    };
    updateInvoice({ items: [...invoice.items, newItem] });
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        return updatedItem;
      }
      return item;
    });
    updateInvoice({ items: updatedItems });
  };

  const removeItem = (id: string) => {
    updateInvoice({ items: invoice.items.filter(item => item.id !== id) });
  };

  const handleServiceChange = (id: string, description: string, rate?: number) => {
    const updates: Partial<InvoiceItem> = { description };
    if (rate && rate > 0) {
      updates.rate = rate;
    }
    updateItem(id, updates);
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    const taxRule = getTaxRuleByCountry(countryCode);
    const currency = currencies.find(c => c.code === country?.currency);
    
    const updates: Partial<Invoice> = { country: countryCode };
    
    if (currency) {
      updates.currency = currency;
    }
    
    if (taxRule) {
      updates.taxRate = taxRule.rate;
      updates.taxType = taxRule.type;
    }
    
    updateInvoice(updates);
  };

  const handleTypeChange = (type: 'service' | 'sales') => {
    updateInvoice({ 
      type,
      items: invoice.items.map(item => ({ ...item, category: type === 'service' ? 'service' : 'product' }))
    });
  };

  return (
    <div className="space-y-8">
      {/* Invoice Type & Basic Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Configuration</h3>
        
        {/* Invoice Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Invoice Type
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => handleTypeChange('service')}
              className={`flex items-center px-4 py-3 rounded-lg border-2 transition-colors ${
                invoice.type === 'service'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              Service Invoice
            </button>
            <button
              onClick={() => handleTypeChange('sales')}
              className={`flex items-center px-4 py-3 rounded-lg border-2 transition-colors ${
                invoice.type === 'sales'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Sales Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={(e) => updateInvoice({ invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="INV-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={invoice.date}
              onChange={(e) => updateInvoice({ date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => updateInvoice({ dueDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <CountrySelector
              selectedCountry={invoice.country}
              onCountryChange={handleCountryChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <CurrencySelector
            selectedCurrency={invoice.currency}
            onCurrencyChange={(currency) => updateInvoice({ currency })}
            className="max-w-xs"
          />
        </div>
      </div>

      {/* From/To Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* From */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">From (Your Business)</h3>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={invoice.from.name}
              onChange={(e) => updateInvoice({ from: { ...invoice.from, name: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name/Company"
            />
            <input
              type="email"
              value={invoice.from.email}
              onChange={(e) => updateInvoice({ from: { ...invoice.from, email: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
            <input
              type="tel"
              value={invoice.from.phone}
              onChange={(e) => updateInvoice({ from: { ...invoice.from, phone: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone Number"
            />
            <input
              type="text"
              value={invoice.from.taxId || ''}
              onChange={(e) => updateInvoice({ from: { ...invoice.from, taxId: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tax ID / VAT Number"
            />
            <textarea
              value={invoice.from.address}
              onChange={(e) => updateInvoice({ from: { ...invoice.from, address: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Address"
              rows={3}
            />
          </div>
        </div>

        {/* To */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">To (Client)</h3>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={invoice.to.name}
              onChange={(e) => updateInvoice({ to: { ...invoice.to, name: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Client Name/Company"
            />
            <input
              type="email"
              value={invoice.to.email}
              onChange={(e) => updateInvoice({ to: { ...invoice.to, email: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="client@email.com"
            />
            <input
              type="tel"
              value={invoice.to.phone}
              onChange={(e) => updateInvoice({ to: { ...invoice.to, phone: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Client Phone"
            />
            <input
              type="text"
              value={invoice.to.taxId || ''}
              onChange={(e) => updateInvoice({ to: { ...invoice.to, taxId: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Client Tax ID"
            />
            <textarea
              value={invoice.to.address}
              onChange={(e) => updateInvoice({ to: { ...invoice.to, address: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Client Address"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {invoice.type === 'service' ? 'Services' : 'Products'}
          </h3>
          <button
            onClick={addItem}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {invoice.type === 'service' ? 'Service' : 'Product'}
          </button>
        </div>

        <div className="space-y-4">
          {invoice.items.map((item) => (
            <div key={item.id} className="relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {invoice.type === 'service' ? 'Service Description' : 'Product Description'}
                  </label>
                  {invoice.type === 'service' ? (
                    <ServiceSelector
                      value={item.description}
                      onChange={(description, rate) => handleServiceChange(item.id, description, rate)}
                      className="w-full"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Product description"
                    />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {invoice.type === 'service' ? 'Hours' : 'Quantity'}
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={invoice.type === 'service' ? 'Hours' : 'Qty'}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {invoice.type === 'service' ? 'Rate (per hour)' : 'Unit Price'}
                  </label>
                  <input
                    type="number"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={invoice.type === 'service' ? 'Rate' : 'Price'}
                    step="0.01"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Amount
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                    {invoice.currency.symbol}{item.amount.toFixed(invoice.currency.decimal_digits)}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    &nbsp;
                  </label>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax and Payment Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Type
              </label>
              <input
                type="text"
                value={invoice.taxType}
                onChange={(e) => updateInvoice({ taxType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VAT, GST, Sales Tax, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={invoice.taxRate}
                onChange={(e) => updateInvoice({ taxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Terms</h3>
          <textarea
            value={invoice.paymentTerms}
            onChange={(e) => updateInvoice({ paymentTerms: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Payment terms and conditions"
            rows={4}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
        <textarea
          value={invoice.notes}
          onChange={(e) => updateInvoice({ notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Additional notes, terms, or comments"
          rows={4}
        />
      </div>
    </div>
  );
};