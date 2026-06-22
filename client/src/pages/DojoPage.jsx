import PageHeader from "../components/common/PageHeader.jsx";
import PhishingDojo from "../components/tools/PhishingDojo.jsx";

export default function DojoPage() {
  return (
    <>
      <PageHeader
        icon="🎯"
        title="Phishing Dojo"
        description="Real scams hide in plain sight. Train yourself to spot phishing messages before they fool you — with real-world examples and instant feedback."
      />
      <PhishingDojo />
    </>
  );
}
