import PageHeader from "../components/common/PageHeader.jsx";
import PrivacyCheckup from "../components/tools/PrivacyCheckup.jsx";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        icon="🕵️"
        title="Privacy Checkup"
        description="See what every website can silently learn about you the moment you visit. Understand your digital fingerprint — and how to shrink it."
      />
      <PrivacyCheckup />
    </>
  );
}
