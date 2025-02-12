import { useState } from "react";
import { Copy, CheckCircle, ExternalLink } from "lucide-react";

function UrlContainer({
  originalUrl,
  shortUrl,
}: {
  originalUrl: string;
  shortUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-100 p-4 shadow-custom3 transition-all hover:shadow-xl overflow-clip">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Original URL */}
        <div className="flex-grow md:w-1/2">
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

        {/* Short URL and Copy Button Container */}
        <div className="flex gap-4 flex-grow md:w-1/2">
          {/* Short URL */}
          <div className="flex-grow w-[80%]">
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

          {/* Copy Button - Now properly aligned */}
          <div className="flex items-end">
            <button
              onClick={() => handleCopy(shortUrl)}
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none "
              title={copied ? "Copied!" : "Copy short URL"}
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrlContainer;
