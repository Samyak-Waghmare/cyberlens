const FAQS = [
  {
    q: "Is my data sent to the cloud?",
    a: "We process as much as possible locally in your browser. For advanced threat analysis, we only send the necessary URL, hash, or text snippet to VirusTotal and Gemini AI. We never send your IP or session data.",
  },
  {
    q: "Can this tool guarantee a website is safe?",
    a: "No cybersecurity tool is 100% accurate. We use heuristics and top-tier intelligence APIs, but zero-day threats or highly targeted phishing can still evade detection. Always stay vigilant.",
  },
  {
    q: "How does the Password Lab check breaches without leaking my password?",
    a: "We use a technique called k-anonymity. Your password is mathematically hashed (SHA-1) locally on your device. We only send the first 5 characters of that hash to the HaveIBeenPwned API, meaning your actual password never leaves your machine.",
  },
  {
    q: "Is this tool entirely free?",
    a: "Yes. It was built for the CyberCoders 2026 Hackathon to democratize cybersecurity. We rely on the free tiers of world-class APIs to keep it running at zero cost to users.",
  },
];

export default function FAQ() {
  return (
    <section className="faq-section" id="faq">
      <div className="section-head">
        <span className="section-eyebrow">Intel</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-sub">Details on how the suite operates under the hood.</p>
      </div>

      <div className="faq-grid">
        {FAQS.map((faq, i) => (
          <div className="faq-card" key={i}>
            <h3 className="faq-q">{faq.q}</h3>
            <p className="faq-a">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
