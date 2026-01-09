import "server-only";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export function withDomain(path?: string) {
  if (!path) return undefined;

  // already absolute
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (!SITE_URL) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
  }

  return `${SITE_URL}${path}`;
}
