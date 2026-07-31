// src/controllers/auth.controller.ts
import { type Request, type Response } from 'express';
import { prisma } from '../config/database.js';
import bcrypt from 'bcryptjs';
import type { AuthRequest } from '../types/index.js';
import { tokenService, generateToken } from '../services/token.service.js';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, companyName, phone } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create client and user in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create client
        const client = await tx.client.create({
          data: {
            name: companyName,
            email,
            phone: phone || '',
            status: 'ACTIVE',
            category: 'OTHER',
          },
        });

        // Create user
        const user = await tx.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: 'BUSINESS_OWNER',
            clientId: client.id,
            status: 'ACTIVE',
          },
        });

        // Create default subscription
        const subscription = await tx.subscription.create({
          data: {
            clientId: client.id,
            plan: 'FREE',
            status: 'ACTIVE',
            startDate: new Date(),
            billingCycle: 'MONTHLY',
            price: 0,
          },
        });

        // Update client with subscription
        await tx.client.update({
          where: { id: client.id },
          data: { subscriptionId: subscription.id },
        });

        // Create default free products
        const freeProducts = await tx.product.findMany({
          where: { status: 'ACTIVE' },
          take: 3,
        });

        for (const product of freeProducts) {
          await tx.clientProduct.create({
            data: {
              clientId: client.id,
              productId: product.id,
              isActive: true,
            },
          });

          await tx.subscriptionProduct.create({
            data: {
              subscriptionId: subscription.id,
              productId: product.id,
              quantity: 1,
            },
          });
        }

        return { client, user, subscription };
      });

      // Generate token using the token service
      const token = generateToken(result.user.id, result.user.role, result.client.id);
      
      // Or using the tokenService instance:
      // const token = tokenService.generateToken(result.user.id, result.user.role, result.client.id);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
          },
          client: {
            id: result.client.id,
            name: result.client.name,
            email: result.client.email,
          },
          subscription: result.subscription,
          token,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create account',
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          client: {
            include: {
              subscription: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      if (user.status === 'SUSPENDED') {
        return res.status(403).json({
          success: false,
          error: 'Account has been suspended',
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password || '');
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Generate token using the token service
      const token = generateToken(user.id, user.role, user.clientId);
      
      // Or using the tokenService instance:
      // const token = tokenService.generateToken(user.id, user.role, user.clientId);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          },
          client: {
            id: user.client.id,
            name: user.client.name,
            email: user.client.email,
            subscription: user.client.subscription,
          },
          token,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to login',
      });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          client: {
            include: {
              subscription: true,
            },
          },
          userPreferences: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get user',
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required',
        });
      }

      // Verify refresh token using the token service
      const payload = tokenService.verifyRefreshToken(refreshToken);
      
      if (!payload) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token',
        });
      }

      // Generate new access token
      const newToken = tokenService.generateToken(
        payload.userId,
        payload.role,
        payload.clientId
      );

      res.json({
        success: true,
        data: {
          token: newToken,
        },
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to refresh token',
      });
    }
  }
}

// Also export as default for compatibility
export default AuthController;