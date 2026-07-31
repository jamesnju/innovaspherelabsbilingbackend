// src/routes/subscription.routes.ts
import express, { type Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller.js';
import { updateSubscriptionSchema } from '../validations/subscription.validation.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';

const router: Router = express.Router();
const subscriptionController = new SubscriptionController();

router.get('/current', authMiddleware, subscriptionController.getCurrentSubscription);
router.put('/update', authMiddleware, validate(updateSubscriptionSchema), subscriptionController.updateSubscription);
router.post('/upgrade', authMiddleware, subscriptionController.upgradePlan);
router.get('/plans', authMiddleware, subscriptionController.getAvailablePlans);

export default router;