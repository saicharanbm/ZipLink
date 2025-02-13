import { useState, useCallback } from "react";
import { Copy, CheckCircle, ExternalLink } from "lucide-react";
import { SiGoogleanalytics } from "react-icons/si";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";

function UrlContainer({
  originalUrl,
  shortUrl,
  slug,
  deleteZipLink,
}: {
  originalUrl: string;
  shortUrl: string;
  slug: string;
  deleteZipLink: (slug: string) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const handleDeleteZipLink = useCallback(() => {
    if (window.confirm("Do you really want to delete this zipLink?")) {
      deleteZipLink(slug);
    }
  }, [deleteZipLink, slug]);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-100 p-4 shadow-custom3 transition-all hover:shadow-xl overflow-clip">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Original URL */}
        <div className="flex-grow md:w-[40%]">
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Original URL
          </label>
          <div className="group relative flex items-center">
            <div
              className="w-full p-3 bg-gray-50 rounded-lg text-gray-700 font-mono text-sm truncate transition-colors hover:bg-gray-100"
              title={originalUrl}
            >
              {originalUrl}
            </div>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </a>
          </div>
        </div>

        <div className="flex gap-4 flex-grow min-w-0 md:w-[60%]">
          {/* Short URL */}
          <div className="flex-grow min-w-0">
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Short URL
            </label>
            <div className="group relative flex items-center">
              <div
                className="w-full p-3 bg-gray-50 rounded-lg text-indigo-600 font-mono text-sm truncate transition-colors hover:bg-gray-100"
                title={shortUrl}
              >
                {shortUrl}
              </div>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </a>
            </div>
          </div>

          <div className="flex items-end gap-2 w-40">
            <button
              onClick={() => handleCopy(shortUrl)}
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-green-500 transition-colors focus:outline-none relative"
              aria-label={copied ? "Copied!" : "Copy short URL"}
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleDeleteZipLink}
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
              aria-label="Delete ZipLink"
            >
              <MdDelete className="w-5 h-5" />
            </button>

            <Link
              to={`/analytics/${slug}`}
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-[#004400] transition-colors focus:outline-none"
              aria-label="Show Analytics"
            >
              <SiGoogleanalytics className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlContainer;
