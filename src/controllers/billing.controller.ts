// src/controllers/billing.controller.ts
import { type Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import { prisma } from '../config/database.js';

export class BillingController {
  async getInvoices(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { page = 1, limit = 10, status } = req.query;

      const where: any = { clientId };
      if (status) {
        where.status = status;
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: {
            payments: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.invoice.count({ where }),
      ]);

      res.json({
        success: true,
        data: invoices,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get invoices error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get invoices',
      });
    }
  }

  async getInvoiceById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      // Ensure id is defined before querying
      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'Invoice ID is required',
        });
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          id: id, // id is now guaranteed to be a string
          clientId,
        },
        include: {
          payments: true,
          subscription: {
            include: {
              subscriptionProducts: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      });

      if (!invoice) {
        return res.status(404).json({
          success: false,
          error: 'Invoice not found',
        });
      }

      res.json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      console.error('Get invoice error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get invoice',
      });
    }
  }

  async getPayments(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { page = 1, limit = 10 } = req.query;

      const [payments, total] = await Promise.all([
        prisma.payment.findMany({
          where: { clientId },
          include: {
            invoice: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit),
        }),
        prisma.payment.count({ where: { clientId } }),
      ]);

      res.json({
        success: true,
        data: payments,
        meta: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Get payments error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get payments',
      });
    }
  }

  async createPayment(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { invoiceId, amount, currency, method, reference } = req.body;

      // Validate required fields
      if (!invoiceId) {
        return res.status(400).json({
          success: false,
          error: 'Invoice ID is required',
        });
      }

      if (!method) {
        return res.status(400).json({
          success: false,
          error: 'Payment method is required',
        });
      }

      const invoice = await prisma.invoice.findFirst({
        where: {
          id: invoiceId,
          clientId,
        },
      });

      if (!invoice) {
        return res.status(404).json({
          success: false,
          error: 'Invoice not found',
        });
      }

      if (invoice.status === 'COMPLETED') {
        return res.status(400).json({
          success: false,
          error: 'Invoice is already paid',
        });
      }

      const payment = await prisma.$transaction(async (tx) => {
        // Create payment
        const newPayment = await tx.payment.create({
          data: {
            invoiceId,
            clientId,
            amount: amount || invoice.amount,
            currency: currency || invoice.currency,
            method,
            reference: reference || undefined,
            status: 'COMPLETED',
            paymentId: `PAY-${Date.now()}`,
          },
        });

        // Update invoice status
        await tx.invoice.update({
          where: { id: invoiceId },
          data: {
            status: 'COMPLETED',
            paidAt: new Date(),
          },
        });

        return newPayment;
      });

      res.json({
        success: true,
        message: 'Payment completed successfully',
        data: payment,
      });
    } catch (error) {
      console.error('Create payment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process payment',
      });
    }
  }

  async getBillingSummary(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const [invoices, subscription] = await Promise.all([
        prisma.invoice.findMany({
          where: {
            clientId,
            status: 'PENDING',
          },
        }),
        prisma.subscription.findUnique({
          where: { clientId },
        }),
      ]);

      const totalPending = invoices.reduce((sum, inv) => sum + inv.amount.toNumber(), 0);
      const totalPaid = await prisma.invoice.aggregate({
        where: {
          clientId,
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      });

      const summary = {
        subscription: subscription || null,
        pendingInvoices: invoices.length,
        pendingAmount: totalPending,
        totalPaid: totalPaid._sum.amount?.toNumber() || 0,
        lastInvoice: invoices.length > 0 ? invoices[0] : null,
      };

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      console.error('Get billing summary error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get billing summary',
      });
    }
  }
}