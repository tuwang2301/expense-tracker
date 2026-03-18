"use client";

import { useState, useEffect } from "react";

export interface AnalyticsData {
  monthlyTotals: { _id: { month: number }; total: number; count: number }[];
  categoryTotals: { _id: string; total: number; count: number }[];
  currentMonth: { total: number; count: number };
  lastMonth: { total: number; count: number };
}

export function useAnalytics(year?: number) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = year ? `?year=${year}` : "";
        const res = await fetch(`/api/analytics${params}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [year]);

  return { data, loading, error };
}
