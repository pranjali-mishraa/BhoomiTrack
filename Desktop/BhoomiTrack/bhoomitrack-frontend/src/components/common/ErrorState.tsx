interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
  }
  
  const ErrorState = ({
    message = "Unable to load the requested data.",
    onRetry,
  }: ErrorStateProps) => {
    return (
      <div
        className="border border-red-200 bg-red-50 px-5 py-6"
        role="alert"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-red-800">
              Unable to load data
            </h2>
  
            <p className="mt-1 text-sm text-red-700">
              {message}
            </p>
          </div>
  
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-fit border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-800 transition hover:bg-red-100"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  };
  
  export default ErrorState;