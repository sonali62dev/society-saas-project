import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const PDFService = {
    generateInvoicePDF: (invoice: any, societyName: string = 'SocietyHub Management') => {
        try {
            const isPaid = invoice.status === 'paid';
            const doc = new jsPDF();

            // --- Header branding ---
            doc.setFillColor(30, 58, 95); // Dark Blue #1e3a5f
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text(societyName.toUpperCase(), 14, 22);

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`${isPaid ? 'PAYMENT RECEIPT' : 'MAINTENANCE INVOICE'}`, 14, 32);

            // Right Side Header (Modern lookup)
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 22);
            doc.text(`Doc Type: ${isPaid ? 'Receipt' : 'Bill'}`, 150, 27);

            // --- Billing Info Section ---
            doc.setTextColor(30, 58, 95);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('BILL TO:', 14, 55);

            doc.setTextColor(0);
            const residentName = typeof invoice.resident === 'string' ? invoice.resident : (invoice.resident?.name || 'Resident');
            doc.text(residentName, 14, 62);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const unitInfo = typeof invoice.unit === 'object' ? `${invoice.unit.block}-${invoice.unit.number}` : (invoice.unit || 'N/A');
            doc.text(`Unit: ${unitInfo}`, 14, 68);
            doc.text(`Ref No: ${invoice.invoiceNo || invoice.id}`, 14, 74);
            if (invoice.description) {
                doc.setFont('helvetica', 'italic');
                doc.text(`Desc: ${invoice.description}`, 14, 80);
                doc.setFont('helvetica', 'normal');
            }

            // Top Right Corner Details
            doc.setFont('helvetica', 'bold');
            doc.text(isPaid ? 'PAID DATE:' : 'DUE DATE:', 140, 55);
            doc.setFont('helvetica', 'normal');
            const dateStr = isPaid
                ? (invoice.paidDate || 'N/A')
                : (invoice.dueDate || 'N/A');
            doc.text(dateStr, 140, 62);

            doc.setFont('helvetica', 'bold');
            doc.text('STATUS:', 140, 68);
            if (isPaid) doc.setTextColor(0, 128, 0); else doc.setTextColor(255, 140, 0);
            doc.text(invoice.status.toUpperCase(), 140, 74);
            doc.setTextColor(0);

            // --- Charges Table ---
            const tableColumn = ["Charge Description", "Qty", "Amount (INR)"];
            const tableRows: any[] = [];

            const capitalize = (str: string) => {
                if (!str) return '';
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            }

            if (invoice.maintenance > 0) {
                tableRows.push(["Maintenance Charges", "1", invoice.maintenance.toLocaleString('en-IN')]);
            }
            if (invoice.utilities > 0) {
                tableRows.push(["Utility Charges", "1", invoice.utilities.toLocaleString('en-IN')]);
            }
            if (invoice.items && invoice.items.length > 0) {
                invoice.items.forEach((item: any) => {
                    tableRows.push([capitalize(item.name), "1", item.amount.toLocaleString('en-IN')]);
                });
            }
            if (invoice.penalty > 0) {
                tableRows.push(["Late Fee / Penalty", "1", invoice.penalty.toLocaleString('en-IN')]);
            }

            autoTable(doc, {
                startY: 85,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: {
                    fillColor: [30, 58, 95],
                    textColor: [255, 255, 255],
                    fontSize: 10,
                    fontStyle: 'bold'
                },
                styles: { fontSize: 9, cellPadding: 4 },
                columnStyles: {
                    0: { cellWidth: 120 },
                    1: { cellWidth: 20, halign: 'center' },
                    2: { cellWidth: 40, halign: 'right' }
                }
            });

            // --- Summary / Total Section ---
            const finalY = (doc as any).lastAutoTable.finalY + 10;

            doc.setFillColor(245, 245, 245);
            doc.rect(125, finalY, 70, 20, 'F');

            doc.setTextColor(30, 58, 95);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('GRAND TOTAL', 130, finalY + 12);

            doc.setFontSize(14);
            doc.text(`Rs. ${invoice.amount.toLocaleString('en-IN')}/-`, 190, finalY + 12, { align: 'right' });

            // --- Paid Stamp (For Receipts) ---
            if (isPaid) {
                doc.setDrawColor(0, 128, 0);
                doc.setLineWidth(1);
                doc.rect(15, finalY + 5, 40, 15);
                doc.setTextColor(0, 128, 0);
                doc.setFontSize(14);
                doc.text('PAID', 35, finalY + 15, { align: 'center' });
            }

            // --- Footer ---
            doc.setTextColor(150);
            doc.setFontSize(8);
            const footerY = 280;
            doc.setDrawColor(200);
            doc.line(14, footerY - 5, 196, footerY - 5);
            doc.text('Thank you for being a valued resident of our society.', 14, footerY);
            doc.text('This is a computer generated document and does not require a physical signature.', 14, footerY + 5);
            doc.text('For queries, please contact your Society Office.', 196, footerY, { align: 'right' });

            doc.save(`${isPaid ? 'Receipt' : 'Invoice'}_${invoice.invoiceNo}.pdf`);
        } catch (error) {
            console.error('PDFService Error:', error);
            throw error;
        }
    }
};
