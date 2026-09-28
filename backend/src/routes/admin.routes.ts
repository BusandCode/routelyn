import { Router } from 'express';
import { prisma } from '../config/prisma';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
router.use(authenticate, requireRole('ADMIN', 'STAFF'));

router.get('/dashboard', async (_req, res, next) => {
  try {
    const [total, inTransit, outForDelivery, delivered, failed, cancelled] =
      await Promise.all([
        prisma.shipment.count(),
        prisma.shipment.count({ where: { status: 'IN_TRANSIT' } }),
        prisma.shipment.count({ where: { status: 'OUT_FOR_DELIVERY' } }),
        prisma.shipment.count({ where: { status: 'DELIVERED' } }),
        prisma.shipment.count({ where: { status: 'FAILED_DELIVERY' } }),
        prisma.shipment.count({ where: { status: 'CANCELLED' } }),
      ]);

    const recent = await prisma.shipment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    res.json({
      success: true,
      data: { total, inTransit, outForDelivery, delivered, failed, cancelled, recent },
    });
  } catch (e) { next(e); }
});

router.get('/drivers', async (_req, res, next) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json({ success: true, data: drivers });
  } catch (e) { next(e); }
});

export default router;
