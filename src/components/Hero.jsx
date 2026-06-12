import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { SPORTS } from '../utils/sports.js';

// The 3D scene is heavy (three.js), so load it on its own chunk after paint.
const SportsScene = lazy(() => import('./SportsScene.jsx'));

export default function Hero({ onTryDemo, onSeeHow, onSelectSport }) {
  return (
    <header className="relative overflow-hidden">
      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-lg font-bold tracking-tight">
          Acuity <span className="text-accent">Kinetic</span>
        </span>
        <button
          onClick={onTryDemo}
          className="rounded-btn border border-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/40"
        >
          Try the demo
        </button>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-6 pb-16 pt-8 lg:grid-cols-2 lg:gap-4 lg:pb-24 lg:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="order-2 lg:order-1"
        >
          <p className="mb-6 inline-flex items-center gap-2 rounded-btn border border-line bg-card px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Now in private beta
          </p>
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            A coach in your pocket.
            <br />
            <span className="text-accent">Real feedback, in real time.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">Point your camera. Get coached.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={onTryDemo}
              className="rounded-btn bg-accent px-6 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              Try the live demo
            </button>
            <button
              onClick={onSeeHow}
              className="flex items-center gap-2 rounded-btn px-4 py-3 text-sm font-medium text-muted transition-colors hover:text-white"
            >
              See how it works
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
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
        <div className="relative order-1 h-[340px] w-full sm:h-[440px] lg:order-2 lg:h-[560px]">
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
      </section>
    </header>
  );
}
