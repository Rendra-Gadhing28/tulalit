"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";
import confetti from "canvas-confetti";
import type { Member } from "@/types";
import { playSfx } from "@/lib/sound";
import { springPresets } from "@/lib/motion";
import { X, Sparkles } from "lucide-react";

interface HolographicCardModalProps {
  member: Member | null;
  onClose: () => void;
}

function HolographicMesh({ member }: { member: Member }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Iridescent shimmer oscillation
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.iridescence = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      }
    }
  });

  const isLegendary = member.rarity === "Legendary";

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2.2, 3.2, 0.08]} />
        <meshPhysicalMaterial
          color={isLegendary ? "#F59E0B" : "#A855F7"}
          metalness={0.7}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={0.9}
          iridescenceIOR={1.6}
          reflectivity={0.9}
        />
      </mesh>
    </Float>
  );
}

export function HolographicCardModal({
  member,
  onClose,
}: HolographicCardModalProps) {
  useEffect(() => {
    if (!member) return;
    playSfx("flip");

    if (member.rarity === "Legendary") {
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.5 },
          colors: ["#F59E0B", "#FCD34D", "#9333EA"],
        });
      } catch {}
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="holo-card-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{
          scale: 1,
          y: 0,
          opacity: 1,
          transition: springPresets.modalBounce,
        }}
        exit={{ scale: 0.92, y: 15, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg h-[500px] md:h-[600px] bg-darkbg-card rounded-2xl border-2 border-white/20 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 z-10 bg-darkbg-card/90">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 id="holo-card-modal-title" className="font-hand text-2xl font-bold text-white">
                {member.name}
              </h3>
              <span className="font-mono text-xs text-accent-mustard uppercase font-bold">
                Kartu 3D Holografik ({member.rarity})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-95"
            aria-label="Tutup modal kartu 3D"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Canvas Area */}
        <div className="flex-1 w-full relative cursor-grab active:cursor-grabbing">
          <Canvas
            camera={{ position: [0, 0, 4.8], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[3, 5, 4]} intensity={2.5} />
            <pointLight position={[-3, -3, 2]} intensity={1.5} color="#38BDF8" />
            <pointLight position={[3, 3, -2]} intensity={1.5} color="#EC4899" />

            <HolographicMesh member={member} />
            <OrbitControls
              enableZoom={false}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>

          {/* Hint Overlay */}
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
            <span className="px-3 py-1 bg-black/60 rounded-full font-mono text-[10px] text-white/80 border border-white/10 backdrop-blur-xs">
              🖱️ Drag / Geser untuk Memutar Kartu 3D
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
