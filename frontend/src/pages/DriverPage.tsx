import { useEffect, useState } from 'react';
import { myDeliveries, submitLocation } from '../api/deliveries';
import { updateStatus } from '../api/shipments';
import { StatusBadge } from '../components/StatusBadge';
import type { ShipmentStatus } from '../types';
import { Radio } from 'lucide-react';

interface DeliveryRow {
  id: string;
  trackingNumber: string;
  status: ShipmentStatus;
  recipientName: string;
  destinationAddress: string;
}

export function DriverPage() {
  const [rows, setRows] = useState<DeliveryRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function refresh() {
    try {
      const data = await myDeliveries();
      setRows(data);
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message);
    }
  }
  useEffect(() => { refresh(); }, []);

  async function shareLocation(id: string) {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    setBusy(id);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await submitLocation(id, pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
          alert('Location submitted ✓');
        } catch (e: any) {
          alert(e?.response?.data?.error || e.message);
        } finally { setBusy(null); }
      },
      (err) => { alert(err.message); setBusy(null); },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  async function markStatus(id: string, status: ShipmentStatus) {
    const desc = window.prompt(`Description for "${status}"?`, `Marked as ${status}`);
    if (!desc) return;
    try {
      await updateStatus(id, { status, description: desc });
      await refresh();
    } catch (e: any) {
      alert(e?.response?.data?.error || e.message);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">My deliveries</h1>
      <p className="mt-1 text-sm text-slate-500">Assigned shipments for you.</p>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 space-y-4">
        {rows.length === 0 && <p className="text-slate-500">No assigned deliveries.</p>}
        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-sm text-slate-500">{r.trackingNumber}</p>
                <p className="font-semibold text-slate-800">{r.recipientName}</p>
                <p className="text-sm text-slate-600">{r.destinationAddress}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => shareLocation(r.id)}
                disabled={busy === r.id}
                className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
              >
                {busy === r.id ? 'Submitting…' : <><Radio className="h-4 w-4" /> Share location</>}
              </button>
              <button onClick={() => markStatus(r.id, 'PICKED_UP')} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">Picked up</button>
              <button onClick={() => markStatus(r.id, 'OUT_FOR_DELIVERY')} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">Out for delivery</button>
              <button onClick={() => markStatus(r.id, 'DELIVERED')} className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800 hover:bg-emerald-100">Delivered</button>
              <button onClick={() => markStatus(r.id, 'FAILED_DELIVERY')} className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-800 hover:bg-red-100">Failed</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}