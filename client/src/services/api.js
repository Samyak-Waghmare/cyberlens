// Thin client for the CyberLens backend API.

const JSON_HEADERS = { "Content-Type": "application/json" };

async function request(path, options = {}) {
  const resp = await fetch(path, options);

  let data;
  try {
    data = await resp.json();
  } catch {
    throw new Error("Server returned an invalid response.");
  }

  if (!resp.ok) {
    const msg = data?.detail || data?.error || `Request failed (${resp.status})`;
    const err = new Error(msg);
    err.payload = data;
    throw err;
  }

  return data;
}

export function analyzeInput(input, fileHash = null) {
  return request("/api/analyze", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ input, fileHash }),
  });
}

export function inspectUrl(url) {
  return request("/api/inspect", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ url }),
  });
}

export function checkHealth() {
  return request("/api/health");
}

export function analyzeLogData(logs) {
  return request("/api/analyze-log", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ logs }),
  });
}

export function askQuestion(context, question) {
  return request("/api/chat", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ context, question }),
  });
}

export function scanWeb3Contract(address) {
  return request("/api/web3/scan", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ address }),
  });
}
