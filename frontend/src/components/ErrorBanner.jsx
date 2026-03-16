export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="error-banner" id="error-banner" role="alert">
      <span>{message}</span>
      <button
        className="error-banner__close"
        onClick={onDismiss}
        aria-label="Dismiss error"
        id="error-dismiss"
      >
        ✕
      </button>
    </div>
  );
}
