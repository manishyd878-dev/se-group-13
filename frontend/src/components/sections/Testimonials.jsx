import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { testimonials } from '../../lib/data.js';

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  const active = testimonials[index];

  return (
    <section className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blood-50 blur-3xl" />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-blood-600">Trusted in emergencies</p>
        <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          Voices from the bridge
        </h2>

        <div className="relative mt-14 min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass mx-auto rounded-3xl p-10"
            >
              <Quote className="mx-auto text-blood-300" size={28} />
              <p className="mt-5 font-display text-xl leading-relaxed text-ink sm:text-2xl">
                "{active.quote}"
              </p>
              <p className="mt-6 text-sm font-semibold text-ink">{active.name}</p>
              <p className="text-xs text-ink-soft">{active.role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 focus-ring ${
                i === index ? 'w-7 bg-blood-600' : 'w-1.5 bg-ink/15 hover:bg-ink/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
