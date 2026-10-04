"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sticker } from "@/components/ui/Sticker";
import { playBeep, playSfx } from "@/lib/sound";
import {
  Camera,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  SwitchCamera,
  Smile,
  Laugh,
  Heart,
} from "lucide-react";

type FrameType = "polaroid" | "strip4" | "idcard" | "terminal";

interface PlacedSticker {
  id: string;
  stickerId: string;
  x: number;
  y: number;
}

const STRIP_POSES = [
  { step: 1, label: "Pose Kalem / Senyum Manis", icon: Smile, iconColor: "text-amber-400" },
  { step: 2, label: "Gaya Bebas / Candid Keren", icon: Sparkles, iconColor: "text-sky-400" },
  { step: 3, label: "Muka Konyol / Ekspresi Melet", icon: Laugh, iconColor: "text-pink-400" },
  { step: 4, label: "Finger Heart / Peace", icon: Heart, iconColor: "text-rose-400" },
] as const;

const STRIP_FILTERS = [
  { id: "normal", label: "Normal", value: "none" },
  { id: "bw", label: "B&W Retro", value: "grayscale(100%) contrast(115%)" },
  { id: "vintage", label: "Warm Vintage", value: "sepia(50%) contrast(105%) brightness(95%)" },
] as const;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) => {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius = 0
) => {
  const targetAspect = w / h;
  const imgAspect = img.naturalWidth / img.naturalHeight;
  let sX = 0;
  let sY = 0;
  let sW = img.naturalWidth;
  let sH = img.naturalHeight;

  if (imgAspect > targetAspect) {
    sW = img.naturalHeight * targetAspect;
    sX = (img.naturalWidth - sW) / 2;
  } else {
    sH = img.naturalWidth / targetAspect;
    sY = (img.naturalHeight - sH) / 2;
  }

  if (radius > 0) {
    ctx.save();
    ctx.beginPath();
    drawRoundRect(ctx, x, y, w, h, radius);
    ctx.clip();
    ctx.drawImage(img, sX, sY, sW, sH, x, y, w, h);
    ctx.restore();
  } else {
    ctx.drawImage(img, sX, sY, sW, sH, x, y, w, h);
  }
};

export function Photobooth() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameType>("polaroid");
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Multi-shot Strip 4 States
  const [stripPhotos, setStripPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [stripFilter, setStripFilter] = useState<string>("none");
  const [isAutoSession, setIsAutoSession] = useState<boolean>(false);
  const [activePoseIndex, setActivePoseIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isPreparingNext, setIsPreparingNext] = useState<boolean>(false);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [isCekrek, setIsCekrek] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameContainerRef = useRef<HTMLDivElement>(null);
  const abortSessionRef = useRef<boolean>(false);

  // Cleanup camera and abort session ONLY on unmount
  useEffect(() => {
    abortSessionRef.current = false;
    return () => {
      abortSessionRef.current = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const cancelAutoSession = () => {
    abortSessionRef.current = true;
    setIsAutoSession(false);
    setCountdown(null);
    setIsPreparingNext(false);
    setIsCekrek(false);
    setIsCameraLoading(false);
    stopCamera();
  };

  const startCamera = async (
    targetMode: "user" | "environment" = facingMode
  ): Promise<MediaStream | null> => {
    abortSessionRef.current = false;
    playSfx("click");
    setCameraError(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Kamera tidak didukung pada browser ini atau butuh koneksi aman HTTPS."
      );
      return null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      let media: MediaStream;
      try {
        media = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 720 }, height: { ideal: 720 }, facingMode: targetMode },
          audio: false,
        });
      } catch {
        // Fallback for devices with strict constraint handling
        try {
          media = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: targetMode },
            audio: false,
          });
        } catch {
          media = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      streamRef.current = media;
      setStream(media);
      setFacingMode(targetMode);
      setCameraActive(true);
      return media;
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      streamRef.current = null;
      setCameraError(
        "Izin kamera tidak diberikan atau perangkat tidak mendukung. Kamu tetap bisa mengunggah foto langsung dari galeri!"
      );
      setCameraActive(false);
      return null;
    }
  };

  const toggleFacingMode = () => {
    const next = facingMode === "user" ? "environment" : "user";
    startCamera(next);
  };

  // Sync stream to video element when active or when switching frames / poses
  useEffect(() => {
    if (videoRef.current && stream && cameraActive) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch((err) => {
        console.warn("Video auto-play warning:", err);
      });
    }
  }, [stream, cameraActive, selectedFrame, activePoseIndex]);

  // Pastikan video kamera benar-benar siap dan sedang memutar frame
  const waitForCameraReady = async (
    activeStream?: MediaStream | null,
    maxTimeoutMs = 3000
  ): Promise<boolean> => {
    setIsCameraLoading(true);
    const targetStream = activeStream || streamRef.current || stream;
    const startTime = Date.now();

    while (Date.now() - startTime < maxTimeoutMs) {
      if (abortSessionRef.current) {
        setIsCameraLoading(false);
        return false;
      }

      if (videoRef.current) {
        videoRef.current.muted = true;
        if (targetStream && videoRef.current.srcObject !== targetStream) {
          videoRef.current.srcObject = targetStream;
          videoRef.current.play().catch(() => {});
        }

        if (videoRef.current.readyState >= 2 && videoRef.current.videoWidth > 0) {
          setIsCameraLoading(false);
          return true;
        }
      }

      await sleep(50);
    }

    setIsCameraLoading(false);
    return Boolean(targetStream && targetStream.active);
  };

  const captureFrameFromVideo = (): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 640;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    if (facingMode === "user") {
      // Mirror horizontal for selfie
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    playSfx("camera-shutter");
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 240);

    const dataUrl = captureFrameFromVideo();
    if (dataUrl) {
      setPhotoDataUrl(dataUrl);
    }
    stopCamera();
  };

  const startAutoSession = async () => {
    if (isAutoSession) return;
    abortSessionRef.current = false;
    setIsAutoSession(true);
    setStripPhotos([null, null, null, null]);
    setActivePoseIndex(0);

    let currentStream = streamRef.current || stream;
    if (!cameraActive || !currentStream || !currentStream.active) {
      setIsCameraLoading(true);
      currentStream = await startCamera(facingMode);
      if (!currentStream || abortSessionRef.current) {
        cancelAutoSession();
        return;
      }
    }

    // Pastikan video kamera siap (jangan pernah membatalkan sesi jika stream aktif)
    await waitForCameraReady(currentStream, 2500);
    if (abortSessionRef.current) {
      return;
    }

    // Loop through 4 poses
    for (let i = 0; i < STRIP_POSES.length; i++) {
      if (abortSessionRef.current) break;
      setActivePoseIndex(i);

      // Verifikasi kesiapan video feed di slot aktif
      await waitForCameraReady(currentStream, 2000);
      if (abortSessionRef.current) break;

      // Jeda ~1.5s untuk bersiap dengan teks panduan animasi
      setIsPreparingNext(true);
      setCountdown(null);
      const prepStart = Date.now();
      while (Date.now() - prepStart < 1500) {
        if (abortSessionRef.current) break;
        await sleep(50);
      }
      setIsPreparingNext(false);
      if (abortSessionRef.current) break;

      // Countdown maju 1 -> 2 -> 3 -> Cekrek!
      // Angka 1
      setCountdown(1);
      playBeep(440, 0.1);
      await sleep(1000);
      if (abortSessionRef.current) break;

      // Angka 2
      setCountdown(2);
      playBeep(587, 0.1);
      await sleep(1000);
      if (abortSessionRef.current) break;

      // Angka 3
      setCountdown(3);
      playBeep(880, 0.15);
      await sleep(1000);
      if (abortSessionRef.current) break;

      setCountdown(null);

      // Cekrek! Flash + Shutter SFX + Simpan Foto
      setIsCekrek(true);
      playSfx("camera-shutter");
      setIsFlashing(true);

      const captured = captureFrameFromVideo();
      if (captured) {
        setStripPhotos((prev) => {
          const next = [...prev];
          next[i] = captured;
          return next;
        });
        if (i === 0) {
          setPhotoDataUrl(captured);
        }
      }

      await sleep(450);
      setIsFlashing(false);
      setIsCekrek(false);
      await sleep(250);
    }

    if (!abortSessionRef.current) {
      stopCamera();
      setIsAutoSession(false);
      setCountdown(null);
      setIsPreparingNext(false);
      setIsCekrek(false);
      setIsCameraLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSfx("click");
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const addSticker = (stickerId: string) => {
    playSfx("pop");
    setPlacedStickers((prev) => [
      ...prev,
      {
        id: `photo-stk-${Date.now()}`,
        stickerId,
        x: 40 + Math.random() * 100,
        y: 40 + Math.random() * 100,
      },
    ]);
  };

  // High-Resolution Native 2D Canvas Compositor
  const exportPhoto = async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
      playSfx("click");

      if (typeof document !== "undefined" && document.fonts) {
        try {
          await document.fonts.ready;
        } catch {}
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize 2D context");

      if (selectedFrame === "strip4") {
        // High-res Strip 4: 1200 x 3600 px
        canvas.width = 1200;
        canvas.height = 3600;

        // Background: clean white
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 1200, 3600);

        // 4 photo slots (each 1080 x 810 px, 4:3)
        const slotW = 1080;
        const slotH = 810;
        const startX = 60;
        const startY = 60;
        const gap = 40;

        for (let i = 0; i < 4; i++) {
          const slotY = startY + i * (slotH + gap);
          const photoSrc = stripPhotos[i] || photoDataUrl;

          // Placeholder box background
          ctx.fillStyle = "#0F172A";
          ctx.save();
          ctx.beginPath();
          drawRoundRect(ctx, startX, slotY, slotW, slotH, 12);
          ctx.fill();
          ctx.restore();

          if (photoSrc) {
            try {
              const img = await loadImage(photoSrc);

              // Apply color filter
              if (stripFilter === "grayscale(100%) contrast(115%)") {
                ctx.filter = "grayscale(1) contrast(1.15)";
              } else if (stripFilter === "sepia(50%) contrast(105%) brightness(95%)") {
                ctx.filter = "sepia(0.5) contrast(1.05) brightness(0.95)";
              } else {
                ctx.filter = "none";
              }

              drawImageCover(ctx, img, startX, slotY, slotW, slotH, 12);
              ctx.filter = "none";
            } catch (e) {
              console.warn(`Could not load strip photo ${i + 1}:`, e);
            }
          }
        }

        // Vector divider line
        ctx.strokeStyle = "#F3F4F6";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(60, 3440);
        ctx.lineTo(1140, 3440);
        ctx.stroke();

        // Vector sharp branding text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#1F2937";
        ctx.font = "bold 52px monospace, sans-serif";
        ctx.fillText("★ MEMORY STRIP ★", 600, 3500);

        ctx.fillStyle = "#9CA3AF";
        ctx.font = "bold 32px monospace, sans-serif";
        ctx.fillText("XII PPLG 3 — 2027", 600, 3550);

      } else if (selectedFrame === "polaroid") {
        // High-res Polaroid: 1200 x 1480 px
        canvas.width = 1200;
        canvas.height = 1480;

        // Polaroid paper background
        ctx.fillStyle = "#FFFDF9";
        ctx.fillRect(0, 0, 1200, 1480);

        // Border outline
        ctx.strokeStyle = "#E2E8F0";
        ctx.lineWidth = 3;
        ctx.strokeRect(1, 1, 1198, 1478);

        // Square photo: 1060 x 1060 px
        const pX = 70;
        const pY = 70;
        const pSize = 1060;

        ctx.fillStyle = "#0F172A";
        ctx.fillRect(pX, pY, pSize, pSize);

        if (photoDataUrl) {
          try {
            const img = await loadImage(photoDataUrl);
            drawImageCover(ctx, img, pX, pY, pSize, pSize, 4);
          } catch (e) {
            console.warn("Could not load polaroid photo:", e);
          }
        }

        // Text Hand-drawn Sharp
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#0F172A";
        ctx.font = "bold 64px 'Caveat', cursive, sans-serif";
        ctx.fillText("XII PPLG 3 — Sogadev × Tulalit", 600, 1260);

        ctx.fillStyle = "#64748B";
        ctx.font = "bold 30px monospace, sans-serif";
        ctx.fillText("WISUDA ANGKATAN 2027", 600, 1340);

      } else if (selectedFrame === "idcard") {
        // High-res ID Card: 1200 x 1500 px
        canvas.width = 1200;
        canvas.height = 1500;

        // Indigo to Slate gradient background
        const grad = ctx.createLinearGradient(0, 0, 0, 1500);
        grad.addColorStop(0, "#1E1B4B");
        grad.addColorStop(1, "#0F172A");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1200, 1500);

        // Amber border
        ctx.strokeStyle = "#FBBF24";
        ctx.lineWidth = 16;
        ctx.save();
        ctx.beginPath();
        drawRoundRect(ctx, 16, 16, 1168, 1468, 48);
        ctx.stroke();
        ctx.restore();

        // Header text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#FBBF24";
        ctx.font = "bold 36px monospace, sans-serif";
        ctx.fillText("OFFICIAL DEVELOPER PASS", 600, 100);

        // Square photo: 880 x 880 px
        const cardX = 160;
        const cardY = 160;
        const cardSize = 880;

        ctx.fillStyle = "#000000";
        ctx.save();
        ctx.beginPath();
        drawRoundRect(ctx, cardX, cardY, cardSize, cardSize, 28);
        ctx.fill();
        ctx.restore();

        if (photoDataUrl) {
          try {
            const img = await loadImage(photoDataUrl);
            drawImageCover(ctx, img, cardX, cardY, cardSize, cardSize, 28);
          } catch (e) {
            console.warn("Could not load ID card photo:", e);
          }
        }

        // Border around photo
        ctx.strokeStyle = "#FFFFFF40";
        ctx.lineWidth = 6;
        ctx.save();
        ctx.beginPath();
        drawRoundRect(ctx, cardX, cardY, cardSize, cardSize, 28);
        ctx.stroke();
        ctx.restore();

        // Footer texts
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 56px sans-serif";
        ctx.fillText("ALUMNI XII PPLG 3", 600, 1180);

        ctx.fillStyle = "#34D399";
        ctx.font = "bold 36px monospace, sans-serif";
        ctx.fillText("ROLE: FULL-STACK DEVELOPER", 600, 1260);

        ctx.fillStyle = "#94A3B8";
        ctx.font = "24px monospace, sans-serif";
        ctx.fillText("CLASS OF 2027 • TULALIT PASS", 600, 1330);

      } else if (selectedFrame === "terminal") {
        // High-res Terminal: 1200 x 1400 px
        canvas.width = 1200;
        canvas.height = 1400;

        // Dark slate background
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(0, 0, 1200, 1400);

        // Slate border
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 8;
        ctx.save();
        ctx.beginPath();
        drawRoundRect(ctx, 8, 8, 1184, 1384, 32);
        ctx.stroke();
        ctx.restore();

        // Top terminal window dots
        const dots = [
          { color: "#F43F5E", x: 90 },
          { color: "#F59E0B", x: 140 },
          { color: "#10B981", x: 190 },
        ];
        dots.forEach((d) => {
          ctx.fillStyle = d.color;
          ctx.beginPath();
          ctx.arc(d.x, 60, 16, 0, Math.PI * 2);
          ctx.fill();
        });

        // Top title
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#94A3B8";
        ctx.font = "bold 32px monospace, sans-serif";
        ctx.fillText("photobooth@tulalit: ~", 250, 62);

        // Divider line
        ctx.strokeStyle = "#1E293B";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(32, 110);
        ctx.lineTo(1168, 110);
        ctx.stroke();

        // Square photo: 960 x 960 px
        const tX = 120;
        const tY = 150;
        const tSize = 960;

        ctx.fillStyle = "#000000";
        ctx.save();
        ctx.beginPath();
        drawRoundRect(ctx, tX, tY, tSize, tSize, 16);
        ctx.fill();
        ctx.restore();

        if (photoDataUrl) {
          try {
            const img = await loadImage(photoDataUrl);
            drawImageCover(ctx, img, tX, tY, tSize, tSize, 16);
          } catch (e) {
            console.warn("Could not load terminal photo:", e);
          }
        }

        // Terminal commit footer text
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#34D399";
        ctx.font = "bold 36px monospace, sans-serif";
        ctx.fillText("> git commit -m 'momen_wisuda_abadi'", 120, 1220);

        ctx.fillStyle = "#64748B";
        ctx.font = "28px monospace, sans-serif";
        ctx.fillText("[main 7a2b9f0] wisuda XII PPLG 3 terverifikasi", 120, 1280);
      }

      // Render placed stickers proportionally on top of high-res canvas
      const cardEl = frameContainerRef.current?.querySelector<HTMLElement>('[data-frame-card="true"]');
      if (cardEl && placedStickers.length > 0) {
        const cardRect = cardEl.getBoundingClientRect();
        const scale = canvas.width / cardRect.width;

        for (const s of placedStickers) {
          try {
            const box = cardEl.querySelector<HTMLElement>(`[data-sticker-box="${s.id}"]`);
            const svg = box?.querySelector("svg");
            if (box && svg) {
              const boxRect = box.getBoundingClientRect();
              const svgStr = new XMLSerializer().serializeToString(svg);
              const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
              const blobUrl = URL.createObjectURL(svgBlob);
              const img = await loadImage(blobUrl);
              URL.revokeObjectURL(blobUrl);

              const destX = (boxRect.left - cardRect.left) * scale;
              const destY = (boxRect.top - cardRect.top) * scale;
              const destW = boxRect.width * scale;
              const destH = boxRect.height * scale;

              ctx.drawImage(img, destX, destY, destW, destH);
            }
          } catch (e) {
            console.warn("Could not draw sticker to high-res canvas:", e);
          }
        }
      }

      // Export lossless high-res PNG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.download = `photobooth-xiipplg3-${selectedFrame}-highres.png`;
            a.href = blobUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
          } else {
            const dataUrl = canvas.toDataURL("image/png", 1.0);
            const a = document.createElement("a");
            a.download = `photobooth-xiipplg3-${selectedFrame}-highres.png`;
            a.href = dataUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
          setIsExporting(false);
        },
        "image/png",
        1.0
      );
    } catch (err) {
      console.error("Gagal mengekspor foto kanvas resolusi tinggi:", err);
      setIsExporting(false);
    }
  };

  const resetAll = () => {
    playSfx("click");
    cancelAutoSession();
    setPhotoDataUrl(null);
    setStripPhotos([null, null, null, null]);
    setStripFilter("none");
    setPlacedStickers([]);
  };

  const handleSelectFrame = (frame: FrameType) => {
    playSfx("click");
    if (isAutoSession) {
      cancelAutoSession();
    }
    setSelectedFrame(frame);
  };

  const hasPhotoToExport =
    selectedFrame === "strip4"
      ? stripPhotos.some(Boolean) || Boolean(photoDataUrl)
      : Boolean(photoDataUrl);

  const hasSomethingToReset =
    Boolean(photoDataUrl) ||
    stripPhotos.some(Boolean) ||
    placedStickers.length > 0 ||
    cameraActive ||
    isAutoSession;

  return (
    <div className="bg-paper-light dark:bg-darkbg-card p-6 md:p-8 rounded-2xl border-2 border-paper-lines dark:border-darkbg-border max-w-4xl mx-auto shadow-scrapbook select-none">
      <div className="text-center max-w-lg mx-auto mb-6">
        <h4 className="font-hand text-3xl font-bold text-ink-navy dark:text-white flex items-center justify-center">
          <Camera className="w-5 h-5 text-accent-mustard mr-2 inline" /> Photobooth Kenangan Kelas
        </h4>
        <p className="font-sans text-xs text-ink-muted mt-1">
          Ambil foto selfie atau unggah fotomu, pasang bingkai tema developer, tempelkan stiker wisuda, lalu simpan dengan resolusi tinggi jernih tanpa kompresi!
        </p>

        {/* Privacy Note */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono border border-emerald-300 mt-2">
          <ShieldCheck className="w-3 h-3" />
          <span>Privasi 100% Aman: Foto diproses di browsermu & tidak diunggah ke server.</span>
        </div>
      </div>

      {cameraError && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs font-mono border border-amber-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Frame Preview Area */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* The Printable Frame Canvas */}
        <div
          ref={frameContainerRef}
          className="relative overflow-hidden transition-all duration-300 shadow-2xl flex flex-col items-center justify-between"
        >
          {selectedFrame === "polaroid" && (
            <div
              data-frame-card="true"
              className="w-[280px] sm:w-[320px] bg-[#FFFDF9] p-3 pb-8 rounded-sm border border-black/10 shadow-polaroid text-center relative"
            >
              <div className="relative w-full aspect-square bg-slate-900 rounded-xs overflow-hidden flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={(node) => {
                      if (node) {
                        videoRef.current = node;
                        node.muted = true;
                        const target = streamRef.current || stream;
                        if (target && node.srcObject !== target) {
                          node.srcObject = target;
                          node.play().catch(() => {});
                        }
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
                  />
                ) : photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoDataUrl}
                    alt="Pratinjau foto frame polaroid"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-mono text-xs text-gray-400 p-4 text-center">
                    Kamera belum aktif atau belum ada foto
                  </span>
                )}

                {/* Flash effect overlay */}
                {isFlashing && (
                  <div className="absolute inset-0 bg-white pointer-events-none z-30 animate-ping opacity-90" />
                )}

                {/* Placed Stickers Overlay */}
                {placedStickers.map((s) => (
                  <div
                    key={s.id}
                    data-sticker-box={s.id}
                    style={{ left: `${s.x}px`, top: `${s.y}px` }}
                    className="absolute pointer-events-none z-20"
                  >
                    <Sticker id={s.stickerId} size={48} decorative />
                  </div>
                ))}
              </div>

              <div className="mt-4 font-hand text-xl font-bold text-ink-navy">
                XII PPLG 3 — Sogadev × Tulalit
              </div>
              <span className="font-mono text-[9px] text-ink-muted uppercase tracking-widest block">
                Wisuda Angkatan 2027
              </span>
            </div>
          )}

          {selectedFrame === "strip4" && (
            <div
              data-frame-card="true"
              className="relative w-[220px] bg-white p-3 rounded-md border border-gray-300 shadow-xl flex flex-col gap-2 text-center"
            >
              {/* Photo slots container with filter applied directly */}
              <div
                className="flex flex-col gap-2 transition-[filter] duration-300"
                style={{ filter: stripFilter }}
              >
                {[0, 1, 2, 3].map((idx) => {
                  const isCurrentActive = isAutoSession && idx === activePoseIndex;
                  const isCameraUsable =
                    cameraActive || Boolean(stream) || Boolean(streamRef.current) || isAutoSession;
                  const shouldShowVideo =
                    isCameraUsable && (isAutoSession ? isCurrentActive : idx === 0 && !stripPhotos[0]);
                  const photoSrc =
                    stripPhotos[idx] ||
                    (!isAutoSession && !stripPhotos.some(Boolean) ? photoDataUrl : null);

                  return (
                    <div
                      key={idx}
                      className={`relative w-full aspect-[4/3] bg-slate-900 overflow-hidden flex items-center justify-center rounded-xs ${
                        isCurrentActive ? "ring-2 ring-accent-coral ring-offset-1" : ""
                      }`}
                    >
                      {shouldShowVideo ? (
                        <video
                          ref={(node) => {
                            if (node) {
                              videoRef.current = node;
                              node.muted = true;
                              const target = streamRef.current || stream;
                              if (target && node.srcObject !== target) {
                                node.srcObject = target;
                                node.play().catch(() => {});
                              }
                            }
                          }}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
                        />
                      ) : photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={photoSrc}
                          alt={`Pratinjau strip foto pose ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-center">
                          <span className="text-[10px] font-mono font-bold text-gray-400">
                            Slot 0{idx + 1}
                          </span>
                          <span className="text-[8px] font-sans text-gray-500 line-clamp-1 mt-0.5 flex items-center justify-center gap-1">
                            {React.createElement(STRIP_POSES[idx].icon, {
                              className: `w-2.5 h-2.5 ${STRIP_POSES[idx].iconColor} shrink-0`,
                            })}
                            <span>{STRIP_POSES[idx].label}</span>
                          </span>
                        </div>
                      )}

                      {/* Loading Kamera Overlay */}
                      {isCurrentActive && isCameraLoading && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/75 p-2 text-center backdrop-blur-xs">
                          <Sparkles className="w-5 h-5 text-amber-300 animate-spin mb-1" />
                          <span className="text-[9px] font-mono font-bold text-amber-300 uppercase tracking-wider animate-pulse">
                            Menyiapkan Kamera...
                          </span>
                          <span className="text-[8px] font-sans text-gray-400 mt-0.5">
                            Menunggu feed aktif
                          </span>
                        </div>
                      )}

                      {/* In-slot Pose Guidance during ~1.5s Pause */}
                      {isCurrentActive && isPreparingNext && !isCameraLoading && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/65 p-2 text-center">
                          <span className="text-[9px] font-mono font-bold text-amber-300 uppercase tracking-wider animate-pulse">
                            Bersiap Pose {idx + 1}/4
                          </span>
                          <span className="text-[10px] font-sans font-extrabold text-white mt-1 leading-tight drop-shadow animate-bounce flex items-center justify-center gap-1.5">
                            {React.createElement(STRIP_POSES[idx].icon, {
                              className: `w-3.5 h-3.5 ${STRIP_POSES[idx].iconColor} shrink-0`,
                            })}
                            <span>{STRIP_POSES[idx].label}</span>
                          </span>
                        </div>
                      )}

                      {/* In-slot Animated Countdown (1 -> 2 -> 3) & CEKREK! */}
                      <AnimatePresence mode="wait">
                        {isCurrentActive && countdown !== null && (
                          <motion.div
                            key={countdown}
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: [0.4, 1.2, 1.0], opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[0.5px]"
                          >
                            <div className="w-12 h-12 rounded-full bg-accent-coral text-white flex items-center justify-center text-2xl font-black font-mono shadow-xl border-2 border-white/80">
                              {countdown}
                            </div>
                            <span className="text-[8px] font-mono font-bold text-white uppercase tracking-wider mt-1 drop-shadow bg-black/50 px-2 py-0.5 rounded-full">
                              Pose {idx + 1}/4
                            </span>
                          </motion.div>
                        )}

                        {isCurrentActive && isCekrek && (
                          <motion.div
                            key="in-slot-cekrek"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [0.5, 1.25, 1.0], opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="absolute inset-0 z-25 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
                          >
                            <div className="px-2.5 py-1 rounded-lg bg-amber-400 text-ink-navy text-xs font-black font-mono shadow-2xl tracking-wider uppercase border border-white animate-bounce flex items-center gap-1.5">
                              <Camera className="w-4 h-4 mr-1.5 inline" /> CEKREK!
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Flash Overlay */}
                      {isFlashing && isCurrentActive && (
                        <div className="absolute inset-0 bg-white pointer-events-none z-30 opacity-95 transition-opacity" />
                      )}

                      {/* Captured Badge */}
                      {stripPhotos[idx] && (
                        <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/60 text-white text-[7px] font-mono font-bold">
                          P{idx + 1} ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Strip Header / Footer Branding */}
              <div className="pt-1 border-t border-gray-100">
                <span className="font-mono font-bold text-[10px] text-gray-800 tracking-widest uppercase block">
                  ★ MEMORY STRIP ★
                </span>
                <span className="font-mono text-[8px] text-gray-400 uppercase tracking-wider block">
                  XII PPLG 3 — 2027
                </span>
              </div>

              {/* Placed Stickers on Strip */}
              {placedStickers.map((s) => (
                <div
                  key={s.id}
                  data-sticker-box={s.id}
                  style={{
                    left: `${Math.min(s.x, 160)}px`,
                    top: `${Math.min(s.y, 440)}px`,
                  }}
                  className="absolute pointer-events-none z-30"
                >
                  <Sticker id={s.stickerId} size={36} decorative />
                </div>
              ))}
            </div>
          )}

          {selectedFrame === "idcard" && (
            <div
              data-frame-card="true"
              className="w-[280px] sm:w-[300px] bg-gradient-to-b from-indigo-900 to-slate-900 p-4 rounded-2xl border-4 border-amber-400 text-white shadow-2xl text-center relative"
            >
              <div className="font-pixel text-[9px] text-amber-400 uppercase tracking-widest mb-2">
                OFFICIAL DEVELOPER PASS
              </div>
              <div className="relative w-full aspect-square bg-black/40 rounded-xl overflow-hidden border-2 border-white/20 mb-3 flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={(node) => {
                      if (node) {
                        videoRef.current = node;
                        node.muted = true;
                        const target = streamRef.current || stream;
                        if (target && node.srcObject !== target) {
                          node.srcObject = target;
                          node.play().catch(() => {});
                        }
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
                  />
                ) : photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoDataUrl}
                    alt="Pratinjau foto kartu identitas"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-mono text-xs text-gray-400">Belum ada foto</span>
                )}

                {/* Flash Overlay */}
                {isFlashing && (
                  <div className="absolute inset-0 bg-white pointer-events-none z-30 animate-ping opacity-90" />
                )}

                {placedStickers.map((s) => (
                  <div
                    key={s.id}
                    data-sticker-box={s.id}
                    style={{ left: `${s.x}px`, top: `${s.y}px` }}
                    className="absolute pointer-events-none z-20"
                  >
                    <Sticker id={s.stickerId} size={44} decorative />
                  </div>
                ))}
              </div>
              <h5 className="font-sans font-bold text-sm text-white">
                ALUMNI XII PPLG 3
              </h5>
              <p className="font-mono text-[10px] text-emerald-400 font-bold mt-0.5">
                ROLE: FULL-STACK DEVELOPER
              </p>
            </div>
          )}

          {selectedFrame === "terminal" && (
            <div
              data-frame-card="true"
              className="w-[280px] sm:w-[320px] bg-[#0F172A] rounded-xl border-2 border-slate-700 p-3 shadow-2xl text-white font-mono text-xs relative"
            >
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 truncate">photobooth@tulalit: ~</span>
              </div>
              <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {cameraActive ? (
                  <video
                    ref={(node) => {
                      if (node) {
                        videoRef.current = node;
                        node.muted = true;
                        const target = streamRef.current || stream;
                        if (target && node.srcObject !== target) {
                          node.srcObject = target;
                          node.play().catch(() => {});
                        }
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`}
                  />
                ) : photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoDataUrl}
                    alt="Pratinjau foto terminal developer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-xs">&gt; awaiting capture...</span>
                )}

                {/* Flash Overlay */}
                {isFlashing && (
                  <div className="absolute inset-0 bg-white pointer-events-none z-30 animate-ping opacity-90" />
                )}

                {placedStickers.map((s) => (
                  <div
                    key={s.id}
                    data-sticker-box={s.id}
                    style={{ left: `${s.x}px`, top: `${s.y}px` }}
                    className="absolute pointer-events-none z-20"
                  >
                    <Sticker id={s.stickerId} size={44} decorative />
                  </div>
                ))}
              </div>
              <div className="mt-2 text-emerald-400 text-[10px]">
                &gt; git commit -m &quot;momen_wisuda_abadi&quot;
              </div>
            </div>
          )}
        </div>

        {/* Controls Column */}
        <div className="w-full max-w-xs space-y-4">
          {/* Frame Selector */}
          <div>
            <span className="block text-xs font-mono font-bold text-ink-muted mb-2 uppercase">
              Pilih Desain Bingkai:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "polaroid", label: "Polaroid" },
                { id: "strip4", label: "Strip 4 Foto" },
                { id: "idcard", label: "ID Card Dev" },
                { id: "terminal", label: "Terminal CLI" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleSelectFrame(f.id as FrameType)}
                  className={`p-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                    selectedFrame === f.id
                      ? "bg-accent-mustard text-ink-navy border-amber-500 shadow-xs"
                      : "bg-paper-base dark:bg-darkbg-base text-ink-muted border-paper-lines hover:text-ink-navy dark:hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Strip 4 Auto Session Live Guidance Banner */}
          {selectedFrame === "strip4" && isAutoSession && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-center">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-amber-800 dark:text-amber-200">
                <span>
                  {isCameraLoading
                    ? "Menyiapkan Kamera..."
                    : isPreparingNext
                    ? "Bersiap Pose..."
                    : isCekrek
                    ? "Cekrek!"
                    : "Hitungan Pose"}
                </span>
                <span>Pose {activePoseIndex + 1} / 4</span>
              </div>
              <div className="text-xs font-sans font-bold text-ink-navy dark:text-white mt-1 flex items-center justify-center gap-1.5">
                {React.createElement(STRIP_POSES[activePoseIndex].icon, {
                  className: `w-3.5 h-3.5 ${STRIP_POSES[activePoseIndex].iconColor} shrink-0`,
                })}
                <span>{STRIP_POSES[activePoseIndex].label}</span>
              </div>
              <div className="h-8 flex items-center justify-center mt-1">
                <AnimatePresence mode="wait">
                  {isCameraLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Memulai feed...</span>
                    </motion.div>
                  ) : countdown !== null ? (
                    <motion.div
                      key={countdown}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: [0.4, 1.2, 1.0], opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="text-2xl font-mono font-black text-accent-coral"
                    >
                      {countdown}
                    </motion.div>
                  ) : isCekrek ? (
                    <motion.div
                      key="cekrek-text"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: [0.6, 1.2, 1.0], opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-mono font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest animate-bounce flex items-center justify-center"
                    >
                      <Camera className="w-4 h-4 mr-1.5 inline" /> CEKREK!
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Strip 4 Color Filter Selector */}
          {selectedFrame === "strip4" && (
            <div className="pt-2 border-t border-paper-lines dark:border-white/10">
              <span className="block text-xs font-mono font-bold text-ink-muted mb-2 uppercase">
                Filter Warna Strip:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {STRIP_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      playSfx("click");
                      setStripFilter(f.value);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                      stripFilter === f.value
                        ? "bg-accent-mustard text-ink-navy border-amber-500 shadow-xs"
                        : "bg-paper-base dark:bg-darkbg-base text-ink-muted border-paper-lines hover:text-ink-navy dark:hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action: Take / Upload Photo */}
          <div className="space-y-2 pt-2 border-t border-paper-lines dark:border-white/10">
            {selectedFrame === "strip4" ? (
              isAutoSession ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled
                    className="flex-1 py-2.5 px-4 rounded-xl bg-accent-coral text-white font-bold font-sans text-xs flex items-center justify-center gap-2 shadow-sm animate-pulse cursor-not-allowed"
                  >
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Sesi Berjalan ({activePoseIndex + 1}/4)...
                  </button>
                  <button
                    type="button"
                    onClick={cancelAutoSession}
                    className="py-2.5 px-3 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-mono transition-colors"
                    title="Batalkan Sesi"
                  >
                    Batal
                  </button>
                </div>
              ) : cameraActive ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startAutoSession}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-sans text-xs flex items-center justify-center gap-2 shadow-sm animate-pulse transition-transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    Mulai Sesi 4 Pose (Auto)
                  </button>
                  <button
                    type="button"
                    onClick={toggleFacingMode}
                    className="py-2.5 px-3 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines text-ink-navy dark:text-white hover:bg-paper-dark dark:hover:bg-darkbg-border text-xs font-mono transition-colors flex items-center justify-center"
                    title={`Ganti kamera (${facingMode === "user" ? "Kamera Belakang" : "Kamera Depan"})`}
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="py-2.5 px-3 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines text-ink-muted hover:text-rose-500 text-xs font-mono transition-colors"
                    title="Tutup Kamera"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startAutoSession}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-accent-coral hover:bg-rose-500 text-white font-bold font-sans text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    Mulai Sesi 4 Pose (Auto)
                  </button>
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="py-2.5 px-3 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines text-ink-navy dark:text-white hover:bg-paper-dark text-xs font-mono transition-colors flex items-center justify-center"
                    title="Pratinjau Kamera Dulu"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              )
            ) : !cameraActive ? (
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="w-full py-2.5 px-4 rounded-xl bg-accent-coral hover:bg-rose-500 text-white font-bold font-sans text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
              >
                <Camera className="w-4 h-4" />
                Nyalakan Kamera
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-sans text-xs flex items-center justify-center gap-2 shadow-sm animate-pulse transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Jepret Sekarang
                </button>
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="py-2.5 px-3 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines text-ink-navy dark:text-white hover:bg-paper-dark dark:hover:bg-darkbg-border text-xs font-mono transition-colors flex items-center justify-center"
                  title={`Ganti kamera (${facingMode === "user" ? "Kamera Belakang" : "Kamera Depan"})`}
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={stopCamera}
                  className="py-2.5 px-3 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines text-ink-muted hover:text-rose-500 text-xs font-mono transition-colors"
                  title="Tutup Kamera"
                >
                  Batal
                </button>
              </div>
            )}

            <label className="w-full py-2 px-4 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines text-ink-navy dark:text-white font-mono text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-paper-dark transition-colors">
              <Upload className="w-3.5 h-3.5 text-ink-muted" />
              <span>Unggah File dari Galeri</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Sticker Overlay Drawer */}
          <div className="pt-2 border-t border-paper-lines dark:border-white/10">
            <span className="block text-xs font-mono font-bold text-ink-muted mb-2 uppercase">
              Tambah Stiker Wisuda:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {["sekolah-toga", "dev-code-tag", "momen-bintang", "ekspresi-siput", "gim-controller"].map((sId) => (
                <button
                  key={sId}
                  type="button"
                  onClick={() => addSticker(sId)}
                  className="p-1 rounded-lg bg-paper-base dark:bg-darkbg-base hover:scale-110 active:scale-95 transition-transform border border-paper-lines"
                  title="Tempel stiker ke foto"
                >
                  <Sticker id={sId} size={32} decorative />
                </button>
              ))}
            </div>
          </div>

          {/* Export / Reset */}
          <div className="pt-2 border-t border-paper-lines dark:border-white/10 flex items-center gap-2">
            <button
              type="button"
              disabled={!hasPhotoToExport || isExporting}
              onClick={exportPhoto}
              className="flex-1 py-2.5 px-4 rounded-xl bg-accent-mustard hover:bg-amber-400 text-ink-navy font-bold font-sans text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-40"
            >
              {isExporting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-ink-navy" />
                  <span>Memproses Resolusi Asli...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh Hasil PNG</span>
                </>
              )}
            </button>

            {hasSomethingToReset && (
              <button
                type="button"
                onClick={resetAll}
                className="p-2.5 rounded-xl bg-paper-base dark:bg-darkbg-base border border-paper-lines text-ink-muted hover:text-ink-navy dark:hover:text-white"
                title="Reset foto"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
