import { InvoiceInput, InvoiceData, InvoiceItem, TotalItem } from '../types/invoice';
import Invoice, { InvoiceDocument } from '../models/invoice.model';

export class InvoiceService {
  // Format currency similar to the client-side logic
  private formatCurrency(amount: number): string {
    return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  }
  
  // Calculate totals for invoice items
  public calculateInvoiceTotals(input: InvoiceInput): InvoiceData {
    const taxRate = input.taxRate || 0.1; // Default to 10% tax rate if not specified
    
    const tableData: InvoiceItem[] = input.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
    
    const subtotal = tableData.reduce((sum, item) => sum + (item.total || 0), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    const totalData: TotalItem[] = [
      { label: "Subtotal", value: this.formatCurrency(subtotal) },
      { label: `Tax (${(taxRate * 100).toFixed(0)}%)`, value: this.formatCurrency(tax) },
      { label: "Total", value: this.formatCurrency(total) }
    ];
    
    return { tableData, totalData };
  }
  
  public async createInvoice(
    input: InvoiceInput,
    invoiceNumber?: string,
    dueDate?: Date
  ): Promise<InvoiceDocument> {
    const { tableData, totalData } = this.calculateInvoiceTotals(input);
    
    const generatedInvoiceNumber = invoiceNumber || `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const generatedDueDate = dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    const invoice = new Invoice({
      invoiceNumber: generatedInvoiceNumber,
      issueDate: new Date(),
      dueDate: generatedDueDate,
      items: tableData,
      totals: totalData
    });
    
    return await invoice.save();
  }
  
  // Get invoice by ID
  public async getInvoiceById(id: string): Promise<InvoiceDocument | null> {
    return await Invoice.findById(id);
  }
    public async getAllInvoices(): Promise<InvoiceDocument[]> {
    return await Invoice.find({});
  }
  
  // Update an invoice
  public async updateInvoice(id: string, input: InvoiceInput): Promise<InvoiceDocument | null> {
    const { tableData, totalData } = this.calculateInvoiceTotals(input);
    
    return await Invoice.findByIdAndUpdate(
      id, 
      { items: tableData, totals: totalData },
      { new: true }
    );
  }
  
  // Delete an invoice
  public async deleteInvoice(id: string): Promise<boolean> {
    const result = await Invoice.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }
}

export default new InvoiceService();