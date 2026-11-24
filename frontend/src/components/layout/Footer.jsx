import { Link } from 'react-router-dom';
import { AtSign, Droplet, Globe, Link2, MessageCircle, PhoneCall } from 'lucide-react';

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Find blood', to: '/find-blood' },
      { label: 'Hospitals', to: '/hospitals' },
      { label: 'Patient portal', to: '/dashboard' },
      { label: 'Hospital dashboard', to: '/hospital-dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Register hospital', to: '/register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blood-600">
                <Droplet size={16} fill="currentColor" strokeWidth={0} />
              </span>
              <span className="font-display text-lg font-semibold">BloodBridge</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              Real-time blood availability between patients and verified hospitals — built so an emergency search takes seconds, not phone calls.
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-blood-500/30 bg-blood-900/40 px-4 py-3">
              <PhoneCall size={18} className="text-blood-400" />
              <div>
                <p className="text-xs text-white/50">Emergency helpline</p>
                <p className="font-mono text-sm font-semibold">1800-BLOOD-01</p>
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-white/65 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">Stay informed</p>
            <p className="mt-4 text-sm text-white/60">Monthly notes on donation drives and platform updates.</p>
            <form className="mt-4 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="w-full rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus-ring"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-blood-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blood-500"
              >
                Join
              </button>
            </form>
            <div className="mt-6 flex gap-3">
              {[AtSign, MessageCircle, Link2, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-blood-500 hover:text-blood-400"
                  aria-label="Social link"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} BloodBridge. All rights reserved.</p>
          <p>Every drop saves a life.</p>
        </div>
      </div>
    </footer>
  );
}
