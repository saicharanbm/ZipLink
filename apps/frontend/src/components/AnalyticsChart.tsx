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

export default function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState("lifetime");
  const [slug, setSlug] = useState("course1");
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    uniqueVisits: 0,
    graphData: [],
  });

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/zipLink/analytics/${slug}/${timeRange}`)
      .then((res) => res.json())
      .then((data) => setAnalytics(data));
  }, [timeRange, slug]);

  return (
    <div className="w-full">
      <h2>Analytics for gitHub</h2>
      <p>Total Visits: {analytics.totalVisits}</p>
      <p>Unique Visits: {analytics.uniqueVisits}</p>

      <div className="flex gap-2">
        <input
          className="outline"
          type="text"
          onChange={(e) => {
            setSlug(e.target.value);
          }}
        />
        <button
          onClick={() => setTimeRange("lifetime")}
          className={`p-1 bg-slate-400 rounded-sm hover:bg-slate-300 ${timeRange === "lifetime" && "bg-green-400"}`}
        >
          Lifetime
        </button>
        <button
          onClick={() => setTimeRange("last7days")}
          className={`p-1 bg-slate-400 rounded-sm hover:bg-slate-300 ${timeRange === "last7days" && "bg-green-400"}`}
        >
          Last 7 Days
        </button>
        <button
          className={`p-1 bg-slate-400 rounded-sm hover:bg-slate-300 ${timeRange === "last24hours" && "bg-green-400"}`}
          onClick={() => setTimeRange("last24hours")}
        >
          Last 24 Hours
        </button>
      </div>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={analytics.graphData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
