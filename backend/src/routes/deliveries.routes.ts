import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate, requireRole('DRIVER'));

router.get('/mine', async (req: AuthRequest, res, next) => {
  try {
    const driverId = req.user!.driverId;
    if (!driverId) return res.status(403).json({ success: false, error: 'No driver profile' });

    const items = await prisma.shipment.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: items });
  } catch (e) { next(e); }
});

const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().nonnegative().optional(),
});

router.post('/:deliveryId/location', async (req: AuthRequest, res, next) => {
  try {
    const input = locationSchema.parse(req.body);
    const driverId = req.user!.driverId;
    if (!driverId) return res.status(403).json({ success: false, error: 'No driver profile' });

    const shipment = await prisma.shipment.findUnique({ where: { id: req.params.deliveryId } });
    if (!shipment) return res.status(404).json({ success: false, error: 'Delivery not found' });
    if (shipment.driverId !== driverId) {
      return res.status(403).json({ success: false, error: 'Not assigned to you' });
    }
    if (shipment.status === 'CANCELLED') {
      return res.status(400).json({ success: false, error: 'Cancelled shipment' });
    }

    const loc = await prisma.deliveryLocation.create({
      data: {
        shipmentId: shipment.id,
        driverId,
        latitude: input.latitude,
        longitude: input.longitude,
        accuracy: input.accuracy,
      },
    });

    res.status(201).json({ success: true, data: loc });
  } catch (e) { next(e); }
});

router.get('/:deliveryId/locations', async (req, res, next) => {
  try {
    const locations = await prisma.deliveryLocation.findMany({
      where: { shipmentId: req.params.deliveryId },
      orderBy: { recordedAt: 'desc' },
      take: 200,
    });
    res.json({ success: true, data: locations });
  } catch (e) { next(e); }
});

export default router;
