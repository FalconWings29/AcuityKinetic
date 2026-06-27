import { useEffect, useState } from 'react';

const LINKS = [
  { label: 'Demo', id: 'demo' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Pipeline', id: 'pipeline' },
];

// Fixed top bar. Stays transparent over the hero and picks up a blurred ink
// background once the page scrolls, so it never fights the 3D scene behind it.
export default function Nav({ onNavigate, onJoin }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-line bg-ink/80 backdrop-blur-md'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <button
          onClick={() => onNavigate('top')}
          className="font-display text-lg font-bold tracking-tight text-bone"
        >
          Acuity <span className="text-accent">Kinetic</span>
        </button>

        <div className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => onNavigate(l.id)}
              className="text-sm text-muted transition-colors hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </div>

        <button
          onClick={onJoin}
          className="rounded-btn bg-accent px-4 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-90"
        >
          Join waitlist
        </button>
      </nav>
    </header>
  );
}
