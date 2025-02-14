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
import { useParams } from "react-router-dom";

export default function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState("lifetime");
  const [Slug, setSlug] = useState("course1");
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    uniqueVisits: 0,
    graphData: [],
  });
  const { slug } = useParams();

  const timeRangeIcons = {
    lifetime: <Infinity className="w-4 h-4" />,
    last7days: <Activity className="w-4 h-4" />,
    last24hours: <Clock className="w-4 h-4" />,
  };

  useEffect(() => {
    if (slug?.trim()) {
      fetch(
        `http://localhost:3000/api/v1/zipLink/analytics/${slug}/${timeRange}`
      )
        .then((res) => res.json())
        .then((data) => setAnalytics(data));
    }
  }, [timeRange, slug]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start sm:items-center gap-4">
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
                    !slug
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : timeRange === range
                        ? "bg-[#004400] text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }
                `}
            >
              {timeRangeIcons[range as keyof typeof timeRangeIcons]}
              <span className="hidden sm:inline">{range}</span>
            </button>
          ))}
        </div>
      </div>
      {!slug ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 p-4 bg-gray-50 rounded-full">
            <svg
              className="h-16 w-16 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Please select a zipLink to view its analytics
          </h2>
          <p className="text-gray-500 max-w-md">
            Enter a zipLink slug in the search box above to load and display the
            analytics data
          </p>
        </div>
      ) : (
        <>
          {" "}
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
        </>
      )}
    </div>
  );
}
