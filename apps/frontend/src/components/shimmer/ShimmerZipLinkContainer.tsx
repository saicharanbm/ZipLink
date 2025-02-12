const ShimmerZipLinkContainer = () => {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-100 p-4 shadow-custom3 overflow-clip">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Original URL Shimmer */}
        <div className="flex-grow md:w-1/2">
          <label className="text-xs font-medium text-gray-300 mb-1 block">
            Original URL
          </label>
          <div className="w-full p-3 bg-gray-200 animate-pulse rounded-lg h-6"></div>
        </div>

        {/* Short URL and Copy Button Shimmer */}
        <div className="flex gap-4 flex-grow md:w-1/2">
          {/* Short URL Shimmer */}
          <div className="flex-grow w-[80%]">
            <label className="text-xs font-medium text-gray-300 mb-1 block">
              Short URL
            </label>
            <div className="w-full p-3 bg-gray-200 animate-pulse rounded-lg h-6"></div>
          </div>

          {/* Copy Button Shimmer */}
          <div className="flex items-end">
            <div className="w-12 h-12 bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerZipLinkContainer;
