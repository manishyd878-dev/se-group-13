import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Loader2, Locate, MapPin, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { bloodGroups } from '../lib/data.js';
import HospitalCard from '../components/ui/HospitalCard.jsx';
import HospitalMap from '../components/ui/HospitalMap.jsx';
import { api } from '../lib/api.js';

export default function FindBlood() {
  const [group, setGroup] = useState('O+');
  const [query, setQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(15);
  const [hospitalsList, setHospitalsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Geolocation state
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');

  // Handle GPS location request
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          addressName: 'Current Location',
        };
        setUserLocation(coords);
        setLocating(false);
        setLocationMessage(`📍 Location detected (${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)})`);
      },
      (err) => {
        setLocating(false);
        console.error('Geolocation error:', err);
        setLocationMessage('Could not retrieve location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Fetch real hospitals from backend (passing lat/lng if available)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    const params = {
      q: query,
      bloodGroup: group,
      ...(userLocation ? { lat: userLocation.lat, lng: userLocation.lng, maxDistanceKm: maxDistance } : {}),
    };

    api.getHospitals(params)
      .then((res) => {
        if (isMounted && res.hospitals) {
          setHospitalsList(res.hospitals);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching hospitals:', err);
          setError('Could not load live hospital data.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query, group, userLocation, maxDistance]);

  const results = useMemo(() => {
    return hospitalsList.filter((h) => {
      if (!maxDistance || !userLocation) return true;
      if (h.distanceKm !== undefined && h.distanceKm !== null) {
        return h.distanceKm <= maxDistance;
      }
      return true;
    });
  }, [hospitalsList, maxDistance, userLocation]);

  return (
    <div className="min-h-screen bg-paper-dim pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-xs uppercase tracking-widest text-blood-600">Find blood</p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Search nearby availability
            </h1>
          </motion.div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-blood-600 text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <LayoutGrid size={14} /> Cards
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                viewMode === 'map' ? 'bg-blood-600 text-white' : 'text-ink-soft hover:text-ink'
              }`}
            >
              <MapIcon size={14} /> Map View
            </button>
          </div>
        </div>

        {/* Controls bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass mt-8 rounded-3xl p-5 sm:p-6"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hospitals by name, address, or city..."
                className="w-full rounded-full border border-ink/10 bg-white py-3.5 pl-11 pr-4 text-sm focus-ring"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              {bloodGroups.map((g) => (
                <button
                  key={g}
                  onClick={() => setGroup(g)}
                  className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-ring ${
                    group === g ? 'bg-blood-600 text-white' : 'bg-white text-ink-soft hover:bg-mist'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Locate Me GPS Button */}
            <button
              onClick={handleLocateMe}
              disabled={locating}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-blood-200 bg-blood-50 px-5 py-3 text-xs font-semibold text-blood-700 transition-colors hover:bg-blood-100 disabled:opacity-50"
            >
              {locating ? <Loader2 size={16} className="animate-spin text-blood-600" /> : <Locate size={16} className="text-blood-600" />}
              <span>{locating ? 'Locating...' : '📍 Use My Location'}</span>
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-ink/8 pt-5">
            <div className="flex items-center gap-4 flex-1">
              <SlidersHorizontal size={16} className="text-ink-soft" />
              <label className="flex flex-1 items-center gap-3 text-xs text-ink-soft">
                Distance radius
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="flex-1 accent-blood-600"
                />
                <span className="font-mono font-semibold text-ink">{maxDistance} km</span>
              </label>
            </div>

            {locationMessage && (
              <span className="text-xs font-medium text-blood-700 bg-blood-50 px-3 py-1.5 rounded-full border border-blood-200">
                {locationMessage}
              </span>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="mt-16 flex items-center justify-center gap-3 text-ink-soft">
            <Loader2 size={20} className="animate-spin text-blood-600" />
            <span>Fetching live blood availability and hospital locations...</span>
          </div>
        ) : (
          <>
            <p className="mt-8 text-sm text-ink-soft">
              {results.length} hospital{results.length !== 1 ? 's' : ''} found with {group}
            </p>

            {viewMode === 'map' ? (
              <div className="mt-4">
                <HospitalMap hospitals={results} userLocation={userLocation} highlightGroup={group} />
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {results.map((h, i) => (
                  <HospitalCard key={h._id || h.id || i} hospital={h} highlightGroup={group} index={i} />
                ))}
              </div>
            )}

            {results.length === 0 && !error && (
              <div className="mt-16 text-center text-ink-soft">No hospitals match those filters yet.</div>
            )}

            {error && (
              <div className="mt-16 text-center text-red-600 text-sm font-medium">{error}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
