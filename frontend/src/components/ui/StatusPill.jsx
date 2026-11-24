const map = {
  green: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  yellow: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  red: { dot: 'bg-blood-600', text: 'text-blood-700', bg: 'bg-blood-50' },
};

export function stockStatus(units) {
  if (units === 0) return 'red';
  if (units < 5) return 'yellow';
  return 'green';
}

export default function StatusPill({ tone = 'green', label }) {
  const s = map[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`relative flex h-1.5 w-1.5 rounded-full ${s.dot}`}>
        {tone === 'red' && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${s.dot} animate-pulsering`} />
        )}
      </span>
      {label}
    </span>
  );
}
