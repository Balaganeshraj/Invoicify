import React, { useState } from 'react';
import { Download, FileImage, Printer, Share2, Mail, MessageCircle } from 'lucide-react';
import { exportToPDF, exportToJPEG, printInvoice, shareViaWhatsApp, shareViaEmail } from '../utils/exportUtils';
import { Invoice } from '../types/invoice';

interface ExportActionsProps {
  invoice: Invoice;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ invoice }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleExportPDF = () => {
    exportToPDF('invoice-preview', `invoice-${invoice.invoiceNumber}.pdf`);
  };

  const handleExportJPEG = () => {
    exportToJPEG('invoice-preview', `invoice-${invoice.invoiceNumber}.jpg`);
  };

  const handlePrint = () => {
    printInvoice();
  };

  const handleWhatsAppShare = async () => {
    setIsSharing(true);
    try {
      const message = `Invoice ${invoice.invoiceNumber} for ${invoice.currency.symbol}${invoice.total.toFixed(invoice.currency.decimal_digits)}`;
      await shareViaWhatsApp('invoice-preview', message);
    } finally {
      setIsSharing(false);
    }
  };

  const handleEmailShare = async () => {
    setIsSharing(true);
    try {
      await shareViaEmail('invoice-preview', invoice.to.email, `Invoice ${invoice.invoiceNumber}`);
    } finally {
      setIsSharing(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.invoiceNumber}`,
          text: `Invoice for ${invoice.currency.symbol}${invoice.total.toFixed(invoice.currency.decimal_digits)}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Invoice URL copied to clipboard!');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Share</h3>
      
      {/* Primary Export Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          PDF
        </button>
        
        <button
          onClick={handleExportJPEG}
          className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileImage className="w-4 h-4 mr-2" />
          JPEG
        </button>
        
        <button
          onClick={handlePrint}
          className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </button>
      </div>

      {/* Advanced Sharing Options */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Share</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleWhatsAppShare}
            disabled={isSharing}
            className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </button>
          
          <button
            onClick={handleEmailShare}
            disabled={isSharing}
            className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </button>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          💡 PDF for professional sharing • JPEG for quick previews • WhatsApp for instant delivery
        </p>
      </div>
    </div>
  );
};