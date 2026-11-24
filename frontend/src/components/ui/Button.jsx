import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Button({
  children,
  variant = 'primary',
  className = '',
  as = 'button',
  onClick,
  ...props
}) {
  const ref = useRef(null);
  const [ripples, setRipples] = useState([]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    ref.current.style.setProperty('--mx', `${x * 0.25}px`);
    ref.current.style.setProperty('--my', `${y * 0.25}px`);
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--mx', `0px`);
    ref.current.style.setProperty('--my', `0px`);
  };

  const handleClick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const id = Date.now();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    onClick?.(e);
  };

  const base =
    'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm px-6 py-3.5 transition-colors duration-300 focus-ring select-none';

  const variants = {
    primary: 'bg-blood-600 text-white hover:bg-blood-700 shadow-[0_8px_30px_-8px_rgba(220,38,38,0.55)]',
    secondary: 'bg-ink text-paper hover:bg-ink-soft',
    outline: 'border border-ink/15 text-ink hover:border-blood-600 hover:text-blood-600 bg-transparent',
    ghost: 'text-ink/70 hover:text-blood-600',
    glass: 'glass text-ink hover:bg-white/70',
  };

  const Comp = typeof as === 'string' ? motion[as] || motion.button : motion.create(as);

  return (
    <Comp
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ transform: 'translate(var(--mx, 0px), var(--my, 0px))' }}
      className={`${base} ${variants[variant]} ${className}`}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ width: 0, height: 0, opacity: 0.45 }}
          animate={{ width: 260, height: 260, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          style={{ left: r.x, top: r.y }}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40"
        />
      ))}
    </Comp>
  );
}
