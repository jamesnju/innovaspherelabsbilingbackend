// src/routes/auth.routes.ts
import express, { type Router } from 'express';
import { validate } from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import AuthController from '../controllers/auth.controller.js';

const router: Router = express.Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;