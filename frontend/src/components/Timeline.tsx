import type { TrackingEvent } from '../types';
import { StatusBadge } from './StatusBadge';

export function Timeline({ events }: { events: TrackingEvent[] }) {
  const ordered = [...events].reverse();
  return (
    <ol className="relative border-l border-slate-200 pl-6">
      {ordered.map((e, i) => (
        <li key={i} className="mb-6 last:mb-0">
          <span className={`absolute -left-[7px] mt-1.5 inline-block h-3 w-3 rounded-full ${i === 0 ? 'bg-brand-500 ring-4 ring-brand-100' : 'bg-slate-300'}`} />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={e.status} />
            <span className="text-xs text-slate-400">{new Date(e.createdAt).toLocaleString()}</span>
          </div>
          <p className="mt-1 text-sm text-slate-700">{e.description}</p>
        </li>
      ))}
    </ol>
  );
}
