// src/controllers/client.controller.ts
import { type Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import { prisma } from '../config/database.js';
export class ClientController {
  async getClients(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, search, status } = req.query;

      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
        ];
      }
      if (status) {
        where.status = status;
      }

      const [clients, total] = await Promise.all([
        prisma.client.findMany({
          where,
          include: {
            subscription: true,
            _count: {
              select: { users: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.client.count({ where }),
      ]);

      res.json({
        success: true,
        data: clients,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get clients error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get clients',
      });
    }
  }

  async getClientById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Client ID is required',
        });
      }

      const client = await prisma.client.findUnique({
        where: { id },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
              createdAt: true,
            },
          },
          subscription: {
            include: {
              subscriptionProducts: {
                include: {
                  product: true,
                },
              },
            },
          },
          invoices: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          customizations: true,
        },
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found',
        });
      }

      res.json({
        success: true,
        data: client,
      });
    } catch (error) {
      console.error('Get client error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get client',
      });
    }
  }

  async updateClient(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Client ID is required',
        });
      }

      const { name, phone, address, city, state, country, postalCode, website, category, status } = req.body;

      const client = await prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          error: 'Client not found',
        });
      }

      const updatedClient = await prisma.client.update({
        where: { id },
        data: {
          name: name || undefined,
          phone: phone || undefined,
          address: address || undefined,
          city: city || undefined,
          state: state || undefined,
          country: country || undefined,
          postalCode: postalCode || undefined,
          website: website || undefined,
          category: category || undefined,
          status: status || undefined,
        },
      });

      res.json({
        success: true,
        message: 'Client updated successfully',
        data: updatedClient,
      });
    } catch (error) {
      console.error('Update client error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update client',
      });
    }
  }

  async getDashboardStats(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const [userCount, productCount, invoiceCount, pendingAmount] = await Promise.all([
        prisma.user.count({ where: { clientId } }),
        prisma.clientProduct.count({ where: { clientId, isActive: true } }),
        prisma.invoice.count({ where: { clientId } }),
        prisma.invoice.aggregate({
          where: {
            clientId,
            status: 'PENDING',
          },
          _sum: { amount: true },
        }),
      ]);

      const recentActivity = await prisma.auditLog.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      res.json({
        success: true,
        data: {
          stats: {
            users: userCount,
            products: productCount,
            invoices: invoiceCount,
            pendingAmount: pendingAmount._sum.amount?.toNumber() || 0,
          },
          recentActivity,
        },
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get dashboard stats',
      });
    }
  }
}