import express from 'express';
import invoiceRoutes from './invoice.route';

const router = express.Router();

router.use('/invoices', invoiceRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

export default router;