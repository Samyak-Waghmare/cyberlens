import PageHeader from "../components/common/PageHeader.jsx";

export default function ExtensionPage() {
  return (
    <>
      <PageHeader
        icon="🧩"
        title="Chrome Extension"
        description="Scan any link on the internet instantly without leaving your current tab."
      />

      <section className="tool card">
        <div className="tool-head">
          <h2 className="tool-title">Installation Guide</h2>
          <p className="tool-sub">
            Because CyberLens is currently in beta for the hackathon, the extension is not yet listed on the public Chrome Web Store. You can install it manually in 3 easy steps!
          </p>
        </div>

        <div className="dojo-card" style={{ textAlign: "left", padding: "2rem" }}>
          <h3 style={{ color: "var(--accent)", marginBottom: "1rem" }}>Step 1: Download the Source Code</h3>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
            Download or clone the CyberLens GitHub repository to your computer.
          </p>

          <h3 style={{ color: "var(--accent)", marginBottom: "1rem" }}>Step 2: Enable Developer Mode</h3>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
            Open Google Chrome and navigate to <strong>chrome://extensions</strong>. In the top right corner of the screen, toggle <strong>Developer mode</strong> to ON.
          </p>

          <h3 style={{ color: "var(--accent)", marginBottom: "1rem" }}>Step 3: Load the Extension</h3>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
            In the top left corner, click the <strong>Load unpacked</strong> button. Select the <code>extension</code> folder located inside the CyberLens repository you downloaded.
          </p>
          
          <div className="dojo-verdict right">
            ✓ You're done! You can now right-click any link on the internet and select "Scan link with CyberLens".
          </div>
        </div>
      </section>
    </>
  );
}
