/**
 * Cloudinary image URL optimization utilities.
 *
 * - `optimizeCloudinaryUrl` — used at **storage time** (upload / room save)
 *   to bake transforms into the URL persisted in MongoDB.
 * - `optimizedImageUrl` — used at **display time** to swap to a context-
 *   specific width preset (card, hero, gallery, thumbnail).
 * - `isCloudinaryUrl` — detect Cloudinary URLs so `<Image>` can skip
 *   Next.js re-optimisation with `unoptimized={true}`.
 */

const CLOUDINARY_BASE = "res.cloudinary.com";

/* ------------------------------------------------------------------ */
/*  Storage-time optimization (baked into MongoDB)                     */
/* ------------------------------------------------------------------ */

/**
 * Inject Cloudinary delivery transforms into a URL.
 * Safe to call on any string — non-Cloudinary URLs pass through unchanged.
 *
 * @param url   Raw Cloudinary `secure_url` from an upload response
 * @param width Max delivery width (default 1600)
 *
 * Example:
 *   in:  https://res.cloudinary.com/x/image/upload/v1/gokyo-lake/rooms/a.jpg
 *   out: https://res.cloudinary.com/x/image/upload/f_auto,q_auto,w_1600,c_limit/v1/gokyo-lake/rooms/a.jpg
 */
export function optimizeCloudinaryUrl(url: string, width = 1600): string {
  if (!url || !url.includes(CLOUDINARY_BASE)) return url;

  // Strip any existing f_auto / q_auto / w_ / c_ transforms so we never
  // double-stack them (safe to call multiple times on the same URL).
  const stripped = stripCloudinaryTransforms(url);

  const transforms = `f_auto,q_auto,w_${width},c_limit`;
  const parts = stripped.split("/upload/");
  if (parts.length !== 2) return url;

  return `${parts[0]}/upload/${transforms}/${parts[1]}`;
}

/**
 * Process an array of image URLs for database storage.
 * Each Cloudinary URL gets `f_auto,q_auto,w_1600,c_limit` baked in.
 */
export function optimizeImageUrls(urls: string[]): string[] {
  return urls
    .map((u) => u.trim())
    .filter((u) => u && /^https?:\/\//i.test(u))
    .map((u) => optimizeCloudinaryUrl(u));
}

/* ------------------------------------------------------------------ */
/*  Display-time presets                                               */
/* ------------------------------------------------------------------ */

type ImagePreset = "card" | "hero" | "gallery" | "thumbnail";

const PRESET_WIDTHS: Record<ImagePreset, number> = {
  card: 1200,
  hero: 2400,
  gallery: 1800,
  thumbnail: 600,
};

/**
 * Swap the width in a (possibly already-optimised) Cloudinary URL to a
 * context-specific preset.  Used in frontend components.
 */
export function optimizedImageUrl(
  url: string,
  preset: ImagePreset = "card"
): string {
  if (!url || !url.includes(CLOUDINARY_BASE)) return url;

  // Remove any existing transforms so we can insert the preset cleanly.
  const stripped = stripCloudinaryTransforms(url);

  const width = PRESET_WIDTHS[preset];
  const transforms = `f_auto,q_auto,w_${width},c_limit`;

  const parts = stripped.split("/upload/");
  if (parts.length !== 2) return url;

  return `${parts[0]}/upload/${transforms}/${parts[1]}`;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Returns true when the URL points to a Cloudinary-hosted image.
 */
export function isCloudinaryUrl(url: string): boolean {
  return !!url && url.includes(CLOUDINARY_BASE);
}

/**
 * Remove inline Cloudinary transforms (the segment between /upload/ and the
 * version or folder path) so we can re-insert fresh ones.
 *
 * Cloudinary transform segments look like `f_auto,q_auto,w_1600,c_limit`.
 * A version/path segment starts with `v<digits>` or a folder name.
 */
function stripCloudinaryTransforms(url: string): string {
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  let rest = parts[1];

  // Transforms are comma-separated key_value pairs before the version/folder.
  // Keep stripping leading segments that look like transforms (contain _).
  const segments = rest.split("/");
  // If the first segment contains commas or underscores with known keys → strip it
  if (
    segments.length > 1 &&
    /^[a-z]_/.test(segments[0]) &&
    segments[0].includes(",")
  ) {
    segments.shift();
    rest = segments.join("/");
  }

  return `${parts[0]}/upload/${rest}`;
}

/**
 * `sizes` attribute for Next.js `<Image>` per display context.
 */
export const IMAGE_SIZES: Record<ImagePreset, string> = {
  card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  hero: "100vw",
  gallery: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  thumbnail: "80px",
};
