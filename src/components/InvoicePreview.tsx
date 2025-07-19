import React from 'react';
import { Invoice } from '../types/invoice';
import { format } from 'date-fns';
import { formatCurrency } from '../utils/exportUtils';

interface InvoicePreviewProps {
  invoice: Invoice;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const themeStyles = {
    fontFamily: invoice.theme.fontFamily,
    '--primary-color': invoice.theme.primaryColor,
    '--secondary-color': invoice.theme.secondaryColor,
  } as React.CSSProperties;

  return (
    <div 
      id="invoice-preview" 
      className="bg-white p-8 shadow-lg max-w-4xl mx-auto print:shadow-none print:max-w-none"
      style={themeStyles}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--primary-color)' }}
          >
            INVOICE
          </h1>
          <div className="text-sm text-gray-600">
            <p>Invoice #: {invoice.invoiceNumber}</p>
            <p>Date: {format(new Date(invoice.date), 'MMM dd, yyyy')}</p>
            <p>Due Date: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
            <p>Type: {invoice.type === 'service' ? 'Service Invoice' : 'Sales Invoice'}</p>
          </div>
        </div>
        <div className="text-right">
          {invoice.theme.logo ? (
            <img 
              src={invoice.theme.logo} 
              alt="Company Logo" 
              className="w-24 h-24 object-contain mb-4"
            />
          ) : (
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center mb-4"
              style={{ 
                background: `linear-gradient(135deg, var(--primary-color), var(--secondary-color))` 
              }}
            >
              <span className="text-white font-bold text-xl">
                {invoice.from.name.charAt(0) || 'C'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* From/To Section */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 
            className="font-semibold mb-3"
            style={{ color: 'var(--primary-color)' }}
          >
            From:
          </h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-medium">{invoice.from.name}</p>
            <p>{invoice.from.email}</p>
            <p>{invoice.from.phone}</p>
            {invoice.from.taxId && <p>Tax ID: {invoice.from.taxId}</p>}
            <p className="whitespace-pre-line">{invoice.from.address}</p>
          </div>
        </div>
        <div>
          <h3 
            className="font-semibold mb-3"
            style={{ color: 'var(--primary-color)' }}
          >
            To:
          </h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-medium">{invoice.to.name}</p>
            <p>{invoice.to.email}</p>
            <p>{invoice.to.phone}</p>
            {invoice.to.taxId && <p>Tax ID: {invoice.to.taxId}</p>}
            <p className="whitespace-pre-line">{invoice.to.address}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `2px solid var(--primary-color)` }}>
              <th className="text-left py-3 font-semibold text-gray-900">Description</th>
              {invoice.type === 'sales' && (
                <th className="text-center py-3 font-semibold text-gray-900 w-20">Qty</th>
              )}
              {invoice.type === 'service' && (
                <th className="text-center py-3 font-semibold text-gray-900 w-20">Hours</th>
              )}
              <th className="text-right py-3 font-semibold text-gray-900 w-24">
                {invoice.type === 'sales' ? 'Unit Price' : 'Rate'}
              </th>
              <th className="text-right py-3 font-semibold text-gray-900 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-3 text-gray-700">
                  {item.description}
                  {item.taxCategory && (
                    <div className="text-xs text-gray-500 mt-1">
                      Tax Category: {item.taxCategory}
                    </div>
                  )}
                </td>
                <td className="py-3 text-center text-gray-700">{item.quantity}</td>
                <td className="py-3 text-right text-gray-700">
                  {formatCurrency(item.rate, invoice.currency)}
                </td>
                <td className="py-3 text-right text-gray-700">
                  {formatCurrency(item.amount, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">Subtotal:</span>
            <span className="text-gray-900">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">{invoice.taxType} ({invoice.taxRate}%):</span>
            <span className="text-gray-900">{formatCurrency(invoice.tax, invoice.currency)}</span>
          </div>
          <div 
            className="flex justify-between py-3 font-bold text-lg"
            style={{ borderBottom: `2px solid var(--primary-color)` }}
          >
            <span className="text-gray-900">Total:</span>
            <span style={{ color: 'var(--primary-color)' }}>
              {formatCurrency(invoice.total, invoice.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      {invoice.paymentTerms && (
        <div className="mb-6">
          <h3 
            className="font-semibold mb-2"
            style={{ color: 'var(--primary-color)' }}
          >
            Payment Terms:
          </h3>
          <p className="text-sm text-gray-700">{invoice.paymentTerms}</p>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-6">
          <h3 
            className="font-semibold mb-2"
            style={{ color: 'var(--primary-color)' }}
          >
            Notes:
          </h3>
          <p className="text-sm text-gray-700">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div 
        className="text-center text-xs text-gray-500 mt-8 pt-4"
        style={{ borderTop: `1px solid var(--secondary-color)` }}
      >
        <p>Thank you for your business!</p>
        <p className="mt-1">Currency: {invoice.currency.name} ({invoice.currency.code})</p>
      </div>
    </div>
  );
};