import { Request, Response } from 'express';
import invoiceService from '../services/invoiceServices';
import { InvoiceInput } from '../types/invoice';

export class InvoiceController {
  public calculateInvoice = async (req: Request, res: Response): Promise<void> => {
    console.log('Calculating invoice with body:', req.body);
    
    try {
      const input: InvoiceInput = req.body;
      
      if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
        res.status(400).json({ error: 'Invoice items are required and must be an array' });
        return;
      }
      
      const result = invoiceService.calculateInvoiceTotals(input);
      res.status(200).json(result);
    } catch (error) {
      console.error('Failed to calculate invoice:', error);
      res.status(500).json({ error: 'Failed to calculate invoice' });
    }
  };
  
  public createInvoice = async (req: Request, res: Response): Promise<void> => {
    console.log('Creating invoice with body:', req.body);
    
    try {
      const { items, taxRate, invoiceNumber, dueDate } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: 'Invoice items are required and must be an array' });
        return;
      }
      
      const input: InvoiceInput = { items, taxRate };
      const dueDateObj = dueDate ? new Date(dueDate) : undefined;
      
      const invoice = await invoiceService.createInvoice(input, invoiceNumber, dueDateObj);
      res.status(201).json(invoice);
    } catch (error) {
      console.error('Failed to create invoice:', error);
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  };
  
  // Get all invoices
  public getInvoice = async (req: Request, res: Response): Promise<void> => {
    console.log('Fetching all invoices');
    
    try {
      const invoices = await invoiceService.getAllInvoices();
      
      if (!invoices || invoices.length === 0) {
        res.status(200).json({ message: 'No invoices found', data: [] });
        return;
      }
      
      res.status(200).json({
        message: 'Invoices retrieved successfully',
        count: invoices.length,
        data: invoices
      });
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  };
  
  // Update an invoice
  public updateInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const input: InvoiceInput = req.body;
      
      if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
        res.status(400).json({ error: 'Invoice items are required and must be an array' });
        return;
      }
      
      const updatedInvoice = await invoiceService.updateInvoice(id, input);
      
      if (!updatedInvoice) {
        res.status(404).json({ error: 'Invoice not found' });
        return;
      }
      
      res.status(200).json(updatedInvoice);
    } catch (error) {
      console.error('Failed to update invoice:', error);
      res.status(500).json({ error: 'Failed to update invoice' });
    }
  };
  
  // Delete an invoice
  public deleteInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleted = await invoiceService.deleteInvoice(id);
      
      if (!deleted) {
        res.status(404).json({ error: 'Invoice not found' });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      res.status(500).json({ error: 'Failed to delete invoice' });
    }
  };
}

export default new InvoiceController();