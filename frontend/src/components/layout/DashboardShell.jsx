import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplet, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardShell({
  title,
  subtitle,
  navItems = [],
  activeTab,
  onTabChange,
  accent = 'patient',
  children,
  topRight,
}) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-paper-dim">
      {/* mobile top bar */}
      <div className="glass sticky top-0 z-40 flex items-center justify-between px-5 py-4 lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blood-600 text-white">
            <Droplet size={14} fill="currentColor" strokeWidth={0} />
          </span>
          <span className="font-display text-base font-semibold">BloodBridge</span>
        </Link>
        <button onClick={() => setOpen((o) => !o)} className="focus-ring rounded-full p-2">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="mx-auto flex max-w-[1600px]">
        {/* sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: open ? 0 : undefined }}
          className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-ink/8 bg-white p-6 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <Link to="/" className="hidden items-center gap-2 lg:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blood-600 text-white">
              <Droplet size={16} fill="currentColor" strokeWidth={0} />
            </span>
            <span className="font-display text-lg font-semibold">BloodBridge</span>
          </Link>

          <nav className="mt-10 space-y-1">
            {navItems.map((item) => {
              const itemId = item.id || item.label.toLowerCase();
              const isTabMode = Boolean(activeTab !== undefined || onTabChange);
              const isActive = isTabMode
                ? activeTab === itemId
                : Boolean(item.to && location.pathname === item.to);

              const handleClick = (e) => {
                setOpen(false);
                if (item.onClick) {
                  item.onClick(e);
                }
                if (onTabChange) {
                  onTabChange(itemId);
                }
                if (item.to && item.to !== location.pathname) {
                  navigate(item.to);
                }
              };

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={handleClick}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blood-600 text-white shadow-[0_8px_20px_-8px_rgba(220,38,38,0.5)]'
                      : 'text-ink-soft hover:bg-mist hover:text-ink'
                  }`}
                >
                  <item.icon size={17} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-ink/8 pt-4">
            {user && (
              <div className="mb-3 flex items-center justify-between rounded-2xl border border-ink/8 bg-mist/50 p-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blood-600 font-display text-sm font-bold text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-[10px] text-ink-soft">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="rounded-xl p-2 text-ink-soft hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
            <div className="rounded-2xl bg-blood-50 p-4">
              <p className="text-xs font-semibold text-blood-700">Emergency helpline</p>
              <p className="mt-1 font-mono text-sm font-semibold text-blood-800">1800-BLOOD-01</p>
            </div>
          </div>
        </motion.aside>

        {open && (
          <div
            className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* main */}
        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {subtitle && <p className="font-mono text-xs uppercase tracking-widest text-blood-600">{subtitle}</p>}
              <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">{title}</h1>
            </div>
            {topRight}
          </div>

          <div className="mt-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
