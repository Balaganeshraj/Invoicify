import { Invoice, InvoiceItem, AISuggestion } from '../types/invoice';
import { getTaxRuleByCountry } from '../data/taxRules';

export const generateAIIntelligence = (
  invoice: Invoice,
  updateInvoice: (updates: Partial<Invoice>) => void,
  addItem: (item: Omit<InvoiceItem, 'id' | 'amount'>) => void
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  // Error Detection
  const errorSuggestions = detectErrors(invoice);
  suggestions.push(...errorSuggestions);

  // Tax Intelligence
  const taxSuggestions = generateTaxIntelligence(invoice, updateInvoice);
  suggestions.push(...taxSuggestions);

  // Optimization Suggestions
  const optimizationSuggestions = generateOptimizations(invoice, updateInvoice, addItem);
  suggestions.push(...optimizationSuggestions);

  // Compliance Checks
  const complianceSuggestions = checkCompliance(invoice, updateInvoice);
  suggestions.push(...complianceSuggestions);

  // Formatting Improvements
  const formattingSuggestions = checkFormatting(invoice, updateInvoice);
  suggestions.push(...formattingSuggestions);

  return suggestions;
};

const detectErrors = (invoice: Invoice): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  // Check for calculation errors
  const calculatedSubtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  if (Math.abs(calculatedSubtotal - invoice.subtotal) > 0.01) {
    suggestions.push({
      type: 'error',
      severity: 'high',
      title: 'Subtotal Mismatch',
      description: `Calculated subtotal (${invoice.currency.symbol}${calculatedSubtotal.toFixed(2)}) doesn't match displayed subtotal`,
      autoFix: true
    });
  }

  // Check for missing required fields
  if (!invoice.from.name) {
    suggestions.push({
      type: 'error',
      severity: 'high',
      title: 'Missing Sender Information',
      description: 'Sender name is required for a valid invoice'
    });
  }

  if (!invoice.to.name) {
    suggestions.push({
      type: 'error',
      severity: 'high',
      title: 'Missing Client Information',
      description: 'Client name is required for a valid invoice'
    });
  }

  // Check for invalid quantities or rates
  invoice.items.forEach((item, index) => {
    if (item.quantity <= 0) {
      suggestions.push({
        type: 'error',
        severity: 'medium',
        title: `Invalid Quantity in Item ${index + 1}`,
        description: 'Quantity must be greater than 0'
      });
    }

    if (item.rate < 0) {
      suggestions.push({
        type: 'error',
        severity: 'medium',
        title: `Negative Rate in Item ${index + 1}`,
        description: 'Rate cannot be negative'
      });
    }

    if (Math.abs(item.amount - (item.quantity * item.rate)) > 0.01) {
      suggestions.push({
        type: 'error',
        severity: 'medium',
        title: `Amount Calculation Error in Item ${index + 1}`,
        description: 'Item amount doesn\'t match quantity × rate',
        autoFix: true
      });
    }
  });

  return suggestions;
};

const generateTaxIntelligence = (
  invoice: Invoice,
  updateInvoice: (updates: Partial<Invoice>) => void
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];
  const taxRule = getTaxRuleByCountry(invoice.country);

  if (taxRule) {
    // Suggest correct tax rate
    if (invoice.taxRate !== taxRule.rate) {
      suggestions.push({
        type: 'tax',
        severity: 'medium',
        title: `Incorrect ${taxRule.type} Rate`,
        description: `Standard ${taxRule.type} rate for ${invoice.country} is ${taxRule.rate}%`,
        action: () => updateInvoice({ taxRate: taxRule.rate, taxType: taxRule.type })
      });
    }

    // Suggest tax categories for items
    invoice.items.forEach((item, index) => {
      if (!item.taxCategory && taxRule.categories.length > 0) {
        suggestions.push({
          type: 'tax',
          severity: 'low',
          title: `Missing Tax Category for Item ${index + 1}`,
          description: `Consider assigning a tax category: ${taxRule.categories.join(', ')}`
        });
      }
    });

    // Tax optimization suggestions
    if (invoice.type === 'service' && invoice.country === 'US') {
      suggestions.push({
        type: 'optimization',
        severity: 'low',
        title: 'Service Tax Optimization',
        description: 'Consider if digital services qualify for different tax treatment in client\'s state'
      });
    }

    // VAT compliance for EU
    if (['DE', 'FR', 'NL', 'BE', 'AT', 'IT', 'ES', 'PT', 'IE', 'FI', 'GR'].includes(invoice.country)) {
      if (!invoice.from.taxId) {
        suggestions.push({
          type: 'compliance',
          severity: 'high',
          title: 'VAT Number Required',
          description: 'EU businesses must include VAT number on invoices'
        });
      }
    }
  }

  return suggestions;
};

const generateOptimizations = (
  invoice: Invoice,
  updateInvoice: (updates: Partial<Invoice>) => void,
  addItem: (item: Omit<InvoiceItem, 'id' | 'amount'>) => void
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  // Payment terms optimization
  if (!invoice.paymentTerms) {
    suggestions.push({
      type: 'optimization',
      severity: 'medium',
      title: 'Add Payment Terms',
      description: 'Clear payment terms improve cash flow and reduce disputes',
      action: () => updateInvoice({ 
        paymentTerms: 'Payment due within 30 days. Late payments subject to 1.5% monthly service charge.' 
      })
    });
  }

  // Due date optimization
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
  if (daysDiff > 60) {
    suggestions.push({
      type: 'optimization',
      severity: 'low',
      title: 'Long Payment Terms',
      description: 'Consider shorter payment terms (30 days) for better cash flow',
      action: () => {
        const newDueDate = new Date();
        newDueDate.setDate(newDueDate.getDate() + 30);
        updateInvoice({ dueDate: newDueDate.toISOString().split('T')[0] });
      }
    });
  }

  // Currency optimization
  if (invoice.country === 'US' && invoice.currency.code !== 'USD') {
    suggestions.push({
      type: 'optimization',
      severity: 'low',
      title: 'Currency Mismatch',
      description: 'Consider using USD for US-based clients to avoid exchange rate issues'
    });
  }

  // Item description optimization
  invoice.items.forEach((item, index) => {
    if (item.description.length < 10) {
      suggestions.push({
        type: 'optimization',
        severity: 'low',
        title: `Improve Item ${index + 1} Description`,
        description: 'More detailed descriptions help clients understand charges'
      });
    }
  });

  // Suggest bundling for multiple small items
  if (invoice.items.length > 5 && invoice.items.some(item => item.amount < invoice.total * 0.05)) {
    suggestions.push({
      type: 'optimization',
      severity: 'low',
      title: 'Consider Item Bundling',
      description: 'Bundle small items to simplify the invoice and improve readability'
    });
  }

  return suggestions;
};

const checkCompliance = (
  invoice: Invoice,
  updateInvoice: (updates: Partial<Invoice>) => void
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  // Sequential invoice numbering
  const invoiceNum = parseInt(invoice.invoiceNumber.replace(/\D/g, ''));
  if (isNaN(invoiceNum)) {
    suggestions.push({
      type: 'compliance',
      severity: 'medium',
      title: 'Non-Sequential Invoice Number',
      description: 'Many jurisdictions require sequential invoice numbering for tax compliance'
    });
  }

  // Required fields for different countries
  if (invoice.country === 'DE' && !invoice.from.taxId) {
    suggestions.push({
      type: 'compliance',
      severity: 'high',
      title: 'German Tax ID Required',
      description: 'German businesses must include tax ID (Steuernummer) on invoices'
    });
  }

  if (invoice.country === 'AU' && invoice.total >= 82.50 && !invoice.from.taxId) {
    suggestions.push({
      type: 'compliance',
      severity: 'high',
      title: 'ABN Required',
      description: 'Australian businesses must include ABN on tax invoices over $82.50'
    });
  }

  // Date validation
  const invoiceDate = new Date(invoice.date);
  const today = new Date();
  if (invoiceDate > today) {
    suggestions.push({
      type: 'compliance',
      severity: 'medium',
      title: 'Future Invoice Date',
      description: 'Invoice date should not be in the future'
    });
  }

  return suggestions;
};

const checkFormatting = (
  invoice: Invoice,
  updateInvoice: (updates: Partial<Invoice>) => void
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  // Currency formatting
  const hasInconsistentDecimals = invoice.items.some(item => {
    const decimals = item.rate.toString().split('.')[1]?.length || 0;
    return decimals !== invoice.currency.decimal_digits;
  });

  if (hasInconsistentDecimals) {
    suggestions.push({
      type: 'formatting',
      severity: 'low',
      title: 'Inconsistent Decimal Places',
      description: `${invoice.currency.name} should use ${invoice.currency.decimal_digits} decimal places`,
      autoFix: true
    });
  }

  // Round numbers for cleaner appearance
  const hasOddCents = invoice.items.some(item => 
    invoice.currency.decimal_digits > 0 && (item.rate * 100) % 100 !== 0
  );

  if (hasOddCents && invoice.items.length > 1) {
    suggestions.push({
      type: 'formatting',
      severity: 'low',
      title: 'Consider Round Numbers',
      description: 'Round rates to whole numbers for cleaner invoices',
      action: () => {
        const roundedItems = invoice.items.map(item => ({
          ...item,
          rate: Math.round(item.rate),
          amount: Math.round(item.rate) * item.quantity
        }));
        updateInvoice({ items: roundedItems });
      }
    });
  }

  // Professional notes suggestion
  if (!invoice.notes && invoice.items.length > 0) {
    suggestions.push({
      type: 'formatting',
      severity: 'low',
      title: 'Add Professional Notes',
      description: 'Include thank you message and contact information',
      action: () => updateInvoice({ 
        notes: 'Thank you for your business! Please contact us if you have any questions about this invoice.' 
      })
    });
  }

  return suggestions;
};

export const getSmartItemSuggestions = (description: string, type: 'service' | 'sales'): string[] => {
  const serviceSuggestions: { [key: string]: string[] } = {};

  const salesSuggestions: { [key: string]: string[] } = {
    'software': ['Software License', 'SaaS Subscription', 'Mobile App', 'Desktop Application', 'Plugin/Extension'],
    'hardware': ['Computer Equipment', 'Network Hardware', 'Mobile Device', 'Accessories', 'Replacement Parts'],
    'digital': ['Digital Download', 'E-book', 'Online Course', 'Digital Template', 'Stock Photos'],
    'physical': ['Physical Product', 'Merchandise', 'Printed Materials', 'Equipment', 'Supplies'],
    'subscription': ['Monthly Subscription', 'Annual Subscription', 'Premium Plan', 'Enterprise License', 'Support Package']
  };

  const suggestions = type === 'sales' ? salesSuggestions : serviceSuggestions;
  const lowerDesc = description.toLowerCase();
  
  for (const [key, items] of Object.entries(suggestions)) {
    if (lowerDesc.includes(key)) {
      return items;
    }
  }

  return type === 'service' 
    ? []
    : ['Product', 'License', 'Subscription', 'Package', 'Bundle'];
};