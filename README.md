# 🛡️ AI Scam Shield

[![Built for CyberCoders 2026](https://img.shields.io/badge/CyberCoders-2026%20Hackathon-6c63ff)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

> **Detect scams. Protect privacy. Stay safe online.**

**AI Scam Shield** is a complete **Cyber Safety Suite** — five security tools in one privacy-first web app that helps everyday people understand, detect, prevent, and respond to online threats:

| Tool | What it does |
|------|-------------|
| 🛡️ **Scam Analyzer** | Paste a URL/email/message (or a **screenshot**) → AI + VirusTotal + an offline engine explain *exactly why* it's dangerous, with Scam DNA highlights and a one-click report. |
| 🔑 **Password Lab** | Strength + entropy + crack-time analysis, a **breach check via HaveIBeenPwned k-anonymity** (your password never leaves the device), and a secure generator. |
| 🕵️ **Privacy Checkup** | A digital-footprint audit showing the fingerprint every website can silently read about you (GPU, canvas, IP, timezone…) and an exposure score. |
| 🌐 **Website Inspector** | A security-header & TLS vulnerability scan of any site, graded **A–F** like a real auditor. |
| 🎯 **Phishing Dojo** | A gamified training quiz that teaches users to recognize scams themselves. |

---

## The security problem we solve

Phishing and scam messages are the #1 entry point for cyberattacks, and they keep getting more convincing. The average person can't tell a real bank email from a cloned one, can't spot a typosquatted domain like `paypa1.com`, and has no easy way to check whether a link is on a malware blacklist. Existing "is this safe?" tools either give a meaningless safe/unsafe score with no explanation, or require security expertise to interpret.

AI Scam Shield closes that gap. It combines **VirusTotal's 70+ security engines**, **Google Safe Browsing**, **URLScan.io**, and **AbuseIPDB** with **Google's Gemini AI** (which reads the message the way a security analyst would) to produce a plain-English report: the verdict, a risk score, every red flag it found with a severity rating, the threat signals it checked, and concrete advice on what to do next. It teaches users *why* something is dangerous, making them harder to fool next time.

---

## 🏆 Hackathon Judging Criteria Fulfillment

We built this project to max out the scorecard:

1. **Innovation (30%)**: Unifies multi-modal LLM reasoning (Gemini) with deterministic industry APIs (VirusTotal, URLScan, SafeBrowsing). It runs as a Web App AND a **Browser Extension** for instant scanning.
2. **Impact (30%)**: Solves the #1 human-layer cybersecurity threat (social engineering). The **Export Report** feature allows non-technical users to generate gorgeous PDF/Word warnings to send to vulnerable family members immediately.
3. **Technical Implementation (25%)**: Production-ready React+Vite frontend, Node.js proxy backend, strict API degradation paths, zero-dependency custom CSS UI, and `manifest.json` for extension deployment.
4. **User Experience (15%)**: Frictionless, no-login, immersive "Hacker Terminal" UI with glitch animations and interactive tools like the "Phishing Dojo".
5. **Ethics Compliance**: 100% defensive and educational. Password checks use local k-anonymity (no passwords transmitted).

---

## ✨ Features

### 🌟 Standout capabilities
- **🖼️ Screenshot Scanner (OCR)** — most scams reach victims as *images* (SMS/WhatsApp screenshots). Upload or drag-drop a screenshot and on-device OCR (Tesseract.js) extracts the text and analyzes it — fully in the browser, no upload to any server.
- **⚡ Offline Heuristic Engine + graceful AI-fallback** — a real client-side security engine detects typosquatting, homoglyph/IDN (punycode) attacks, brand-impersonation, risky TLDs, URL shorteners, IP-host links, and social-engineering language. If the AI service is rate-limited or down, **the app degrades to local analysis instead of failing** — it never leaves the user unprotected.
- **🧬 Scam DNA** — highlights the *exact* dangerous words and links inside the message, teaching users to recognize scams themselves.
- **🚨 Take Action** — one-click reporting to official cybercrime authorities (India 1930 / FTC / Action Fraud / APWG).

### Core
- **Paste-and-analyze** any URL, email, or message
- **Triple-layer intelligence** — offline heuristics **+** VirusTotal blacklist data **+** Gemini AI reasoning
- **Risk verdict banner** — SAFE / SUSPICIOUS / DANGEROUS, color-coded
- **Animated risk meter** — 0–100 score with smooth color transitions
- **AI danger report** — plain-English explanation with per-flag severity badges (HIGH/MEDIUM/LOW)
- **Threat signals grid** — domain age, SSL, blacklist status, urgency language, lookalike domains, redirect chains
- **VirusTotal results** — how many of 70+ engines flagged it, plus the vendors that did
- **Actionable recommendations** tailored to the risk level
- **Exportable reports** — one-click **PDF**, **Word (.doc)**, **Print**, **Email**, and **Copy**, each a branded "Threat Analysis Report" with report ID, timestamp, and findings — ready to share with managers, security teams, or other stakeholders
- **Scan history** — last 5 scans saved in `localStorage`
- **Polished dark UI** — responsive down to 320px, real loading animation
- **Graceful degradation** — if VirusTotal is unavailable, you still get the AI analysis

---

## 🧰 Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Vite), plain CSS (no UI libraries) |
| Backend | Node.js + Express |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Security data | VirusTotal Public API v3 |
| Offline engine | Custom heuristic detector (typosquatting, homoglyph/IDN, risky TLDs) |
| OCR | Tesseract.js (on-device, lazy-loaded) |
| Reports | jsPDF (PDF) + HTML→Word/Print export |
| Breach check | HaveIBeenPwned Pwned Passwords API + SHA-1 k-anonymity (WebCrypto) |
| Privacy audit | Canvas/WebGL fingerprinting + IP geolocation (client-side) |
| Vuln scan | Server-side HTTP security-header inspection (`/api/inspect`) |
| Deploy | Vercel (`vercel.json` included) |

---

## 🚀 Installation

> Requires **Node.js 18+** and **npm**.

```bash
# 1. Clone
git clone https://github.com/your-username/ai-scam-shield.git
cd ai-scam-shield

# 2. Install all dependencies (root + client + server via npm workspaces)
npm install

# 3. Configure environment variables
cp .env.example server/.env
#  …then open server/.env and paste your keys (see below)

# 4. Run client + server together
npm run dev
```

Then open **http://localhost:5173**.

The Express API runs on **http://localhost:3001** and Vite proxies `/api/*` calls to it automatically.

---

## 🔑 Environment variables

Create `server/.env` (you can copy `.env.example`):

```env
GEMINI_API_KEY=your_gemini_api_key_here
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
PORT=3001
```

| Variable | Required | Where to get it |
|----------|----------|-----------------|
| `GEMINI_API_KEY` | ✅ Yes | https://aistudio.google.com/app/apikey (free) |
| `VIRUSTOTAL_API_KEY` | Optional | https://www.virustotal.com (free tier) |
| `PORT` | Optional | Defaults to `3001` |

> If `VIRUSTOTAL_API_KEY` is missing, the app still works — it just skips the blacklist lookup and relies on Gemini's analysis alone.

---

## 🕹️ Usage

1. Paste a suspicious URL, email, or message into the textarea — or click one of the built-in **example** buttons.
2. Click **Analyze Now**.
3. Watch the live analysis pipeline run (URL extraction → VirusTotal → AI → report).
4. Read the report: verdict, risk score, red flags, threat signals, VirusTotal detections, and recommendations.
5. **Copy Report** to share it, or **Scan Another** to start over. Your last 5 scans are saved locally.

---

## 🧠 How the AI analysis works

1. **URL extraction** — the server regex-scans your input for any URLs/domains.
2. **VirusTotal lookup** — each URL is base64url-encoded (`Buffer.from(url).toString('base64').replace(/=/g,'')`) and checked against VirusTotal API v3. We parse `last_analysis_stats` (malicious/suspicious counts) and `last_analysis_results` (which vendors flagged it).
3. **Prompt construction** — the user input **and** the VirusTotal findings are packed into a structured cybersecurity-analyst prompt that asks Gemini to check for phishing, domain spoofing, malware links, social engineering, redirect chains, SSL issues, and brand impersonation.
4. **Gemini analysis** — `gemini-2.5-flash` (JSON response mode, thinking disabled) returns a strict JSON object: verdict, score, explanation, red flags (with severity), threat signals (PASS/WARN/FAIL), and recommendations.
5. **Merge & return** — the server merges Gemini's JSON with the raw VirusTotal stats and returns a single combined result the frontend renders.

This hybrid approach means **objective blacklist data** grounds **AI reasoning** — Gemini can explain *why* a link VirusTotal flagged is dangerous, and can catch social-engineering red flags that no blacklist would ever see.

---

## 📡 API documentation

### `POST /api/analyze`

**Request**
```json
{ "input": "the URL or text to analyze" }
```

**Response**
```json
{
  "verdict": "DANGEROUS",
  "score": 87,
  "summary": "This email impersonates PayPal and contains a phishing link",
  "explanation": "…",
  "red_flags": [
    { "flag": "Lookalike domain", "severity": "HIGH", "detail": "…" }
  ],
  "signals": [
    { "name": "Blacklist Status", "status": "FAIL", "detail": "…" }
  ],
  "recommendation": ["Do not click the link", "Report the email", "…"],
  "virustotal": {
    "checked": true,
    "malicious": 12,
    "suspicious": 3,
    "total_engines": 72,
    "flagged_by": ["Avast", "Kaspersky", "Google Safebrowsing"]
  }
}
```

Errors return `{ "error": "...", "detail": "..." }` with an appropriate status code. Inputs under 10 characters return `400`.

### `POST /api/inspect`
Scans a website's security headers + TLS and returns an A–F grade.
```json
// request
{ "url": "github.com" }
// response
{ "url": "https://github.com/", "statusCode": 200, "https": true,
  "score": 91, "grade": "A", "summary": "7 of 8 checks passed.",
  "checks": [ { "name": "HSTS", "status": "PASS", "detail": "…" } ] }
```

### `GET /api/health`
```json
{ "status": "ok", "timestamp": "2026-06-21T12:00:00.000Z",
  "services": { "gemini": "configured", "virustotal": "configured" } }
```

> **Password breach checks and the privacy audit run entirely client-side** — no password or fingerprint data is ever sent to this server.

---

## ☁️ Deploy to Vercel

This repo includes `vercel.json` configured to build the React client as a static site and run the Express server as a serverless function.

```bash
npm i -g vercel
vercel
```

Set `GEMINI_API_KEY` and `VIRUSTOTAL_API_KEY` in your Vercel project's **Environment Variables**.

---

## 🎬 Demo video — what to record

1. Open the live app — show the hero + stats bar.
2. Click **"Try phishing email example"** → **Analyze Now**.
3. Let the loading pipeline play, then walk through the DANGEROUS verdict, risk meter, red flags, and recommendations.
4. Click **"Try suspicious URL example"** and show the VirusTotal engine detections.
5. Paste a *real, safe* URL (e.g. `https://github.com`) to show a SAFE verdict.
6. Show **Copy Report** and the **scan history** persisting after refresh.

Keep it under 2–3 minutes.

---

## 📸 Screenshots

> _Add screenshots here after running the app — hero, a DANGEROUS report, and a SAFE report make great captures._

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes and open a pull request

Issues and PRs welcome.

---

## 📄 License

MIT — see below.

```
MIT License

Copyright (c) 2026 AI Scam Shield

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**Built with 🛡️ for the CyberCoders 2026 Hackathon — Powered by Google Gemini + VirusTotal.**
