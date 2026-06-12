import { AnimatePresence, motion } from 'framer-motion';

export default function Toast({ toast }) {
  const assertive = toast?.type === 'error';
  return (
    // Persistent live region: it must already exist (empty) before its content
    // changes, or screen readers won't reliably announce the toast.
    <div
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex justify-center px-4"
      role={assertive ? 'alert' : 'status'}
      aria-live={assertive ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto rounded-btn border px-4 py-3 text-sm font-medium ${
              toast.type === 'error'
                ? 'border-red-500/50 bg-card text-red-400'
                : 'border-accent/50 bg-card text-accent'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
