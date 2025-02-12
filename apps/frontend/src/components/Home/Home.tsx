import { useState } from "react";
import UrlContainer from "./ZipLinkContainer";
import { useLinksQuery } from "../../services/queries";
import useDebounce from "../../hooks/useDebounce";
import ShimmerZipLinkContainer from "../Shimmer/ShimmerZipLinkContainer";
import { Divide } from "lucide-react";
import NoResultsFound from "../NoResultFound";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading, isError } = useLinksQuery(debouncedSearch);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-4 flex flex-col gap-3 lg:px-12">
      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Search Original URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-blue-500"
        />
      </div>

      {isLoading && (
        <div className="w-full flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <ShimmerZipLinkContainer key={index} />
          ))}
        </div>
      )}
      {isError && (
        <div className="w-full py-4 text-center">
          <p className="text-red-500">Failed to fetch links</p>
        </div>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="w-full ">
          <NoResultsFound />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {data?.map(
          (item: { originalUrl: string; slug: string }, index: number) => (
            <UrlContainer
              key={index}
              originalUrl={item.originalUrl}
              shortUrl={`http://localhost:3000/api/v1/zipLink/${item.slug}`}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Home;
