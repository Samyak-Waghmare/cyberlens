const ICONS = {
  default: "✓",
  success: "✓",
  error: "✕",
  info: "ℹ",
};

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div
      className={`toast toast-${toast.tone}`}
      role="status"
      aria-live="polite"
      onClick={onDismiss}
      key={toast.id}
    >
      <span className="toast-icon">{ICONS[toast.tone] || ICONS.default}</span>
      <span className="toast-msg">{toast.message}</span>
    </div>
  );
}
