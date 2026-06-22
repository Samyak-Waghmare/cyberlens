/**
 * Offline heuristic threat engine.
 *
 * Runs fully client-side with no API. Detects classic scam signals:
 * typosquatting / homoglyph (IDN) attacks, brand impersonation, risky TLDs,
 * URL shorteners, IP-host links, and social-engineering language.
 *
 * Powers three things:
 *   1. Instant analysis (no network)
 *   2. Graceful fallback when the AI service is unavailable
 *   3. "Scam DNA" highlighting of the exact suspicious spans
 */

const URL_RE = /\b(?:https?:\/\/|www\.)[^\s<>"')]+/gi;

const KNOWN_BRANDS = [
  "paypal", "amazon", "apple", "microsoft", "google", "netflix", "facebook",
  "instagram", "whatsapp", "paytm", "phonepe", "flipkart", "sbi", "hdfc",
  "icici", "axis", "kotak", "dhl", "fedex", "ups", "usps", "irs", "hmrc",
  "coinbase", "binance", "metamask", "walmart", "ebay", "linkedin", "dropbox",
  "adobe", "spotify", "steam", "outlook", "chase", "wellsfargo", "bankofamerica",
];

const SUSPICIOUS_TLDS = new Set([
  "tk", "ml", "ga", "cf", "gq", "xyz", "top", "zip", "mov", "country", "kim",
  "work", "link", "click", "live", "loan", "rest", "fit", "men", "gdn", "review",
]);

const SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly", "is.gd", "buff.ly",
  "rebrand.ly", "cutt.ly", "shorturl.at", "rb.gy", "tiny.cc",
]);

const KEYWORDS = {
  urgency: {
    weight: 8,
    cap: 22,
    severity: "MEDIUM",
    label: "Urgency / pressure",
    terms: [
      "urgent", "immediately", "act now", "right away", "within 24 hours",
      "within 24hrs", "final notice", "last warning", "expires today",
      "account suspended", "account locked", "account limited", "suspended",
      "verify now", "confirm now", "failure to", "or your account will",
    ],
  },
  credential: {
    weight: 15,
    cap: 32,
    severity: "HIGH",
    label: "Sensitive info request",
    terms: [
      "password", "one-time", "otp", "cvv", "pin number", "ssn",
      "social security", "bank account", "card number", "seed phrase",
      "recovery phrase", "wire transfer", "gift card", "bitcoin", "crypto",
      "login credentials", "verify your identity", "update your payment",
    ],
  },
  greed: {
    weight: 10,
    cap: 22,
    severity: "MEDIUM",
    label: "Too-good-to-be-true",
    terms: [
      "you have won", "you've won", "winner", "lottery", "prize", "claim now",
      "free gift", "inheritance", "tax refund", "you are eligible",
      "congratulations", "reward", "cash prize", "selected",
    ],
  },
  generic: {
    weight: 6,
    cap: 6,
    severity: "LOW",
    label: "Generic greeting",
    terms: ["dear customer", "dear user", "dear account holder", "valued customer"],
  },
};

const HOMOGLYPH = {
  "0": "o", "1": "l", "3": "e", "4": "a", "5": "s", "7": "t",
  "8": "b", "9": "g", $: "s", "@": "a", "|": "l", "!": "i",
};

/* ---------- helpers ---------- */

function normalizeHomoglyphs(s) {
  let out = s.toLowerCase();
  out = out.replace(/[013457890$@|!]/g, (c) => HOMOGLYPH[c] || c);
  out = out.replace(/rn/g, "m").replace(/vv/g, "w");
  return out;
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => i);
  for (let j = 1; j <= n; j++) {
    let prev = dp[0];
    dp[0] = j;
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i];
      dp[i] = Math.min(
        dp[i] + 1,
        dp[i - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      prev = tmp;
    }
  }
  return dp[m];
}

function parseHost(url) {
  try {
    const u = new URL(url.startsWith("http") ? url : `http://${url}`);
    return u;
  } catch {
    return null;
  }
}

function registrableLabel(hostname) {
  // crude: take the second-to-last label (e.g. "paypal" from "x.paypal.com")
  const parts = hostname.split(".");
  return parts.length >= 2 ? parts[parts.length - 2] : parts[0];
}

function brandMatch(label) {
  const norm = normalizeHomoglyphs(label);
  for (const brand of KNOWN_BRANDS) {
    if (norm === brand) return { brand, exact: true };
    const d = levenshtein(norm, brand);
    if (d > 0 && d <= (brand.length > 6 ? 2 : 1)) {
      return { brand, exact: false, distance: d };
    }
  }
  return null;
}

/* ---------- main ---------- */

export function runHeuristics(input) {
  const text = (input || "").toString();
  let score = 0;
  const findings = [];
  const highlights = [];
  const urls = [];

  /* --- URL analysis --- */
  let m;
  URL_RE.lastIndex = 0;
  while ((m = URL_RE.exec(text)) !== null) {
    const raw = m[0].replace(/[.,;:]+$/, "");
    const start = m.index;
    const end = start + raw.length;
    const u = parseHost(raw);
    urls.push(raw);

    let urlDanger = false;
    const host = u ? u.hostname.toLowerCase() : "";
    const tld = host.split(".").pop();
    const label = host ? registrableLabel(host) : "";
    const subCount = host ? host.split(".").length - 2 : 0;

    if (host.includes("xn--")) {
      score += 35;
      urlDanger = true;
      findings.push({
        flag: "Internationalized (homoglyph) domain",
        severity: "HIGH",
        detail: `${host} uses punycode (xn--), a classic trick to impersonate a real site with look-alike characters.`,
      });
    }

    // Layered brand-impersonation detection.
    if (label) {
      const normLabel = normalizeHomoglyphs(label);
      const normHost = normalizeHomoglyphs(host);
      const labelTokens = normLabel.split(/[-_]/).filter(Boolean);
      let brandHit = null;

      // 1. The registrable label IS a brand spelled with tricks (paypa1, amaz0n)
      //    or one edit away (paypl, gooogle).
      const bm = brandMatch(label);
      if (bm && (!bm.exact || label.toLowerCase() !== bm.brand)) {
        brandHit = { brand: bm.brand, kind: "lookalike" };
      }
      // 2. A brand sits as a token inside a longer label (amazon-prime-renewal).
      if (!brandHit) {
        const tb = KNOWN_BRANDS.find((b) => labelTokens.includes(b));
        if (tb && normLabel !== tb) brandHit = { brand: tb, kind: "indomain" };
      }
      // 3. A brand is buried in a subdomain (paypal.secure-login.xyz).
      if (!brandHit) {
        const sb = KNOWN_BRANDS.find(
          (b) => normHost.includes(b) && !normLabel.includes(b)
        );
        if (sb) brandHit = { brand: sb, kind: "subdomain" };
      }

      if (brandHit) {
        urlDanger = true;
        if (brandHit.kind === "lookalike") {
          score += 35;
          findings.push({
            flag: "Look-alike / spoofed domain",
            severity: "HIGH",
            detail: `"${label}" imitates "${brandHit.brand}" — a typosquatting attempt to impersonate ${brandHit.brand}.`,
          });
        } else if (brandHit.kind === "indomain") {
          score += 28;
          findings.push({
            flag: "Brand name in fake domain",
            severity: "HIGH",
            detail: `"${brandHit.brand}" appears inside the domain "${host}", but this is not an official ${brandHit.brand} address.`,
          });
        } else {
          score += 25;
          findings.push({
            flag: "Brand hidden in subdomain",
            severity: "HIGH",
            detail: `This link references "${brandHit.brand}" but the real domain is "${host}" — not owned by ${brandHit.brand}.`,
          });
        }
      }
    }

    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
      score += 20;
      urlDanger = true;
      findings.push({
        flag: "IP-address link",
        severity: "HIGH",
        detail: `${host} is a raw IP address — legitimate companies almost never link to bare IPs.`,
      });
    }

    if (SHORTENERS.has(host)) {
      score += 12;
      findings.push({
        flag: "URL shortener",
        severity: "MEDIUM",
        detail: `${host} hides the real destination, a common way to mask malicious links.`,
      });
    }

    if (SUSPICIOUS_TLDS.has(tld)) {
      score += 15;
      findings.push({
        flag: `High-risk domain (.${tld})`,
        severity: "MEDIUM",
        detail: `The .${tld} extension is frequently abused for free, disposable scam sites.`,
      });
    }

    if (raw.includes("@")) {
      score += 20;
      urlDanger = true;
      findings.push({
        flag: "Deceptive link structure",
        severity: "HIGH",
        detail: "The link contains an '@', which can make a malicious site appear to be a trusted one.",
      });
    }

    if (u && u.protocol === "http:") {
      score += 6;
      findings.push({
        flag: "Unencrypted (HTTP) link",
        severity: "LOW",
        detail: "The link uses http:// without encryption — data you enter could be intercepted.",
      });
    }

    if (subCount >= 3 || (label && (label.match(/-/g) || []).length >= 2)) {
      score += 8;
      findings.push({
        flag: "Suspicious domain structure",
        severity: "LOW",
        detail: `${host} has an unusually complex structure often used to confuse readers.`,
      });
    }

    highlights.push({ start, end, type: urlDanger ? "url-danger" : "url-warn", label: "Suspicious link" });
  }

  /* --- Language analysis --- */
  for (const [, group] of Object.entries(KEYWORDS)) {
    let groupHits = 0;
    let groupScore = 0;
    for (const term of group.terms) {
      const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      let km;
      while ((km = re.exec(text)) !== null) {
        groupHits++;
        if (groupScore < group.cap) {
          groupScore = Math.min(group.cap, groupScore + group.weight);
        }
        highlights.push({
          start: km.index,
          end: km.index + km[0].length,
          type: group.severity === "HIGH" ? "kw-danger" : "kw-warn",
          label: group.label,
        });
        if (km.index === re.lastIndex) re.lastIndex++;
      }
    }
    if (groupHits > 0) {
      score += groupScore;
      findings.push({
        flag: group.label,
        severity: group.severity,
        detail: `Detected ${groupHits} ${group.label.toLowerCase()} cue${
          groupHits > 1 ? "s" : ""
        } commonly used in scams.`,
      });
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const level = score <= 25 ? "SAFE" : score <= 55 ? "SUSPICIOUS" : "DANGEROUS";

  return {
    score,
    level,
    findings,
    signals: buildSignals(findings, urls.length),
    highlights: dedupeHighlights(highlights),
    urls,
  };
}

function buildSignals(findings, urlCount) {
  const has = (kw) => findings.some((f) => f.flag.toLowerCase().includes(kw));
  const sig = [];

  sig.push({
    name: "Domain authenticity",
    status: has("look-alike") || has("homoglyph") || has("subdomain") ? "FAIL" : urlCount ? "PASS" : "PASS",
    detail:
      has("look-alike") || has("homoglyph")
        ? "Detected an impersonated or spoofed domain."
        : urlCount
        ? "No obvious domain spoofing detected."
        : "No links to evaluate.",
  });

  sig.push({
    name: "Link safety",
    status: has("ip-address") || has("deceptive") || has("shortener") || has("high-risk")
      ? "FAIL"
      : has("http") || has("structure")
      ? "WARN"
      : "PASS",
    detail: urlCount ? "Evaluated link structure, TLD, and redirects." : "No links found.",
  });

  sig.push({
    name: "Pressure tactics",
    status: has("urgency") ? "WARN" : "PASS",
    detail: has("urgency") ? "Uses urgency to rush you into acting." : "No urgency language detected.",
  });

  sig.push({
    name: "Sensitive data request",
    status: has("sensitive") ? "FAIL" : "PASS",
    detail: has("sensitive") ? "Asks for credentials, payment, or personal data." : "No sensitive-info request detected.",
  });

  return sig;
}

function dedupeHighlights(list) {
  const sorted = [...list].sort((a, b) => a.start - b.start || b.end - a.end);
  const out = [];
  let lastEnd = -1;
  for (const h of sorted) {
    if (h.start >= lastEnd) {
      out.push(h);
      lastEnd = h.end;
    }
  }
  return out;
}
