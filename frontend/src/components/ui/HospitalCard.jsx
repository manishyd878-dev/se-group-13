import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, ShieldCheck, Star, Eye } from 'lucide-react';
import StatusPill, { stockStatus } from './StatusPill.jsx';
import HospitalDetailModal from './HospitalDetailModal.jsx';
import RequestBloodModal from './RequestBloodModal.jsx';

const toneLabel = { green: 'In stock', yellow: 'Low stock', red: 'Out of stock' };
const defaultStock = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 };

export default function HospitalCard({ hospital, highlightGroup, index = 0 }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const stockObj = hospital.stock || defaultStock;
  const groups = Object.entries(stockObj);
  const highlightUnits = highlightGroup ? (stockObj[highlightGroup] || 0) : null;
  
  const stockValues = Object.values(stockObj).map(Number);
  const maxUnits = stockValues.length > 0 ? Math.max(...stockValues) : 0;

  const overallTone = highlightGroup
    ? stockStatus(highlightUnits)
    : stockStatus(maxUnits);

  const displayDistance = hospital.distance || (hospital.distanceKm !== undefined && hospital.distanceKm !== null ? `${hospital.distanceKm.toFixed(1)} km` : 'Near you');
  const displayRating = hospital.rating ?? 4.5;
  const displayAddress = hospital.address || (hospital.city ? `${hospital.city}` : 'Location available');
  const displayPhone = hospital.phone || 'N/A';

  const hasCoords = hospital.location?.coordinates && (hospital.location.coordinates[0] !== 0 || hospital.location.coordinates[1] !== 0);
  const mapsDirectionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.name + ' ' + (hospital.address || ''))}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: index * 0.06, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="rounded-3xl border border-ink/8 bg-white p-6 shadow-[0_4px_20px_-10px_rgba(28,20,23,0.1)] transition-shadow hover:shadow-[0_20px_45px_-16px_rgba(220,38,38,0.22)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="cursor-pointer" onClick={() => setShowDetails(true)}>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-medium text-ink hover:text-blood-600 transition-colors">{hospital.name}</h3>
              {hospital.verified && <ShieldCheck size={16} className="shrink-0 text-emerald-600" />}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
              <MapPin size={13} /> {displayAddress} · {displayDistance}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-ink shrink-0">
            <Star size={12} className="fill-amber-400 text-amber-400" /> {displayRating}
          </div>
        </div>

        {highlightGroup ? (
          <div
            onClick={() => setShowDetails(true)}
            className="mt-5 flex items-center justify-between rounded-2xl bg-blood-50 px-4 py-3 cursor-pointer hover:bg-blood-100/60 transition-colors"
          >
            <div>
              <p className="text-xs text-ink-soft">{highlightGroup} available</p>
              <p className="font-display text-2xl font-medium text-blood-700">{highlightUnits} units</p>
            </div>
            <StatusPill tone={overallTone} label={toneLabel[overallTone]} />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-4 gap-2 cursor-pointer" onClick={() => setShowDetails(true)}>
            {groups.map(([g, units]) => (
              <div key={g} className="rounded-xl bg-mist px-2 py-2 text-center">
                <p className="text-[11px] font-semibold text-ink-soft">{g}</p>
                <p className={`font-mono text-sm font-semibold ${units === 0 ? 'text-blood-500' : 'text-ink'}`}>{units}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-2">
          <a
            href={displayPhone !== 'N/A' ? `tel:${displayPhone}` : '#'}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/12 px-3 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-blood-600 hover:text-blood-600"
          >
            <Phone size={14} /> Call
          </a>
          <a
            href={mapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/12 px-3 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-blood-600 hover:text-blood-600"
          >
            <Navigation size={14} /> Directions
          </a>
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex-1 rounded-full bg-blood-600 px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blood-700 shadow-sm"
          >
            Request blood
          </button>
        </div>
      </motion.div>

      {/* Hospital Details Modal */}
      {showDetails && (
        <HospitalDetailModal
          hospital={hospital}
          onClose={() => setShowDetails(false)}
          onRequestBlood={() => setShowRequestModal(true)}
        />
      )}

      {/* Request Blood Modal */}
      {showRequestModal && (
        <RequestBloodModal
          hospital={hospital}
          initialGroup={highlightGroup || 'O+'}
          onClose={() => setShowRequestModal(false)}
        />
      )}
    </>
  );
}
