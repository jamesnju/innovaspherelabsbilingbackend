// src/routes/index.ts
import express, { type Router } from 'express';
import authRoutes from './auth.routes.js';
import billingRoutes from './billing.routes.js';
import clientRoutes from './client.routes.js';
import subscriptionRoutes from './subscription.routes.js';


const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/billing', billingRoutes);

export default router;