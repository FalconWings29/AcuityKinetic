import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Play, Square } from 'lucide-react';
import CameraFeed from './CameraFeed.jsx';
import FeedbackPanel from './FeedbackPanel.jsx';
import { captureFrame } from '../utils/captureFrame.js';
import { speak, stopSpeaking } from '../utils/speechOutput.js';
import { playCueChime, primeAudio } from '../utils/soundFx.js';
import { getCoachingFeedback } from '../utils/coachApi.js';

const STEPS = ['Allow camera access', 'Pick your sport', 'Hit Start Coaching'];

const CAPTURE_INTERVAL_MS = 2500;
const RETRY_DELAY_MS = 5000;

export default function Demo({ sports, selectedSport, onSportChange, showToast }) {
  const videoRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isCoaching, setIsCoaching] = useState(false);
  const [muted, setMuted] = useState(false);
  const [feedback, setFeedback] = useState([]);

  // Refs let the capture loop read the latest values without re-subscribing.
  const lastFeedbackRef = useRef('');
  const mutedRef = useRef(muted);
  const sportRef = useRef(selectedSport);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);
  useEffect(() => {
    sportRef.current = selectedSport;
  }, [selectedSport]);

  // Cancel any in-flight speech if the demo ever unmounts.
  useEffect(() => () => stopSpeaking(), []);

  const onReadyChange = useCallback((ready) => setCameraReady(ready), []);

  // Latest camera-distance status from the pose overlay ('good' | 'close' | 'far' | 'none').
  const distanceRef = useRef('none');
  const onDistanceChange = useCallback((s) => {
    distanceRef.current = s;
  }, []);

  const addFeedback = useCallback((text) => {
    setFeedback((prev) =>
      [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        },
        ...prev,
      ].slice(0, 50)
    );
  }, []);

  // The coaching loop: capture a frame, analyze it, dedupe, render + speak.
  // Self-scheduling so success and failure can use different cadences.
  useEffect(() => {
    if (!isCoaching || !cameraReady) return;

    let cancelled = false;
    let timer;

    const tick = async () => {
      if (cancelled) return;

      // No athlete confidently in frame, so skip the API call (saves quota) and
      // let the on-screen "Step into frame" indicator guide positioning.
      if (distanceRef.current === 'none') {
        timer = setTimeout(tick, CAPTURE_INTERVAL_MS);
        return;
      }

      const frame = captureFrame(videoRef.current);
      if (!frame) {
        timer = setTimeout(tick, CAPTURE_INTERVAL_MS);
        return;
      }

      try {
        const cue = await getCoachingFeedback(frame, sportRef.current);
        if (cancelled) return;
        if (cue && cue !== lastFeedbackRef.current) {
          lastFeedbackRef.current = cue;
          addFeedback(cue);
          if (!mutedRef.current) {
            playCueChime();
            speak(cue);
          }
        }
        timer = setTimeout(tick, CAPTURE_INTERVAL_MS);
      } catch {
        if (cancelled) return;
        showToast('Could not reach the coach, retrying.', 'error');
        timer = setTimeout(tick, RETRY_DELAY_MS);
      }
    };

    timer = setTimeout(tick, CAPTURE_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isCoaching, cameraReady, addFeedback, showToast]); 

  const toggleCoaching = () => {
    if (isCoaching) {
      setIsCoaching(false);
      stopSpeaking();
      return;
    }
    if (!cameraReady) {
      showToast('Camera not ready yet.', 'error');
      return;
    }
    lastFeedbackRef.current = '';
    primeAudio();
    setIsCoaching(true);
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (next) stopSpeaking();
      return next;
    });
  };

  const clearFeed = () => {
    setFeedback([]);
    lastFeedbackRef.current = '';
  };

  return (
    <section id="demo" className="border-t border-line bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-muted">
            Live demo
          </p>
          <h2 className="font-display text-4xl font-bold leading-[0.95] tracking-tight text-bone sm:text-5xl">
            Try it yourself.
          </h2>
          <p className="mt-4 text-muted sm:text-lg">
            Three steps and you are training. Cues show up within a few seconds.
          </p>
          <ol className="mt-6 flex flex-wrap items-center gap-2 text-sm">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="flex items-center gap-2 rounded-btn border border-line bg-card px-3 py-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-ink">
                    {i + 1}
                  </span>
                  <span className="font-medium text-white">{step}</span>
                </span>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 text-muted sm:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: camera */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <label
                htmlFor="sport"
                className="text-xs font-medium uppercase tracking-[0.2em] text-muted"
              >
                Sport
              </label>
              <select
                id="sport"
                value={selectedSport}
                onChange={(e) => onSportChange(e.target.value)}
                disabled={isCoaching}
                className="flex-1 rounded-btn border border-line bg-card px-3 py-2 text-sm text-white outline-none transition-colors focus:border-accent disabled:opacity-50"
              >
                {sports.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <CameraFeed
              videoRef={videoRef}
              isCoaching={isCoaching}
              onReadyChange={onReadyChange}
              onDistanceChange={onDistanceChange}
            />

            <button
              onClick={toggleCoaching}
              disabled={!cameraReady}
              className={`flex items-center justify-center gap-2 rounded-btn px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                isCoaching
                  ? 'border border-red-500/60 bg-transparent text-red-400 hover:bg-red-500/10'
                  : 'bg-accent text-ink hover:opacity-90'
              }`}
            >
              {isCoaching ? (
                <>
                  <Square className="h-4 w-4" fill="currentColor" /> Stop Coaching
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" fill="currentColor" /> Start Coaching
                </>
              )}
            </button>
          </div>

          {/* Right: feedback */}
          <FeedbackPanel
            feedback={feedback}
            muted={muted}
            onToggleMute={toggleMute}
            onClear={clearFeed}
            isCoaching={isCoaching}
          />
        </div>
      </div>
    </section>
  );
}
