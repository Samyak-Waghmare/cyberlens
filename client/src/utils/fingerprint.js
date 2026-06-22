/** Collect the device/browser signals a website can read about a visitor. */

function canvasHash() {
  try {
    const c = document.createElement("canvas");
    c.width = 240;
    c.height = 60;
    const ctx = c.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = "16px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(10, 10, 100, 30);
    ctx.fillStyle = "#069";
    ctx.fillText("CyberLens🛡️", 12, 14);
    ctx.fillStyle = "rgba(102,204,0,0.7)";
    ctx.fillText("Fingerprint", 14, 30);
    const data = c.toDataURL();
    let h = 0;
    for (let i = 0; i < data.length; i++) {
      h = (h * 31 + data.charCodeAt(i)) >>> 0;
    }
    return h.toString(16);
  } catch {
    return null;
  }
}

function webgl() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) return null;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return null;
    return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
  } catch {
    return null;
  }
}

export function collectFingerprint() {
  const n = navigator;
  const dnt = n.doNotTrack === "1" || window.doNotTrack === "1";
  const conn = n.connection || {};

  const items = [
    { key: "ua", label: "Browser / OS", value: shortUA(n.userAgent), risk: "med", tip: "Identifies your browser and operating system." },
    { key: "screen", label: "Screen resolution", value: `${screen.width}×${screen.height} @${screen.colorDepth}-bit`, risk: "med", tip: "A fairly distinctive tracking signal." },
    { key: "tz", label: "Timezone", value: Intl.DateTimeFormat().resolvedOptions().timeZone || "?", risk: "med", tip: "Reveals roughly where you are." },
    { key: "lang", label: "Languages", value: (n.languages || [n.language]).join(", "), risk: "low", tip: "Hints at your region and preferences." },
    { key: "cores", label: "CPU cores", value: String(n.hardwareConcurrency ?? "?"), risk: "low", tip: "Part of your device fingerprint." },
    { key: "mem", label: "Device memory", value: n.deviceMemory ? `${n.deviceMemory} GB` : "hidden", risk: "low", tip: "Approximate RAM, used for fingerprinting." },
    { key: "touch", label: "Touch points", value: String(n.maxTouchPoints ?? 0), risk: "low", tip: "Distinguishes phones/tablets from desktops." },
    { key: "gpu", label: "GPU (WebGL)", value: webgl() || "blocked", risk: "high", tip: "Your graphics chip — a strong, persistent identifier." },
    { key: "canvas", label: "Canvas fingerprint", value: canvasHash() || "blocked", risk: "high", tip: "A near-unique hash of how your device renders graphics." },
    { key: "conn", label: "Network type", value: conn.effectiveType || "hidden", risk: "low", tip: "Your connection quality." },
    { key: "cookies", label: "Cookies enabled", value: n.cookieEnabled ? "yes" : "no", risk: "low", tip: "Whether sites can store cookies." },
    { key: "dnt", label: "Do Not Track", value: dnt ? "on" : "off", risk: dnt ? "good" : "med", tip: dnt ? "You're asking sites not to track you." : "Sites are not being asked to stop tracking." },
  ];

  const weights = { high: 25, med: 12, low: 5, good: -10 };
  let score = 30;
  items.forEach((it) => {
    if (it.value && it.value !== "blocked" && it.value !== "hidden") {
      score += weights[it.risk] || 0;
    }
  });
  score = Math.max(0, Math.min(100, score));

  return { items, score };
}

function shortUA(ua = "") {
  const browser =
    /edg/i.test(ua) ? "Edge" :
    /chrome/i.test(ua) ? "Chrome" :
    /firefox/i.test(ua) ? "Firefox" :
    /safari/i.test(ua) ? "Safari" : "Browser";
  const os =
    /windows/i.test(ua) ? "Windows" :
    /mac/i.test(ua) ? "macOS" :
    /android/i.test(ua) ? "Android" :
    /iphone|ipad/i.test(ua) ? "iOS" :
    /linux/i.test(ua) ? "Linux" : "";
  return `${browser}${os ? " · " + os : ""}`;
}
