import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, dark = false, ...props }) {
  return (
    <motion.div
      className={`${dark ? 'glass-dark' : 'glass'} rounded-3xl shadow-[0_10px_40px_-16px_rgba(28,20,23,0.18)] ${className}`}
      whileHover={hover ? { y: -6, boxShadow: '0 20px 50px -12px rgba(220,38,38,0.25)' } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
