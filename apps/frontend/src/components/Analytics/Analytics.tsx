import AnalyticsChart from "./AnalyticsChart";
import { Search } from "lucide-react";

function Analytics() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-custom p-6 flex flex-col gap-6">
        <div className="relative w-full ">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by original URL..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl 
                         shadow-sm bg-white text-gray-900 text-base transition-all duration-200"
          />
        </div>
        <AnalyticsChart />
      </div>
    </div>
  );
}

export default Analytics;
