function NoResultsFound() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center items-center mb-8">
        <div className="w-32 h-32 relative rounded-full flex items-center justify-center border-2 border-gray-300">
          {/* Eyes */}
          <div
            className={`absolute top-9 left-7 transition-all duration-200 h-5 w-5 bg-gray-400 rounded-full`}
          ></div>
          <div
            className={`absolute top-9 right-7 transition-all duration-200 h-5 w-5 bg-gray-400 rounded-full`}
          ></div>

          {/* Sad mouth */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-16">
            <div className="w-full h-full border-4 border-transparent border-t-gray-400 rounded-t-full"></div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-3">
        No Results Found
      </h2>
      <p className="text-gray-500 max-w-sm mx-auto">
        We couldn't find what you're looking for. Try adjusting your search.
      </p>
    </div>
  );
}

export default NoResultsFound;
