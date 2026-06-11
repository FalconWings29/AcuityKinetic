export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-8 sm:flex-row sm:items-center">
        <span className="font-display text-sm font-bold tracking-tight">
          Acuity <span className="text-accent">Kinetic</span>
        </span>
        <p className="text-sm text-muted">© 2026 Acuity Kinetic. All rights reserved.</p>
      </div>
    </footer>
  );
}
