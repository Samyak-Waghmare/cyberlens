import PageHeader from "../components/common/PageHeader.jsx";

export default function LegalTermsPage() {
  return (
    <>
      <PageHeader
        icon="📜"
        title="Terms of Use"
        description="Rules for using the CyberLens platform."
      />
      <div className="card legal-content">
        <h2 className="tool-title">1. Acceptable Use</h2>
        <p className="tool-sub">
          By accessing CyberLens, you agree to use the platform only for lawful, defensive cybersecurity purposes. 
          You may not use our APIs, scanners, or analyzers to test the effectiveness of malware you are developing, 
          or for any offensive cyber operations.
        </p>

        <h2 className="tool-title" style={{ marginTop: '2rem' }}>2. API Rate Limiting</h2>
        <p className="tool-sub">
          CyberLens relies on free tiers of third-party APIs (like VirusTotal and Gemini). 
          Please do not attempt to automate, scrape, or flood our systems with requests, as this degrades the experience for everyone.
          We reserve the right to temporarily or permanently block IPs that abuse the service.
        </p>

        <h2 className="tool-title" style={{ marginTop: '2rem' }}>3. Open Source Modifications</h2>
        <p className="tool-sub">
          CyberLens is an open-source project. You are free to fork, modify, and self-host the code in accordance with the project's license. 
          However, you may not use the CyberLens name or branding for commercial derivatives without explicit permission.
        </p>
      </div>
    </>
  );
}
