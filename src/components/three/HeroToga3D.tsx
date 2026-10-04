"use client";

import React, { useRef, useState, useCallback } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { GraduationCap } from "lucide-react";
import { HeroTogaFallback } from "./HeroTogaFallback";

export interface HeroToga3DProps {
  onGraduate?: () => void;
}

// Physics state for tassel spring/pendulum
interface TasselPhysics {
  angle: number;       // current angle (radians)
  velocity: number;    // angular velocity
  targetAngle: number; // target resting angle
}

// Side: left = -Math.PI * 0.75, right = Math.PI * 0.75
const SIDE_LEFT = -Math.PI * 0.75;
const SIDE_RIGHT = Math.PI * 0.75;
const SPRING_K = 8;      // spring stiffness
const DAMPING = 4.5;     // damping coefficient

function Tassel({
  physics,
  onClick,
}: {
  physics: React.MutableRefObject<TasselPhysics>;
  onClick: () => void;
}) {
  const tasselRef = useRef<THREE.Group>(null);
  const sway = useRef(0);

  useFrame((_, delta) => {
    if (!tasselRef.current) return;
    const p = physics.current;

    // Spring physics: F = -k*(angle - target) - damping*velocity
    const force = -SPRING_K * (p.angle - p.targetAngle) - DAMPING * p.velocity;
    p.velocity += force * delta;
    p.angle += p.velocity * delta;

    // Gentle idle sway
    sway.current += delta * 1.2;

    // Position tassel pivot on mortarboard edge
    // angle 0 = front, sweeps left/right
    const radius = 0.72;
    const px = Math.sin(p.angle) * radius;
    const pz = Math.cos(p.angle) * radius * 0.4;

    tasselRef.current.position.set(px, 0.41, pz);
    // Lean the tassel in the direction it's going
    tasselRef.current.rotation.z = -(p.angle * 0.4);
    tasselRef.current.rotation.x = Math.sin(sway.current) * 0.03;
  });

  return (
    <group
      ref={tasselRef}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* String from button down */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Tassel charm/knot sphere */}
      <mesh position={[0, -0.52, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Tassel fringe cone */}
      <mesh position={[0, -0.72, 0]}>
        <coneGeometry args={[0.1, 0.4, 12, 1, true]} />
        <meshStandardMaterial
          color="#F59E0B"
          roughness={0.6}
          metalness={0.1}
          side={THREE.DoubleSide}
          wireframe={false}
        />
      </mesh>

      {/* Fringe strands (thin cylinders) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const ang = (i / 8) * Math.PI * 2;
        const r = 0.07;
        return (
          <mesh
            key={i}
            position={[
              Math.sin(ang) * r,
              -0.88,
              Math.cos(ang) * r,
            ]}
          >
            <cylinderGeometry args={[0.006, 0.003, 0.22, 4]} />
            <meshStandardMaterial color="#D97706" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function ProceduralGraduationCap({
  onGraduate,
}: {
  onGraduate?: () => void;
}) {
  const capRef = useRef<THREE.Group>(null);
  const [isRight, setIsRight] = useState(false);
  const graduated = useRef(false);

  const physics = useRef<TasselPhysics>({
    angle: SIDE_LEFT,
    velocity: 0,
    targetAngle: SIDE_LEFT,
  });

  const handleTasselClick = useCallback(() => {
    const nextRight = !isRight;
    setIsRight(nextRight);
    physics.current.targetAngle = nextRight ? SIDE_RIGHT : SIDE_LEFT;
    // Give a small velocity kick for snappiness
    physics.current.velocity = nextRight ? 1.5 : -1.5;

    if (nextRight && !graduated.current) {
      graduated.current = true;
      // Fire after animation settles (~800ms)
      setTimeout(() => onGraduate?.(), 800);
    }
  }, [isRight, onGraduate]);

  useFrame((state) => {
    if (capRef.current) {
      const { x, y } = state.pointer;
      capRef.current.rotation.y = THREE.MathUtils.lerp(
        capRef.current.rotation.y,
        x * 0.5,
        0.05
      );
      capRef.current.rotation.x = THREE.MathUtils.lerp(
        capRef.current.rotation.x,
        -y * 0.3 - 0.2,
        0.05
      );
    }
  });

  return (
    <group ref={capRef} position={[0, -0.2, 0]}>
      {/* Mortarboard flat top */}
      <mesh position={[0, 0.4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.8, 0.08, 1.8]} />
        <meshStandardMaterial color="#1E293B" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* Skullcap cylinder */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.7, 0.65, 0.5, 32]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} />
      </mesh>

      {/* Tassel center button (on top) */}
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        <meshStandardMaterial color="#F59E0B" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Interactive tassel */}
      <Tassel physics={physics} onClick={handleTasselClick} />

      {/* Floating decorative cubes */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh position={[-1.2, 0.8, -0.4]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#34D399" roughness={0.3} />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={2}>
        <mesh position={[1.3, 0.2, -0.2]}>
          <octahedronGeometry args={[0.25]} />
          <meshStandardMaterial color="#F4B942" roughness={0.2} metalness={0.5} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.2}>
        <mesh position={[0.8, 1, 0.2]}>
          <tetrahedronGeometry args={[0.22]} />
          <meshStandardMaterial color="#FF6B6B" roughness={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroToga3D({ onGraduate }: HeroToga3DProps) {
  const [hasWebGlError, setHasWebGlError] = useState(false);

  if (hasWebGlError) {
    return <HeroTogaFallback onGraduate={onGraduate} />;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
        <Canvas
          camera={{ position: [0, 1, 3.5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          onCreated={({ gl }) => {
            // WebGL check on creation
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setHasWebGlError(true);
            });
          }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 8, 5]} intensity={1.8} castShadow />
          <pointLight position={[-4, -2, -2]} intensity={0.8} color="#7DD3FC" />

          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
            <ProceduralGraduationCap onGraduate={onGraduate} />
          </Float>
        </Canvas>
      </div>

      {/* Hint affordance */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-accent-mustard/10 border border-accent-mustard/30 rounded-full cursor-pointer select-none animate-pulse"
        onClick={() => {
          // clicking hint also triggers the cap interaction hint
        }}
      >
        <span className="text-[11px] font-mono text-accent-mustard font-bold flex items-center">
          Klik kuncir toga untuk wisuda! <GraduationCap className="w-4 h-4 inline ml-1.5" />
        </span>
      </div>
    </div>
  );
}
