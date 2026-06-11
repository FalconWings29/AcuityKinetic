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
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-16 max-w-xl sm:mb-24"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            What it does
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Three parts of every session.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-16 sm:gap-28">
          {ITEMS.map((item, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={item.n} className="grid items-center gap-4 lg:grid-cols-2 lg:gap-12">
                <motion.div
                  initial={{ opacity: 0, x: flip ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-90px' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className={`flex justify-center ${flip ? 'lg:order-2 lg:justify-end' : 'lg:justify-start'}`}
                >
                  <span
                    className="font-display text-[6rem] font-extrabold leading-none text-transparent sm:text-[11rem]"
                    style={{ WebkitTextStroke: '1.5px #262626' }}
                    aria-hidden="true"
                  >
                    {item.n}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-90px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.08 }}
                  className={`rounded-card border border-line bg-card p-8 sm:p-10 ${
                    flip ? 'lg:order-1' : ''
                  }`}
                >
                  <item.icon className="h-7 w-7 text-accent" strokeWidth={1.75} />
                  <h3 className="mt-5 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-muted">{item.body}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
