"use client";

import React, { useRef, useEffect, useMemo } from "react";
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
  const isLegendary = member.rarity === "Legendary";
  const primaryColor = isLegendary ? "#f59e0b" : "#8b5cf6";
  const glowColor = isLegendary ? "#fbbf24" : "#a78bfa";

  const { frontTexture, backTexture } = useMemo(() => {
    if (typeof document === "undefined") {
      return { frontTexture: null, backTexture: null };
    }

    // 1. FRONT CANVAS (512 x 740)
    const frontCanvas = document.createElement("canvas");
    frontCanvas.width = 512;
    frontCanvas.height = 740;
    const fctx = frontCanvas.getContext("2d")!;

    const drawFront = (img?: HTMLImageElement) => {
      // Background
      fctx.fillStyle = "#0c1222";
      fctx.fillRect(0, 0, 512, 740);

      // Border & frame
      fctx.strokeStyle = primaryColor;
      fctx.lineWidth = 14;
      fctx.strokeRect(7, 7, 498, 726);

      fctx.strokeStyle = glowColor;
      fctx.lineWidth = 2;
      fctx.strokeRect(18, 18, 476, 704);

      // Header
      fctx.fillStyle = "#ffffff";
      fctx.font = "bold 26px sans-serif";
      fctx.fillText(member.name, 28, 52);

      fctx.fillStyle = primaryColor;
      fctx.font = "bold 13px monospace";
      fctx.fillText(`[${member.nickname || member.role}]`, 28, 72);

      fctx.fillStyle = primaryColor;
      fctx.font = "bold 13px sans-serif";
      const rarityText = `★ ${member.rarity.toUpperCase()}`;
      fctx.fillText(rarityText, 484 - fctx.measureText(rarityText).width, 54);

      // Photo Box: x=28, y=84, w=456, h=360
      fctx.fillStyle = "#1e293b";
      fctx.fillRect(28, 84, 456, 360);
      fctx.strokeStyle = "rgba(255,255,255,0.2)";
      fctx.lineWidth = 2;
      fctx.strokeRect(28, 84, 456, 360);

      if (img && img.naturalWidth) {
        const sWidth = img.naturalWidth;
        const sHeight = img.naturalHeight;
        const dWidth = 456;
        const dHeight = 360;
        const sRatio = sWidth / sHeight;
        const dRatio = dWidth / dHeight;
        let renderW = sWidth;
        let renderH = sHeight;
        let cropX = 0;
        let cropY = 0;

        const posStr = member.photoPosition || "50% 50%";
        const [posXStr, posYStr] = posStr.split(" ");
        const posX = (parseFloat(posXStr) || 50) / 100;
        const posY = (parseFloat(posYStr) || 50) / 100;

        if (sRatio > dRatio) {
          renderW = sHeight * dRatio;
          cropX = (sWidth - renderW) * posX;
        } else {
          renderH = sWidth / dRatio;
          cropY = (sHeight - renderH) * posY;
        }

        fctx.save();
        fctx.beginPath();
        fctx.rect(28, 84, 456, 360);
        fctx.clip();
        fctx.drawImage(img, cropX, cropY, renderW, renderH, 28, 84, dWidth, dHeight);
        fctx.restore();
      } else {
        fctx.fillStyle = "rgba(255,255,255,0.08)";
        fctx.beginPath();
        fctx.arc(256, 264, 60, 0, Math.PI * 2);
        fctx.fill();
        fctx.fillStyle = "#94a3b8";
        fctx.font = "bold 44px sans-serif";
        fctx.textAlign = "center";
        fctx.fillText(member.name.slice(0, 2).toUpperCase(), 256, 278);
        fctx.textAlign = "left";
      }

      // Role tag
      if (member.role && member.role.trim()) {
        fctx.fillStyle = isLegendary ? "rgba(245, 158, 11, 0.2)" : "rgba(139, 92, 246, 0.2)";
        fctx.fillRect(28, 456, 456, 36);
        fctx.strokeStyle = primaryColor;
        fctx.lineWidth = 1;
        fctx.strokeRect(28, 456, 456, 36);
        fctx.fillStyle = "#ffffff";
        fctx.font = "bold 15px monospace";
        fctx.fillText(member.role, 38, 480);
      }

      // Attributes
      fctx.fillStyle = "#e2e8f0";
      fctx.font = "14px sans-serif";
      fctx.fillText(`⚡ Tech: ${member.favoriteLang}`, 32, 520);
      fctx.fillText(`🎯 Hobi: ${member.hobby}`, 32, 548);

      // Quote
      fctx.fillStyle = "rgba(0,0,0,0.3)";
      fctx.fillRect(28, 566, 456, 76);
      fctx.strokeStyle = "rgba(255,255,255,0.1)";
      fctx.strokeRect(28, 566, 456, 76);
      fctx.fillStyle = "#cbd5e1";
      fctx.font = "italic 13px serif";
      const words = `"${member.quote}"`.split(" ");
      let line = "";
      let lineY = 592;
      for (const w of words) {
        const test = line + w + " ";
        if (fctx.measureText(test).width > 420) {
          fctx.fillText(line, 38, lineY);
          line = w + " ";
          lineY += 20;
        } else {
          line = test;
        }
      }
      if (line) fctx.fillText(line, 38, lineY);

      // Footer
      fctx.fillStyle = "#64748b";
      fctx.font = "bold 11px monospace";
      fctx.fillText("XII PPLG 3 • TULALIT EDISI 2025", 28, 680);
      fctx.textAlign = "right";
      fctx.fillText(member.id.toUpperCase(), 484, 680);
      fctx.textAlign = "left";
    };

    drawFront();
    const frontTex = new THREE.CanvasTexture(frontCanvas);
    frontTex.colorSpace = THREE.SRGBColorSpace;

    if (member.photo) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = member.photo;
      img.onload = () => {
        drawFront(img);
        frontTex.needsUpdate = true;
      };
      img.onerror = () => {
        if (img.src.endsWith(".webp")) {
          img.src = img.src.replace(/\.webp$/, ".png");
        }
      };
    }

    // 2. BACK CANVAS (512 x 740)
    const backCanvas = document.createElement("canvas");
    backCanvas.width = 512;
    backCanvas.height = 740;
    const bctx = backCanvas.getContext("2d")!;

    bctx.fillStyle = "#090d16";
    bctx.fillRect(0, 0, 512, 740);

    bctx.strokeStyle = primaryColor;
    bctx.lineWidth = 14;
    bctx.strokeRect(7, 7, 498, 726);

    bctx.strokeStyle = "rgba(255,255,255,0.05)";
    bctx.lineWidth = 1;
    for (let i = 20; i < 512; i += 32) {
      bctx.beginPath();
      bctx.moveTo(i, 20);
      bctx.lineTo(i, 720);
      bctx.stroke();
    }
    for (let j = 20; j < 740; j += 32) {
      bctx.beginPath();
      bctx.moveTo(20, j);
      bctx.lineTo(492, j);
      bctx.stroke();
    }

    bctx.save();
    bctx.translate(256, 370);
    bctx.beginPath();
    bctx.arc(0, 0, 130, 0, Math.PI * 2);
    bctx.strokeStyle = primaryColor;
    bctx.lineWidth = 6;
    bctx.stroke();

    bctx.beginPath();
    bctx.arc(0, 0, 114, 0, Math.PI * 2);
    bctx.strokeStyle = glowColor;
    bctx.lineWidth = 2;
    bctx.stroke();

    bctx.fillStyle = "#ffffff";
    bctx.font = "bold 28px sans-serif";
    bctx.textAlign = "center";
    bctx.fillText("XII PPLG 3", 0, -20);

    bctx.fillStyle = primaryColor;
    bctx.font = "bold 15px monospace";
    bctx.fillText("COMMIT TERAKHIR", 0, 14);

    bctx.fillStyle = "#94a3b8";
    bctx.font = "12px monospace";
    bctx.fillText("CLASS OF 2025", 0, 42);
    bctx.restore();

    const backTex = new THREE.CanvasTexture(backCanvas);
    backTex.colorSpace = THREE.SRGBColorSpace;

    return { frontTexture: frontTex, backTexture: backTex };
  }, [member, isLegendary, primaryColor, glowColor]);

  const materials = useMemo(() => {
    const edgeMat = new THREE.MeshStandardMaterial({
      color: isLegendary ? "#d97706" : "#6d28d9",
      metalness: 0.8,
      roughness: 0.2,
    });

    const frontMat = new THREE.MeshPhysicalMaterial({
      map: frontTexture,
      metalness: 0.25,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      iridescence: 0.8,
      iridescenceIOR: 1.6,
    });

    const backMat = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      metalness: 0.4,
      roughness: 0.3,
      clearcoat: 0.8,
      iridescence: 0.6,
    });

    // BoxGeometry faces: [+X, -X, +Y, -Y, +Z (Front), -Z (Back)]
    return [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat];
  }, [frontTexture, backTexture, isLegendary]);

  useEffect(() => {
    return () => {
      frontTexture?.dispose();
      backTexture?.dispose();
      materials.forEach((m) => m.dispose());
    };
  }, [frontTexture, backTexture, materials]);

  useFrame((state) => {
    const frontMat = materials[4] as THREE.MeshPhysicalMaterial;
    if (frontMat) {
      frontMat.iridescence = 0.7 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} material={materials}>
        <boxGeometry args={[2.2, 3.2, 0.08]} />
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
