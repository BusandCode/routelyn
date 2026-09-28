import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Truck } from 'lucide-react';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 font-medium transition-colors ${
    isActive ? 'bg-brand-100 text-brand-800' : 'text-slate-600 hover:bg-lavender-100 hover:text-slate-900'
  }`;

export function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() { signOut(); navigate('/'); }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 px-4 pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/70 bg-white/80 px-4 py-2.5 shadow-soft backdrop-blur">
          <Link to="/" className="flex items-center gap-2.5 font-display text-xl font-bold text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 shadow-sm"><Truck className="h-5 w-5 text-white" /></span>
            Routelyn
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink to="/track" className={linkClass}>Track a parcel</NavLink>
            {user && (user.role === 'ADMIN' || user.role === 'STAFF') && (
              <>
                <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
                <NavLink to="/shipments" className={linkClass}>Shipments</NavLink>
              </>
            )}
            {user && user.role === 'DRIVER' && (
              <NavLink to="/driver" className={linkClass}>My Deliveries</NavLink>
            )}
            {user ? (
              <div className="ml-2 flex items-center gap-2">
                <span className="hidden rounded-full bg-lavender-100 px-3 py-1.5 text-xs font-semibold text-lavender-500 sm:inline">
                  {user.name} · {user.role}
                </span>
                <button onClick={handleSignOut} className="rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200">
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" className="ml-2 rounded-full bg-brand-600 px-5 py-2 font-semibold text-white shadow-sm hover:bg-brand-700">
                Staff login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="mx-auto w-full max-w-6xl px-4 pb-8 pt-4">
        <div className="flex flex-col items-center justify-between gap-2 rounded-full border border-white/70 bg-white/70 px-6 py-4 text-sm text-slate-500 sm:flex-row">
          <span className="flex items-center gap-2 font-display font-bold text-slate-700"><Truck className="h-4 w-4 text-brand-600" /> Routelyn</span>
          <span>Every parcel, every step, in plain sight.</span>
          <span>© {new Date().getFullYear()} Routelyn Logistics</span>
        </div>
      </footer>
    </div>
  );
}