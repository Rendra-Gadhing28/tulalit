"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Download, Trash2, Undo2, PenTool } from "lucide-react";

const COLORS = [
  { label: "Hitam Spidol", value: "#1A1A1A" },
  { label: "Biru Pulpen", value: "#1A4FA0" },
  { label: "Merah Guru", value: "#CC1F1F" },
  { label: "Spidol Emas", value: "#C8960C" },
  { label: "Spidol Hijau", value: "#1A7A3A" },
  { label: "Stabilo Kuning", value: "#FFE83A" },
];

const SIZES = [
  { label: "Kecil", value: 2 },
  { label: "Sedang", value: 5 },
  { label: "Tebal", value: 12 },
];

// Draw PDL shirt silhouette on canvas
function drawShirt(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const strokeColor = "#C9C1A8";
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // --- Shirt body ---
  ctx.beginPath();
  // Left shoulder → left sleeve tip
  ctx.moveTo(cx - 110, h * 0.12);
  ctx.lineTo(cx - 170, h * 0.28);
  // Left sleeve bottom
  ctx.lineTo(cx - 150, h * 0.38);
  // Left armhole back in
  ctx.lineTo(cx - 95, h * 0.26);
  // Left side → hem
  ctx.lineTo(cx - 90, h * 0.9);
  // Bottom hem
  ctx.lineTo(cx + 90, h * 0.9);
  // Right side
  ctx.lineTo(cx + 95, h * 0.26);
  // Right armhole
  ctx.lineTo(cx + 150, h * 0.38);
  ctx.lineTo(cx + 170, h * 0.28);
  ctx.lineTo(cx + 110, h * 0.12);
  // Right collar slope
  ctx.lineTo(cx + 40, h * 0.07);
  // V-neck right
  ctx.lineTo(cx + 18, h * 0.22);
  // Bottom of V
  ctx.lineTo(cx, h * 0.29);
  // V-neck left
  ctx.lineTo(cx - 18, h * 0.22);
  ctx.lineTo(cx - 40, h * 0.07);
  ctx.closePath();
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.stroke();

  // --- Collar left flap ---
  ctx.beginPath();
  ctx.moveTo(cx - 40, h * 0.07);
  ctx.lineTo(cx - 18, h * 0.22);
  ctx.lineTo(cx, h * 0.29);
  ctx.lineTo(cx - 5, h * 0.07);
  ctx.closePath();
  ctx.fillStyle = "#F5F0E8";
  ctx.fill();
  ctx.stroke();

  // --- Collar right flap ---
  ctx.beginPath();
  ctx.moveTo(cx + 40, h * 0.07);
  ctx.lineTo(cx + 18, h * 0.22);
  ctx.lineTo(cx, h * 0.29);
  ctx.lineTo(cx + 5, h * 0.07);
  ctx.closePath();
  ctx.fillStyle = "#F5F0E8";
  ctx.fill();
  ctx.stroke();

  // --- Center button placket line ---
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.moveTo(cx, h * 0.29);
  ctx.lineTo(cx, h * 0.9);
  ctx.stroke();
  ctx.setLineDash([]);

  // --- Buttons ---
  const buttonY = [0.34, 0.44, 0.54, 0.64, 0.74];
  buttonY.forEach((by) => {
    ctx.beginPath();
    ctx.arc(cx, h * by, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#E0D9C8";
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  });

  // --- Left chest pocket ---
  const px = cx - 60;
  const py = h * 0.35;
  const pw = 40;
  const ph = 35;
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.fillStyle = "#F8F4EC";
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Pocket flap
  ctx.beginPath();
  ctx.moveTo(px, py + 10);
  ctx.lineTo(px + pw, py + 10);
  ctx.stroke();

  ctx.restore();
}

export function SeragamDigital() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(COLORS[0].value);
  const [size, setSize] = useState(SIZES[1].value);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const history = useRef<ImageData[]>([]);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return {
        x: (t.clientX - rect.left) * scaleX,
        y: (t.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawShirt(ctx, canvas.width, canvas.height);
    history.current = [];
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (history.current.length > 50) history.current.shift();
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveHistory();
    setIsDrawing(true);
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !lastPos.current) return;

    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // Stabilo: semi-transparent
    ctx.globalAlpha = color === "#FFE83A" ? 0.55 : 1;
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    lastPos.current = pos;
  };

  const stopDraw = () => setIsDrawing(false);

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prev = history.current.pop();
    if (prev) ctx.putImageData(prev, 0, 0);
  };

  const handleClear = () => {
    initCanvas();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Compose: white bg + current canvas + watermark
    const out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    const octx = out.getContext("2d")!;
    octx.fillStyle = "#FFFFFF";
    octx.fillRect(0, 0, out.width, out.height);
    octx.drawImage(canvas, 0, 0);

    // Watermark
    octx.save();
    octx.globalAlpha = 0.18;
    octx.font = `bold ${Math.floor(out.width / 20)}px monospace`;
    octx.fillStyle = "#1F2937";
    octx.textAlign = "center";
    octx.textBaseline = "bottom";
    octx.translate(out.width / 2, out.height - 12);
    octx.rotate(-0.15);
    octx.fillText("Kenang-kenangan Tulalit", 0, 0);
    octx.restore();

    const link = document.createElement("a");
    link.download = "seragam-tulalit.png";
    link.href = out.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start justify-center">
        {/* Canvas */}
        <div className="relative border-2 border-paper-lines dark:border-darkbg-border shadow-scrapbook bg-white rounded-sm overflow-hidden"
          style={{ touchAction: "none" }}>
          <canvas
            ref={canvasRef}
            width={420}
            height={480}
            className="block w-full max-w-[420px] cursor-crosshair"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
            onTouchCancel={stopDraw}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 min-w-[160px]">
          {/* Color palette */}
          <div>
            <p className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
              Warna
            </p>
            <div className="grid grid-cols-3 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => setColor(c.value)}
                  className={`w-9 h-9 rounded-full border-4 transition-transform active:scale-90 ${
                    color === c.value
                      ? "border-ink-navy scale-110 shadow-md"
                      : "border-paper-lines"
                  }`}
                  style={{ background: c.value }}
                />
              ))}
            </div>
            <p className="font-mono text-[10px] text-ink-muted mt-1">
              {COLORS.find((c) => c.value === color)?.label}
            </p>
          </div>

          {/* Brush size */}
          <div>
            <p className="font-mono text-xs font-bold text-ink-muted uppercase tracking-wider mb-2">
              Ukuran
            </p>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  title={s.label}
                  onClick={() => setSize(s.value)}
                  className={`flex items-center justify-center w-9 h-9 border-2 rounded-sm font-mono text-xs font-bold transition-all ${
                    size === s.value
                      ? "border-ink-navy bg-ink-navy text-white"
                      : "border-paper-lines text-ink-muted bg-paper-base dark:bg-darkbg-base"
                  }`}
                >
                  <span
                    className="rounded-full bg-current"
                    style={{ width: s.value + 4, height: s.value + 4 }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-2 px-3 py-2 border-2 border-paper-lines dark:border-darkbg-border font-mono text-xs font-bold text-ink-brown dark:text-gray-300 bg-paper-base dark:bg-darkbg-base hover:bg-paper-dark transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" /> Undo
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-2 border-2 border-paper-lines dark:border-darkbg-border font-mono text-xs font-bold text-ink-brown dark:text-gray-300 bg-paper-base dark:bg-darkbg-base hover:bg-paper-dark transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 border-2 border-accent-mustard font-mono text-xs font-bold text-ink-navy bg-accent-mustard hover:bg-amber-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Simpan Coretan (PNG)
            </button>
          </div>

          <p className="font-hand text-sm text-ink-muted text-center">
            <PenTool className="w-4 h-4 mr-1.5 inline text-accent-mustard" /> Coret seragam<br />virtual kelas!
          </p>
        </div>
      </div>
    </div>
  );
}
