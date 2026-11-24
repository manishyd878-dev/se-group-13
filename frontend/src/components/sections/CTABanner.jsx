import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Button from '../ui/Button.jsx';
import DropletField from '../ui/DropletField.jsx';

export default function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blood-700 via-blood-600 to-blood-800 px-8 py-20 text-center text-white sm:px-16"
      >
        <DropletField count={10} className="text-white/20" />
        <h2 className="relative font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Your next request could be the one that matters most.
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-white/75">
          Join the network moving blood faster between the people who have it and the people who need it.
        </p>
        <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button as={Link} to="/find-blood" variant="glass" className="!text-blood-700">
            Find blood now <ArrowUpRight size={16} />
          </Button>
          <Button as={Link} to="/register" variant="outline" className="!border-white/30 !text-white hover:!border-white">
            Register your hospital
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
