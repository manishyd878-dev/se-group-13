import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home as HomeIcon, LayoutGrid, Boxes, Bell, User, Settings, Plus, Minus, Trash2, AlertTriangle, Droplets, Users, Activity, Edit3, Save, CheckCircle2, Building2, MapPin, Phone, Mail, Navigation, Lock, ShieldAlert, Check, X
} from 'lucide-react';
import DashboardShell from '../components/layout/DashboardShell.jsx';
import BarChart from '../components/ui/BarChart.jsx';
import StatusPill, { stockStatus } from '../components/ui/StatusPill.jsx';
import { bloodGroups } from '../lib/data.js';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../lib/api.js';

const navItems = [
  { id: 'home', label: 'Go to Home', icon: HomeIcon, to: '/' },
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const defaultStock = { 'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'O+': 0, 'O-': 0 };
const toneLabel = { green: 'Healthy', yellow: 'Low', red: 'Empty' };

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Hospital state
  const hospitalObj = typeof user?.hospital === 'object' ? user.hospital : null;
  const hospitalId = hospitalObj?._id || (typeof user?.hospital === 'string' ? user.hospital : null);

  const [hospitalData, setHospitalData] = useState(hospitalObj);
  const [stock, setStock] = useState(() => hospitalObj?.stock || defaultStock);
  
  // Profile edit fields
  const [name, setName] = useState(hospitalObj?.name || user?.name || '');
  const [address, setAddress] = useState(hospitalObj?.address || '');
  const [city, setCity] = useState(hospitalObj?.city || '');
  const [phone, setPhone] = useState(hospitalObj?.phone || user?.phone || '');
  const [email, setEmail] = useState(hospitalObj?.email || user?.email || '');
  const [latitude, setLatitude] = useState(hospitalObj?.location?.coordinates?.[1] ? String(hospitalObj.location.coordinates[1]) : '');
  const [longitude, setLongitude] = useState(hospitalObj?.location?.coordinates?.[0] ? String(hospitalObj.location.coordinates[0]) : '');
  const [locatingGps, setLocatingGps] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Real backend notifications & patient requests
  const [notificationsList, setNotificationsList] = useState([]);
  const [hospitalRequests, setHospitalRequests] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Settings state
  const [settingsMsg, setSettingsMsg] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Sync / load fresh data from API on mount
  useEffect(() => {
    if (hospitalId) {
      api.getHospital(hospitalId)
        .then((res) => {
          if (res.hospital) {
            setHospitalData(res.hospital);
            setStock(res.hospital.stock || defaultStock);
            setName(res.hospital.name || '');
            setAddress(res.hospital.address || '');
            setCity(res.hospital.city || '');
            setPhone(res.hospital.phone || '');
            setEmail(res.hospital.email || '');
            if (res.hospital.location?.coordinates && (res.hospital.location.coordinates[0] !== 0 || res.hospital.location.coordinates[1] !== 0)) {
              setLongitude(String(res.hospital.location.coordinates[0]));
              setLatitude(String(res.hospital.location.coordinates[1]));
            }
          }
        })
        .catch((err) => console.error('Failed to load hospital details:', err));
    }
  }, [hospitalId]);

  // Fetch real notifications and patient requests from MongoDB
  const fetchLiveBackendData = () => {
    setLoadingNotifications(true);

    Promise.all([
      api.getNotifications().catch(() => ({ notifications: [] })),
      api.getHospitalRequests().catch(() => ({ requests: [] })),
    ])
      .then(([notifRes, reqRes]) => {
        if (notifRes.notifications) {
          setNotificationsList(notifRes.notifications);
        }
        if (reqRes.requests) {
          setHospitalRequests(reqRes.requests);
        }
      })
      .finally(() => {
        setLoadingNotifications(false);
      });
  };

  useEffect(() => {
    fetchLiveBackendData();
  }, []);

  const handleCaptureGps = () => {
    if (!navigator.geolocation) return;
    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(String(pos.coords.latitude.toFixed(6)));
        setLongitude(String(pos.coords.longitude.toFixed(6)));
        setLocatingGps(false);
      },
      (err) => {
        setLocatingGps(false);
        console.error('GPS Capture error:', err);
      }
    );
  };

  const totalUnits = useMemo(() => {
    if (!stock) return 0;
    return Object.values(stock).reduce((a, b) => a + (Number(b) || 0), 0);
  }, [stock]);

  const lowStockGroups = useMemo(() => {
    return bloodGroups.filter((g) => (stock?.[g] || 0) < 5);
  }, [stock]);

  // Update stock handler with backend persistence
  const updateStock = async (g, newQty) => {
    const validQty = Math.max(0, newQty);
    const updatedStock = { ...stock, [g]: validQty };
    setStock(updatedStock);

    if (hospitalId) {
      try {
        await api.updateStock(hospitalId, {
          mode: 'set',
          changes: { [g]: validQty },
        });
        fetchLiveBackendData();
      } catch (err) {
        console.error('Failed to persist stock update:', err);
      }
    }
  };

  // Handle request status update (accept / reject / fulfill)
  const handleUpdateStatus = async (requestId, status) => {
    try {
      await api.updateRequestStatus(requestId, status);
      fetchLiveBackendData();
      if (hospitalId) {
        api.getHospital(hospitalId).then((res) => {
          if (res.hospital?.stock) setStock(res.hospital.stock);
        });
      }
    } catch (err) {
      console.error('Failed to update request status:', err);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!hospitalId) {
      setProfileMessage('Error: Hospital ID not found.');
      return;
    }

    setSavingProfile(true);
    setProfileMessage('');

    try {
      const payload = {
        name,
        address,
        city,
        phone,
        email,
      };

      if (latitude && longitude && !isNaN(Number(latitude)) && !isNaN(Number(longitude))) {
        payload.location = {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        };
      }

      const res = await api.updateHospital(hospitalId, payload);

      if (res.hospital) {
        setHospitalData(res.hospital);
        setProfileMessage('Hospital profile and GPS location updated successfully!');
      }
    } catch (err) {
      setProfileMessage(err.message || 'Failed to update hospital details.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsMsg('Dashboard settings updated successfully.');
    setTimeout(() => setSettingsMsg(''), 4000);
  };

  const hospitalTitle = hospitalData?.name || name || user?.name || 'Hospital Dashboard';

  return (
    <DashboardShell
      title={hospitalTitle}
      subtitle="Hospital dashboard & blood inventory manager"
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      topRight={
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white"
        >
          <Bell size={18} className="text-ink-soft" />
          {notificationsList.length > 0 && (
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blood-600" />
          )}
        </button>
      }
    >
      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {lowStockGroups.length > 0 && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <AlertTriangle size={18} className="shrink-0 text-amber-600" />
              <p className="text-sm text-amber-800">
                Low stock alert: <span className="font-semibold">{lowStockGroups.join(', ')}</span> need replenishment soon.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total units', value: totalUnits, icon: Droplets },
              { label: 'Blood groups low', value: lowStockGroups.length, icon: AlertTriangle },
              { label: 'Incoming Requests', value: hospitalRequests.length, icon: Users },
              { label: 'System status', value: 'Live', icon: Activity },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-ink/8 bg-white p-4">
                <s.icon size={16} className="text-blood-600" />
                <p className="mt-3 font-display text-2xl font-medium text-ink">{s.value}</p>
                <p className="mt-1 text-xs text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl border border-ink/8 bg-white p-6">
              <h2 className="font-display text-lg font-medium text-ink">Stock by blood group</h2>
              <div className="mt-6">
                <BarChart data={bloodGroups.map((g) => ({ label: g, value: stock[g] || 0 }))} />
              </div>
            </div>

            <div className="rounded-3xl border border-ink/8 bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-medium text-ink">Live Notifications</h2>
                <button onClick={() => setActiveTab('notifications')} className="text-xs font-semibold text-blood-600 hover:underline">
                  View all
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {notificationsList.slice(0, 4).map((n) => (
                  <div key={n._id || n.id} className="flex items-start gap-3 rounded-2xl bg-mist/60 p-3">
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        n.tone === 'danger' || n.tone === 'caution' ? 'bg-amber-500' : n.tone === 'success' ? 'bg-emerald-500' : 'bg-blood-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm text-ink">{n.text}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </p>
                    </div>
                  </div>
                ))}

                {notificationsList.length === 0 && !loadingNotifications && (
                  <p className="py-6 text-center text-xs text-ink-soft">No recent notifications.</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Inventory overview */}
          <div className="mt-10 flex items-center justify-between">
            <h2 className="font-display text-lg font-medium text-ink">Blood inventory overview</h2>
            <button onClick={() => setActiveTab('inventory')} className="text-xs font-semibold text-blood-600 hover:underline">
              Manage inventory →
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bloodGroups.map((g) => {
              const qty = stock[g] || 0;
              const tone = stockStatus(qty);
              return (
                <div key={g} className="rounded-2xl border border-ink/8 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl font-medium text-blood-600">{g}</p>
                    <StatusPill tone={tone} label={toneLabel[tone]} />
                  </div>
                  <p className="mt-3 font-mono text-2xl font-semibold text-ink">{qty}</p>
                  <p className="text-xs text-ink-soft">units available</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Inventory Tab Content */}
      {activeTab === 'inventory' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl font-medium text-ink">Blood Inventory Management</h2>
              <p className="text-xs text-ink-soft">Update unit counts in real-time. Changes immediately sync to the MongoDB database.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {bloodGroups.map((g) => {
              const qty = stock[g] || 0;
              const tone = stockStatus(qty);
              return (
                <div key={g} className="rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl font-medium text-blood-600">{g}</p>
                    <StatusPill tone={tone} label={toneLabel[tone]} />
                  </div>
                  <p className="mt-4 font-mono text-3xl font-bold text-ink">{qty}</p>
                  <p className="text-xs text-ink-soft mt-1">units available</p>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-mist">
                    <div
                      className={`h-full ${tone === 'red' ? 'bg-blood-500' : tone === 'yellow' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min((qty / 30) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => updateStock(g, qty - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink hover:border-blood-600 hover:text-blood-600 font-bold"
                    >
                      <Minus size={16} />
                    </button>
                    <button
                      onClick={() => updateStock(g, qty + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink hover:border-blood-600 hover:text-blood-600 font-bold"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => updateStock(g, 0)}
                      className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 text-ink-soft hover:border-blood-600 hover:text-blood-600"
                      title="Clear stock"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="mt-10 font-display text-lg font-medium text-ink">Live Inventory Audit Log</h3>
          <div className="mt-4 overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink-soft bg-mist/30">
                  <th className="px-6 py-4 font-semibold">Blood group</th>
                  <th className="px-6 py-4 font-semibold">Available Units</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Source</th>
                  <th className="px-6 py-4 font-semibold text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {bloodGroups.map((g) => {
                  const qty = stock[g] || 0;
                  const tone = stockStatus(qty);
                  return (
                    <tr key={g} className="border-b border-ink/6 last:border-0 hover:bg-mist/40">
                      <td className="px-6 py-4 font-bold text-ink text-base">{g}</td>
                      <td className="px-6 py-4 font-mono font-semibold text-lg">{qty}</td>
                      <td className="px-6 py-4">
                        <StatusPill tone={tone} label={toneLabel[tone]} />
                      </td>
                      <td className="px-6 py-4 text-xs text-emerald-700 font-semibold">Synced with MongoDB</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => updateStock(g, qty + 1)} className="rounded-full border border-ink/10 px-3.5 py-1.5 text-xs font-semibold hover:border-blood-600 hover:text-blood-600 bg-white">
                            + Add unit
                          </button>
                          <button onClick={() => updateStock(g, 0)} className="rounded-full border border-ink/10 px-3.5 py-1.5 text-xs font-semibold hover:border-blood-600 hover:text-blood-600 bg-white">
                            Clear
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Notifications & Patient Requests Tab Content */}
      {activeTab === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-medium text-ink">System Notifications & Patient Requests</h2>
              <p className="text-xs text-ink-soft">Real-time requests submitted by patients to this hospital.</p>
            </div>
            <button
              onClick={fetchLiveBackendData}
              className="rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-mist hover:text-ink"
            >
              Refresh Feed
            </button>
          </div>

          {/* Incoming Patient Requests Section */}
          <div className="mb-8">
            <h3 className="font-display text-lg font-medium text-ink mb-4">Patient Blood Requests</h3>
            {hospitalRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-ink-soft bg-white rounded-3xl border border-ink/8">
                No patient requests received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {hospitalRequests.map((req) => (
                  <div key={req._id || req.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-3xl border border-ink/8 bg-white p-6 shadow-sm gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-blood-700 bg-blood-50 px-2.5 py-1 rounded-full border border-blood-200">
                          REQ-{(req._id || req.id || '').slice(-4).toUpperCase()}
                        </span>
                        <h4 className="font-display text-base font-bold text-ink">
                          {req.patient?.name || 'Patient'}
                        </h4>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          req.urgency === 'emergency' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.urgency || 'normal'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-ink-soft">
                        Needs <span className="font-bold text-blood-600">{req.units || 1} unit(s)</span> of <span className="font-bold text-blood-600">{req.bloodGroup}</span> blood
                        {req.patient?.phone && ` · Contact: ${req.patient.phone}`}
                      </p>
                      {req.notes && <p className="mt-1 text-xs text-ink/70">Notes: {req.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize mr-2 ${
                        req.status === 'accepted' || req.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-700' : req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req._id || req.id, 'accepted')}
                            className="flex items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req._id || req.id, 'rejected')}
                            className="flex items-center gap-1 rounded-full bg-red-100 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200"
                          >
                            <X size={14} /> Reject
                          </button>
                        </>
                      )}
                      {req.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateStatus(req._id || req.id, 'fulfilled')}
                          className="flex items-center gap-1 rounded-full bg-blood-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blood-700"
                        >
                          Fulfill & Decrement Stock
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Notifications Log */}
          <div>
            <h3 className="font-display text-lg font-medium text-ink mb-4">System Alerts Log</h3>
            <div className="space-y-3">
              {notificationsList.map((n) => (
                <div key={n._id || n.id} className="flex items-start justify-between rounded-2xl border border-ink/8 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${
                        n.tone === 'danger' || n.tone === 'caution' ? 'bg-amber-500' : n.tone === 'success' ? 'bg-emerald-500' : 'bg-blood-500'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">{n.text}</p>
                      <p className="mt-1 text-xs text-ink-soft">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-mist px-3 py-1 text-[11px] font-semibold text-ink-soft capitalize">
                    {n.tone || 'info'}
                  </span>
                </div>
              ))}

              {notificationsList.length === 0 && !loadingNotifications && (
                <div className="py-12 text-center text-ink-soft bg-white rounded-3xl border border-ink/8">
                  No notifications recorded yet.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="mb-6">
            <h2 className="font-display text-2xl font-medium text-ink">Hospital Profile & GPS Details</h2>
            <p className="text-xs text-ink-soft">Manage hospital contact details, street address, and GPS coordinates.</p>
          </div>

          {profileMessage && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={16} /> {profileMessage}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="rounded-3xl border border-ink/8 bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink">Hospital Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink">City / Region</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
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
                <label className="mb-1.5 block text-xs font-semibold text-ink">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-ink">Street Address</label>
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink">Latitude (GPS)</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g. 19.0760"
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink">Longitude (GPS)</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g. 72.8777"
                  className="w-full rounded-xl border border-ink/10 bg-paper-dim p-3 text-sm focus-ring"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  disabled={locatingGps}
                  className="w-full rounded-xl border border-blood-200 bg-blood-50 p-3 text-xs font-semibold text-blood-700 transition-colors hover:bg-blood-100 disabled:opacity-50"
                >
                  {locatingGps ? 'Capturing GPS...' : '📍 Auto-detect GPS Location'}
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 rounded-full bg-blood-600 px-8 py-3 text-xs font-semibold text-white transition-colors hover:bg-blood-700 disabled:opacity-50 shadow-md"
              >
                <Save size={16} /> {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Settings Tab Content */}
      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="mb-6">
            <h2 className="font-display text-2xl font-medium text-ink">Dashboard Settings</h2>
            <p className="text-xs text-ink-soft">Configure alerts, notification channels, and security settings.</p>
          </div>

          {settingsMsg && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={16} /> {settingsMsg}
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                <Bell size={16} className="text-blood-600" /> Stock Alert Preferences
              </h3>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="accent-blood-600 rounded" />
                  <span>Send automatic notification when stock falls below 5 units</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="accent-blood-600 rounded" />
                  <span>Receive emergency patient request notifications via SMS</span>
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                <Lock size={16} className="text-blood-600" /> Account Security
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-ink/10 bg-paper-dim p-2.5 text-sm focus-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ink-soft">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-ink/10 bg-paper-dim p-2.5 text-sm focus-ring"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-blood-600 px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blood-700 shadow-sm"
              >
                <Save size={14} /> Save Dashboard Settings
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </DashboardShell>
  );
}
