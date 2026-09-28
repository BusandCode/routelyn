export type Role = 'ADMIN' | 'STAFF' | 'DRIVER';
export type ShipmentStatus =
  | 'CREATED' | 'PICKED_UP' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY'
  | 'DELIVERED' | 'FAILED_DELIVERY' | 'CANCELLED';

export interface AuthUser {
  id: string; name: string; email: string; role: Role; driverId?: string;
}
export interface TrackingEvent {
  status: ShipmentStatus; description: string;
  latitude: number | null; longitude: number | null; createdAt: string;
}
export interface TrackingLocation { latitude: number; longitude: number; updatedAt: string; }
export interface TrackingData {
  trackingNumber: string;
  status: ShipmentStatus;
  estimatedDelivery: string | null;
  pickup: { address: string; latitude: number; longitude: number };
  destination: { address: string; latitude: number; longitude: number };
  currentLocation: TrackingLocation | null;
  lastLocationUpdate: string | null;
  events: TrackingEvent[];
}
export interface ShipmentListItem {
  id: string; trackingNumber: string; status: ShipmentStatus;
  recipientName: string; destinationAddress: string;
  estimatedDelivery: string | null;
  driver: { id: string; name: string } | null;
  createdAt: string;
}
export interface DashboardData {
  total: number; inTransit: number; outForDelivery: number;
  delivered: number; failed: number; cancelled: number;
  recent: Array<{ id: string; trackingNumber: string; status: ShipmentStatus; createdAt: string }>;
}
export interface DriverSummary {
  id: string; vehicleType: string | null; vehicleNumber: string | null;
  isAvailable: boolean;
  user: { id: string; name: string; email: string };
}
