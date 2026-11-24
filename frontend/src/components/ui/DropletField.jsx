import { useMemo } from 'react';

function Droplet({ style }) {
  return (
    <svg
      viewBox="0 0 24 32"
      className="absolute animate-drift"
      style={style}
      fill="currentColor"
    >
      <path d="M12 0C12 0 2 14.5 2 21a10 10 0 0020 0C22 14.5 12 0 12 0z" />
    </svg>
  );
}

export default function DropletField({ count = 14, className = '' }) {
  const drops = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: `${(i * 97) % 100}%`,
        size: 10 + ((i * 13) % 22),
        delay: `${(i * 1.3) % 12}s`,
        duration: `${10 + ((i * 7) % 10)}s`,
        opacity: 0.05 + ((i * 3) % 10) / 100,
      })),
    [count]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden text-blood-500 ${className}`} aria-hidden="true">
      {drops.map((d) => (
        <Droplet
          key={d.id}
          style={{
            left: d.left,
            bottom: '-40px',
            width: d.size,
            height: d.size * 1.3,
            opacity: d.opacity,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
}
