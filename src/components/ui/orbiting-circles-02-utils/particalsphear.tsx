"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Particle sphere globe for the orbit center. Source particalsphear.tsx wasn't
// provided, so this rebuilds an equivalent with the repo's three.js/@react-three
// stack, tinted to the brand purple.
function ParticleSphere() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 1400;
    const arr = new Float32Array(count * 3);
    // Fibonacci sphere for an even surface distribution.
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = i * 2.399963229728653; // golden angle
      arr[i * 3] = Math.cos(theta) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.14;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        sizeAttenuation
        color="#c084fc"
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleSphereAnimation() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.6], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ background: "transparent" }}
    >
      <ParticleSphere />
    </Canvas>
  );
}
