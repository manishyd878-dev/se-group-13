import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, X } from 'lucide-react';

export default function EmergencyButton() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="glass w-64 rounded-2xl p-4 shadow-2xl"
          >
            <p className="text-sm font-semibold text-ink">Need blood right now?</p>
            <p className="mt-1 text-xs text-ink-soft">
              Jump straight to nearby units matching your blood group.
            </p>
            <button
              onClick={() => {
                setOpen(false);
                navigate('/find-blood');
              }}
              className="mt-3 w-full rounded-full bg-blood-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blood-700"
            >
              Search available blood
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        aria-label="Emergency blood search"
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-blood-600 text-white shadow-[0_10px_40px_-6px_rgba(220,38,38,0.65)] focus-ring"
      >
        <span className="absolute inset-0 rounded-full bg-blood-500 animate-pulsering" />
        <span className="absolute inset-0 rounded-full bg-blood-500/40 blur-xl" />
        <span className="relative">{open ? <X size={24} /> : <Siren size={24} />}</span>
      </motion.button>
    </div>
  );
}
