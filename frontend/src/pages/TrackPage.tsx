import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTracking } from '../api/tracking';
import { apiError } from '../api/client';
import type { TrackingData } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Timeline } from '../components/Timeline';
import { TrackingMap } from '../components/TrackingMap';
import { Package, SearchX, AlertTriangle } from 'lucide-react';

export function TrackPage() {
  const { trackingNumber = '' } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(trackingNumber);

  useEffect(() => {
    setQuery(trackingNumber);
    if (!trackingNumber) return;
    let cancelled = false;
    setLoading(true); setError(null); setData(null);
    getTracking(trackingNumber)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(apiError(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [trackingNumber]);

  const stale =
    data?.lastLocationUpdate &&
    Date.now() - new Date(data.lastLocationUpdate).getTime() > 1000 * 60 * 30;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Track your parcel</h1>
        <p className="mt-2 text-slate-600">Enter your tracking number to see where it is and where it has been.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = query.trim();
          if (v) navigate(`/track/${encodeURIComponent(v)}`);
        }}
        className="mx-auto mb-10 flex max-w-xl items-center gap-2 rounded-full border border-white bg-white p-2 shadow-soft focus-within:ring-4 focus-within:ring-brand-100"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. RLN-20394820"
          className="flex-1 rounded-full bg-transparent px-5 py-2.5 placeholder:text-slate-400 focus:outline-none"
        />
        <button className="rounded-full bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700">
          Track
        </button>
      </form>

      {!trackingNumber && !loading && !data && (
        <div className="mx-auto max-w-md rounded-2xl border border-white bg-white/80 p-8 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-100"><Package className="h-7 w-7 text-brand-700" /></span>
          <p className="mt-3 font-display text-lg font-bold text-slate-800">Nothing to track yet</p>
          <p className="mt-1 text-sm text-slate-600">
            Your tracking number is in the message or receipt from the sender.{' '}
            <Link to="/track/RLN-20394820" className="font-semibold text-brand-700 hover:underline">Try a sample</Link>
          </p>
        </div>
      )}

      {loading && <p className="text-center text-slate-500">Finding your parcel…</p>}

      {error && (
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100"><SearchX className="h-6 w-6 text-red-700" /></span>
          <p className="mt-2 font-display text-lg font-bold text-red-800">We couldn't find that one</p>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <p className="mt-2 text-sm text-red-700">Double-check the number and try again.</p>
        </div>
      )}

      {data && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-white bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-slate-500">{data.trackingNumber}</span>
                <StatusBadge status={data.status} />
              </div>
              <h2 className="mt-3 text-xl font-bold text-slate-800">Delivery details</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">From</dt>
                  <dd className="text-right font-medium text-slate-800">{data.pickup.address}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">To</dt>
                  <dd className="text-right font-medium text-slate-800">{data.destination.address}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Arriving</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {data.estimatedDelivery ? new Date(data.estimatedDelivery).toLocaleString() : 'To be confirmed'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Last seen</dt>
                  <dd className="text-right font-medium text-slate-800">
                    {data.lastLocationUpdate ? new Date(data.lastLocationUpdate).toLocaleString() : '—'}
                  </dd>
                </div>
              </dl>
              {stale && (
                <p className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-2 text-xs text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span>The driver's location hasn't updated in over 30 minutes, so the map may be behind.</span>
                </p>
              )}
              {!data.currentLocation && (
                <p className="mt-3 rounded-2xl bg-lavender-50 px-4 py-2 text-xs text-slate-600">
                  No live location yet. You'll see it here once your driver starts sharing.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-white bg-white/90 p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-800">The journey so far</h2>
              <Timeline events={data.events} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="h-[520px] overflow-hidden rounded-2xl border border-white bg-white shadow-soft">
              <TrackingMap data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}