import { Clock, Calendar, Infinity } from "lucide-react";

const AnalyticsNotFound = () => {
  // Time range icons (same as in original component)
  const timeRangeIcons = {
    lifetime: <Infinity className="h-4 w-4" />,
    last7days: <Calendar className="h-4 w-4" />,
    last24hours: <Clock className="h-4 w-4" />,
  };

  return (
    <div className="w-full  max-w-6xl mx-auto bg-white rounded-lg flex flex-col gap-6 shadow-md p-6">
      <div className=" w-full ">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004400] focus:border-transparent"
          placeholder="Enter zipLink slug..."
        />
      </div>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <div className="flex gap-2">
            {["lifetime", "last7days", "last24hours"].map((range) => (
              <button
                key={range}
                disabled
                className="flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-gray-100 text-gray-400 cursor-not-allowed"
              >
                {timeRangeIcons[range as keyof typeof timeRangeIcons]}
                <span className="hidden sm:inline">{range}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Placeholder Selection State */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 p-4 bg-gray-50 rounded-full">
            <svg
              className="h-16 w-16 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Please select a zipLink to view its analytics
          </h2>
          <p className="text-gray-500 max-w-md">
            Enter a zipLink slug in the search box below to load and display the
            analytics data
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsNotFound;
