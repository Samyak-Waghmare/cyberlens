import { config } from "../config/env.js";
import { VT_FLAG_CATEGORIES } from "../constants/index.js";
import { vtUrlId } from "../utils/url.js";

/**
 * Query VirusTotal for a single URL.
 * Returns null on any failure so the caller can degrade gracefully.
 */
async function checkUrl(url) {
  try {
    const id = vtUrlId(url);
    const resp = await fetch(`${config.virustotal.baseUrl}/urls/${id}`, {
      method: "GET",
      headers: { "x-apikey": config.virustotal.apiKey },
    });

    if (!resp.ok) {
      // 404 = URL never submitted to VT. Not an error, just unknown.
      return { url, found: resp.status !== 404, status: resp.status };
    }

    const json = await resp.json();
    const attrs = json?.data?.attributes || {};
    const stats = attrs.last_analysis_stats || {};
    const results = attrs.last_analysis_results || {};

    const flaggedBy = Object.entries(results)
      .filter(([, r]) => VT_FLAG_CATEGORIES.includes(r.category))
      .map(([vendor]) => vendor);

    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetected = stats.undetected || 0;

    return {
      url,
      found: true,
      malicious,
      suspicious,
      harmless,
      undetected,
      total_engines: malicious + suspicious + harmless + undetected,
      flagged_by: flaggedBy,
      reputation: attrs.reputation ?? null,
    };
  } catch (err) {
    // Silently handle error in production
    return null;
  }
}

/**
 * Collapse multiple per-URL results into a single headline summary,
 * using the worst-scoring URL.
 */
function aggregate(results) {
  const valid = results.filter((r) => r && r.found && r.total_engines);

  if (valid.length === 0) {
    const checkedAny = results.some((r) => r);
    return {
      checked: checkedAny,
      malicious: 0,
      suspicious: 0,
      total_engines: 0,
      flagged_by: [],
      note: checkedAny
        ? "URLs were checked but are not yet known to VirusTotal."
        : "No URLs found to check.",
    };
  }

  valid.sort((a, b) => b.malicious + b.suspicious - (a.malicious + a.suspicious));
  const worst = valid[0];
  const flaggedBy = [...new Set(valid.flatMap((r) => r.flagged_by))];

  return {
    checked: true,
    malicious: worst.malicious,
    suspicious: worst.suspicious,
    total_engines: worst.total_engines,
    flagged_by: flaggedBy.slice(0, 5),
    scanned_url: worst.url,
  };
}

const emptySummary = (note) => ({
  checked: false,
  malicious: 0,
  suspicious: 0,
  total_engines: 0,
  flagged_by: [],
  note,
});

/**
 * Scan a list of URLs and return an aggregated summary. Best-effort:
 * never throws, always returns a renderable summary object.
 */
export async function scanUrls(urls) {
  if (urls.length === 0) {
    return emptySummary("No URLs found to check.");
  }
  if (!config.virustotal.apiKey) {
    return emptySummary("URLs found, but VIRUSTOTAL_API_KEY is not configured.");
  }

  const limited = urls.slice(0, config.virustotal.maxUrlsPerScan);
  const results = await Promise.all(limited.map(checkUrl));
  return aggregate(results);
}

/**
 * Query VirusTotal for a file hash.
 */
export async function scanFileHash(hash) {
  if (!config.virustotal.apiKey) {
    return emptySummary("File hash provided, but VIRUSTOTAL_API_KEY is not configured.");
  }

  try {
    const resp = await fetch(`${config.virustotal.baseUrl}/files/${hash}`, {
      method: "GET",
      headers: { "x-apikey": config.virustotal.apiKey },
    });

    if (!resp.ok) {
      return emptySummary(resp.status === 404 ? "File hash not known to VirusTotal." : "VirusTotal file scan failed.");
    }

    const json = await resp.json();
    const attrs = json?.data?.attributes || {};
    const stats = attrs.last_analysis_stats || {};
    const results = attrs.last_analysis_results || {};

    const flaggedBy = Object.entries(results)
      .filter(([, r]) => VT_FLAG_CATEGORIES.includes(r.category))
      .map(([vendor]) => vendor);

    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const harmless = stats.harmless || 0;
    const undetected = stats.undetected || 0;

    return {
      checked: true,
      malicious,
      suspicious,
      total_engines: malicious + suspicious + harmless + undetected,
      flagged_by: flaggedBy.slice(0, 5),
      scanned_hash: hash,
    };
  } catch (err) {
    return emptySummary("VirusTotal file hash check failed.");
  }
}
