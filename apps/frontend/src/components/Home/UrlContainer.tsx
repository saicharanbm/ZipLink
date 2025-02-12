import { FaCopy } from "react-icons/fa";

function UrlContainer({
  originalUrl,
  shortUrl,
}: {
  originalUrl: string;
  shortUrl: string;
}) {
  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    alert(`Short URL copied to clipboard! ${shortUrl}`);
  };
  return (
    <div className="w-full bg-[#fbf7f4a6] rounded-lg p-4 shadow-custom3 grid grid-flow-row grid-cols-[6fr_4fr_auto] items-center gap-6">
      <div
        className="flex-1 p-2 rounded-md truncate bg-[#EEEFF1] text-[#656b64] "
        title={originalUrl}
      >
        {originalUrl}
      </div>
      <div
        className="flex-1 p-2 rounded-md truncate bg-[#EEEFF1] text-[#676b75] "
        title={shortUrl}
      >
        {shortUrl}
      </div>
      <div className="p-2 text-[#004400]" title="copy">
        <FaCopy
          size={25}
          className="cursor-pointer"
          onClick={() => handleCopy(shortUrl)}
        />
      </div>
    </div>
  );
}

export default UrlContainer;
