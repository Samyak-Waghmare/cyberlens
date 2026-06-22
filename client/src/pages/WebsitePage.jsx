import PageHeader from "../components/common/PageHeader.jsx";
import WebsiteInspector from "../components/tools/WebsiteInspector.jsx";

export default function WebsitePage({ onToast }) {
  return (
    <>
      <PageHeader
        icon="🌐"
        title="Website Inspector"
        description="Scan any website's HTTP security headers, TLS setup, and get a graded security report — the same first checks any professional auditor runs."
      />
      <WebsiteInspector onToast={onToast} />
    </>
  );
}
