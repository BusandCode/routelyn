import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ChevronDown } from 'lucide-react';

const FAQ = [
  { q: 'How do I track my package?', a: 'Enter your tracking number (format RLN-12345678) on the home page or the Track page.' },
  { q: 'My tracking number is not working.', a: 'Double-check the format. If it still fails, the shipment may not exist yet — contact the sender or our support team.' },
  { q: 'Why is the map not updating?', a: 'Location updates depend on the driver sharing GPS. If the last update is over 30 minutes old, we flag it as stale on the tracking page.' },
  { q: 'Can I change the delivery address?', a: 'Address changes must be requested before the shipment is marked Out for Delivery. Contact us with your tracking number.' },
  { q: 'What do the statuses mean?', a: 'Created → Picked Up → In Transit → Out for Delivery → Delivered. Failed Delivery and Cancelled are also possible.' },
];

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <span className="inline-block rounded-full bg-lavender-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lavender-500">
          We're here to help
        </span>
        <h1 className="mt-5 font-display text-5xl font-bold text-slate-900">Contact & support</h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-slate-600">
          Delivery issue, delayed parcel, or a tracking question? Reach out — we'll get back within one business day.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white bg-white/80 p-8 shadow-soft">
          <h2 className="font-display text-2xl font-bold text-slate-800">Get in touch</h2>
          <ul className="mt-6 space-y-4 text-sm text-slate-700">
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
                <Phone className="h-4 w-4 text-brand-700" />
              </span>
              <div>
                <p className="font-semibold text-slate-800">Support hotline</p>
                <p className="text-slate-500">+234 800 ROUTELYN</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lavender-100">
                <Mail className="h-4 w-4 text-lavender-500" />
              </span>
              <div>
                <p className="font-semibold text-slate-800">Email</p>
                <p className="text-slate-500">support@routelyn.test</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100">
                <Clock className="h-4 w-4 text-brand-700" />
              </span>
              <div>
                <p className="font-semibold text-slate-800">Hours</p>
                <p className="text-slate-500">Mon–Sat, 08:00–20:00</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lavender-100">
                <MapPin className="h-4 w-4 text-lavender-500" />
              </span>
              <div>
                <p className="font-semibold text-slate-800">Head office</p>
                <p className="text-slate-500">Victoria Island, Lagos</p>
              </div>
            </li>
          </ul>
          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-xs text-amber-900">
            <p className="font-semibold">Reporting a delivery issue?</p>
            <p className="mt-1">Have your tracking number ready so we can locate your shipment instantly.</p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white bg-white/80 p-8 shadow-soft">
          <h2 className="font-display text-2xl font-bold text-slate-800">Send us a message</h2>
          {sent ? (
            <div className="mt-6 rounded-2xl bg-brand-50 p-5 text-sm text-brand-800">
              <p className="font-semibold">Message received ✓</p>
              <p className="mt-1">We'll reply within one business day.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="mt-6 space-y-3"
            >
              <input required placeholder="Your name"
                className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100" />
              <input required type="email" placeholder="Email address"
                className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100" />
              <input placeholder="Tracking number (optional)"
                className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100" />
              <textarea required rows={4} placeholder="How can we help?"
                className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100" />
              <button className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white shadow-sm hover:bg-brand-700">
                Send message
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-12 rounded-[2rem] border border-white bg-white/80 p-8 shadow-soft">
        <h2 className="font-display text-2xl font-bold text-slate-800">Frequently asked</h2>
        <div className="mt-6 space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="rounded-2xl bg-lavender-50/60">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-slate-800">{item.q}</span>
                <ChevronDown className={`h-4 w-4 text-lavender-500 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <p className="px-4 pb-4 text-sm text-slate-600">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
