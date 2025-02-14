import { Search } from "lucide-react";
import useDebounce from "../../hooks/useDebounce";
import { useState, useEffect, useRef } from "react";
import { useLinksQuery } from "../../services/queries";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const debouncedSearch = useDebounce(searchTerm.trim(), 300);
  const { data, isLoading, isError } = useLinksQuery(debouncedSearch);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsResultsVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Show results when typing
  useEffect(() => {
    if (debouncedSearch) {
      setIsResultsVisible(true);
    } else {
      setIsResultsVisible(false);
    }
  }, [debouncedSearch]);

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by original link..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                   shadow-sm bg-white text-gray-900 text-base transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsResultsVisible(!!debouncedSearch)}
        />
      </div>

      {isResultsVisible && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg overflow-hidden max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-pulse flex justify-center">
                <div className="h-4 w-4 bg-gray-300 rounded-full mr-1"></div>
                <div className="h-4 w-4 bg-gray-300 rounded-full mr-1"></div>
                <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ) : isError ? (
            <div className="p-4 text-center text-red-500">
              Something went wrong
            </div>
          ) : data && data.length > 0 ? (
            data.map((item: { originalUrl: string; slug: string }) => (
              <div
                key={item.slug}
                onClick={() => {
                  navigate(`/analytics/${item.slug}`);
                  setIsResultsVisible(false);
                }}
                className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="truncate text-gray-700">{item.originalUrl}</div>
                <div className="text-xs text-gray-500 mt-1 truncate">
                  {`/${item.slug}`}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBox;
