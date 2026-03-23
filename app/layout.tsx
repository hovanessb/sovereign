import type { Metadata, Viewport } from "next";
import { Spectral, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ─── Font Configuration ──────────────────────────────────────────────────────

/**
 * Spectral – the sovereign voice of BARTAMIAN.
 * Used exclusively for the logo, display headings, and editorial pull quotes.
 * Italic weights lend the brand its dramatic, old-world authority.
 */
const spectral = Spectral({
  subsets:  ["latin"],
  weight:   ["300", "400", "500", "600", "700", "800"],
  style:    ["normal", "italic"],
  variable: "--font-spectral",
  display:  "swap",
});

/**
 * Geist Sans – the functional counterweight.
 * Clean, modern, and invisible—lets the content breathe.
 */
const geistSans = Geist({
  subsets:  ["latin"],
  variable: "--font-geist-sans",
  display:  "swap",
});

/**
 * Geist Mono – for price points, product IDs, and technical metadata.
 * The precision of a watchmaker's engraving.
 */
const geistMono = Geist_Mono({
  subsets:  ["latin"],
  variable: "--font-geist-mono",
  display:  "swap",
});

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default:  "BARTAMIAN — Uncompromising & Sovereign",
    template: "%s | BARTAMIAN",
  },
  description:
    "High-end gold jewelry forged with industrial precision. BARTAMIAN pieces are not worn—they are wielded.",
  keywords: [
    "gold jewelry",
    "luxury jewelry",
    "artisan gold",
    "high-end jewelry",
    "BARTAMIAN",
    "sovereign jewelry",
  ],
  authors:  [{ name: "BARTAMIAN Atelier" }],
  creator:  "BARTAMIAN",
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://bartamian.com",
    siteName:    "BARTAMIAN",
    title:       "BARTAMIAN — Uncompromising & Sovereign",
    description: "High-end gold jewelry forged with industrial precision.",
    images: [
      {
        url:    "/og-image.jpg",
        width:  1200,
        height: 630,
        alt:    "BARTAMIAN — Uncompromising & Sovereign",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "BARTAMIAN — Uncompromising & Sovereign",
    description: "High-end gold jewelry forged with industrial precision.",
    images:      ["/og-image.jpg"],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:                  true,
      follow:                 true,
      "max-video-preview":    -1,
      "max-image-preview":    "large",
      "max-snippet":          -1,
    },
  },
  icons: {
    icon:        "/favicon.ico",
    shortcut:    "/favicon-16x16.png",
    apple:       "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor:   "#050505",
};

import { CartDrawer } from "@/components/CartDrawer";

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`
        dark
        ${spectral.variable}
        ${geistSans.variable}
        ${geistMono.variable}
      `}
      suppressHydrationWarning
    >
      <head>
        {/*
          Preconnect to Google Fonts for faster font loading.
          next/font handles the actual font delivery; this is belt-and-suspenders.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="
          bg-obsidian
          text-ivory
          font-geist
          antialiased
          selection:bg-gold/30
          selection:text-gold-bright
          overflow-x-hidden
        "
      >
        {/*
          ── Ambient Forge Glow ─────────────────────────────────────────────
          A persistent, subtle radial glow from the bottom of the viewport—
          as if there's always a forge burning just below the fold.
        */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            fixed inset-0 z-0
            bg-forge-glow
            opacity-40
          "
        />

        {/*
          ── Global Grain Texture ───────────────────────────────────────────
          Film-grain SVG noise overlay. Prevents the flat, digital look.
          Opacity intentionally low—felt, not seen.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize:   "128px 128px",
          }}
        />

        {/* ── App Shell ─────────────────────────────────────────────────── */}
        <CartDrawer />
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
