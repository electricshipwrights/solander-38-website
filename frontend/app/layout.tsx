// must stay above every other import: Turbopack's production build orders CSS
// chunks by module-graph traversal, so any JS import listed first pulls in the
// component tree's CSS modules and emits them *before* globals
import "./globals.scss";

import type { Metadata } from "next";
import { AcuminPro } from "./_fonts";
import { SanityLive } from "@/sanity/lib/live";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/app/consts";

export const metadata: Metadata = {
  title: "Solander 38 | Electric Shipwrights Society",
  description:
    "A self-sufficient, solar-electric, coastal cruising power catamaran.",
  icons: `${SITE_URL}/rising-tide.svg`,
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={AcuminPro.variable}>
      <body>
        {children}
        {process.env.NEXT_PUBLIC_PREVIEW_SITE === "true" && <SanityLive />}
      </body>
    </html>
  );
}
