import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, PhoneCall } from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import { api } from '../lib/api.js';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setLoading(true);
    try {
      await api.submitContact({ name, email, subject, message });
      setStatus({ type: 'success', text: 'Thank you! Your message has been sent successfully.' });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Failed to send message' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-blood-600">Get in touch</p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
            We're here, especially in an emergency.
          </h1>
          <p className="mt-4 text-ink-soft">
            For urgent requests, call the helpline directly. For everything else, reach out below.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {[
              { icon: PhoneCall, label: 'Emergency helpline', value: '1800-BLOOD-01' },
              { icon: Mail, label: 'Email', value: 'help@bloodbridge.app' },
              { icon: MapPin, label: 'Head office', value: 'MI Road, Jaipur, Rajasthan' },
            ].map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-2xl border border-ink/8 bg-white p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blood-50 text-blood-600">
                  <c.icon size={17} />
                </div>
                <div>
                  <p className="text-xs text-ink-soft">{c.label}</p>
                  <p className="mt-0.5 font-medium text-ink">{c.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="glass rounded-3xl p-8"
          >
            {status.text && (
              <div
                className={`mb-4 rounded-xl border p-3 text-center text-xs font-semibold ${
                  status.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-600'
                }`}
              >
                {status.text}
              </div>
            )}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-ink-soft">Full name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-soft">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div className="mt-5">
              <label className="text-xs font-semibold text-ink-soft">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                placeholder="How can we help?"
              />
            </div>
            <div className="mt-5">
              <label className="text-xs font-semibold text-ink-soft">Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                placeholder="Tell us more..."
              />
            </div>
            <Button variant="primary" className="mt-6 w-full" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send message'}
            </Button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

