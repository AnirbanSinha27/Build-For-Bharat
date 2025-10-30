// app/dashboard/components/ErrorMessage.tsx
'use client';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
      <div className="flex items-start">
        <svg 
          className="w-6 h-6 text-red-600 mt-0.5 mr-3 shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-1">
            Error Loading Data
          </h3>
          <p className="text-red-700 mb-4">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}