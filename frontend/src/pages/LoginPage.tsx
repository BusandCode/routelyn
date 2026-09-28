import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { apiError } from '../api/client';
import { Truck } from 'lucide-react';

const DEMOS = [
  { label: 'Admin', email: 'admin@routelyn.test' },
  { label: 'Staff', email: 'staff@routelyn.test' },
  { label: 'Driver', email: 'driver@routelyn.test' },
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const user = await signIn(email, password);
      if (user.role === 'DRIVER') navigate('/driver');
      else navigate('/dashboard');
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }

  const input = 'mt-1 w-full rounded-full border border-slate-300 bg-white px-5 py-3 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100';

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-[2rem] border border-white bg-white/90 p-8 shadow-soft">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100"><Truck className="h-6 w-6 text-brand-700" /></span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage shipments or start your route.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={input} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={input} required />
          </div>

          {error && <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl bg-lavender-50 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Try a demo account</p>
          <div className="mt-2 flex gap-2">
            {DEMOS.map((d) => (
              <button
                key={d.label}
                type="button"
                onClick={() => { setEmail(d.email); setPassword('password123'); }}
                className="rounded-full bg-white px-3 py-1.5 font-semibold text-lavender-500 shadow-sm hover:bg-lavender-100"
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}