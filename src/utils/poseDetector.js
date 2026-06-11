// Pose detection via MediaPipe Tasks Vision. Runs fully in-browser (WASM/GPU),
// no API cost. Lazily code-split so the ~1MB library only loads when the demo
// actually starts. Used for two things:
//   1. drawing a live skeleton "net" over the video
//   2. estimating how far the athlete is from the camera (framing)

// Pin the WASM bundle to the installed package version to avoid drift.
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
// 'full' is markedly more accurate than 'lite'. Swap to 'pose_landmarker_heavy'
// for the most accurate (and slowest) variant. The model always outputs 33
// BlazePose landmarks; we densify the drawn net below for a finer-looking map.
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task';

let modPromise = null;
let landmarkerPromise = null;

function loadModule() {
  if (!modPromise) modPromise = import('@mediapipe/tasks-vision');
  return modPromise;
}

// Singleton: one landmarker shared across the app, created once.
export function getPoseLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      const { FilesetResolver, PoseLandmarker } = await loadModule();
      const vision = await FilesetResolver.forVisionTasks(WASM_URL);
      return PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
      });
    })().catch((err) => {
      // Reset so a later attempt can retry instead of caching the failure.
      landmarkerPromise = null;
      throw err;
    });
  }
  return landmarkerPromise;
}

// Returns a function that paints the skeleton net for one set of landmarks onto
// the given 2D context. Colors use the brand accent green.
export async function makeSkeletonDrawer(ctx) {
  const { DrawingUtils, PoseLandmarker } = await loadModule();
  const utils = new DrawingUtils(ctx);
  const connections = PoseLandmarker.POSE_CONNECTIONS;
  return (landmarks) => {
    utils.drawConnectors(landmarks, connections, {
      color: 'rgba(0, 255, 133, 0.7)',
      lineWidth: 3,
    });
    // Densify: interpolate extra points along every bone so the map shows far
    // more nodes than the model's 33 raw landmarks.
    const dense = [];
    for (const c of connections) {
      const a = landmarks[c.start];
      const b = landmarks[c.end];
      if (!a || !b) continue;
      for (const f of [0.25, 0.5, 0.75]) {
        dense.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, z: 0 });
      }
    }
    utils.drawLandmarks(dense, { color: 'rgba(0, 255, 133, 0.85)', radius: 1.6 });
    utils.drawLandmarks(landmarks, {
      color: '#00FF85',
      fillColor: '#0A0A0A',
      lineWidth: 1,
      radius: 4,
    });
  };
}

// BlazePose landmark indices we rely on.
const L_SHOULDER = 11;
const R_SHOULDER = 12;

// Distance bands keyed off apparent shoulder width (normalized 0–1). Shoulder
// width is a robust, rotation-tolerant proxy for distance: closer => wider.
// Tunable: widen or narrow to taste.
const TOO_CLOSE = 0.42;
const TOO_FAR = 0.14;

// Estimate framing from a single pose. Returns { status, shoulderWidth }.
// status: 'good' | 'close' | 'far' | 'none' (no confident athlete in frame).
export function estimateDistance(landmarks) {
  if (!landmarks || landmarks.length < 33) return { status: 'none' };
  const ls = landmarks[L_SHOULDER];
  const rs = landmarks[R_SHOULDER];
  if ((ls?.visibility ?? 0) < 0.5 || (rs?.visibility ?? 0) < 0.5) {
    return { status: 'none' };
  }
  const shoulderWidth = Math.hypot(ls.x - rs.x, ls.y - rs.y);
  return { status: classifyWidth(shoulderWidth), shoulderWidth };
}

export function classifyWidth(width) {
  if (width == null) return 'none';
  if (width > TOO_CLOSE) return 'close';
  if (width < TOO_FAR) return 'far';
  return 'good';
}
