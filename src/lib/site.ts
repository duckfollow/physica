/** Absolute site origin without trailing slash, e.g. https://duckfollow.github.io */
export function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://duckfollow.github.io").replace(/\/$/, "");
}

/** Public base path without trailing slash, e.g. /physica or "". */
export function siteBasePath() {
  return (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
}

/**
 * metadataBase should be the origin only. Next.js already prefixes asset paths
 * with NEXT_PUBLIC_BASE_PATH / basePath, so including it here doubles /physica.
 */
export function siteUrl() {
  return new URL(`${siteOrigin()}/`);
}

/** Full public URL for a path, including optional GitHub Pages project base path. */
export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(`${siteBasePath()}${normalized}`, `${siteOrigin()}/`);
}

export const siteName = "Physica";
export const siteDescription =
  "สำรวจฟิสิกส์ ชีววิทยา เคมี และคณิตศาสตร์ ผ่านภาพจำลองที่ปรับตัวแปรได้ ตั้งแต่ประถมถึงมหาวิทยาลัย";
