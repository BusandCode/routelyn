import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listShipments, listDrivers, assignDriver, updateStatus } from '../api/shipments';
import type { DriverSummary, ShipmentListItem, ShipmentStatus } from '../types';
import { StatusBadge } from '../components/StatusBadge';

const STATUSES: ShipmentStatus[] = [
  'CREATED','PICKED_UP','IN_TRANSIT','OUT_FOR_DELIVERY',
  'DELIVERED','FAILED_DELIVERY','CANCELLED',
];

export function ShipmentsPage() {
  const [items, setItems] = useState<ShipmentListItem[]>([]);
  const [drivers, setDrivers] = useState<DriverSummary[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<ShipmentStatus | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function refresh() {
    setLoading(true); setError(null);
    try {
      const res = await listShipments({ q: q || undefined, status: status || undefined });
      setItems(res.items);
    } catch (e: any) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [status]);
  useEffect(() => { listDrivers().then(setDrivers).catch(() => {}); }, []);

  async function onAssign(id: string, driverId: string) {
    try {
      await assignDriver(id, driverId || null);
      await refresh();
    } catch (e: any) { alert(e?.response?.data?.error || e.message); }
  }

  async function onStatus(id: string, newStatus: ShipmentStatus) {
    const desc = window.prompt(`Description for status "${newStatus}"?`, `Status updated to ${newStatus}`);
    if (!desc) return;
    try {
      await updateStatus(id, { status: newStatus, description: desc });
      await refresh();
    } catch (e: any) { alert(e?.response?.data?.error || e.message); }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Shipments</h1>
        <Link to="/shipments/new" className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
          + New shipment
        </Link>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); refresh(); }}
        className="mt-6 flex flex-wrap gap-3"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tracking number"
          className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ShipmentStatus | '')}
          className="rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
          Search
        </button>
      </form>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Tracking</th>
              <th className="px-4 py-3">Recipient</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Driver</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">Loading…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-slate-500">No shipments found.</td></tr>
            )}
            {items.map((s) => (
              <tr key={s.id} className="align-middle">
                <td className="px-4 py-3">
                  <Link to={`/track/${s.trackingNumber}`} className="font-mono text-brand-700 hover:underline">
                    {s.trackingNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">{s.recipientName}</td>
                <td className="px-4 py-3 text-slate-600">{s.destinationAddress}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3">
                  <select
                    value={s.driver?.id || ''}
                    onChange={(e) => onAssign(s.id, e.target.value)}
                    className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                  >
                    <option value="">Unassigned</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.user.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setOpenId(openId === s.id ? null : s.id)}
                    className="text-xs text-brand-700 hover:underline"
                  >
                    {openId === s.id ? 'Close' : 'Update status'}
                  </button>
                  {openId === s.id && (
                    <div className="mt-2 flex flex-wrap justify-end gap-2">
                      {STATUSES.map((st) => (
                        <button
                          key={st}
                          onClick={() => onStatus(s.id, st)}
                          className="rounded border border-slate-200 px-2 py-0.5 text-[10px] hover:bg-slate-100"
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
