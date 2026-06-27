import { SPORTS } from '../utils/sports.js';

// A running band of the supported sports. Two copies of the list sit side by
// side and the CSS marquee shifts the track by exactly half its width, so the
// loop is seamless.
export default function Marquee() {
  const lane = [...SPORTS, ...SPORTS];
  return (
    <div className="overflow-hidden border-y border-line bg-ink py-5 sm:py-6">
      <div className="flex w-max animate-marquee items-center whitespace-nowrap will-change-transform">
        {lane.map((sport, i) => (
          <span
            key={i}
            className="flex items-center font-display text-2xl font-bold uppercase tracking-tight text-bone sm:text-3xl"
          >
            <span className="mx-7 sm:mx-10">{sport}</span>
            <span className="text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
