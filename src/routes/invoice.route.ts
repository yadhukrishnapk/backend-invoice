import express from 'express';
import invoiceController from '../controllers/invoice.controller';

const router = express.Router();

// Calculate invoice totals (without saving)
router.post('/calculate', invoiceController.calculateInvoice);

// CRUD operations
router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getInvoice);  // Get all invoices
// router.get('/:id', invoiceController.getInvoiceById);  
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);

export default router;