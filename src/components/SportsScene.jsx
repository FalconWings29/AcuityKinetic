import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { basketballTexture, pebbleBump, dimpleBump, stringTexture } from '../utils/proceduralTextures.js';

const CYCLE_MS = 4200;

// ---- Models (procedural, no external assets) ----

function Basketball() {
  const map = useMemo(() => basketballTexture(), []);
  const bump = useMemo(() => pebbleBump(), []);
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial
          map={map}
          bumpMap={bump}
          bumpScale={0.022}
          roughness={0.78}
          metalness={0.04}
          envMapIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function TennisBall({ scale = 1, position = [0, 0, 0] }) {
  const bump = useMemo(() => pebbleBump(), []);
  const seam = useMemo(() => {
    const pts = [];
    const N = 180;
    const amp = 0.62;
    for (let i = 0; i < N; i++) {
      const lon = (i / N) * Math.PI * 2;
      const lat = amp * Math.sin(2 * lon);
      const cl = Math.cos(lat);
      pts.push(
        new THREE.Vector3(cl * Math.cos(lon) * 1.004, Math.sin(lat) * 1.004, cl * Math.sin(lon) * 1.004)
      );
    }
    return new THREE.CatmullRomCurve3(pts, true);
  }, []);
  return (
    <group scale={scale} position={position}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#cbe53a"
          roughness={0.98}
          metalness={0}
          bumpMap={bump}
          bumpScale={0.014}
        />
      </mesh>
      <mesh>
        <tubeGeometry args={[seam, 200, 0.03, 10, true]} />
        <meshStandardMaterial color="#f4f4f0" roughness={0.7} />
      </mesh>
    </group>
  );
}

function TennisRacket() {
  const strings = useMemo(() => stringTexture(), []);
  return (
    <group rotation={[0.12, -0.35, 0.22]}>
      <mesh scale={[1, 1.25, 1]}>
        <torusGeometry args={[0.58, 0.045, 24, 100]} />
        <meshStandardMaterial color="#1f6fe0" roughness={0.3} metalness={0.45} envMapIntensity={0.9} />
      </mesh>
      <mesh scale={[1, 1.25, 1]}>
        <circleGeometry args={[0.56, 64]} />
        <meshStandardMaterial
          map={strings}
          transparent
          alphaTest={0.4}
          side={THREE.DoubleSide}
          roughness={0.55}
        />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.85, 18]} />
        <meshStandardMaterial color="#1f6fe0" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, -1.62, 0]}>
        <cylinderGeometry args={[0.075, 0.07, 0.6, 18]} />
        <meshStandardMaterial color="#161616" roughness={0.95} />
      </mesh>
    </group>
  );
}

function GolfBall({ scale = 1, position = [0, 0, 0] }) {
  const dimple = useMemo(() => dimpleBump(), []);
  return (
    <mesh scale={scale} position={position}>
      <sphereGeometry args={[1, 96, 96]} />
      <meshPhysicalMaterial
        color="#f7f7f5"
        roughness={0.32}
        metalness={0.02}
        clearcoat={0.6}
        clearcoatRoughness={0.3}
        bumpMap={dimple}
        bumpScale={0.05}
        envMapIntensity={0.7}
      />
    </mesh>
  );
}

function GolfPutter() {
  return (
    <group rotation={[0.08, -0.4, 0.12]}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.022, 0.028, 2.4, 24]} />
        <meshStandardMaterial color="#c9ccd1" roughness={0.2} metalness={0.95} envMapIntensity={1} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.05, 0.044, 0.62, 20]} />
        <meshStandardMaterial color="#00FF85" roughness={0.85} />
      </mesh>
      <group position={[0.18, -0.72, 0.02]}>
        <mesh>
          <boxGeometry args={[0.5, 0.11, 0.17]} />
          <meshStandardMaterial color="#00FF85" roughness={0.35} metalness={0.3} envMapIntensity={1} />
        </mesh>
      </group>
    </group>
  );
}

// ---- Stage: cross-fades between the three sports ----

const STAGES = [
  { kind: 'basketball', base: 1.05, render: () => <Basketball /> },
  {
    kind: 'tennis',
    base: 0.84,
    render: () => (
      <>
        <TennisRacket />
        <TennisBall scale={0.28} position={[0.85, -0.5, 0.4]} />
      </>
    ),
  },
  {
    kind: 'golf',
    base: 0.92,
    render: () => (
      <>
        <GolfPutter />
        <GolfBall scale={0.26} position={[0.55, -1.02, 0.35]} />
      </>
    ),
  },
];

function SportGroup({ active, kind, base, children }) {
  const outer = useRef();
  useFrame((state, delta) => {
    const g = outer.current;
    if (!g) return;
    const d = Math.min(delta, 0.05);
    const target = active ? 1 : 0;
    const s = THREE.MathUtils.lerp(g.scale.x, target, 1 - Math.pow(0.0001, d));
    g.scale.setScalar(s);
    g.visible = s > 0.01;
    if (!g.visible) return;

    const t = state.clock.elapsedTime;
    if (kind === 'basketball') {
      g.rotation.y += d * 0.6;
      const bounce = Math.abs(Math.sin(t * 2.3));
      g.position.y = -0.35 + bounce * 0.7;
    } else {
      g.rotation.y += d * 0.45;
      g.position.y = Math.sin(t * 1.1) * 0.08;
      g.rotation.x = Math.sin(t * 0.7) * 0.05;
    }
  });

  return (
    <group ref={outer} scale={0}>
      <group scale={base}>{children}</group>
    </group>
  );
}

function Stage() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STAGES.length), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
      {STAGES.map((s, i) => (
        <SportGroup key={s.kind} active={active === i} kind={s.kind} base={s.base}>
          {s.render()}
        </SportGroup>
      ))}
    </Float>
  );
}

export default function SportsScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 6], fov: 38 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={2.1} />
      <directionalLight position={[-6, 1, -2]} intensity={0.7} color="#00ff85" />
      <pointLight position={[0, 2.5, 3]} intensity={0.35} />
      <Suspense fallback={null}>
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={2.2} position={[0, 2, 3]} scale={[4, 4, 1]} color="#ffffff" />
          <Lightformer intensity={1.1} position={[-3, 0, 2]} scale={[3, 3, 1]} color="#ffffff" />
          <Lightformer intensity={1} position={[3, 1.5, 1]} scale={[3, 3, 1]} color="#9effc9" />
        </Environment>
        <Stage />
        <ContactShadows position={[0, -1.7, 0]} opacity={0.45} scale={9} blur={2.6} far={4.5} />
      </Suspense>
    </Canvas>
  );
}
