import type { ShipmentStatus } from '../types';

const COLORS: Record<ShipmentStatus, string> = {
  CREATED: 'bg-slate-100 text-slate-700',
  PICKED_UP: 'bg-amber-100 text-amber-800',
  IN_TRANSIT: 'bg-lavender-100 text-lavender-500',
  OUT_FOR_DELIVERY: 'bg-brand-100 text-brand-800',
  DELIVERED: 'bg-brand-500 text-white',
  FAILED_DELIVERY: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-slate-200 text-slate-600',
};
const LABEL: Record<ShipmentStatus, string> = {
  CREATED: 'Created', PICKED_UP: 'Picked Up', IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery', DELIVERED: 'Delivered',
  FAILED_DELIVERY: 'Failed Delivery', CANCELLED: 'Cancelled',
};
export function StatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${COLORS[status]}`}>
      {LABEL[status]}
    </span>
  );
}