import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";

import { ClickBurst } from "@/components/motion/click-burst";
import { Cursor } from "@/components/motion/cursor";
import { PageTransition } from "@/components/motion/page-transition";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const description =
  "HelsaGrace Okporho designs and builds digital products — from the first user problem to the last database migration. Product Design, UI/UX, Full-Stack Development, AI.";

export const metadata: Metadata = {
  title: {
    default: "HelsaGrace — Product Designer & Full-Stack Developer",
    template: "%s · HelsaGrace",
  },
  description,
  authors: [{ name: "HelsaGrace Okporho" }],
  keywords: [
    "HelsaGrace Okporho",
    "Product Designer",
    "UI/UX Designer",
    "Full-Stack Developer",
    "AI",
    "Nigeria",
  ],
  openGraph: {
    title: "HelsaGrace — Product Designer & Full-Stack Developer",
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HelsaGrace — Product Designer & Full-Stack Developer",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f9f9fb",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Marks that JS is available so scroll-reveal can safely hide content first. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              "try{if(sessionStorage.getItem('hg-intro')==='1')document.documentElement.classList.add('intro-seen')}catch(e){}",
          }}
        />
      </head>
      <body>
        <SmoothScroll>
          <ScrollProgress />
          <Cursor />
          <ClickBurst />
          <PageTransition />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
