import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Droplet, Menu, X, LogOut } from 'lucide-react';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Home' },
  { to: '/find-blood', label: 'Find Blood' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const dashboardLink = user?.role === 'hospital' ? '/hospital-dashboard' : '/dashboard';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-500 ${
            scrolled ? 'glass shadow-[0_8px_30px_-12px_rgba(28,20,23,0.25)]' : 'bg-transparent'
          }`}
        >
          <Link to="/" className="flex items-center gap-2 focus-ring rounded-full" onClick={() => setOpen(false)}>
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-blood-600 text-white">
              <Droplet size={16} fill="currentColor" strokeWidth={0} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">BloodBridge</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `group relative text-sm font-medium transition-colors focus-ring rounded ${
                    isActive ? 'text-blood-600' : 'text-ink/70 hover:text-ink'
                  }`
                }
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-blood-600 transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}
          </nav>

          {user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to={dashboardLink}
                className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-sm font-semibold text-ink hover:bg-white transition-colors"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blood-600 text-xs font-bold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span>Dashboard</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink/70 hover:text-blood-600 transition-colors"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/login" className="focus-ring rounded-full px-4 py-2 text-sm font-medium text-ink/70 hover:text-ink">
                Login
              </Link>
              <Button as={Link} to="/register" variant="primary" className="!px-5 !py-2.5 text-sm">
                Register
              </Button>
            </div>
          )}

          <button
            className="focus-ring rounded-full p-2 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden px-6 md:hidden"
          >
            <div className="glass mt-3 flex flex-col gap-1 rounded-3xl p-4">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 text-sm font-medium ${
                        isActive ? 'bg-blood-50 text-blood-600' : 'text-ink/80 hover:bg-mist'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              {user ? (
                <div className="mt-2 flex flex-col gap-2 border-t border-ink/10 pt-3">
                  <Link
                    to={dashboardLink}
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-blood-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="rounded-xl px-4 py-2.5 text-center text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout ({user.name})
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2 border-t border-ink/10 pt-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-medium text-ink/80 hover:bg-mist"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl bg-blood-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
