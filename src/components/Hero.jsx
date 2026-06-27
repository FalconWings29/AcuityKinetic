import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { SPORTS } from '../utils/sports.js';

// The 3D scene is heavy (three.js), so load it on its own chunk after paint.
const SportsScene = lazy(() => import('./SportsScene.jsx'));

export default function Hero({ onTryDemo, onSeeHow, onSelectSport }) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Soft accent glow behind the scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-[560px] w-[560px] rounded-full bg-accent/10 blur-[130px]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-28 sm:px-8 lg:min-h-[88vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-24 lg:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="order-2 lg:order-1"
        >
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-card px-3.5 py-1.5 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Now in private beta
          </p>

          <h1 className="font-display text-[3.25rem] font-bold leading-[0.92] tracking-tight text-bone sm:text-7xl lg:text-[5.5rem]">
            A coach in
            <br />
            your pocket.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted sm:text-xl">
            Point your camera and get real feedback on your form, the moment it matters. Not after
            the session. During it.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={onTryDemo}
              className="group flex items-center gap-2 rounded-btn bg-accent px-6 py-3.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              Try the live demo
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={onSeeHow}
              className="flex items-center gap-2 rounded-btn px-4 py-3.5 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              See how it works
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-12">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-muted">
              Trained for
            </p>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((name) => (
                <button
                  key={name}
                  onClick={() => onSelectSport(name)}
                  className="cursor-pointer rounded-full border border-line bg-card px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 hover:text-accent active:translate-y-0 active:scale-95"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3D scene */}
        <div className="relative order-1 h-[320px] w-full sm:h-[440px] lg:order-2 lg:h-[600px]">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <span className="h-3 w-3 animate-ping rounded-full bg-accent/60" />
              </div>
            }
          >
            <SportsScene />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
