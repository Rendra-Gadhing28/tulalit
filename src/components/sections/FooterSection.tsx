"use client";

import React, { useState } from "react";
import { siteConfig } from "@/data/config";
import { TerminalWindow } from "@/components/ui/TerminalWindow";
import { Sticker } from "@/components/ui/Sticker";
import { ScrapbookSlot } from "@/components/custom/ScrapbookSlot";
import { playSfx } from "@/lib/sound";
import { Terminal as TerminalIcon, Heart, Coffee } from "lucide-react";

interface FooterSectionProps {
  onTriggerSnail: () => void;
}

export function FooterSection({ onTriggerSnail }: FooterSectionProps) {
  const [clickSnailCount, setClickSnailCount] = useState<number>(0);
  const [commandInput, setCommandInput] = useState<string>("");
  const [terminalHistory, setTerminalHistory] = useState<
    { cmd: string; out: string }[]
  >([
    {
      cmd: "whoami",
      out: "sogadev@tulalit: Murid XII PPLG 3 siap menyambut dunia nyata.",
    },
  ]);

  const handleSnailClick = () => {
    playSfx("pop");
    const next = clickSnailCount + 1;
    setClickSnailCount(next);
    if (next >= 5) {
      setClickSnailCount(0);
      onTriggerSnail();
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    playSfx("click");
    let out = "";

    switch (cmd) {
      case "help":
        out = "Perintah tersedia: help, whoami, sudo lulus, ls memories, cat quote, clear";
        break;
      case "whoami":
        out = "XII PPLG 3 — Angkatan Developer SMK 8 Semarang (2025-2027)";
        break;
      case "sudo lulus":
        out = "Permission denied. Butuh restu guru.";
        try {
          const stored = localStorage.getItem("tulalit_unlocked_achievements");
          const parsed = stored ? JSON.parse(stored) : {};
          if (!parsed["hacker_sudo"]) {
            parsed["hacker_sudo"] = new Date().toISOString();
            localStorage.setItem("tulalit_unlocked_achievements", JSON.stringify(parsed));
          }
        } catch {}
        break;
      case "ls memories":
        out = "📁 mpls/   📁 praktikum-lab/   📁 study-tour/   📁 pkl/   📁 tugas-akhir/   📁 wisuda.exe";
        break;
      case "cat quote":
        out = "📜 'Jangan pernah biarkan semicolon yang hilang merusak harimu.' — Sogadev";
        break;
      case "clear":
        setTerminalHistory([]);
        setCommandInput("");
        return;
      default:
        out = `zsh: command not found: ${cmd}. Ketik 'help' untuk daftar perintah.`;
        break;
    }

    setTerminalHistory((prev) => [...prev, { cmd: commandInput, out }]);
    setCommandInput("");
  };

  return (
    <footer className="relative pt-16 pb-28 md:pb-16 px-4 md:px-8 border-t-4 border-paper-lines dark:border-darkbg-border bg-paper-light dark:bg-darkbg-card transition-colors">
      <div className="max-w-5xl mx-auto">
        {/* Hidden Interactive Terminal CLI */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <TerminalIcon className="w-5 h-5 text-accent-terminal" />
            <h3 className="font-mono text-sm font-bold text-ink-navy dark:text-white uppercase tracking-wider">
              Terminal Rahasia Pengembang
            </h3>
          </div>

          <TerminalWindow title="terminal — sogadev@tulalit: ~">
            <div className="space-y-2">
              <div className="text-gray-400 text-xs">
                Ketik <span className="text-accent-terminal font-bold">&apos;help&apos;</span>{" "}
                untuk melihat perintah rahasia.
              </div>

              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-accent-terminal">
                    <span>sogadev@tulalit:~$</span>
                    <span className="text-white">{item.cmd}</span>
                  </div>
                  <div className="text-gray-300 pl-4 whitespace-pre-wrap">
                    {item.out}
                  </div>
                </div>
              ))}

              {/* Input Line */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 pt-1">
                <span className="text-accent-terminal">sogadev@tulalit:~$</span>
                <input
                  type="text"
                  aria-label="Ketik perintah terminal"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="ketik perintah..."
                  className="flex-1 bg-transparent border-none outline-none font-mono text-white text-sm"
                />
              </form>
            </div>
          </TerminalWindow>
        </div>

        {/* Footer Meta Row */}
        <div className="pt-8 border-t border-paper-lines dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Brand & Snail Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSnailClick}
              className="p-1 rounded-full hover:bg-paper-base dark:hover:bg-darkbg-base transition-transform active:scale-90"
              title="Klik aku 5 kali untuk easter egg!"
              aria-label="Logo Tulalit"
            >
              <Sticker id="ekspresi-siput" size={44} decorative />
            </button>
            <div>
              <span className="font-hand font-bold text-2xl text-ink-navy dark:text-white block leading-none">
                {siteConfig.className} — {siteConfig.circleName}
              </span>
              <span className="font-mono text-xs text-ink-muted">
                {siteConfig.tagline}
              </span>
            </div>
          </div>

          {/* Credits */}
          <div className="font-mono text-xs text-ink-muted space-y-1">
            <p className="flex items-center justify-center md:justify-end gap-1.5">
              <span>Made with</span>
              <Coffee className="w-3.5 h-3.5 text-amber-600 inline" />
              <span>& sedikit kesabaran (karena Tulalit)</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            </p>
            <p className="text-gray-400">
              © {new Date().getFullYear()} {siteConfig.className}. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Reserved Slot Ruang Kosong */}
      <ScrapbookSlot id="footer-custom-slot" hint="Ruang Kosong untuk Footer Kustom Kamu" />
    </footer>
  );
}
