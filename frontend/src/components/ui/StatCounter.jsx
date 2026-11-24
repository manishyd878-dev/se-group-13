import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function StatCounter({ value, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.floor(v).toLocaleString('en-IN'));

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, value, motionVal]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
