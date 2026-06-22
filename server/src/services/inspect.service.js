import { ApiError } from "../utils/ApiError.js";

const SECURITY_HEADERS = [
  {
    key: "strict-transport-security",
    name: "HSTS",
    detail: "Forces browsers to use HTTPS, preventing downgrade & cookie-hijacking attacks.",
    weight: 20,
  },
  {
    key: "content-security-policy",
    name: "Content-Security-Policy",
    detail: "Blocks cross-site scripting (XSS) by controlling what resources can load.",
    weight: 25,
  },
  {
    key: "x-frame-options",
    name: "X-Frame-Options",
    detail: "Prevents clickjacking by disallowing the site from being framed.",
    weight: 15,
  },
  {
    key: "x-content-type-options",
    name: "X-Content-Type-Options",
    detail: "Stops MIME-sniffing attacks (should be 'nosniff').",
    weight: 12,
  },
  {
    key: "referrer-policy",
    name: "Referrer-Policy",
    detail: "Limits how much referrer information leaks to other sites.",
    weight: 10,
  },
  {
    key: "permissions-policy",
    name: "Permissions-Policy",
    detail: "Restricts access to camera, mic, geolocation and other powerful features.",
    weight: 10,
  },
];

// Headers that leak server software / version (information disclosure).
const DISCLOSURE_HEADERS = ["server", "x-powered-by", "x-aspnet-version"];

function normalizeUrl(input) {
  let url = (input || "").trim();
  if (!url) throw ApiError.badRequest("Please provide a website URL.");
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    return new URL(url).toString();
  } catch {
    throw ApiError.badRequest("That doesn't look like a valid URL.");
  }
}

function gradeFor(pct) {
  if (pct >= 90) return "A";
  if (pct >= 75) return "B";
  if (pct >= 55) return "C";
  if (pct >= 35) return "D";
  return "F";
}

export async function inspectWebsite(rawUrl) {
  const url = normalizeUrl(rawUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  let resp;
  try {
    resp = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "AI-Scam-Shield-Inspector/1.0" },
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      throw ApiError.badGateway("The site took too long to respond (timeout).");
    }
    throw ApiError.badGateway("Could not reach that website. Check the URL and try again.");
  }
  clearTimeout(timeout);

  const h = resp.headers;
  const finalUrl = resp.url || url;
  const isHttps = finalUrl.startsWith("https://");

  const checks = [];
  let earned = 0;
  let total = 0;

  // HTTPS itself is worth a chunk.
  total += 18;
  if (isHttps) {
    earned += 18;
    checks.push({ name: "HTTPS / TLS", status: "PASS", detail: "Traffic is encrypted over HTTPS." });
  } else {
    checks.push({ name: "HTTPS / TLS", status: "FAIL", detail: "Site is served over plain HTTP — data can be intercepted." });
  }

  for (const sh of SECURITY_HEADERS) {
    total += sh.weight;
    const present = h.has(sh.key);
    if (present) earned += sh.weight;
    checks.push({
      name: sh.name,
      status: present ? "PASS" : "FAIL",
      detail: present ? `Present. ${sh.detail}` : `Missing. ${sh.detail}`,
    });
  }

  const disclosed = DISCLOSURE_HEADERS.filter((d) => h.has(d)).map(
    (d) => `${d}: ${h.get(d)}`
  );
  if (disclosed.length) {
    checks.push({
      name: "Information disclosure",
      status: "WARN",
      detail: `Reveals server details that help attackers: ${disclosed.join(", ")}.`,
    });
  } else {
    checks.push({
      name: "Information disclosure",
      status: "PASS",
      detail: "No server software/version headers leaked.",
    });
  }

  const pct = Math.round((earned / total) * 100);

  return {
    url: finalUrl,
    statusCode: resp.status,
    https: isHttps,
    score: pct,
    grade: gradeFor(pct),
    checks,
    summary: `${checks.filter((c) => c.status === "PASS").length} of ${checks.length} checks passed.`,
  };
}
