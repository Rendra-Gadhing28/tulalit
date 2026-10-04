/**
 * Daftar kata terlarang untuk sensor otomatis di Buku Tamu.
 * Mudah diedit dan ditambahkan.
 */
export const badWordsList: string[] = [
  "anjing",
  "babi",
  "bangsat",
  "bajingan",
  "kontol",
  "memek",
  "pantek",
  "asu",
  "tolol",
  "goblok",
  "idiot",
  "tai",
  "kampret",
  "ngentot",
  "jembut",
  "perek",
  "lonte",
];

export function containsBadWords(text: string): boolean {
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return badWordsList.some((word) => normalized.includes(word));
}

export function sanitizeText(text: string): string {
  let cleaned = text;
  badWordsList.forEach((word) => {
    const regex = new RegExp(word, "gi");
    cleaned = cleaned.replace(regex, "*".repeat(word.length));
  });
  return cleaned;
}
