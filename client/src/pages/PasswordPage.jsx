import PageHeader from "../components/common/PageHeader.jsx";
import PasswordLab from "../components/tools/PasswordLab.jsx";

export default function PasswordPage({ onToast }) {
  return (
    <>
      <PageHeader
        icon="🔑"
        title="Password Lab"
        description="Test any password's strength and check if it has appeared in known data breaches — all processed privately in your browser."
      />
      <PasswordLab onToast={onToast} />
    </>
  );
}
