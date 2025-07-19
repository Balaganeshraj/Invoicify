export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  taxCategory?: string;
  category?: 'product' | 'service';
}

export interface TaxRule {
  country: string;
  type: string; // 'VAT', 'GST', 'Sales Tax', etc.
  rate: number;
  categories: string[];
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimal_digits: number;
}

export interface InvoiceTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logo?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  type: 'service' | 'sales';
  currency: Currency;
  country: string;
  from: {
    name: string;
    email: string;
    address: string;
    phone: string;
    taxId?: string;
  };
  to: {
    name: string;
    email: string;
    address: string;
    phone: string;
    taxId?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  taxType: string;
  total: number;
  notes: string;
  paymentTerms: string;
  theme: InvoiceTheme;
}

export interface AISuggestion {
  type: 'error' | 'optimization' | 'tax' | 'formatting' | 'compliance';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  action?: () => void;
  autoFix?: boolean;
}

export interface InvoiceReport {
  period: string;
  totalRevenue: number;
  serviceRevenue: number;
  salesRevenue: number;
  totalTax: number;
  invoiceCount: number;
  clientCount: number;
  averageInvoiceValue: number;
}