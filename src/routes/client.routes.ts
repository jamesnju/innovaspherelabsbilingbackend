// src/routes/client.routes.ts
import express, { type Router } from 'express';
import { ClientController } from '../controllers/client.controller.js';
import { updateClientSchema } from '../validations/client.validation.js';
import { adminMiddleware, authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';


const router: Router = express.Router();
const clientController = new ClientController();

router.get('/', authMiddleware, adminMiddleware, clientController.getClients);
router.get('/dashboard/stats', authMiddleware, clientController.getDashboardStats);
router.get('/:id', authMiddleware, adminMiddleware, clientController.getClientById);
router.put('/:id', authMiddleware, adminMiddleware, validate(updateClientSchema), clientController.updateClient);

export default router;