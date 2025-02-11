import { useState } from "react";
import UrlContainer from "./UrlContainer";
import { useLinksQuery } from "../services/queries";

function Home() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = useLinksQuery(search);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-4 flex flex-col gap-3 lg:px-12">
      {/* Search Bar */}
      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Loading & Error Handling */}
      {isLoading && <p>Loading...</p>}
      {isError && <p className="text-red-500">Failed to fetch links</p>}

      {/* Shortened URLs List */}
      {!isLoading && !isError && data?.length === 0 && <p>No results found.</p>}

      <div className="flex flex-col gap-4">
        {data?.map(
          (item: { originalUrl: string; slug: string }, index: number) => (
            <UrlContainer
              key={index}
              originalUrl={item.originalUrl}
              shortUrl={`http://localhost:3000/api/v1/shortLink/${item.slug}`}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Home;
