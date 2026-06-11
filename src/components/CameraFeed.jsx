import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import {
  getPoseLandmarker,
  makeSkeletonDrawer,
  estimateDistance,
  classifyWidth,
} from '../utils/poseDetector.js';

// How often to run pose detection (ms). ~20fps feels live without pinning the CPU.
const DETECT_INTERVAL_MS = 50;
// Smoothing factor for the distance metric (lower = steadier, less flicker).
const EMA_ALPHA = 0.3;

const DISTANCE_UI = {
  good: { label: 'Good distance', dot: 'bg-accent', text: 'text-accent' },
  close: { label: 'Move back', dot: 'bg-amber-400', text: 'text-amber-400' },
  far: { label: 'Move closer', dot: 'bg-amber-400', text: 'text-amber-400' },
  none: { label: 'Step into frame', dot: 'bg-muted', text: 'text-muted' },
};

// Owns the webcam lifecycle. The <video> ref is supplied by the parent (Demo)
// so it can grab frames from the live stream for analysis. Also runs on-device
// pose detection to draw a skeleton overlay and report camera distance.
export default function CameraFeed({ videoRef, isCoaching, onReadyChange, onDistanceChange }) {
  const [status, setStatus] = useState('loading'); // loading | ready | denied | error
  const [distance, setDistance] = useState('none'); // good | close | far | none
  const overlayRef = useRef(null);

  // Keep the latest callback without re-subscribing the detection loop.
  const onDistanceChangeRef = useRef(onDistanceChange);
  useEffect(() => {
    onDistanceChangeRef.current = onDistanceChange;
  }, [onDistanceChange]);

  // --- Webcam lifecycle ---
  useEffect(() => {
    let stream;
    let active = true;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('error');
        onReadyChange?.(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStatus('ready');
        onReadyChange?.(true);
      } catch (err) {
        if (!active) return;
        setStatus(err?.name === 'NotAllowedError' ? 'denied' : 'error');
        onReadyChange?.(false);
      }
    }

    start();

    return () => {
      active = false;
      onReadyChange?.(false);
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [videoRef, onReadyChange]);

  // --- Pose detection + skeleton overlay (runs once the camera is live) ---
  useEffect(() => {
    if (status !== 'ready') return;

    let active = true;
    let raf = 0;
    let landmarker = null;
    let drawSkeleton = null;
    let lastTs = -1;
    let lastRun = 0;
    let ema = null;
    let emitted = null;

    const setStatusOut = (s) => {
      if (s === emitted) return;
      emitted = s;
      setDistance(s);
      onDistanceChangeRef.current?.(s);
    };

    (async () => {
      try {
        landmarker = await getPoseLandmarker();
        const ctx = overlayRef.current?.getContext('2d');
        if (!ctx) return;
        drawSkeleton = await makeSkeletonDrawer(ctx);
      } catch {
        return; // pose unavailable, video still works, just no overlay
      }
      if (!active) return;

      const loop = () => {
        if (!active) return;
        raf = requestAnimationFrame(loop);

        const video = videoRef.current;
        const canvas = overlayRef.current;
        if (!video || !canvas || !video.videoWidth) return;

        const now = performance.now();
        if (now - lastRun < DETECT_INTERVAL_MS) return;
        lastRun = now;

        // detectForVideo requires strictly increasing timestamps.
        let ts = now;
        if (ts <= lastTs) ts = lastTs + 1;
        lastTs = ts;

        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        let result;
        try {
          result = landmarker.detectForVideo(video, ts);
        } catch {
          return;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const lm = result.landmarks?.[0];
        if (lm) {
          drawSkeleton(lm);
          const { status: raw, shoulderWidth } = estimateDistance(lm);
          if (raw === 'none' || shoulderWidth == null) {
            setStatusOut('none');
          } else {
            ema = ema == null ? shoulderWidth : ema * (1 - EMA_ALPHA) + shoulderWidth * EMA_ALPHA;
            setStatusOut(classifyWidth(ema));
          }
        } else {
          ema = null;
          setStatusOut('none');
        }
      };

      loop();
    })();

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      const canvas = overlayRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      setDistance('none');
      onDistanceChangeRef.current?.('none');
    };
  }, [status, videoRef]);

  const glow = isCoaching && status === 'ready';
  const d = DISTANCE_UI[distance] ?? DISTANCE_UI.none;

  return (
    <div
      className="relative overflow-hidden rounded-card border border-line bg-black"
      style={
        glow
          ? { boxShadow: '0 0 0 1px #00FF85, 0 0 28px rgba(0, 255, 133, 0.35)' }
          : undefined
      }
    >
      {/* Mirrored for a natural selfie view; capture reads the true frame from the stream */}
      <video
        ref={videoRef}
        playsInline
        muted
        aria-label={isCoaching ? 'Live camera feed, coaching active' : 'Live camera feed'}
        className="aspect-video w-full bg-black object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Skeleton net overlay, mirrored to align with the mirrored video */}
      <canvas
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* REC indicator */}
      {isCoaching && status === 'ready' && (
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-btn bg-black/60 px-2.5 py-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-white">REC</span>
        </div>
      )}

      {/* Distance / framing indicator */}
      {status === 'ready' && (
        <div
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-btn bg-black/60 px-3 py-1.5"
          role="status"
          aria-live="polite"
        >
          <span className={`h-2 w-2 rounded-full ${d.dot}`} />
          <span className={`text-xs font-semibold tracking-wide ${d.text}`}>{d.label}</span>
        </div>
      )}

      {/* Permission / error overlays */}
      {status !== 'ready' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/95 p-6 text-center">
          {status === 'loading' && (
            <>
              <Camera className="h-7 w-7 text-muted" />
              <p className="text-sm text-muted">Requesting camera access…</p>
            </>
          )}
          {status === 'denied' && (
            <>
              <CameraOff className="h-7 w-7 text-red-500" />
              <p className="max-w-xs text-sm text-white">
                Camera access required. Enable it in your browser settings.
              </p>
            </>
          )}
          {status === 'error' && (
            <>
              <CameraOff className="h-7 w-7 text-red-500" />
              <p className="max-w-xs text-sm text-white">
                No camera available. Connect a camera and reload the page.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
