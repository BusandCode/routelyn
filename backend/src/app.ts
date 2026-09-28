import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import trackingRoutes from './routes/tracking.routes';
import shipmentsRoutes from './routes/shipments.routes';
import deliveriesRoutes from './routes/deliveries.routes';
import adminRoutes from './routes/admin.routes';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => res.json({ ok: true, service: 'routelyn-api' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/tracking', trackingRoutes);
  app.use('/api/shipments', shipmentsRoutes);
  app.use('/api/deliveries', deliveriesRoutes);
  app.use('/api/admin', adminRoutes);

  app.use((_req, res) => res.status(404).json({ success: false, error: 'Not found' }));
  app.use(errorHandler);
  return app;
}
