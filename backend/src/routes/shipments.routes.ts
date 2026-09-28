import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { authenticate, requireRole } from '../middleware/auth';
import { generateTrackingNumber } from '../utils/trackingNumber';

const router = Router();
router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { status, q, page = '1', pageSize = '20' } = req.query as Record<string, string>;
    const take = Math.min(Number(pageSize), 100);
    const skip = (Number(page) - 1) * take;

    const where: any = {};
    if (status) where.status = status;
    if (q) where.trackingNumber = { contains: q };

    const [items, total] = await Promise.all([
      prisma.shipment.findMany({
        where, orderBy: { createdAt: 'desc' }, take, skip,
        include: { driver: { include: { user: true } } },
      }),
      prisma.shipment.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        items: items.map((s) => ({
          id: s.id,
          trackingNumber: s.trackingNumber,
          status: s.status,
          recipientName: s.recipientName,
          destinationAddress: s.destinationAddress,
          estimatedDelivery: s.estimatedDelivery?.toISOString() ?? null,
          driver: s.driver ? { id: s.driver.id, name: s.driver.user.name } : null,
          createdAt: s.createdAt.toISOString(),
        })),
        total,
        page: Number(page),
        pageSize: take,
      },
    });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const s = await prisma.shipment.findUnique({
      where: { id: req.params.id },
      include: {
        driver: { include: { user: true } },
        trackingEvents: { orderBy: { createdAt: 'asc' } },
        deliveryLocations: { orderBy: { recordedAt: 'desc' }, take: 50 },
      },
    });
    if (!s) return res.status(404).json({ success: false, error: 'Shipment not found' });
    res.json({ success: true, data: s });
  } catch (e) { next(e); }
});

const createSchema = z.object({
  senderName: z.string().min(1),
  senderPhone: z.string().min(3),
  pickupAddress: z.string().min(1),
  pickupLatitude: z.number().min(-90).max(90),
  pickupLongitude: z.number().min(-180).max(180),
  recipientName: z.string().min(1),
  recipientPhone: z.string().min(3),
  destinationAddress: z.string().min(1),
  destinationLatitude: z.number().min(-90).max(90),
  destinationLongitude: z.number().min(-180).max(180),
  estimatedDelivery: z.string().datetime().optional().nullable(),
  packageReference: z.string().optional().nullable(),
});

router.post('/', requireRole('ADMIN', 'STAFF'), async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);

    let trackingNumber = generateTrackingNumber();
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.shipment.findUnique({ where: { trackingNumber } });
      if (!exists) break;
      trackingNumber = generateTrackingNumber();
    }

    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber,
        status: 'CREATED',
        ...input,
        estimatedDelivery: input.estimatedDelivery ? new Date(input.estimatedDelivery) : null,
        trackingEvents: {
          create: {
            status: 'CREATED',
            description: 'Shipment created',
            latitude: input.pickupLatitude,
            longitude: input.pickupLongitude,
          },
        },
      },
    });

    res.status(201).json({ success: true, data: shipment });
  } catch (e) { next(e); }
});

const statusSchema = z.object({
  status: z.enum([
    'CREATED','PICKED_UP','IN_TRANSIT','OUT_FOR_DELIVERY',
    'DELIVERED','FAILED_DELIVERY','CANCELLED',
  ]),
  description: z.string().min(1),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

router.patch('/:id/status', requireRole('ADMIN', 'STAFF', 'DRIVER'), async (req, res, next) => {
  try {
    const input = statusSchema.parse(req.body);
    const shipment = await prisma.shipment.findUnique({ where: { id: req.params.id } });
    if (!shipment) return res.status(404).json({ success: false, error: 'Shipment not found' });

    if (shipment.status === 'CANCELLED' && input.status !== 'CANCELLED') {
      return res.status(400).json({ success: false, error: 'Cancelled shipment cannot be updated' });
    }

    const [updated] = await prisma.$transaction([
      prisma.shipment.update({ where: { id: shipment.id }, data: { status: input.status } }),
      prisma.trackingEvent.create({
        data: {
          shipmentId: shipment.id,
          status: input.status,
          description: input.description,
          latitude: input.latitude,
          longitude: input.longitude,
        },
      }),
    ]);

    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
});

const assignSchema = z.object({ driverId: z.string().uuid().nullable() });

router.patch('/:id/assign-driver', requireRole('ADMIN', 'STAFF'), async (req, res, next) => {
  try {
    const { driverId } = assignSchema.parse(req.body);
    if (driverId) {
      const driver = await prisma.driver.findUnique({ where: { id: driverId } });
      if (!driver) return res.status(404).json({ success: false, error: 'Driver not found' });
    }
    const updated = await prisma.shipment.update({
      where: { id: req.params.id },
      data: { driverId },
    });
    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
});

export default router;
