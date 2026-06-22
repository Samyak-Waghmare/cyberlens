import PageHeader from "../components/common/PageHeader.jsx";

export default function LegalPrivacyPage() {
  return (
    <>
      <PageHeader
        icon="📄"
        title="Privacy Policy"
        description="How we handle your data (Hint: we don't)."
      />
      <div className="card legal-content">
        <h2 className="tool-title">1. Data Collection</h2>
        <p className="tool-sub">
          CyberLens is designed with privacy-first principles. We do not collect, store, or sell your personal data. 
          When you use our tools (like the Scam Analyzer or Password Lab), your input is processed in your local browser as much as possible.
        </p>

        <h2 className="tool-title" style={{ marginTop: '2rem' }}>2. Third-Party APIs</h2>
        <p className="tool-sub">
          To provide threat intelligence, the <strong>Scam Analyzer</strong> sends anonymized text/URLs to Google Gemini AI and VirusTotal APIs.
          These services have their own privacy policies. We do not attach any identifying information (like your IP address or session ID) to these requests.
        </p>

        <h2 className="tool-title" style={{ marginTop: '2rem' }}>3. Passwords & k-Anonymity</h2>
        <p className="tool-sub">
          The <strong>Password Lab</strong> never sends your actual password over the internet. To check for breaches, we compute a SHA-1 hash of your password locally in your browser, and only send the first 5 characters of that hash to the HaveIBeenPwned API (k-anonymity model).
        </p>

        <h2 className="tool-title" style={{ marginTop: '2rem' }}>4. Local Storage</h2>
        <p className="tool-sub">
          Your scan history is saved entirely in your browser's `localStorage`. It never touches our servers. You can clear this history at any time using the "Clear History" button.
        </p>
      </div>
    </>
  );
}
