export const SITE_URL =
  process.env.NEXT_PUBLIC_PREVIEW_SITE === "true"
    ? "https://solander38-preview.netlify.app"
    : "https://solander38.com";

// used wherever a page has no share image of its own; the homepage's can be
// overridden in Sanity (homepage → Share image)
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-homepage.jpg`,
  width: 1200,
  height: 630,
  alt: "Solander 38",
};

export const SYSTEM_ORDER = [
  "overview",
  "power architecture",
  "superstructure",
  "control",
  "propulsion",
  "body",
  "water & heating systems",
  "outfitting & interior",
];
