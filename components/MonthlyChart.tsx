"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AnalyticsData } from "@/hooks/useAnalytics";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface MonthlyChartProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        fontSize: "13px",
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 2, color: "#111" }}>{label}</p>
      <p style={{ color: "#6b7280" }}>${payload[0].value.toFixed(2)}</p>
    </div>
  );
}

export function MonthlyChart({ analytics, loading }: MonthlyChartProps) {
  if (loading) {
    return (
      <div className="h-52 flex items-end gap-2 px-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-muted rounded-t animate-pulse"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    );
  }

  const currentMonth = new Date().getMonth() + 1;
  const data = MONTH_NAMES.map((name, i) => {
    const monthNum = i + 1;
    const found = analytics?.monthlyTotals.find(
      (m) => m._id.month === monthNum,
    );
    return {
      name,
      total: found?.total ?? 0,
      isCurrent: monthNum === currentMonth,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0f0f0"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(0,0,0,0.04)", radius: 4 }}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.isCurrent ? "#1d4ed8" : "#93c5fd"}
              opacity={entry.total === 0 ? 0.3 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
