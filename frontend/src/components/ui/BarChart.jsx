import { motion } from 'framer-motion';

export default function BarChart({ data, max }) {
  const maxVal = max ?? Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-48 items-end gap-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="relative flex h-40 w-full items-end overflow-hidden rounded-lg bg-mist">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${Math.max((d.value / maxVal) * 100, 3)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full rounded-lg ${d.value === 0 ? 'bg-blood-300' : d.value < 5 ? 'bg-amber-400' : 'bg-blood-600'}`}
            />
          </div>
          <p className="text-[11px] font-semibold text-ink-soft">{d.label}</p>
        </div>
      ))}
    </div>
  );
}
