import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const FILL_MS = 2200; // how long the bar takes to reach 100%
const HOLD_MS = 450; // pause at 100% before revealing the site

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Lock scroll while the intro is up.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let raf;
    let done = false;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / FILL_MS);
      const eased = 1 - Math.pow(1 - p, 2); // easeOut
      setProgress(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!done) {
        done = true;
        setTimeout(() => onDone?.(), HOLD_MS);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        <span className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Acuity <span className="text-accent">Kinetic</span>
        </span>
        <p className="mt-3 text-xs uppercase tracking-[0.28em] text-muted sm:text-sm">
          For athletes, by an athlete
        </p>

        <div className="mt-9 h-[3px] w-56 overflow-hidden rounded-full bg-line sm:w-72">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="mt-3 text-xs tabular-nums text-muted">{progress}%</span>
      </motion.div>
    </motion.div>
  );
}
