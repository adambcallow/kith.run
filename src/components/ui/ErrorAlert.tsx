interface ErrorAlertProps {
  message: string;
  className?: string;
}

export function ErrorAlert({ message, className = "" }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-input bg-red-50 border border-red-200 px-4 py-3 ${className}`}
    >
      <p className="text-sm text-red-600 font-body">{message}</p>
    </div>
  );
}
