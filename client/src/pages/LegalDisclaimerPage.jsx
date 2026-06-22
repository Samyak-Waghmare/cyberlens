import PageHeader from "../components/common/PageHeader.jsx";

export default function LegalDisclaimerPage() {
  return (
    <>
      <PageHeader
        icon="⚖️"
        title="Disclaimer"
        description="Important limitations of the CyberLens toolset."
      />
      <div className="card legal-content">
        <h2 className="tool-title">1. No Guarantees of Safety</h2>
        <p className="tool-sub">
          CyberLens provides educational and informational analysis based on heuristics, AI models, and third-party threat intelligence APIs. 
          <strong>We cannot guarantee 100% accuracy.</strong> A result indicating "Safe" does not mean a file, URL, or message is completely harmless. 
          Zero-day threats and highly targeted phishing campaigns may evade detection.
        </p>

        <h2 className="tool-title" style={{ marginTop: '2rem' }}>2. Not Professional Advice</h2>
        <p className="tool-sub">
          The information provided by CyberLens does not constitute professional cybersecurity, legal, or financial advice. 
          If you believe you have been the victim of a cybercrime, please contact your local law enforcement agency or financial institution immediately.
        </p>

        <h2 className="tool-title" style={{ marginTop: '2rem' }}>3. Provided "As Is"</h2>
        <p className="tool-sub">
          This software is provided "as is", without warranty of any kind, express or implied. 
          In no event shall the creators of CyberLens be liable for any claim, damages, or other liability arising from your use of this software.
        </p>
      </div>
    </>
  );
}
