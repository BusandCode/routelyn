import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-lavender-100">
        <PackageSearch className="h-10 w-10 text-lavender-500" />
      </span>
      <p className="mt-6 font-display text-7xl font-bold text-brand-600">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-slate-900">This page took a wrong turn</h1>
      <p className="mt-3 text-slate-600">
        The page you're looking for doesn't exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-brand-600 px-7 py-3 font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Back to home
        </Link>
        <Link
          to="/track"
          className="rounded-full border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-lavender-50"
        >
          Track a parcel
        </Link>
      </div>
    </div>
  );
}
