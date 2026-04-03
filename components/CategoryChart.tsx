"use client";

import type { AnalyticsData } from "@/hooks/useAnalytics";
import { getCategoryMeta } from "@/constants/categories";
import { formatCurrency } from "@/utils/format";

interface CategoryChartProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

export function CategoryChart({ analytics, loading }: CategoryChartProps) {
  const totals = analytics?.categoryTotals ?? [];
  const grandTotal = totals.reduce((s, c) => s + c.total, 0);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-3 bg-muted rounded animate-pulse w-24" />
              <div className="h-3 bg-muted rounded animate-pulse w-16" />
            </div>
            <div className="h-2 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (totals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <p className="text-sm">No data yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {totals.map((item) => {
        const cat = getCategoryMeta(item._id);
        const pct = grandTotal > 0 ? (item.total / grandTotal) * 100 : 0;
        return (
          <div key={item._id} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span>{cat.emoji}</span>
                <span className="font-medium">{cat.label}</span>
                <span className="text-xs text-muted-foreground">
                  {item.count} txn
                </span>
              </span>
              <span className="font-medium tabular-nums">
                {formatCurrency(item.total)}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: cat.color }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {pct.toFixed(1)}%
            </p>
          </div>
        );
      })}
    </div>
  );
}
