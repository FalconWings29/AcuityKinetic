import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { joinWaitlist, markWaitlistJoined } from '../utils/waitlist.js';

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
      markWaitlistJoined();
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
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="overflow-hidden rounded-card border border-line bg-card">
          <div className="grid gap-8 p-8 sm:p-14 lg:grid-cols-2 lg:items-center lg:gap-14">
            <div>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-accent">
                Early access
              </p>
              <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-bone sm:text-6xl">
                Get in early.
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted sm:text-lg">
                Acuity Kinetic is in private beta with a small group of athletes, and we are opening
                more spots soon. Leave your email and we will reach out when it is your turn.
              </p>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                disabled={submitting}
                className="w-full rounded-btn border border-line bg-ink px-4 py-3.5 text-sm text-white outline-none transition-colors placeholder:text-muted focus:border-accent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-btn bg-accent px-6 py-3.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? (
                  'Joining…'
                ) : (
                  <>
                    Join the waitlist <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="text-xs text-muted">No spam. Just one note when your spot opens.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
