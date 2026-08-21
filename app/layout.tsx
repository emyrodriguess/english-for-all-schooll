import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";

import { siteConfig } from "@/config/site";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

const previewUrl = process.env.VERCEL_URL
  ? new URL(`https://${process.env.VERCEL_URL}`)
  : new URL("http://localhost:3000");

const title = "English For All | Aulas de Inglês Online para Todas as Idades";
const socialImage = {
  url: "/brand/open-graph-social-share.png",
  width: 1729,
  height: 910,
  alt: "English For All — Inglês para a vida real.",
};

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ?? previewUrl,
  title,
  description: siteConfig.description,
  applicationName: "English For All",
  creator: "English For All",
  publisher: "English For All",
  category: "education",
  alternates: siteConfig.siteUrl ? { canonical: "/" } : undefined,
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title,
    description: siteConfig.description,
    type: "website",
    locale: "pt_BR",
    siteName: "English For All",
    url: siteConfig.siteUrl ? "/" : undefined,
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
    images: [socialImage],
  },
  robots: siteConfig.siteUrl
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false, noarchive: true },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#102a43",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={poppins.variable} lang="pt-BR" suppressHydrationWarning>
      <body>
        {children}
        {process.env.VERCEL ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
