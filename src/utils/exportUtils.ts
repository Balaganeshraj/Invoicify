import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId: string, filename: string = 'invoice.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Hide any interactive elements for clean export
    const interactiveElements = element.querySelectorAll('button, input, select, textarea');
    interactiveElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    // Ensure logo is properly sized for PDF export
    const logoElements = element.querySelectorAll('img[alt="Company Logo"]');
    logoElements.forEach(logo => {
      (logo as HTMLElement).style.width = '60mm';
      (logo as HTMLElement).style.height = '40mm';
      (logo as HTMLElement).style.objectFit = 'contain';
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI (210mm)
      height: 1123 // A4 height in pixels at 96 DPI (297mm)
    });

    // Restore interactive elements
    interactiveElements.forEach(el => {
      (el as HTMLElement).style.display = '';
    });

    // Restore logo styles
    logoElements.forEach(logo => {
      (logo as HTMLElement).style.width = '';
      (logo as HTMLElement).style.height = '';
      (logo as HTMLElement).style.objectFit = '';
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const exportToJPEG = async (elementId: string, filename: string = 'invoice.jpg') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Hide any interactive elements for clean export
    const interactiveElements = element.querySelectorAll('button, input, select, textarea');
    interactiveElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    // Ensure logo is properly sized for JPEG export
    const logoElements = element.querySelectorAll('img[alt="Company Logo"]');
    logoElements.forEach(logo => {
      (logo as HTMLElement).style.maxWidth = '60mm';
      (logo as HTMLElement).style.maxHeight = '40mm';
      (logo as HTMLElement).style.objectFit = 'contain';
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123 // A4 height in pixels at 96 DPI
    });

    // Restore interactive elements
    interactiveElements.forEach(el => {
      (el as HTMLElement).style.display = '';
    });

    // Restore logo styles
    logoElements.forEach(logo => {
      (logo as HTMLElement).style.maxWidth = '';
      (logo as HTMLElement).style.maxHeight = '';
      (logo as HTMLElement).style.objectFit = '';
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  } catch (error) {
    console.error('Error generating JPEG:', error);
  }
};

export const shareViaWhatsApp = async (elementId: string, message: string = '') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    // Convert to blob for sharing
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const file = new File([blob], 'invoice.jpg', { type: 'image/jpeg' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Invoice',
        text: message,
        files: [file]
      });
    } else {
      // Fallback: open WhatsApp web with message
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message + ' (Invoice image attached separately)')}`;
      window.open(whatsappUrl, '_blank');
      
      // Also download the image
      const link = document.createElement('a');
      link.download = 'invoice-for-whatsapp.jpg';
      link.href = dataUrl;
      link.click();
    }
  } catch (error) {
    console.error('Error sharing via WhatsApp:', error);
  }
};

export const shareViaEmail = async (elementId: string, to: string = '', subject: string = 'Invoice') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Generate both PDF and HTML versions
    await exportToPDF(elementId, 'invoice.pdf');
    
    const htmlContent = element.outerHTML;
    const styledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: 600; }
          .text-right { text-align: right; }
          .font-bold { font-weight: bold; }
          .text-lg { font-size: 1.125rem; }
          .text-xl { font-size: 1.25rem; }
          .text-2xl { font-size: 1.5rem; }
          .text-3xl { font-size: 1.875rem; }
          .mb-4 { margin-bottom: 1rem; }
          .mb-6 { margin-bottom: 1.5rem; }
          .mb-8 { margin-bottom: 2rem; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
          .gap-8 { gap: 2rem; }
          @media print {
            body { margin: 0; padding: 0; }
            .invoice-container { max-width: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          ${htmlContent}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([styledHtml], { type: 'text/html' });
    const file = new File([blob], 'invoice.html', { type: 'text/html' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: subject,
        text: 'Please find the invoice attached.',
        files: [file]
      });
    } else {
      // Fallback: open email client
      const emailUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('Please find the invoice attached. The PDF version has been downloaded to your computer.')}`;
      window.open(emailUrl);
    }
  } catch (error) {
    console.error('Error sharing via email:', error);
  }
};

export const printInvoice = () => {
  window.print();
};

export const formatCurrency = (amount: number, currency: { symbol: string; decimal_digits: number }): string => {
  return `${currency.symbol}${amount.toFixed(currency.decimal_digits)}`;
};