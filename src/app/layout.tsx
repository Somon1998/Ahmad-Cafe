import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ThemeScript } from "@/components/providers/ThemeScript";
import { SITE } from "@/constants/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.shortName} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.shortName,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/hero-shawarma.jpg", width: 1200, height: 630, alt: SITE.shortName }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.shortName,
    description: SITE.description,
    images: ["/images/hero-shawarma.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${dmSans.variable} ${playfair.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
