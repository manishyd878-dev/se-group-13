import { motion } from 'framer-motion';
import { HeartHandshake, Target, Eye } from 'lucide-react';
import VitalLine from '../components/ui/VitalLine.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function About() {
  return (
    <div className="pb-24 pt-40">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="font-mono text-xs uppercase tracking-widest text-blood-600">
          Why BloodBridge exists
        </motion.p>
        <motion.h1
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl"
        >
          A shortage isn't a lack of donors — it's a lack of visibility.
        </motion.h1>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft"
        >
          India collects millions of blood units every year, yet families still spend precious hours
          calling hospital after hospital during an emergency. BloodBridge exists to close that gap
          with one real-time view of what's available, where.
        </motion.p>
        <VitalLine className="mx-auto mt-12 h-10 w-full max-w-md text-blood-500" />
      </div>

      <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-6 px-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-ink/8 bg-white p-8"
        >
          <Target className="text-blood-600" size={26} />
          <h2 className="mt-4 font-display text-xl font-medium text-ink">Our mission</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Connect every verified hospital's live blood inventory to the patients who need it,
            cutting the time between a request and a match down to minutes.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-ink/8 bg-white p-8"
        >
          <Eye className="text-blood-600" size={26} />
          <h2 className="mt-4 font-display text-xl font-medium text-ink">Our vision</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            A country where no family ever loses time searching for blood — where availability is
            as visible and searchable as a hotel room.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-16 max-w-3xl px-6 text-center"
      >
        <HeartHandshake className="mx-auto text-blood-600" size={28} />
        <h2 className="mt-4 font-display text-2xl font-medium text-ink">Why donation still matters</h2>
        <p className="mt-3 text-ink-soft">
          Blood can't be manufactured — it can only come from another person, and it has a shelf
          life measured in weeks. A steady flow of donors, matched quickly to real need, is the
          only thing that keeps supply ahead of emergency.
        </p>
      </motion.div>
    </div>
  );
}
