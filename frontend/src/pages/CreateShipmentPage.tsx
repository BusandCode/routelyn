import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShipment } from '../api/shipments';

export function CreateShipmentPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ trackingNumber: string } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true); setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      senderName: fd.get('senderName'),
      senderPhone: fd.get('senderPhone'),
      pickupAddress: fd.get('pickupAddress'),
      pickupLatitude: parseFloat(String(fd.get('pickupLatitude'))),
      pickupLongitude: parseFloat(String(fd.get('pickupLongitude'))),
      recipientName: fd.get('recipientName'),
      recipientPhone: fd.get('recipientPhone'),
      destinationAddress: fd.get('destinationAddress'),
      destinationLatitude: parseFloat(String(fd.get('destinationLatitude'))),
      destinationLongitude: parseFloat(String(fd.get('destinationLongitude'))),
      estimatedDelivery: fd.get('estimatedDelivery')
        ? new Date(String(fd.get('estimatedDelivery'))).toISOString()
        : null,
      packageReference: fd.get('packageReference') || null,
    };
    try {
      const res = await createShipment(payload);
      setCreated({ trackingNumber: res.trackingNumber });
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
          <h1 className="text-2xl font-bold text-emerald-900">Shipment created</h1>
          <p className="mt-2 text-emerald-800">Tracking number</p>
          <p className="mt-2 font-mono text-2xl font-bold text-emerald-900">{created.trackingNumber}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate(`/track/${created.trackingNumber}`)}
              className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
            >
              View tracking
            </button>
            <button
              onClick={() => { setCreated(null); }}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Create another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">New shipment</h1>
      <p className="mt-1 text-sm text-slate-500">Provide pickup, destination and contact details.</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-6 md:grid-cols-2">
        <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <legend className="px-2 font-semibold text-slate-800">Sender</legend>
          <input name="senderName" required placeholder="Sender name"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input name="senderPhone" required placeholder="Sender phone"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </fieldset>

        <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <legend className="px-2 font-semibold text-slate-800">Recipient</legend>
          <input name="recipientName" required placeholder="Recipient name"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" />
          <input name="recipientPhone" required placeholder="Recipient phone"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" />
        </fieldset>

        <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <legend className="px-2 font-semibold text-slate-800">Pickup</legend>
          <input name="pickupAddress" required placeholder="Pickup address"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input name="pickupLatitude" required type="number" step="any" defaultValue="6.6018" placeholder="Lat"
              className="rounded-lg border border-slate-300 px-3 py-2" />
            <input name="pickupLongitude" required type="number" step="any" defaultValue="3.3515" placeholder="Lng"
              className="rounded-lg border border-slate-300 px-3 py-2" />
          </div>
        </fieldset>

        <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <legend className="px-2 font-semibold text-slate-800">Destination</legend>
          <input name="destinationAddress" required placeholder="Destination address"
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input name="destinationLatitude" required type="number" step="any" defaultValue="6.4281" placeholder="Lat"
              className="rounded-lg border border-slate-300 px-3 py-2" />
            <input name="destinationLongitude" required type="number" step="any" defaultValue="3.4219" placeholder="Lng"
              className="rounded-lg border border-slate-300 px-3 py-2" />
          </div>
        </fieldset>

        <fieldset className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <legend className="px-2 font-semibold text-slate-800">Additional</legend>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600">Estimated delivery</label>
              <input name="estimatedDelivery" type="datetime-local"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600">Package reference (optional)</label>
              <input name="packageReference" placeholder="e.g. ORD-1234"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          </div>
        </fieldset>

        {error && (
          <p className="md:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}
