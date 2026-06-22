# 🛡️ CyberLens (AI Scam Shield)

[![Built for CyberCoders 2026](https://img.shields.io/badge/CyberCoders-2026%20Hackathon-6c63ff)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

> **Detect scams. Protect privacy. Stay safe online.**

*A comprehensive Cyber Safety Suite built for the CyberCoders 2026 Hackathon.*

## 📋 Devpost Submission Details

- **Project Name:** CyberLens (AI Scam Shield)
- **Live Website URL:** [Insert Live URL Here]
- **Public Source Code Repository:** [Insert GitHub/GitLab URL Here]
- **Demo Video:** [Insert YouTube/Vimeo Demo Link Here]

### 👥 Team Information
- **Samyak Waghmare** (samyakwaghmare347@gmail.com) - Full Stack Developer & Cybersecurity Enthusiast

---

## 📖 Project Description

In today's interconnected world, phishing and scam messages are the #1 entry point for cyberattacks. The average person struggles to differentiate a legitimate bank email from a cloned one, cannot spot a typosquatted domain like `paypa1.com`, and has no easy way to verify if a link is on a malware blacklist. Existing "is this safe?" tools either give a meaningless safe/unsafe score without explanation or require advanced security expertise to interpret.

**CyberLens (AI Scam Shield)** closes that gap. It is a complete, privacy-first Cyber Safety Suite that empowers everyday users to understand, detect, prevent, and respond to online threats. It combines deterministic industry APIs (VirusTotal's 70+ security engines, Google Safe Browsing, URLScan.io, and AbuseIPDB) with Google's Gemini AI to produce plain-English, highly actionable threat intelligence reports. 

By unifying multi-modal LLM reasoning with hard cybersecurity data, CyberLens not only blocks threats but actively educates users on *why* something is dangerous, making them harder to fool the next time.

---

## 🛑 The Security Problem Addressed

CyberLens tackles **Social Engineering and Digital Privacy Risks**, which are the hardest vulnerabilities to patch because they rely on human error. Specifically, it addresses:
1. **Phishing & Scam Messages:** Users receive sophisticated deceptive links via SMS/Email.
2. **Weak Credentials:** Users reuse passwords that have already been exposed in data breaches.
3. **Hidden Digital Footprints:** Users are unaware of the tracking mechanisms (IP tracking, Canvas fingerprinting) websites use to monitor them.
4. **Vulnerable Web Infrastructure:** Lack of easy tools to inspect website SSL/TLS and security headers.

---

## ✨ Features & Implementation

CyberLens consists of five core tools working seamlessly together:

| Tool | Implementation & Features |
|------|-------------|
| 🛡️ **Scam Analyzer** | Paste text, URLs, or **Screenshots (on-device OCR via Tesseract.js)**. AI + VirusTotal + an offline heuristic engine explain *why* it's dangerous, generating a "Scam DNA" report and actionable recommendations. Includes Export to PDF/Word. |
| 🔑 **Password Lab** | Strength + entropy + crack-time analysis. Checks against the **HaveIBeenPwned API using SHA-1 k-anonymity** (passwords never leave the device). |
| 🕵️ **Privacy Checkup** | A digital-footprint audit showing the fingerprint websites can silently read (GPU, canvas, IP via IPinfo, timezone) and an exposure score. |
| 🌐 **Website Inspector** | A security-header & TLS vulnerability scan of any site, grading it **A–F** based on actual HTTP response headers. |
| 🎯 **Phishing Dojo** | A gamified training quiz that teaches users to recognize scams themselves through interactive examples. |

**Graceful Degradation:** The platform features an offline heuristic engine. If external APIs fail or rate-limit, the app degrades to local analysis, ensuring the user is never left unprotected.

---

## 🧰 Technologies Used

- **Frontend:** React 18 (Vite), Plain CSS (Zero UI libraries, custom Glassmorphism/Hacker aesthetics)
- **Backend:** Node.js + Express
- **AI Engine:** Google Gemini API (`gemini-2.5-flash`)
- **Cybersecurity APIs:** VirusTotal Public API v3, Google Safe Browsing, URLScan.io, AbuseIPDB, HaveIBeenPwned API
- **Utilities:** Tesseract.js (On-device OCR), jsPDF (Report generation)
- **Deployment:** Vercel (Configured via `vercel.json` for static frontend + serverless backend)

---

## 📸 Screenshots

> *(Participant Note: Add your screenshots here before final submission!)*
> 
> - [x] **Home Dashboard** - Showing the suite overview
> - [x] **Scam Analyzer Result** - Showing a DANGEROUS verdict and AI breakdown
> - [x] **Privacy Checkup** - Showing the digital fingerprint results
> - [x] **Password Lab** - Showing a breached password alert

---

## 🚀 Installation and Usage Instructions

### Prerequisites
- **Node.js 18+** and **npm**

### Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Samyak-Waghmare/ai-scam-shield.git
   cd ai-scam-shield
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside the `server/` directory using `.env.example` as a template:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
   SAFEBROWSING_API_KEY=your_google_safe_browsing_key_here
   URLSCAN_API_KEY=your_urlscan_api_key_here
   ABUSEIPDB_API_KEY=your_abuseipdb_key_here
   PORT=3001
   ALLOWED_ORIGIN=http://localhost:5173
   ```
   *(Note: The app will run without VirusTotal/SafeBrowsing/URLScan keys by gracefully falling back to AI and offline heuristics, but Gemini is required).*

4. **Run the Application:**
   ```bash
   npm run dev
   ```
   The client will start at `http://localhost:5173` and proxy API requests to the Express server at `http://localhost:3001`.

### Usage
- Open `http://localhost:5173`
- Navigate to the **Scam Analyzer**. Paste a suspicious email or upload a screenshot, and click "Analyze Now".
- Check your password security in the **Password Lab**.
- Audit your browser in the **Privacy Checkup**.

---

## 🎬 Demo Video Instructions

> *(Participant Note: Follow this flow for your 2-5 minute demo video)*
1. **Introduction (30s):** State your name and briefly explain CyberLens.
2. **Scam Analyzer (1m):** Paste a known phishing email. Show the Risk Meter, AI Explanation, VirusTotal results, and how to export the PDF report.
3. **Password Lab (30s):** Type a weak password (like `password123`) to trigger the HaveIBeenPwned breach alert.
4. **Privacy Checkup (30s):** Open the privacy dashboard to show real-time IP/Canvas fingerprinting extraction.
5. **Conclusion (30s):** Summarize the impact and how it solves the Hackathon challenge.

---

**Built with 🛡️ for the CyberCoders 2026 Hackathon.**
