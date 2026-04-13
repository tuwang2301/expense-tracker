"use client";

import { toast } from "@/components/ui/toast";
import { useState, useEffect, useCallback } from "react";

export interface Expense {
  _id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
  createdAt: string;
}

export interface ExpenseFilters {
  category?: string;
  month?: string; // "YYYY-MM"
  search?: string;
}

export function useExpenses(filters: ExpenseFilters = {}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "all")
        params.set("category", filters.category);
      if (filters.month) params.set("month", filters.month);
      if (filters.search) params.set("search", filters.search);

      const res = await fetch(`/api/expenses?${params.toString()}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error);
      setExpenses(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expenses");
      toast("Error loading expenses", "error");
    } finally {
      setLoading(false);
    }
  }, [filters.category, filters.month, filters.search]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const createExpense = async (data: Omit<Expense, "_id" | "createdAt">) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    await fetchExpenses();
    return json.data;
  };

  const updateExpense = async (id: string, data: Partial<Expense>) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    await fetchExpenses();
    return json.data;
  };

  const deleteExpense = async (id: string) => {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!json.success) throw new Error(json.error);
    await fetchExpenses();
  };

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
