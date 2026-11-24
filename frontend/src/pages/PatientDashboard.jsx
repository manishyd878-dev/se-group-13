import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home as HomeIcon, LayoutGrid, Search, History, User, Settings, Bell, Loader2, Plus, CheckCircle2, Lock, Droplet } from 'lucide-react';
import DashboardShell from '../components/layout/DashboardShell.jsx';
import HospitalCard from '../components/ui/HospitalCard.jsx';
import { bloodGroups } from '../lib/data.js';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

const navItems = [
  { id: 'home', label: 'Go to Home', icon: HomeIcon, to: '/' },
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'find-blood', label: 'Find blood', icon: Search, to: '/find-blood' },
  { id: 'history', label: 'Request history', icon: History },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const displayName = user?.name ? user.name.split(' ')[0] : 'Patient';
  const defaultGroup = user?.bloodGroup || 'B+';
  const [group, setGroup] = useState(defaultGroup);
  const [query, setQuery] = useState('');
  const [hospitalsList, setHospitalsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bloodGroupPref, setBloodGroupPref] = useState(user?.bloodGroup || 'B+');
  const [profileMsg, setProfileMsg] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Blood requests history from database
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Fetch live hospitals
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getHospitals({ q: query, bloodGroup: group })
      .then((res) => {
        if (isMounted && res.hospitals) {
          setHospitalsList(res.hospitals);
        }
      })
      .catch((err) => console.error('Failed to fetch hospitals in patient dashboard:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query, group]);

  // Fetch real patient blood requests from backend database
  useEffect(() => {
    let isMounted = true;
    setRequestsLoading(true);
    api.getMyRequests()
      .then((res) => {
        if (isMounted && res.requests) {
          setMyRequests(res.requests);
        }
      })
      .catch((err) => console.error('Error fetching patient requests:', err))
      .finally(() => {
        if (isMounted) setRequestsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      await api.updateMe({ name, phone, bloodGroup: bloodGroupPref });
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileMsg(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const results = hospitalsList;

  return (
    <DashboardShell
      title={`Welcome back, ${displayName}`}
      subtitle="Patient portal"
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      topRight={
        <div className="flex items-center gap-3">
          {user?.bloodGroup && (
            <span className="hidden sm:inline-block rounded-full bg-blood-100 px-3 py-1 text-xs font-semibold text-blood-700">
              Blood Group: {user.bloodGroup}
            </span>
          )}
          <button className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white">
            <Bell size={18} className="text-ink-soft" />
            {myRequests.length > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blood-600" />
            )}
          </button>
        </div>
      }
    >
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="glass rounded-3xl p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search hospitals near you..."
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
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Active requests', value: myRequests.filter(r => r.status === 'pending' || r.status === 'accepted').length },
              { label: 'Matches nearby', value: results.length },
              { label: 'Total requests', value: myRequests.length },
              { label: 'Blood group', value: group },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink/8 bg-white p-4">
                <p className="font-display text-2xl font-medium text-ink">{s.value}</p>
                <p className="mt-1 text-xs text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 font-display text-xl font-medium text-ink">Nearby hospitals for {group}</h2>
          
          {loading ? (
            <div className="mt-12 flex items-center justify-center gap-3 text-ink-soft">
              <Loader2 size={20} className="animate-spin text-blood-600" />
              <span>Searching hospitals...</span>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((h, i) => (
                <HospitalCard key={h._id || h.id || i} hospital={h} highlightGroup={group} index={i} />
              ))}
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="mt-12 text-center text-ink-soft">No hospitals found matching your filter.</div>
          )}
        </motion.div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-medium text-ink">Blood Request History</h2>
              <p className="text-xs text-ink-soft">Real-time status of blood requests submitted to hospitals.</p>
            </div>
          </div>

          {requestsLoading ? (
            <div className="py-16 flex items-center justify-center gap-3 text-ink-soft">
              <Loader2 size={20} className="animate-spin text-blood-600" />
              <span>Loading your blood requests...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div key={req._id || req.id} className="flex items-center justify-between rounded-3xl border border-ink/8 bg-white p-6 shadow-sm">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-blood-700 bg-blood-50 px-2.5 py-1 rounded-full border border-blood-200">
                        REQ-{(req._id || req.id || '').slice(-4).toUpperCase()}
                      </span>
                      <h3 className="font-display text-base font-medium text-ink">
                        {req.hospital?.name || 'Hospital Facility'}
                      </h3>
                    </div>
                    <p className="mt-2 text-xs text-ink-soft">
                      Requested <span className="font-bold text-ink">{req.units || 1} unit(s)</span> of <span className="font-bold text-blood-600">{req.bloodGroup}</span> blood · {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {req.notes && <p className="mt-1 text-xs text-ink/70">Notes: {req.notes}</p>}
                  </div>
                  <span className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${
                    req.status === 'accepted' || req.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-700' : req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}

              {myRequests.length === 0 && (
                <div className="py-16 text-center text-ink-soft bg-white rounded-3xl border border-ink/8">
                  No blood requests submitted yet. Click "Find blood" or select any hospital to submit a request.
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="mb-6">
            <h2 className="font-display text-2xl font-medium text-ink">Patient Profile</h2>
            <p className="text-xs text-ink-soft">Manage your personal information and blood group preference.</p>
          </div>

          {profileMsg && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={16} /> {profileMsg}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="rounded-3xl border border-ink/8 bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink">Full Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink">Blood Group</label>
                <select
                  value={bloodGroupPref}
                  onChange={(e) => setBloodGroupPref(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                >
                  {bloodGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink">Email Address</label>
                <input
                  disabled
                  value={user?.email || ''}
                  className="w-full rounded-xl border border-ink/10 bg-mist/60 p-3 text-sm text-ink-soft cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="rounded-full bg-blood-600 px-8 py-3 text-xs font-semibold text-white hover:bg-blood-700 disabled:opacity-50 shadow-md"
              >
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="mb-6">
            <h2 className="font-display text-2xl font-medium text-ink">Patient Settings</h2>
            <p className="text-xs text-ink-soft">Configure notification alerts and privacy options.</p>
          </div>

          <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm space-y-4">
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" defaultChecked className="accent-blood-600 rounded" />
              <span>Receive SMS alerts when blood matching your group is available nearby</span>
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" defaultChecked className="accent-blood-600 rounded" />
              <span>Allow verified hospitals to contact me during emergency requests</span>
            </label>
          </div>
        </motion.div>
      )}
    </DashboardShell>
  );
}
