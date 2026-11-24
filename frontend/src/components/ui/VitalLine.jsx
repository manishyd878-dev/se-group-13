import { motion } from 'framer-motion';

/**
 * The recurring signature motif of BloodBridge: a heartbeat waveform that
 * threads through the hero, the stats strip, and the "how it works" path —
 * a literal visualization of a pulse, standing in for the life the platform
 * moves toward patients.
 */
export default function VitalLine({ className = '', color = 'var(--color-blood-500)', strokeWidth = 2.5 }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={className}
      fill="none"
    >
      <motion.path
        d="M0,60 L220,60 L255,60 L275,15 L305,105 L330,40 L350,60 L1200,60"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      />
    </svg>
  );
}
