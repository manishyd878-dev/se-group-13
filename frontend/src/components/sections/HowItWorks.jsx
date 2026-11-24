import { motion } from 'framer-motion';
import { steps } from '../../lib/data.js';

export default function HowItWorks() {
  return (
    <section className="relative bg-paper-dim py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-blood-600">The path to a match</p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            How BloodBridge works
          </h2>
        </div>

        <div className="relative mt-20 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-8 hidden lg:block">
            <svg viewBox="0 0 1200 20" className="w-full" preserveAspectRatio="none">
              <motion.line
                x1="90" y1="10" x2="1110" y2="10"
                stroke="var(--color-blood-300)"
                strokeWidth="2"
                strokeDasharray="1 12"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
            </svg>
          </div>

          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-center sm:text-left"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white font-display text-xl font-medium text-blood-600 shadow-[0_10px_30px_-10px_rgba(220,38,38,0.35)] sm:mx-0">
                0{i + 1}
              </div>
              <h3 className="mt-5 font-display text-lg font-medium text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
