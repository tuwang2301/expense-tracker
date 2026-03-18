"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AnalyticsData } from "@/hooks/useAnalytics";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface MonthlyChartProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">
        ${payload[0].value.toFixed(2)}
      </p>
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

  // Build full 12-month data with zeros for missing months
  const currentMonth = new Date().getMonth() + 1;
  const data = MONTH_NAMES.map((name, i) => {
    const monthNum = i + 1;
    const found = analytics?.monthlyTotals.find((m) => m._id.month === monthNum);
    return {
      name,
      total: found?.total ?? 0,
      isCurrent: monthNum === currentMonth,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 4 }} />
        <Bar
          dataKey="total"
          radius={[4, 4, 0, 0]}
          // Color current month differently using Cell — handled below via fill
          fill="hsl(var(--primary))"
          opacity={0.75}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
