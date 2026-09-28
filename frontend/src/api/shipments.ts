import { api } from './client';
import type { DashboardData, DriverSummary, ShipmentListItem, ShipmentStatus } from '../types';

export async function listShipments(params: { status?: ShipmentStatus | ''; q?: string; page?: number } = {}) {
  const res = await api.get('/shipments', { params });
  return res.data.data as { items: ShipmentListItem[]; total: number; page: number; pageSize: number };
}
export async function createShipment(payload: any) {
  const res = await api.post('/shipments', payload);
  return res.data.data;
}
export async function updateStatus(id: string, payload: { status: ShipmentStatus; description: string; latitude?: number; longitude?: number }) {
  const res = await api.patch(`/shipments/${id}/status`, payload);
  return res.data.data;
}
export async function assignDriver(id: string, driverId: string | null) {
  const res = await api.patch(`/shipments/${id}/assign-driver`, { driverId });
  return res.data.data;
}
export async function getDashboard() {
  const res = await api.get('/admin/dashboard');
  return res.data.data as DashboardData;
}
export async function listDrivers() {
  const res = await api.get('/admin/drivers');
  return res.data.data as DriverSummary[];
}
