function ErrorState({
  message = "Something went wrong",
  subMessage = "We're having trouble processing your request. Please try again.",
  onRetry,
}: {
  message?: string;
  subMessage?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center items-center mb-8">
        <div className="w-32 h-32 relative rounded-full flex items-center justify-center border-2 border-red-200">
          {/* Worried eyes with eyebrows */}
          <div className="absolute top-6 left-7 space-y-1">
            <div className="w-6 h-1 bg-red-400 rounded-full -rotate-12"></div>
            <div
              className={`w-5 transition-all duration-200 h-5 bg-red-400 rounded-full`}
            ></div>
          </div>
          <div className="absolute top-6 right-7 space-y-1">
            <div className="w-6 h-1 bg-red-400 rounded-full rotate-12"></div>
            <div
              className={`w-5 transition-all duration-200 h-5 bg-red-400 rounded-full`}
            ></div>
          </div>

          {/* Worried mouth */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-12 h-12">
            <div className="w-full h-full border-4 border-transparent border-t-red-400 rounded-t-full"></div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-3">{message}</h2>
      <p className="text-gray-500 max-w-sm mx-auto">{subMessage}</p>

      <div className="mt-8 space-x-4">
        <button
          className="px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
          onClick={onRetry}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Add keyframes for shake animation

export default ErrorState;
