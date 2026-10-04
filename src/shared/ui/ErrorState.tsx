interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}

export function ErrorState({ message, onRetry, isRetrying }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-lg border border-line bg-surface p-4">
      <p className="mb-3">{message}</p>
      <button
        type="button"
        className="btn"
        onClick={onRetry}
        disabled={isRetrying}
      >
        {isRetrying ? "Deneniyor…" : "Tekrar dene"}
      </button>
    </div>
  );
}
