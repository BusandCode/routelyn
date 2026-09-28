import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Clock, Timer, Search, ArrowRight } from 'lucide-react';

const STEPS = [
  { n: '1', title: 'Drop off', desc: 'Staff create a shipment and you get a tracking number instantly.' },
  { n: '2', title: 'On the move', desc: 'Your driver shares their live location as they head your way.' },
  { n: '3', title: 'At your door', desc: 'Get a delivered confirmation, timestamped and on the record.' },
];

const FEATURES = [
  { icon: MapPin, color: 'text-brand-700', title: 'Live map', desc: 'Watch the route and the latest driver location, not just a status label.', tint: 'bg-brand-100' },
  { icon: Clock, color: 'text-lavender-500', title: 'Every step, timestamped', desc: 'A clear history from pickup to doorstep, so nothing is a mystery.', tint: 'bg-lavender-100' },
  { icon: Timer, color: 'text-lavender-500', title: 'Honest ETAs', desc: 'Know roughly when to be home. We flag it when location data goes stale.', tint: 'bg-lavender-100' },
  { icon: Search, color: 'text-brand-700', title: 'No account needed', desc: 'Just a tracking number. Customers never have to sign up to see where their parcel is.', tint: 'bg-brand-100' },
];

const FAQ = [
  { q: 'Where do I find my tracking number?', a: 'It is in the message or receipt from the sender, and looks like RLN-20394820.' },
  { q: 'Why is there no location on the map?', a: 'The parcel may not have been picked up yet. You will still see its status and history.' },
  { q: 'How often does the location update?', a: 'Each time the driver shares their position. If it has been over 30 minutes, we will let you know.' },
];

export function HomePage() {
  const [tn, setTn] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 pb-16 pt-20 text-center">
        <span className="inline-block rounded-full bg-lavender-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lavender-500">
          Delivery tracking, minus the guesswork
        </span>
        <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 sm:text-6xl">
          Know exactly where your parcel is. <span className="text-brand-600">Right now.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
          Paste your tracking number and follow your delivery live on the map, from pickup to your doorstep.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = tn.trim();
            if (v) navigate(`/track/${encodeURIComponent(v)}`);
          }}
          className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-full border border-white bg-white p-2 shadow-soft focus-within:ring-4 focus-within:ring-brand-100"
        >
          <input
            value={tn}
            onChange={(e) => setTn(e.target.value)}
            placeholder="Enter tracking number, e.g. RLN-20394820"
            className="flex-1 rounded-full bg-transparent px-5 py-3 text-base placeholder:text-slate-400 focus:outline-none"
          />
          <button className="rounded-full bg-brand-600 px-7 py-3 font-semibold text-white hover:bg-brand-700">
            Track
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Just exploring? <Link to="/track/RLN-20394820" className="font-semibold text-brand-700 hover:underline">See a sample shipment <ArrowRight className="inline h-3.5 w-3.5" /></Link>
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">From our hands to yours</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-slate-600">Three moments, all visible to you.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-display text-lg font-bold text-white">{s.n}</span>
              <h3 className="mt-4 font-display text-xl font-bold text-slate-800">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-slate-900">Built for peace of mind</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex gap-4 rounded-2xl border border-white bg-white/80 p-6 shadow-sm">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${f.tint}`}><f.icon className={`h-6 w-6 ${f.color}`} /></span>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-[2rem] bg-gradient-to-br from-brand-600 to-brand-800 p-10 text-center text-white shadow-soft">
          <h2 className="text-3xl font-bold">Run deliveries? Keep everything in one place.</h2>
          <p className="mx-auto mt-3 max-w-lg text-brand-100">
            Create shipments, assign drivers and update statuses from one dashboard. Drivers get a simple screen to share location and mark drops.
          </p>
          <Link to="/login" className="mt-7 inline-block rounded-full bg-white px-7 py-3 font-semibold text-brand-800 hover:bg-lavender-50">
            Staff & driver login
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-20 pt-8">
        <h2 className="text-center text-3xl font-bold text-slate-900">Quick answers</h2>
        <div className="mt-8 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-white bg-white/80 p-5 shadow-sm">
              <summary className="cursor-pointer list-none font-semibold text-slate-800">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}