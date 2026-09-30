interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
}

export function ErrorState({ message, onRetry, isRetrying }: ErrorStateProps) {
  return (
    <div className="error-container">
      <p>{message}</p>
      <button onClick={onRetry} disabled={isRetrying}>
        {isRetrying ? 'Deneniyor...' : 'Tekrar dene'}
      </button>
    </div>
  );
}