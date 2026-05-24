'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function Globe() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * .15; });
  return (
    <Sphere ref={ref} args={[1.6, 64, 64]}>
      <MeshDistortMaterial color="#3b82f6" attach="material" distort={0.35} speed={1.5} roughness={0.1} metalness={0.8} wireframe />
    </Sphere>
  );
}

function FloatingIcon({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
      <mesh position={position}>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} metalness={0.9} roughness={0.2} />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#3b82f6" />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#06b6d4" />
        <Stars radius={50} depth={50} count={1500} factor={3} fade speed={1} />
        <Globe />
        <FloatingIcon position={[2.5, 1.5, 0]} color="#06b6d4" />
        <FloatingIcon position={[-2.5, 1.2, 0.5]} color="#f97316" />
        <FloatingIcon position={[2.2, -1.4, 0.3]} color="#22c55e" />
        <FloatingIcon position={[-2.2, -1.5, -0.3]} color="#9333ea" />
        <FloatingIcon position={[0, 2.4, -0.2]} color="#eab308" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Suspense>
    </Canvas>
  );
}
