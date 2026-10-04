interface LoadingStateProps {
    message?: string;
  }
  
  const LoadingState = ({
    message = "Loading data...",
  }: LoadingStateProps) => {
    return (
      <div
        className="flex min-h-40 items-center justify-center border border-slate-200 bg-white"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#123b63]"
            aria-hidden="true"
          />
  
          <span className="text-sm text-slate-600">
            {message}
          </span>
        </div>
      </div>
    );
  };
  
  export default LoadingState;