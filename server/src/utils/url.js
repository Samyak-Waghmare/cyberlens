import { URL_REGEX } from "../constants/index.js";

/**
 * Extract every URL-looking token from arbitrary text.
 * Adds a scheme to bare www.* matches and de-duplicates.
 */
export function extractUrls(input) {
  const matches = input.match(URL_REGEX) || [];
  const seen = new Set();
  const urls = [];

  for (let raw of matches) {
    raw = raw.replace(/[.,;:]+$/, ""); // strip trailing punctuation
    const url = raw.startsWith("http") ? raw : `http://${raw}`;
    if (!seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }

  return urls;
}

/**
 * VirusTotal v3 identifies a URL by the unpadded base64 of the URL string.
 */
export function vtUrlId(url) {
  return Buffer.from(url).toString("base64").replace(/=/g, "");
}
