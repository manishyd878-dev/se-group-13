import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet, Mail, User, Lock, Building2, Phone, MapPin, Navigation } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import DropletField from '../components/ui/DropletField.jsx';
import GoogleAuthButton from '../components/ui/GoogleAuthButton.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password,
        role,
        phone,
        hospitalDetails: role === 'hospital' ? { name, address, city, phone } : undefined,
      };
      const res = await register(payload);
      const userRole = res.user?.role || role;
      navigate(userRole === 'hospital' ? '/hospital-dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32">
      <DropletField count={12} />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blood-50 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative w-full max-w-md rounded-3xl p-8 sm:p-10"
      >
        <Link to="/" className="mx-auto flex w-fit items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blood-600 text-white">
            <Droplet size={18} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="font-display text-xl font-semibold">BloodBridge</span>
        </Link>

        <h1 className="mt-8 text-center font-display text-2xl font-medium text-ink">Create your account</h1>
        <p className="mt-1 text-center text-sm text-ink-soft">Join as a patient or register your hospital.</p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex rounded-full bg-mist p-1">
          {['patient', 'hospital'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold capitalize transition-colors ${
                role === r ? 'bg-white text-blood-600 shadow-sm' : 'text-ink-soft'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <GoogleAuthButton
            role={role}
            text="Continue with Google"
            onSuccess={(res) => {
              const userRole = res.user?.role || role;
              navigate(userRole === 'hospital' ? '/hospital-dashboard' : '/dashboard');
            }}
            onError={(err) => setError(err)}
          />
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-ink/10" />
          <span className="text-xs uppercase tracking-wider text-ink-soft">or register with email</span>
          <div className="h-px flex-1 bg-ink/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            {role === 'patient' ? (
              <User size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            ) : (
              <Building2 size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            )}
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'patient' ? 'Full name' : 'Hospital name'}
              className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-11 pr-4 text-sm focus-ring"
            />
          </div>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-11 pr-4 text-sm focus-ring"
            />
          </div>

          <div className="relative">
            <Phone size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contact phone number"
              className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-11 pr-4 text-sm focus-ring"
            />
          </div>

          {role === 'hospital' && (
            <>
              <div className="relative">
                <Navigation size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City / Region"
                  className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-11 pr-4 text-sm focus-ring"
                />
              </div>

              <div className="relative">
                <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Hospital full street address"
                  className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-11 pr-4 text-sm focus-ring"
                />
              </div>
            </>
          )}

          <div className="relative">
            <Lock size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-11 pr-4 text-sm focus-ring"
            />
          </div>
          <label className="flex items-start gap-2 text-xs text-ink-soft">
            <input required type="checkbox" className="mt-0.5 accent-blood-600" />
            I agree to the terms of service and privacy policy.
          </label>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : `Create ${role} account`}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blood-600">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

