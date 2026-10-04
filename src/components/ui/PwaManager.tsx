"use client";

import React, { useEffect, useState } from "react";
import { Download, X, WifiOff } from "lucide-react";

export function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Register Service Worker in production only, clean in development
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (
        process.env.NODE_ENV === "production" &&
        window.location.hostname !== "localhost"
      ) {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((err) => console.log("SW register failed:", err));
      } else {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }
    }

    // Network status listener
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();

    // PWA Install Prompt Listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      // Only show if user hasn't dismissed before
      const dismissed = localStorage.getItem("tulalit_pwa_dismissed");
      if (!dismissed) {
        setInstallPrompt(e);
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem("tulalit_pwa_dismissed", "true");
    } catch {}
  };

  return (
    <>
      {/* Offline Toast Banner */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900 text-amber-300 rounded-full border border-amber-400 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl animate-fade-in"
        >
          <WifiOff className="w-3.5 h-3.5 text-rose-400" />
          <span>Kamu offline, tapi kenangan tetap ada &amp; bisa dibuka.</span>
        </div>
      )}

      {/* PWA Install Banner */}
      {showPrompt && (
        <div className="fixed bottom-24 right-4 z-50 max-w-xs bg-paper-light dark:bg-darkbg-card p-4 rounded-2xl border-2 border-amber-400 shadow-2xl text-ink-navy dark:text-white flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex-1 min-w-0">
            <h5 className="font-bold text-xs truncate">Pasang ke Layar Utama?</h5>
            <p className="font-sans text-[11px] text-ink-muted">
              Buka website kapan saja serasa aplikasi native offline!
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="p-1.5 rounded-lg bg-amber-400 text-ink-navy hover:bg-amber-300 font-bold text-xs"
              title="Pasang PWA"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-ink-muted hover:text-ink-navy dark:hover:text-white"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
