import { motion } from 'framer-motion';
import { Camera, ScanLine, Cpu, MessageSquare, Volume2, RefreshCw } from 'lucide-react';

const STEPS = [
  {
    icon: Camera,
    title: 'Capture a frame',
    tag: 'every ~2.5s',
    body: 'A single frame is pulled from your live camera and scaled down to a compact JPEG, small enough to move fast but detailed enough to read your form.',
  },
  {
    icon: ScanLine,
    title: 'Check your framing',
    tag: 'on-device',
    body: 'A pose model maps 140 body points right in the browser and confirms you are in shot and at a workable distance. If no athlete is found, the frame is dropped before anything leaves your device.',
  },
  {
    icon: Cpu,
    title: 'Send it for analysis',
    tag: 'sport-tuned prompt',
    body: 'The frame goes to a vision model along with instructions written for the sport you selected, asking for the single most important correction visible in that moment.',
  },
  {
    icon: MessageSquare,
    title: 'Get one clear cue',
    tag: '≤ 15 words',
    body: 'The model replies with one short instruction rather than a paragraph. Identical back-to-back cues are discarded, so the feed only updates when something genuinely changes.',
  },
  {
    icon: Volume2,
    title: 'Deliver the feedback',
    tag: 'spoken + logged',
    body: 'The cue lands at the top of your feed with a timestamp and is read aloud through the browser, unless you have muted it, so you can keep your eyes on the work.',
  },
];

export default function Pipeline() {
  return (
    <section id="pipeline" className="border-t border-line bg-ink">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-14 max-w-xl"
        >
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Under the hood
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
            What happens on every frame.
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            The same loop runs a few times a minute while you train. Each pass takes one frame from
            capture to a spoken cue.
          </p>
        </motion.div>

        <ol className="relative space-y-8">
          {/* Connecting rail */}
          <div className="absolute bottom-6 left-5 top-6 w-px bg-line" aria-hidden="true" />

          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.06 }}
              className="relative flex gap-5"
            >
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-ink text-sm font-semibold text-accent">
                {i + 1}
              </div>
              <div className="pt-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <step.icon className="h-4 w-4 text-accent" strokeWidth={2} />
                  <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                  <span className="rounded-btn border border-line px-2 py-0.5 text-[11px] font-medium text-muted">
                    {step.tag}
                  </span>
                </div>
                <p className="mt-2 max-w-xl leading-relaxed text-muted">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-12 flex items-center gap-2 text-sm text-muted"
        >
          <RefreshCw className="h-4 w-4 shrink-0 text-muted" />
          If a request fails or times out, a brief notice appears and the loop retries on its own.
        </motion.p>
      </div>
    </section>
  );
}
