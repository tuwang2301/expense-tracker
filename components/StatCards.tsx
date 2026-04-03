"use client";

import {
  TrendingUp,
  TrendingDown,
  Minus,
  Receipt,
  CalendarDays,
  BarChart3,
} from "lucide-react";
import type { AnalyticsData } from "@/hooks/useAnalytics";
import { getCategoryMeta } from "@/constants/categories";
import { formatCurrency } from "@/utils/format";

interface StatCardsProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

function StatCard({
  label,
  value,
  sub,
  trend,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5 flex flex-col gap-3 animate-fade-up">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="text-muted-foreground/50">{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          {trend === "up" && <TrendingUp className="h-3 w-3 text-rose-500" />}
          {trend === "down" && (
            <TrendingDown className="h-3 w-3 text-emerald-500" />
          )}
          {trend === "neutral" && (
            <Minus className="h-3 w-3 text-muted-foreground" />
          )}
          <span
            className={
              trend === "up"
                ? "text-xs text-rose-500"
                : trend === "down"
                  ? "text-xs text-emerald-500"
                  : "text-xs text-muted-foreground"
            }
          >
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
      <div className="h-3 bg-muted rounded animate-pulse w-24" />
      <div className="h-7 bg-muted rounded animate-pulse w-32" />
      <div className="h-3 bg-muted rounded animate-pulse w-20" />
    </div>
  );
}

export function StatCards({ analytics, loading }: StatCardsProps) {
  if (loading)
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );

  const current = analytics?.currentMonth.total ?? 0;
  const last = analytics?.lastMonth.total ?? 0;
  const pctChange = last > 0 ? ((current - last) / last) * 100 : 0;
  const topCat = analytics?.categoryTotals[0];
  const dailyAvg = current / new Date().getDate();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="This month"
        value={formatCurrency(current)}
        sub={
          last > 0
            ? `${pctChange > 0 ? "+" : ""}${pctChange.toFixed(1)}% vs last month`
            : "No prior data"
        }
        trend={pctChange > 0 ? "up" : pctChange < 0 ? "down" : "neutral"}
        icon={<Receipt className="h-4 w-4" />}
      />
      <StatCard
        label="Transactions"
        value={String(analytics?.currentMonth.count ?? 0)}
        sub={`${analytics?.lastMonth.count ?? 0} last month`}
        trend="neutral"
        icon={<CalendarDays className="h-4 w-4" />}
      />
      <StatCard
        label="Top category"
        value={topCat ? formatCurrency(topCat.total) : "$0.00"}
        sub={topCat ? getCategoryMeta(topCat._id).label : "No data"}
        trend="neutral"
        icon={<BarChart3 className="h-4 w-4" />}
      />
      <StatCard
        label="Daily average"
        value={formatCurrency(dailyAvg)}
        sub={`Based on ${new Date().getDate()} days`}
        trend="neutral"
        icon={<TrendingUp className="h-4 w-4" />}
      />
    </div>
  );
}
