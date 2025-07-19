import { TaxRule } from '../types/invoice';

export const taxRules: TaxRule[] = [
  {
    country: 'US',
    type: 'Sales Tax',
    rate: 8.5,
    categories: ['Standard', 'Digital Services', 'Consulting']
  },
  {
    country: 'GB',
    type: 'VAT',
    rate: 20,
    categories: ['Standard Rate', 'Reduced Rate', 'Zero Rate']
  },
  {
    country: 'DE',
    type: 'VAT',
    rate: 19,
    categories: ['Standard Rate', 'Reduced Rate']
  },
  {
    country: 'FR',
    type: 'VAT',
    rate: 20,
    categories: ['Standard Rate', 'Reduced Rate', 'Super Reduced Rate']
  },
  {
    country: 'CA',
    type: 'GST/HST',
    rate: 13,
    categories: ['Taxable', 'Zero-rated', 'Exempt']
  },
  {
    country: 'AU',
    type: 'GST',
    rate: 10,
    categories: ['Taxable', 'GST-free', 'Input taxed']
  },
  {
    country: 'IN',
    type: 'GST',
    rate: 18,
    categories: ['5%', '12%', '18%', '28%']
  },
  {
    country: 'JP',
    type: 'Consumption Tax',
    rate: 10,
    categories: ['Standard Rate', 'Reduced Rate']
  },
  {
    country: 'SG',
    type: 'GST',
    rate: 8,
    categories: ['Standard Rate', 'Zero Rate']
  },
  {
    country: 'NL',
    type: 'VAT',
    rate: 21,
    categories: ['High Rate', 'Low Rate', 'Zero Rate']
  },
  {
    country: 'SE',
    type: 'VAT',
    rate: 25,
    categories: ['Standard Rate', 'Reduced Rate', 'Zero Rate']
  },
  {
    country: 'NO',
    type: 'VAT',
    rate: 25,
    categories: ['Standard Rate', 'Reduced Rate', 'Zero Rate']
  },
  {
    country: 'CH',
    type: 'VAT',
    rate: 7.7,
    categories: ['Standard Rate', 'Reduced Rate', 'Special Rate']
  },
  {
    country: 'BR',
    type: 'ICMS',
    rate: 17,
    categories: ['Standard', 'Reduced', 'Exempt']
  },
  {
    country: 'MX',
    type: 'IVA',
    rate: 16,
    categories: ['General Rate', 'Zero Rate', 'Exempt']
  },
  {
    country: 'LK',
    type: 'VAT',
    rate: 15,
    categories: ['Standard Rate', 'Zero Rate', 'Exempt']
  }
];

export const getTaxRuleByCountry = (countryCode: string): TaxRule | null => {
  return taxRules.find(rule => rule.country === countryCode) || null;
};