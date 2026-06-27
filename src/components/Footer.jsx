export default function Footer({ onNavigate }) {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-10 border-b border-line pb-12 sm:flex-row sm:items-end sm:justify-between">
          <button
            onClick={() => onNavigate('top')}
            className="text-left font-display text-5xl font-bold leading-[0.9] tracking-tight text-bone sm:text-7xl"
          >
            Acuity
            <br />
            <span className="text-accent">Kinetic</span>
          </button>

          <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm">
            <button
              onClick={() => onNavigate('demo')}
              className="text-muted transition-colors hover:text-white"
            >
              Demo
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="text-muted transition-colors hover:text-white"
            >
              How it works
            </button>
            <button
              onClick={() => onNavigate('pipeline')}
              className="text-muted transition-colors hover:text-white"
            >
              Pipeline
            </button>
            <button
              onClick={() => onNavigate('waitlist')}
              className="text-muted transition-colors hover:text-white"
            >
              Waitlist
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">© 2026 Acuity Kinetic. All rights reserved.</p>
          <p className="text-sm text-muted">For athletes, by an athlete.</p>
        </div>
      </div>
    </footer>
  );
}
