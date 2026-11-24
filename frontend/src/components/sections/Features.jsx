import { motion } from 'framer-motion';
import { Activity, Lock, MapPin, RefreshCw, ShieldCheck, Siren } from 'lucide-react';
import { features } from '../../lib/data.js';

const icons = { Activity, MapPin, Siren, ShieldCheck, Lock, RefreshCw };

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-blood-600">Built for urgency</p>
        <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Everything an emergency needs, nothing it doesn't
        </h2>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => {
          const Icon = icons[f.icon];
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group rounded-3xl border border-ink/8 bg-white p-7 shadow-[0_4px_20px_-8px_rgba(28,20,23,0.08)] transition-shadow duration-300 hover:shadow-[0_20px_50px_-12px_rgba(220,38,38,0.2)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blood-50 text-blood-600 transition-colors duration-300 group-hover:bg-blood-600 group-hover:text-white">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
