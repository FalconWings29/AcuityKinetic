import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Trash2, Volume2, VolumeX } from 'lucide-react';

export default function FeedbackPanel({
  feedback,
  muted,
  onToggleMute,
  onClear,
  isCoaching,
}) {
  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-accent" strokeWidth={2} />
          <h3 className="font-display text-sm font-semibold">Live Feedback</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute coaching audio' : 'Mute coaching audio'}
            className={`flex items-center gap-1.5 rounded-btn border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              muted
                ? 'border-line text-muted hover:text-white'
                : 'border-accent/40 text-accent'
            }`}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
            {muted ? 'Muted' : 'Sound on'}
          </button>
          <button
            onClick={onClear}
            disabled={feedback.length === 0}
            className="flex items-center gap-1.5 rounded-btn border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Feed
          </button>
        </div>
      </div>

      {/* Feed */}
      <div
        className="feed-scroll flex-1 overflow-y-auto p-4"
        style={{ minHeight: 320 }}
        aria-label="AI coaching feedback"
        aria-live="polite"
        aria-relevant="additions"
      >
        {feedback.length === 0 ? (
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center">
            <p className="text-sm text-muted">
              {isCoaching ? 'Analyzing your form…' : 'Start coaching to see live cues.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {feedback.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="rounded-card border border-line bg-ink p-4"
                >
                  <p className="text-sm leading-relaxed text-white">{item.text}</p>
                  <p className="mt-2 text-xs text-muted">{item.time}</p>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
