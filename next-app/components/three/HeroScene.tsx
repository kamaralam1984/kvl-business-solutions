'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Text } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Three rotating label sets — Option A → B → C → A...
const labelSets = [
  // Option A — KVL Services
  ['SOFTWARE', 'GPS', 'AUTOMATION', 'AI', 'CCTV'],
  // Option B — Key Stats
  ['1000+', '99.5%', '500+', '₹2.4Cr', '4.8★'],
  // Option C — Tech keywords
  ['SaaS', 'Cloud', 'API', 'AI', 'GST'],
];

const SET_INTERVAL_MS = 4000;

function Globe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.15; });
  return (
    <Sphere ref={ref} args={[1.6, 64, 64]}>
      <MeshDistortMaterial color="#3b82f6" attach="material" distort={0.35} speed={1.5} roughness={0.1} metalness={0.8} wireframe />
    </Sphere>
  );
}

function FloatingIcon({ position, color, label }: { position: [number, number, number]; color: string; label: string }) {
  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
      <group position={position}>
        {/* 3D shape (icosahedron) */}
        <mesh>
          <icosahedronGeometry args={[0.28, 0]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.9} roughness={0.2} />
        </mesh>
        {/* 3D Text label below the shape */}
        <Text
          position={[0, -0.55, 0]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
          outlineOpacity={0.6}
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

export function HeroScene() {
  const [setIdx, setSetIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSetIdx(i => (i + 1) % labelSets.length), SET_INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  const labels = labelSets[setIdx];

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#3b82f6" />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#06b6d4" />
        <Stars radius={50} depth={50} count={1500} factor={3} fade speed={1} />
        <Globe />

        {/* 5 floating icons with rotating labels */}
        <FloatingIcon position={[2.5, 1.5, 0]}    color="#06b6d4" label={labels[0]} />
        <FloatingIcon position={[-2.5, 1.2, 0.5]} color="#f97316" label={labels[1]} />
        <FloatingIcon position={[2.2, -1.4, 0.3]} color="#22c55e" label={labels[2]} />
        <FloatingIcon position={[-2.2, -1.5, -0.3]} color="#9333ea" label={labels[3]} />
        <FloatingIcon position={[0, 2.4, -0.2]}   color="#eab308" label={labels[4]} />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Suspense>
    </Canvas>
  );
}
