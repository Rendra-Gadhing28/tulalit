/**
 * Utility untuk menghasilkan nilai acak deterministik berbasis seed/hash.
 * Menghindari hydration mismatch pada Next.js SSR karena output selalu sama
 * untuk ID yang sama di server dan client.
 */

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Mengembalikan angka deterministik dalam rentang [min, max] berdasarkan seed string.
 */
export function getDeterministicRange(
  seed: string,
  min: number,
  max: number,
  salt: number = 0
): number {
  const hash = hashString(`${seed}-${salt}`);
  const normalized = (hash % 10000) / 10000;
  return min + normalized * (max - min);
}

/**
 * Mengembalikan rotasi acak scrapbook yang stabil (-3.5 deg s/d +3.5 deg).
 */
export function getStableRotation(seed: string, maxDeg: number = 3.5): number {
  return Number(getDeterministicRange(seed, -maxDeg, maxDeg).toFixed(2));
}

/**
 * Mengembalikan posisi pita washi deterministik ("top-center" | "top-left" | "top-right")
 */
export function getStableTapeVariant(
  seed: string
): "top-center" | "top-left" | "top-right" {
  const mod = hashString(seed) % 3;
  if (mod === 0) return "top-left";
  if (mod === 1) return "top-right";
  return "top-center";
}
