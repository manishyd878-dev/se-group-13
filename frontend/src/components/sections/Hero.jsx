import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Droplet, MapPin, Activity } from 'lucide-react';
import Button from '../ui/Button.jsx';
import DropletField from '../ui/DropletField.jsx';
import VitalLine from '../ui/VitalLine.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-40 sm:pb-28 sm:pt-48">
      {/* ambient gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blood-100 via-blood-50 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(28,20,23,0.06)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>
      <DropletField count={16} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blood-200 bg-blood-50/80 px-4 py-1.5 text-xs font-semibold text-blood-700"
          >
            <span className="relative flex h-1.5 w-1.5 rounded-full bg-blood-600">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blood-500 animate-pulsering" />
            </span>
            Live across 842+ verified hospitals
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.2rem]"
          >
            Every drop
            <br />
            <span className="italic text-blood-600">saves a life.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft"
          >
            BloodBridge shows real-time blood availability across verified hospitals near
            you — so during an emergency, you spend your minutes getting there, not
            calling around.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button as={Link} to="/find-blood" variant="primary">
              Find blood <ArrowUpRight size={16} />
            </Button>
            <Button as={Link} to="/register" variant="outline">
              Register hospital
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-14 max-w-md"
          >
            <VitalLine className="h-10 w-full text-blood-500" />
            <p className="mt-2 font-mono text-xs uppercase tracking-wider text-ink-soft/70">
              A pulse, tracked in real time
            </p>
          </motion.div>
        </div>

        {/* Right side illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blood-500 to-blood-800 opacity-90 blur-2xl" />
          <div className="glass relative flex h-full w-full items-center justify-center rounded-[2.5rem]">
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-blood-500 to-blood-700 text-white shadow-[0_20px_60px_-10px_rgba(220,38,38,0.6)]"
            >
              <Droplet size={64} strokeWidth={1.4} />
            </motion.div>

            {/* floating satellite cards */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="glass absolute -left-6 top-10 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-lg"
            >
              <MapPin size={16} className="text-blood-600" />
              <span className="text-xs font-semibold">1.2 km away</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="glass absolute bottom-12 -right-8 flex items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-lg"
            >
              <Activity size={16} className="text-emerald-600" />
              <span className="text-xs font-semibold">O- · 6 units</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
              className="glass absolute -bottom-4 left-8 rounded-2xl px-3.5 py-2.5 shadow-lg"
            >
              <span className="text-xs font-semibold text-blood-700">✓ Verified hospital</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
