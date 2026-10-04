import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XII PPLG 3 — Sogadev x Tulalit | Commit Terakhir",
    short_name: "Tulalit XII PPLG 3",
    description: "Website Kenangan Digital Scrapbook & Yearbook XII PPLG 3",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8E7",
    theme_color: "#F4B942",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
