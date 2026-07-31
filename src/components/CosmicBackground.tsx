import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// Hex mirror of the --purple-* scale in styles.css (three.js can't read CSS vars).
const PURPLE = { light: "#d8b4fe", base: "#c084fc", deep: "#8b3ff0" } as const;

function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null!);
  const start = useRef(Math.random() * 20);

  useFrame((state) => {
    const t = (state.clock.elapsedTime + start.current) % 8;
    const m = ref.current;
    if (!m) return;
    if (t < 1.5) {
      m.visible = true;
      const k = t / 1.5;
      m.position.set(-15 + k * 30, 6 - k * 8, -10 + Math.sin(start.current) * 4);
      (m.material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI);
    } else {
      m.visible = false;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent />
    </mesh>
  );
}

function NebulaCloud({ position, color, scale }: { position: [number, number, number]; color: string; scale: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.02;
    ref.current.rotation.y = state.clock.elapsedTime * 0.015;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.06} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const { positions, colors } = useMemo(() => {
    const count = 1400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(PURPLE.base),
      new THREE.Color(PURPLE.light),
      new THREE.Color("#e9d5ff"),
      new THREE.Color("#ffffff"),
    ];
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function MouseParallax() {
  useFrame((state) => {
    const x = state.pointer.x * 0.35;
    const y = state.pointer.y * 0.2;
    state.camera.position.x += (x - state.camera.position.x) * 0.04;
    state.camera.position.y += (y - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Three.js cosmic background — animated starfield, particle drift,
 * nebula glow, mouse parallax. Performant, mobile-safe.
 */
export function CosmicBackground() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, oklch(0.22 0.12 305 / 0.45) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, oklch(0.18 0.10 280 / 0.45) 0%, transparent 55%), oklch(0.07 0.03 280)",
        }}
      />
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#08051a", 8, 30]} />
          <Stars radius={80} depth={50} count={4000} factor={4} saturation={0.5} fade speed={0.6} />
          <ParticleField />
          <NebulaCloud position={[-4, 2, -8]} color={PURPLE.deep} scale={6} />
          <NebulaCloud position={[5, -3, -10]} color={PURPLE.base} scale={8} />
          <NebulaCloud position={[0, 4, -12]} color={PURPLE.deep} scale={5} />
          <ShootingStar />
          <ShootingStar />
          <MouseParallax />
        </Suspense>
      </Canvas>
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.20 305 / 0.55), transparent 70%)" }}
      />
    </div>
  );
}
