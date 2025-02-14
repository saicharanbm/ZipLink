import AnalyticsChart from "./AnalyticsChart";
import SerachBox from "./SerachBox";

function Analytics() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-custom p-6 flex flex-col gap-6">
        <SerachBox />
        <AnalyticsChart />
      </div>
    </div>
  );
}

export default Analytics;
