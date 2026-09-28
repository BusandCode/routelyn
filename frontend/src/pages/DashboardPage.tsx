import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/shipments';
import type { DashboardData } from '../types';
import { StatusBadge } from '../components/StatusBadge';

function Stat({ label, value, tone = 'brand' }: { label: string; value: number; tone?: 'brand' | 'green' | 'amber' | 'red' | 'slate' | 'purple' }) {
  const tones: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-800 border-brand-100',
    green: 'bg-emerald-50 text-emerald-800 border-emerald-100',
    amber: 'bg-amber-50 text-amber-800 border-amber-100',
    red: 'bg-red-50 text-red-800 border-red-100',
    slate: 'bg-slate-50 text-slate-800 border-slate-100',
    purple: 'bg-purple-50 text-purple-800 border-purple-100',
  };
  return (
    <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((e) => setError(e?.response?.data?.error || e.message));
  }, []);

  if (error) return <div className="p-8 text-red-700">{error}</div>;
  if (!data) return <div className="p-8 text-slate-500">Loading dashboard…</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <Link to="/shipments/new" className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700">
          + New shipment
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total" value={data.total} tone="brand" />
        <Stat label="In transit" value={data.inTransit} tone="purple" />
        <Stat label="Out for delivery" value={data.outForDelivery} tone="amber" />
        <Stat label="Delivered" value={data.delivered} tone="green" />
        <Stat label="Failed" value={data.failed} tone="red" />
        <Stat label="Cancelled" value={data.cancelled} tone="slate" />
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Recent shipments</h2>
          <Link to="/shipments" className="text-sm text-brand-700 hover:underline">View all →</Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {data.recent.length === 0 && <p className="py-4 text-sm text-slate-500">No shipments yet.</p>}
          {data.recent.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-3">
              <div>
                <Link to={`/track/${s.trackingNumber}`} className="font-mono text-sm text-brand-700 hover:underline">
                  {s.trackingNumber}
                </Link>
                <p className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString()}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
