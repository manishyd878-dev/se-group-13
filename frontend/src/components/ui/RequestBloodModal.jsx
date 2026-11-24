import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertTriangle, CheckCircle2, Droplet, User, Phone } from 'lucide-react';
import { bloodGroups } from '../../lib/data.js';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function RequestBloodModal({ hospital, initialGroup = 'O+', onClose }) {
  if (!hospital) return null;

  const { user } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(initialGroup || 'O+');
  const [units, setUnits] = useState(1);
  const [urgency, setUrgency] = useState('normal');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in as a patient to submit blood requests.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await api.createRequest({
        hospital: hospital._id || hospital.id,
        bloodGroup: group,
        units: Number(units),
        urgency,
        notes,
      });

      setSuccessMsg(`Blood request for ${units} unit(s) of ${group} successfully submitted to ${hospital.name}!`);
    } catch (err) {
      setError(err.message || 'Failed to submit blood request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-ink/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-ink/10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-mist text-ink-soft hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blood-600 text-white">
              <Droplet size={20} fill="currentColor" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Request Blood</h2>
              <p className="text-xs text-ink-soft">Hospital: <span className="font-semibold text-ink">{hospital.name}</span></p>
            </div>
          </div>

          {successMsg ? (
            <div className="mt-6 text-center py-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">Request Submitted!</h3>
              <p className="mt-2 text-xs text-ink-soft">{successMsg}</p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full bg-blood-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-blood-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-center text-xs font-semibold text-red-600 border border-red-200">
                  {error}
                  {!user && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate('/login');
                        }}
                        className="rounded-full bg-blood-600 px-4 py-1.5 text-xs text-white hover:bg-blood-700"
                      >
                        Log In Now
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Blood Group Required</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                >
                  {bloodGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Number of Units</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Urgency Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Normal' },
                    { id: 'urgent', label: 'Urgent' },
                    { id: 'emergency', label: 'Emergency' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id)}
                      className={`rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                        urgency === u.id
                          ? 'bg-blood-600 text-white shadow-sm'
                          : 'bg-mist text-ink-soft hover:bg-paper-dim'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-ink">Additional Notes / Patient Contact</label>
                <textarea
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Patient ICU bed no, doctor contact number..."
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring resize-none"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-blood-600 py-3 text-xs font-semibold text-white hover:bg-blood-700 disabled:opacity-50 shadow-md transition-colors"
                >
                  <Send size={16} /> {loading ? 'Submitting Request...' : 'Submit Blood Request'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
