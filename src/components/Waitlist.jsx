import { useState } from 'react';
import { joinWaitlist } from '../utils/waitlist.js';

export default function Waitlist({ showToast }) {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      showToast('Enter a valid email address.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await joinWaitlist(trimmed);
      setEmail('');
      showToast("You're on the list.", 'success');
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="border-t border-line bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Get early access
        </h2>
        <p className="mt-4 leading-relaxed text-muted">
          Acuity Kinetic is in private beta with a small group of athletes, and we are opening more
          spots soon. Leave your email and we will reach out when it is your turn.
        </p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            disabled={submitting}
            className="flex-1 rounded-btn border border-line bg-card px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-accent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-btn bg-accent px-6 py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Joining…' : 'Join Waitlist'}
          </button>
        </form>
      </div>
    </section>
  );
}
