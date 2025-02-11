import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import UrlContainer from "./UrlContainer";

function Home() {
  const [search, setSearch] = useState("");
  const [shortUrl, setShortUrl] = useState("https://short.ly/xyz123");
  const originalUrl = "https://example.com/some-long-url";

  const urlArray = [
    {
      originalUrl: "https://example.com/some-long-url",
      shortUrl: "https://short.ly/xyz123",
    },
    {
      originalUrl: "https://example.com/some-long-url1",
      shortUrl: "https://short.ly/xyz1231",
    },
    {
      originalUrl: "https://example.com/some-long-url2",
      shortUrl: "https://short.ly/xyz1232",
    },
    {
      originalUrl: "https://example.com/some-long-url3",
      shortUrl: "https://short.ly/xyz1233",
    },
    {
      originalUrl: "https://example.com/some-long-url4",
      shortUrl: "https://short.ly/xyz1234",
    },
    {
      originalUrl: "https://example.com/some-long-url5",
      shortUrl: "https://short.ly/xyz1235",
    },
    {
      originalUrl: "https://example.com/some-long-url6",
      shortUrl: "https://short.ly/xyz1236",
    },
    {
      originalUrl: "https://example.com/some-long-url7",
      shortUrl: "https://short.ly/xyz1237",
    },
  ];

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    alert("Short URL copied to clipboard!");
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] py-4  flex flex-col gap-3 lg:px-12">
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

      <div className="flex flex-col gap-4">
        {urlArray.map((item, index) => (
          <UrlContainer
            key={index}
            originalUrl={item.originalUrl}
            shortUrl={item.shortUrl}
          />
        ))}
      </div>

      {/* URL Container */}
      {/* <div className="w-full bg-[#fbf7f4a6] rounded-lg p-4 shadow-custom grid grid-flow-row grid-cols-[6fr_4fr_auto] items-center gap-6">
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
        <div className="p-2 text-[#004400]">
          <FaCopy
            size={25}
            className="cursor-pointer"
            onClick={() => handleCopy(shortUrl)}
          />
        </div>
      </div> */}
    </div>
  );
}

export default Home;
