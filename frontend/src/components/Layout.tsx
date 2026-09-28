import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Menu, X } from 'lucide-react';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 font-medium transition-colors ${
    isActive ? 'bg-brand-100 text-brand-800' : 'text-slate-600 hover:bg-lavender-100 hover:text-slate-900'
  }`;

export function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleSignOut() {
    setOpen(false);
    signOut();
    navigate('/');
  }

  function closeMenu() { setOpen(false); }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/70 bg-white/80 px-3 py-2.5 shadow-soft backdrop-blur sm:rounded-full sm:px-4">
          {/* Top row: logo + burger */}
          <div className="flex items-center justify-between">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
              <img src="/routelyn.png" alt="Routelyn" className="h-8 w-auto object-contain sm:h-9" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 text-sm lg:flex">
              <NavLink to="/track" className={linkClass}>Track a parcel</NavLink>
              <NavLink to="/contact" className={linkClass}>Support</NavLink>
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
                  <span className="rounded-full bg-lavender-100 px-3 py-1.5 text-xs font-semibold text-lavender-500">
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

            {/* Mobile burger */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile dropdown */}
          {open && (
            <nav className="mt-3 flex flex-col gap-1 border-t border-slate-200/70 pt-3 text-sm lg:hidden">
              <NavLink to="/track" onClick={closeMenu} className={linkClass}>Track a parcel</NavLink>
              <NavLink to="/contact" onClick={closeMenu} className={linkClass}>Support</NavLink>
              {user && (user.role === 'ADMIN' || user.role === 'STAFF') && (
                <>
                  <NavLink to="/dashboard" onClick={closeMenu} className={linkClass}>Dashboard</NavLink>
                  <NavLink to="/shipments" onClick={closeMenu} className={linkClass}>Shipments</NavLink>
                </>
              )}
              {user && user.role === 'DRIVER' && (
                <NavLink to="/driver" onClick={closeMenu} className={linkClass}>My Deliveries</NavLink>
              )}

              <div className="mt-2 border-t border-slate-200/70 pt-3">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <span className="w-full rounded-full bg-lavender-100 px-3 py-1.5 text-center text-xs font-semibold text-lavender-500">
                      {user.name} · {user.role}
                    </span>
                    <button onClick={handleSignOut} className="w-full rounded-full bg-slate-100 px-4 py-2 font-medium text-slate-700 hover:bg-slate-200">
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={closeMenu} className="block w-full rounded-full bg-brand-600 px-5 py-2 text-center font-semibold text-white shadow-sm hover:bg-brand-700">
                    Staff login
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="mx-auto w-full max-w-6xl px-3 pb-6 pt-4 sm:px-4 sm:pb-8">
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/70 bg-white/70 px-5 py-5 text-center text-sm text-slate-500 sm:flex-row sm:justify-between sm:gap-2 sm:rounded-full sm:px-6 sm:py-4 sm:text-left">
          <img src="/routelyn.png" alt="Routelyn" className="h-8 w-auto object-contain sm:h-9" />
          <span>Every parcel, every step, in plain sight.</span>
          <span>© {new Date().getFullYear()} Routelyn Logistics</span>
        </div>
      </footer>
    </div>
  );
}
