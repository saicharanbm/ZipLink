import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Activity, Clock, Infinity } from "lucide-react";

export default function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState("lifetime");
  const [slug, setSlug] = useState("course1");
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    uniqueVisits: 0,
    graphData: [],
  });

  const timeRangeIcons = {
    lifetime: <Infinity className="w-4 h-4" />,
    last7days: <Activity className="w-4 h-4" />,
    last24hours: <Clock className="w-4 h-4" />,
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/zipLink/analytics/${slug}/${timeRange}`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data));
  }, [timeRange, slug]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-custom p-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <div className="flex gap-2">
            {["lifetime", "last7days", "last24hours"].map((range) => (
              <button
                key={range}
                onClick={() => {
                  if (timeRange !== range) setTimeRange(range);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md transition-colors
                  ${
                    timeRange === range
                      ? "bg-[#004400] text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {timeRangeIcons[range]}
                <span className="hidden sm:inline">
                  {range.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls and Stats Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-full sm:w-64">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter slug..."
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <div className="flex gap-8 ml-0 sm:ml-8">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Total Visits</span>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.totalVisits}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Unique Visits</span>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.uniqueVisits}
              </span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="h-[400px] mt-4 bg-white rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.graphData}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white px-4 py-2 shadow-lg border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600">{label}</p>
                        <p className="text-sm font-bold text-gray-900">
                          {payload[0].value} visits
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#004400" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
