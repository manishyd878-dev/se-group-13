import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet, Home } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import VitalLine from '../components/ui/VitalLine.jsx';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-blood-50 text-blood-600"
      >
        <Droplet size={36} strokeWidth={1.5} />
      </motion.div>
      <p className="mt-8 font-mono text-sm text-blood-600">404</p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        This page didn't make it here.
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        The page you're looking for may have moved. Let's get you back to finding blood, not links.
      </p>
      <VitalLine className="mt-10 h-8 w-full max-w-xs text-blood-300" />
      <Button as={Link} to="/" variant="primary" className="mt-10">
        <Home size={16} /> Back to home
      </Button>
    </div>
  );
}
