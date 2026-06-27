import { motion } from 'framer-motion';
import { Eye, Volume2, Target } from 'lucide-react';

const ITEMS = [
  {
    n: '01',
    icon: Eye,
    title: 'It watches how you move',
    body: 'Every frame from your camera runs through an on-device pose model that tracks 140 points across your body. From those points the app measures joint angles, balance, and how your posture shifts through a rep, the same signals a coach reads by eye.',
  },
  {
    n: '02',
    icon: Volume2,
    title: 'It talks you through the fix',
    body: 'When a rep drifts, a model returns one short correction and your browser reads it aloud. Repeats are filtered out, so you only hear something when it actually changes. No charts, no replays, just the cue that matters while you can still act on it.',
  },
  {
    n: '03',
    icon: Target,
    title: 'It speaks your sport',
    body: 'A jump shot and a deadlift break down in different ways. The instructions sent with every frame are tuned to the sport you pick, so each movement is judged against the mechanics that matter for that discipline rather than a generic checklist.',
  },
];

export default function Capabilities() {
  return (
    <section id="how-it-works" className="border-t border-line bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-12 max-w-2xl sm:mb-16"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-muted">
            What it does
          </p>
          <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-bone sm:text-6xl">
            Three parts of every session.
          </h2>
        </motion.div>

        <div className="flex flex-col">
          {ITEMS.map((item) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-90px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="grid gap-5 border-t border-line py-10 sm:py-14 lg:grid-cols-[12rem_1fr] lg:gap-14"
            >
              <span
                className="font-display text-7xl font-bold leading-none text-transparent sm:text-8xl"
                style={{ WebkitTextStroke: '1.5px #2A2A2A' }}
                aria-hidden="true"
              >
                {item.n}
              </span>

              <div className="max-w-2xl">
                <item.icon className="h-7 w-7 text-accent" strokeWidth={1.75} />
                <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-bone sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-4 leading-relaxed text-muted sm:text-lg">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
