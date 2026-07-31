// src/routes/billing.routes.ts
import express, { type Router } from 'express';
import { createPaymentSchema } from '../validations/billing.validation.js';
import { BillingController } from '../controllers/billing.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';


const router: Router = express.Router();
const billingController = new BillingController();

router.get('/invoices', authMiddleware, billingController.getInvoices);
router.get('/invoices/:id', authMiddleware, billingController.getInvoiceById);
router.get('/payments', authMiddleware, billingController.getPayments);
router.post('/payments', authMiddleware, validate(createPaymentSchema), billingController.createPayment);
router.get('/summary', authMiddleware, billingController.getBillingSummary);

export default router;