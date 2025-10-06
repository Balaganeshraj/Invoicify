import { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, InvoiceTheme } from '../types/invoice';
import { currencies } from '../data/currencies';

const createInitialInvoice = (): Invoice => {
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 30);

  return {
    id: Date.now().toString(),
    invoiceNumber: `INV-${String(Date.now()).slice(-6)}`,
    date: today.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    type: 'service',
    currency: currencies[0], // USD by default
    country: '',
    from: {
      name: '',
      email: '',
      address: '',
      phone: '',
      taxId: ''
    },
    to: {
      name: '',
      email: '',
      address: '',
      phone: '',
      taxId: ''
    },
    items: [],
    subtotal: 0,
    tax: 0,
    taxRate: 0,
    taxType: 'Tax',
    total: 0,
    notes: '',
    paymentTerms: '',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter, sans-serif'
    }
  };
};

export const useInvoice = () => {
  const [invoice, setInvoice] = useState<Invoice>(createInitialInvoice);

  const updateInvoice = (updates: Partial<Invoice>) => {
    setInvoice(prev => ({ ...prev, ...updates }));
  };

  const addItem = (item: Omit<InvoiceItem, 'id' | 'amount'>) => {
    const newItem: InvoiceItem = {
      ...item,
      id: Date.now().toString(),
      amount: (item.quantity || 0) * (item.rate || 0)
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateTheme = (theme: InvoiceTheme) => {
    setInvoice(prev => ({ ...prev, theme }));
  };

  // Calculate totals whenever items or tax rate changes
  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const tax = subtotal * ((invoice.taxRate || 0) / 100);
    const total = subtotal + tax;

    setInvoice(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  }, [invoice.items, invoice.taxRate]);

  const resetInvoice = () => {
    setInvoice(createInitialInvoice());
  };

  const duplicateInvoice = () => {
    const newInvoice = {
      ...invoice,
      id: Date.now().toString(),
      invoiceNumber: `INV-${String(Date.now()).slice(-6)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setInvoice(newInvoice);
  };

  return {
    invoice,
    updateInvoice,
    addItem,
    updateTheme,
    resetInvoice,
    duplicateInvoice
  };
};