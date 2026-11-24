import { motion } from 'framer-motion';
import { stats } from '../../lib/data.js';
import StatCounter from '../ui/StatCounter.jsx';

export default function Stats() {
  return (
    <section className="relative border-y border-ink/8 bg-ink py-16 text-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="text-center sm:text-left"
          >
            <p className="font-display text-3xl font-medium text-blood-400 sm:text-4xl">
              <StatCounter value={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-1.5 text-sm text-white/55">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
