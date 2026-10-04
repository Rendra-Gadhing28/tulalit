import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Press_Start_2P,
} from "next/font/google";
import "./globals.css";
import { QualityProvider } from "@/lib/quality";
import { siteConfig } from "@/data/config";
import { PwaManager } from "@/components/ui/PwaManager";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caveat",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-press-start",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FFF8E7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sogadev-tulalit.vercel.app"
  ),
  title: `${siteConfig.className} — ${siteConfig.circleName} | Commit Terakhir`,
  description: `${siteConfig.tagline}. Website kenangan kelas ${siteConfig.className} ${siteConfig.schoolName}.`,
  keywords: [
    "Yearbook",
    "Kenangan Sekolah",
    "XII PPLG 3",
    "Sogadev",
    "Tulalit",
    "SMK",
    "Software Engineering",
  ],
  authors: [{ name: "Sogadev Development Team" }],
  openGraph: {
    title: `${siteConfig.className} — ${siteConfig.circleName} | Commit Terakhir`,
    description: siteConfig.tagline,
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.className} — ${siteConfig.circleName}`,
    description: siteConfig.tagline,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${caveat.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} ${pressStart.variable} scroll-smooth`}
    >
      <body className="antialiased selection:bg-accent-mustard selection:text-ink-navy">
        <QualityProvider>
          {children}
          <PwaManager />
        </QualityProvider>
      </body>
    </html>
  );
}
