import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { TRACKING_REGEX } from '../utils/trackingNumber';

const router = Router();

const trackingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, error: 'Too many requests, please slow down.' },
});
router.use(trackingLimiter);

const paramSchema = z.string().trim().regex(TRACKING_REGEX, 'Invalid tracking number format');

router.get('/:trackingNumber', async (req, res, next) => {
  try {
    const trackingNumber = paramSchema.parse(req.params.trackingNumber);

    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber },
      include: {
        trackingEvents: { orderBy: { createdAt: 'asc' } },
        deliveryLocations: { orderBy: { recordedAt: 'desc' }, take: 1 },
      },
    });

    if (!shipment) {
      return res.status(404).json({ success: false, error: 'Package not found' });
    }

    const latestGps = shipment.deliveryLocations[0];
    const latestEventCoords = [...shipment.trackingEvents]
      .reverse()
      .find((e) => e.latitude != null && e.longitude != null);

    const currentLocation = latestGps
      ? {
          latitude: latestGps.latitude,
          longitude: latestGps.longitude,
          updatedAt: latestGps.recordedAt.toISOString(),
        }
      : latestEventCoords
      ? {
          latitude: latestEventCoords.latitude!,
          longitude: latestEventCoords.longitude!,
          updatedAt: latestEventCoords.createdAt.toISOString(),
        }
      : null;

    res.json({
      success: true,
      data: {
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        estimatedDelivery: shipment.estimatedDelivery?.toISOString() ?? null,
        pickup: {
          address: shipment.pickupAddress,
          latitude: shipment.pickupLatitude,
          longitude: shipment.pickupLongitude,
        },
        destination: {
          address: shipment.destinationAddress,
          latitude: shipment.destinationLatitude,
          longitude: shipment.destinationLongitude,
        },
        currentLocation,
        lastLocationUpdate: currentLocation?.updatedAt ?? null,
        events: shipment.trackingEvents.map((e) => ({
          status: e.status,
          description: e.description,
          latitude: e.latitude,
          longitude: e.longitude,
          createdAt: e.createdAt.toISOString(),
        })),
      },
    });
  } catch (e) { next(e); }
});

router.get('/:trackingNumber/history', async (req, res, next) => {
  try {
    const trackingNumber = paramSchema.parse(req.params.trackingNumber);
    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber },
      include: { trackingEvents: { orderBy: { createdAt: 'asc' } } },
    });
    if (!shipment) return res.status(404).json({ success: false, error: 'Package not found' });

    res.json({
      success: true,
      data: shipment.trackingEvents.map((e) => ({
        status: e.status,
        description: e.description,
        latitude: e.latitude,
        longitude: e.longitude,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (e) { next(e); }
});

export default router;
