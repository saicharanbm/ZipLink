import { Link } from "react-router-dom";
function PageNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          Oops! It seems you've wandered off the map.
        </p>
        <div className="flex justify-center items-center mb-6 ">
          <div className="w-32 h-32  relative rounded-full flex items-center justify-center border-2 border-gray-600 border-solid">
            <div className="absolute top-8 left-8 w-5 h-5 bg-[#1e5652] rounded-full"></div>
            <div className="absolute top-8 right-8 w-5 h-5 bg-[#1e5652] rounded-full"></div>

            <div className="absolute top-20 w-20 h-24 border-4 border-transparent  border-t-[#1e5652] rounded-t-full"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Let’s guide you back to safety.{" "}
          <Link to={"/"} className="text-[#004400] underline">
            Go Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default PageNotFound;
