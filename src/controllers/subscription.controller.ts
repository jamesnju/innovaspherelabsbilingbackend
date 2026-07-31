// src/controllers/subscription.controller.ts
import { type Response } from 'express';
import type { AuthRequest } from '../types/index.js';
import { prisma } from '../config/database.js';

export class SubscriptionController {
  async getCurrentSubscription(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const subscription = await prisma.subscription.findUnique({
        where: { clientId },
        include: {
          subscriptionProducts: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'No subscription found',
        });
      }

      res.json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      console.error('Get subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get subscription',
      });
    }
  }

  async updateSubscription(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { plan, autoRenew, billingCycle, productIds } = req.body;

      const subscription = await prisma.subscription.findUnique({
        where: { clientId },
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'No subscription found',
        });
      }

      // Update subscription
      const updatedSubscription = await prisma.$transaction(async (tx) => {
        // Update subscription
        const sub = await tx.subscription.update({
          where: { id: subscription.id },
          data: {
            plan: plan || undefined,
            autoRenew: autoRenew !== undefined ? autoRenew : undefined,
            billingCycle: billingCycle || undefined,
            status: 'ACTIVE',
            ...(plan && plan !== 'FREE' ? { price: this.getPlanPrice(plan) } : { price: 0 }),
          },
        });

        // Update products if provided
        if (productIds && productIds.length > 0) {
          // Remove existing products
          await tx.subscriptionProduct.deleteMany({
            where: { subscriptionId: subscription.id },
          });

          // Add new products
          for (const productId of productIds) {
            await tx.subscriptionProduct.create({
              data: {
                subscriptionId: subscription.id,
                productId,
                quantity: 1,
              },
            });

            // Update client products
            await tx.clientProduct.upsert({
              where: {
                clientId_productId: {
                  clientId: clientId,
                  productId,
                },
              },
              update: { isActive: true },
              create: {
                clientId: clientId,
                productId,
                isActive: true,
              },
            });
          }
        }

        return sub;
      });

      res.json({
        success: true,
        message: 'Subscription updated successfully',
        data: updatedSubscription,
      });
    } catch (error) {
      console.error('Update subscription error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update subscription',
      });
    }
  }

  async upgradePlan(req: AuthRequest, res: Response) {
    try {
      const clientId = req.user?.clientId;

      if (!clientId) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { plan } = req.body;

      const subscription = await prisma.subscription.findUnique({
        where: { clientId },
      });

      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'No subscription found',
        });
      }

      // Check if upgrading
      const planOrder = { FREE: 0, BASIC: 1, PREMIUM: 2, ENTERPRISE: 3 };
      const currentPlanOrder = planOrder[subscription.plan as keyof typeof planOrder];
      const newPlanOrder = planOrder[plan as keyof typeof planOrder];

      if (newPlanOrder <= currentPlanOrder) {
        return res.status(400).json({
          success: false,
          error: 'Plan must be upgraded to a higher tier',
        });
      }

      const updatedSubscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          plan,
          status: 'ACTIVE',
          price: this.getPlanPrice(plan),
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      // Create invoice for upgrade
      await prisma.invoice.create({
        data: {
          invoiceNumber: `INV-${Date.now()}`,
          clientId: clientId,
          subscriptionId: subscription.id,
          amount: this.getPlanPrice(plan),
          currency: 'USD',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'PENDING',
          items: [
            {
              description: `Plan upgrade from ${subscription.plan} to ${plan}`,
              quantity: 1,
              unitPrice: this.getPlanPrice(plan),
              total: this.getPlanPrice(plan),
            },
          ],
        },
      });

      res.json({
        success: true,
        message: `Plan upgraded to ${plan} successfully`,
        data: updatedSubscription,
      });
    } catch (error) {
      console.error('Upgrade plan error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upgrade plan',
      });
    }
  }

  async getAvailablePlans(req: AuthRequest, res: Response) {
    try {
      const plans = [
        {
          id: 'FREE',
          name: 'Free',
          description: 'Perfect for getting started',
          price: 0,
          currency: 'USD',
          features: [
            'Basic POS System',
            'Up to 10 Products',
            '1 User',
            'Basic Reports',
            'Email Support',
          ],
          isPopular: false,
        },
        {
          id: 'BASIC',
          name: 'Basic',
          description: 'Great for small businesses',
          price: 29,
          currency: 'USD',
          features: [
            'Full POS System',
            'Unlimited Products',
            'Up to 5 Users',
            'Advanced Reports',
            'Inventory Management',
            'Email & Chat Support',
          ],
          isPopular: true,
        },
        {
          id: 'PREMIUM',
          name: 'Premium',
          description: 'For growing businesses',
          price: 49,
          currency: 'USD',
          features: [
            'Full POS System',
            'E-commerce Platform',
            'Unlimited Products',
            'Unlimited Users',
            'Advanced Analytics',
            'Inventory Management',
            'Offline Mode',
            'Priority Support',
            'API Access',
          ],
          isPopular: false,
        },
        {
          id: 'ENTERPRISE',
          name: 'Enterprise',
          description: 'For large businesses',
          price: 99,
          currency: 'USD',
          features: [
            'All Premium Features',
            'Custom Integrations',
            'Dedicated Support',
            'SLA Guarantee',
            'Advanced Security',
            'Multi-Branch Support',
            'Custom Reporting',
            'White Labeling',
          ],
          isPopular: false,
        },
      ];

      res.json({
        success: true,
        data: plans,
      });
    } catch (error) {
      console.error('Get plans error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get plans',
      });
    }
  }

  private getPlanPrice(plan: string): number {
    const prices: Record<string, number> = {
      FREE: 0,
      BASIC: 29,
      PREMIUM: 49,
      ENTERPRISE: 99,
    };
    return prices[plan] || 0;
  }
}