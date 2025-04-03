import { useState } from "react";
import { Search, Link2 } from "lucide-react";
import UrlContainer from "./ZipLinkContainer";
import { useLinksQuery } from "../../services/queries";
import useDebounce from "../../hooks/useDebounce";
import ShimmerZipLinkContainer from "../Shimmer/ShimmerZipLinkContainer";
import NoResultsFound from "../NoResultFound";
import ErrorState from "../ErrorState";
import { useDeleteZipLink } from "../../services/mutations";
import { toast } from "react-toastify";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm.trim(), 300);
  const { mutate } = useDeleteZipLink();

  const { data, isLoading, isError, refetch } = useLinksQuery(debouncedSearch);
  const deleteZipLink = (slug: string) => {
    toast.promise(
      new Promise<{ message: string }>((resolve, reject) => {
        mutate(
          { slug, search: debouncedSearch },
          {
            onSuccess: (data: { message: string }) => {
              console.log(data);

              resolve(data);
            },
            onError: (error) => {
              console.log(error);
              reject(error);
            },
          }
        );
      }),
      {
        pending: "Deleting ZipLink...",
        success: {
          render({ data }: { data: { message: string } }) {
            console.log(data);
            return data.message;
          },
        },
        error: {
          render({ data }: { data: string }) {
            console.log(data);
            return data;
          },
        },
      }
    );
  };
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-4 flex flex-col gap-8 lg:px-12">
      <div className="text-center ">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Link2 className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Your ZipLinks</h1>
        </div>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Manage and search through all your shortened URLs in one place
        </p>
      </div>
      <div className="w-full ">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by original URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                         shadow-sm bg-white text-gray-900 text-base transition-all duration-200"
          />
        </div>
      </div>

      {isLoading && (
        <div className="w-full flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <ShimmerZipLinkContainer key={index} />
          ))}
        </div>
      )}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && data?.length === 0 && (
        <div className="w-full ">
          <NoResultsFound />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {!isError &&
          data?.map((item: { originalUrl: string; slug: string }) => (
            <UrlContainer
              key={item.slug}
              originalUrl={item.originalUrl}
              shortUrl={`https:redirect.saicharanbm.in/${item.slug}`}
              slug={item.slug}
              deleteZipLink={deleteZipLink}
            />
          ))}
      </div>
    </div>
  );
}

export default Home;
