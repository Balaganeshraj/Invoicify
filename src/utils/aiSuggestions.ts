import { Invoice, InvoiceItem, AISuggestion } from '../types/invoice';

export const generateAISuggestions = (
  invoice: Invoice,
  updateInvoice: (updates: Partial<Invoice>) => void,
  addItem: (item: Omit<InvoiceItem, 'id' | 'amount'>) => void
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];

  // Suggest common items based on business type
  if (invoice.items.length === 0) {
    suggestions.push({
      type: 'item',
      title: 'Add Common Services',
      description: 'Start with popular service items',
      action: () => {
        addItem({ description: 'Consultation', quantity: 1, rate: 150 });
      }
    });
  }

  // Suggest payment terms optimization
  if (!invoice.paymentTerms) {
    suggestions.push({
      type: 'terms',
      title: 'Set Payment Terms',
      description: 'Add clear payment terms to get paid faster',
      action: () => {
        updateInvoice({ paymentTerms: 'Net 30 days. Late payments subject to 1.5% monthly service charge.' });
      }
    });
  }

  // Suggest tax rate if not set
  if (invoice.taxRate === 0 && invoice.subtotal > 0) {
    suggestions.push({
      type: 'optimization',
      title: 'Add Tax Rate',
      description: 'Consider adding applicable tax rate',
      action: () => {
        updateInvoice({ taxRate: 8.5 });
      }
    });
  }

  // Suggest due date optimization
  const today = new Date();
  const dueDate = new Date(invoice.dueDate);
  const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
  if (daysDiff > 45) {
    suggestions.push({
      type: 'optimization',
      title: 'Optimize Due Date',
      description: 'Consider shorter payment terms for better cash flow',
      action: () => {
        const newDueDate = new Date();
        newDueDate.setDate(newDueDate.getDate() + 30);
        updateInvoice({ dueDate: newDueDate.toISOString().split('T')[0] });
      }
    });
  }

  // Suggest adding notes for better communication
  if (!invoice.notes && invoice.items.length > 0) {
    suggestions.push({
      type: 'optimization',
      title: 'Add Professional Notes',
      description: 'Include thank you message and contact info',
      action: () => {
        updateInvoice({ 
          notes: 'Thank you for your business! Please contact us if you have any questions about this invoice.' 
        });
      }
    });
  }

  // Suggest rounding optimization
  const hasOddCents = invoice.items.some(item => (item.rate * 100) % 100 !== 0);
  if (hasOddCents) {
    suggestions.push({
      type: 'optimization',
      title: 'Round Rates',
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

  return suggestions;
};

export const getSmartItemSuggestions = (description: string): string[] => {
  const suggestions: { [key: string]: string[] } = {
    'web': ['Website Design', 'Frontend Development', 'Backend Development', 'SEO Optimization'],
    'design': ['Logo Design', 'Brand Identity', 'UI/UX Design', 'Graphic Design'],
    'marketing': ['Social Media Management', 'Content Creation', 'Email Marketing', 'PPC Advertising'],
    'consulting': ['Business Consultation', 'Strategy Planning', 'Market Research', 'Process Optimization'],
    'development': ['Mobile App Development', 'API Development', 'Database Design', 'System Integration']
  };

  const lowerDesc = description.toLowerCase();
  
  for (const [key, items] of Object.entries(suggestions)) {
    if (lowerDesc.includes(key)) {
      return items;
    }
  }

  return ['Consultation', 'Project Management', 'Research & Analysis', 'Implementation'];
};