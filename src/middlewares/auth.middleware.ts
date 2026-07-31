// src/middlewares/auth.middleware.ts
import { type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '../types/index.js';
import { prisma } from '../config/database.js';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
      role: string;
      clientId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        client: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        error: 'Account has been suspended',
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
      client: user.client,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }
  next();
};

export const tenantMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Ensure tenant isolation
  const clientId = req.user?.clientId;
  if (!clientId) {
    return res.status(403).json({
      success: false,
      error: 'Invalid tenant',
    });
  }
  next();
};