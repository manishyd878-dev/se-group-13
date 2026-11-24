import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import HospitalCard from '../components/ui/HospitalCard.jsx';
import { api } from '../lib/api.js';

export default function Hospitals() {
  const [hospitalsList, setHospitalsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getHospitals()
      .then((res) => {
        if (isMounted && res.hospitals) {
          setHospitalsList(res.hospitals);
        }
      })
      .catch((err) => console.error('Failed to load hospitals:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-mono text-xs uppercase tracking-widest text-blood-600">Network</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            Verified hospitals near you
          </h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            Every facility here has been licensed and inventory-audited before joining the network.
          </p>
        </motion.div>

        {loading ? (
          <div className="mt-16 flex items-center justify-center gap-3 text-ink-soft">
            <Loader2 size={20} className="animate-spin text-blood-600" />
            <span>Loading hospital network...</span>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {hospitalsList.map((h, i) => (
              <HospitalCard key={h._id || h.id || i} hospital={h} index={i} />
            ))}
          </div>
        )}

        {!loading && hospitalsList.length === 0 && (
          <div className="mt-16 text-center text-ink-soft">No hospitals found in the network yet.</div>
        )}
      </div>
    </div>
  );
}
