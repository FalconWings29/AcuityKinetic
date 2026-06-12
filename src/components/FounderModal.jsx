import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { joinWaitlist, markWaitlistJoined } from '../utils/waitlist.js';

export default function FounderModal({ onClose, onJoined, showToast }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Escape to close. Scroll lock is managed in App.jsx so it restores
  // immediately on close rather than waiting for the exit animation to unmount.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      showToast('Enter a valid email address.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await joinWaitlist(trimmed);
      markWaitlistJoined();
      showToast("You're on the list. Talk soon.", 'success');
      onJoined();
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="A note from the founder"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-card border border-line bg-card p-7 sm:p-9"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-btn border border-line text-muted transition-colors hover:border-white/40 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          A note from the founder
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Hey, I'm Azaan
        </h2>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
          <p>
            I'm a rising sophomore who has played sports my whole life. Basketball, Tae Kwon Do,
            Soccer, Tennis, Swimming, you name it. There were so many times I'd walk off the court
            or out of the gym and just think "why am I not getting better?" and have no real answer.
          </p>
          <p>
            That's why I built Acuity Kinetic. I wanted something that actually watches you and
            tells you what's wrong, right when it matters.
          </p>
          <p>
            It's just me building this right now and it's still early. I'd love for you to be part
            of it from the start.
          </p>
        </div>

        <div className="mt-5 rounded-card border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed text-white">
          Sign up for the waitlist today and I'll give you{' '}
          <span className="text-accent">1 month of free Pro access</span> when we officially launch.
          No credit card necessary.
        </div>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            disabled={submitting}
            className="flex-1 rounded-btn border border-line bg-ink px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-btn bg-accent px-5 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? (
              'Joining…'
            ) : (
              <>
                Join the Waitlist <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">~Azaan, Founder of Acuity Kinetic</p>
      </motion.div>
    </motion.div>
  );
}
