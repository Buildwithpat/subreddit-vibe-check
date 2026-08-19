import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibecheck.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Vibecheck — Reddit Sentiment Intelligence",
    template: "%s | Vibecheck",
  },
  description:
    "Analyze the sentiment and community vibe of any subreddit instantly. Real-time AFINN NLP analysis of Reddit's top 50 hot posts.",
  keywords: [
    "reddit sentiment analysis",
    "subreddit vibe check",
    "reddit NLP",
    "community mood analyzer",
    "reddit analytics",
    "AFINN sentiment",
  ],
  authors: [{ name: "Vibecheck" }],
  creator: "Vibecheck",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Vibecheck",
    title: "Vibecheck — Reddit Sentiment Intelligence",
    description:
      "Analyze the sentiment and community vibe of any subreddit instantly. Real-time AFINN NLP analysis of Reddit's top 50 hot posts.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vibecheck — Reddit Sentiment Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibecheck — Reddit Sentiment Intelligence",
    description:
      "Analyze the sentiment and community vibe of any subreddit instantly.",
    images: ["/og-image.png"],
    creator: "@vibecheck",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#030303" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${ibmPlexSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://www.reddit.com" />
        <link rel="dns-prefetch" href="https://www.reddit.com" />
      </head>
      <body className="antialiased selection:bg-[#FF4500]/30 transition-colors duration-150">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          <a href="#main-content" className="skip-to-main">
            Skip to main content
          </a>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
