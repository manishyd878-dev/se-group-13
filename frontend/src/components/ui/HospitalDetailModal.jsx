import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Mail, Navigation, ShieldCheck, Star, Droplet, Send } from 'lucide-react';
import StatusPill, { stockStatus } from './StatusPill.jsx';

const toneLabel = { green: 'In stock', yellow: 'Low stock', red: 'Out of stock' };
const defaultStock = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 };

export default function HospitalDetailModal({ hospital, onClose, onRequestBlood }) {
  if (!hospital) return null;

  const stockObj = hospital.stock || defaultStock;
  const groups = Object.entries(stockObj);
  const displayAddress = hospital.address || hospital.city || 'Address available upon contact';
  const displayPhone = hospital.phone || 'N/A';
  const displayEmail = hospital.email || 'N/A';
  const displayDistance = hospital.distance || (hospital.distanceKm !== undefined && hospital.distanceKm !== null ? `${hospital.distanceKm.toFixed(1)} km` : 'Near you');
  const displayRating = hospital.rating ?? 4.5;

  const hasCoords = hospital.location?.coordinates && (hospital.location.coordinates[0] !== 0 || hospital.location.coordinates[1] !== 0);
  const mapsDirectionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.name + ' ' + (hospital.address || ''))}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-ink/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-ink/10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-mist text-ink-soft hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blood-50 text-blood-600">
              <Droplet size={24} fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-2xl font-bold text-ink">{hospital.name}</h2>
                {hospital.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <ShieldCheck size={14} /> Verified Facility
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
                <MapPin size={14} className="text-blood-600" /> {displayAddress} · <span className="font-semibold text-ink">{displayDistance}</span>
              </p>
            </div>
          </div>

          {/* Contact & Ratings info */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-paper-dim p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Rating</p>
              <p className="mt-0.5 flex items-center gap-1 font-display text-base font-bold text-ink">
                <Star size={14} className="fill-amber-400 text-amber-400" /> {displayRating} / 5.0
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Phone</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-ink truncate">{displayPhone}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft">Email</p>
              <p className="mt-0.5 font-mono text-xs font-semibold text-ink truncate">{displayEmail}</p>
            </div>
          </div>

          {/* Full Blood Stock Inventory Grid */}
          <h3 className="mt-6 font-display text-base font-medium text-ink">Complete Blood Stock Inventory</h3>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {groups.map(([g, units]) => {
              const tone = stockStatus(units);
              return (
                <div key={g} className="rounded-2xl border border-ink/8 bg-white p-3 shadow-sm text-center">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-blood-600">{g}</span>
                    <StatusPill tone={tone} label={toneLabel[tone]} />
                  </div>
                  <p className="mt-2 font-mono text-2xl font-extrabold text-ink">{units}</p>
                  <p className="text-[10px] text-ink-soft">units available</p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-ink/8">
            <a
              href={displayPhone !== 'N/A' ? `tel:${displayPhone}` : '#'}
              className="flex items-center gap-2 rounded-full border border-ink/12 px-5 py-2.5 text-xs font-semibold text-ink hover:border-blood-600 hover:text-blood-600 transition-colors"
            >
              <Phone size={14} /> Call Hospital
            </a>
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-ink/12 px-5 py-2.5 text-xs font-semibold text-ink hover:border-blood-600 hover:text-blood-600 transition-colors"
            >
              <Navigation size={14} /> Open Google Maps
            </a>
            <button
              onClick={() => {
                onClose();
                if (onRequestBlood) onRequestBlood(hospital);
              }}
              className="flex items-center gap-2 rounded-full bg-blood-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blood-700 transition-colors shadow-md"
            >
              <Send size={14} /> Request Blood Now
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
