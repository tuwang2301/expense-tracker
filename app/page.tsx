"use client";

import { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/Sidebar";
import { StatCards } from "@/components/StatCards";
import { CategoryChart } from "@/components/CategoryChart";
import { MonthlyChart } from "@/components/MonthlyChart";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpenseForm } from "@/components/ExpenseForm";
import { useExpenses, type Expense } from "@/hooks/useExpenses";
import { useAnalytics } from "@/hooks/useAnalytics";
import { toast } from "@/components/ui/toast";
import { CATEGORIES } from "@/constants/categories";
import { formatCurrency } from "@/utils/format";

type View = "dashboard" | "expenses" | "analytics";

const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [category, setCategory] = useState("all");
  const [month, setMonth] = useState(getCurrentMonth());
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Expense | null>(null);

  // Filters for expense list — search only on "expenses" view
  const filters = useMemo(
    () => ({
      category,
      month,
      search: view === "expenses" ? search : undefined,
    }),
    [category, month, search, view],
  );

  const {
    expenses,
    loading: expLoading,
    createExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses(filters);
  const {
    data: analytics,
    loading: anaLoading,
    fetchAnalytics,
  } = useAnalytics();

  // Recent 6 for dashboard
  const recent = useMemo(() => expenses.slice(0, 8), [expenses]);

  function openAdd() {
    setEditTarget(null);
    setFormOpen(true);
  }
  function openEdit(e: Expense) {
    setEditTarget(e);
    setFormOpen(true);
  }

  async function handleSubmit(data: Omit<Expense, "_id" | "createdAt">) {
    if (editTarget) {
      await updateExpense(editTarget._id, data);
      fetchAnalytics(); // Refresh analytics after editing an expense
      toast("Expense updated", "success");
    } else {
      await createExpense(data);
      fetchAnalytics(); // Refresh analytics after adding new expense
      toast("Expense added", "success");
    }
  }

  async function handleDelete(id: string) {
    await deleteExpense(id);
    fetchAnalytics(); // Refresh analytics after deleting an expense
    toast("Expense deleted", "success");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  const viewTitle: Record<View, string> = {
    dashboard: "Dashboard",
    expenses: "All Expenses",
    analytics: "Analytics",
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        activeView={view}
        onViewChange={setView}
        activeCategory={category}
        onCategoryChange={setCategory}
        selectedMonth={month}
        onMonthChange={setMonth}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card shrink-0">
          <h1 className="text-base font-semibold">{viewTitle[view]}</h1>
          <div className="flex items-center gap-3">
            {view === "expenses" && (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search expenses..."
                    className="pl-8 h-8 w-52 text-sm"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput("");
                        setSearch("");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </form>
            )}
            <Button
              onClick={openAdd}
              className="gap-1.5 hover:bg-transparent hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex justify-center overflow-y-auto p-6">
          {/* ── DASHBOARD VIEW ── */}
          {view === "dashboard" && (
            <div className="space-y-6 w-full">
              <StatCards analytics={analytics} loading={anaLoading} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent expenses */}
                <div className="lg:col-span-2 bg-card border border-border/50 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                    <h2 className="text-sm font-semibold">Recent Expenses</h2>
                    <Button
                      onClick={() => setView("expenses")}
                      className="text-xs hover:bg-transparent hover:text-primary"
                    >
                      View all →
                    </Button>
                  </div>
                  <ExpenseTable
                    expenses={recent}
                    loading={expLoading}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                </div>

                {/* Category breakdown */}
                <div className="bg-card border border-border/50 rounded-xl">
                  <div className="px-5 py-4 border-b border-border/50">
                    <h2 className="text-sm font-semibold">By Category</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      This year
                    </p>
                  </div>
                  <div className="p-5">
                    <CategoryChart analytics={analytics} loading={anaLoading} />
                  </div>
                </div>
              </div>

              {/* Monthly trend */}
              <div className="bg-card border border-border/50 rounded-xl">
                <div className="px-5 py-4 border-b border-border/50">
                  <h2 className="text-sm font-semibold">Monthly Spending</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Current year
                  </p>
                </div>
                <div className="p-5">
                  <MonthlyChart analytics={analytics} loading={anaLoading} />
                </div>
              </div>
            </div>
          )}

          {/* ── ALL EXPENSES VIEW ── */}
          {view === "expenses" && (
            <div className="w-full space-y-4">
              {/* Summary row */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {expenses.length}
                </span>{" "}
                expenses
                {search && <span>matching &quot;{search}&quot;</span>}
                <span className="ml-auto font-semibold text-foreground">
                  Total:{" "}
                  {formatCurrency(expenses.reduce((s, e) => s + e.amount, 0))}
                </span>
              </div>

              <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <ExpenseTable
                  expenses={expenses}
                  loading={expLoading}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          )}

          {/* ── ANALYTICS VIEW ── */}
          {view === "analytics" && (
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly bar chart */}
                <div className="bg-card border border-border/50 rounded-xl">
                  <div className="px-5 py-4 border-b border-border/50">
                    <h2 className="text-sm font-semibold">Monthly Spending</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Current year breakdown
                    </p>
                  </div>
                  <div className="p-5 flex justify-center items-center h-full">
                    <MonthlyChart analytics={analytics} loading={anaLoading} />
                  </div>
                </div>

                {/* Category breakdown */}
                <div className="bg-card border border-border/50 rounded-xl">
                  <div className="px-5 py-4 border-b border-border/50">
                    <h2 className="text-sm font-semibold">
                      Category Breakdown
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      All time by category
                    </p>
                  </div>
                  <div className="p-5">
                    <CategoryChart analytics={analytics} loading={anaLoading} />
                  </div>
                </div>
              </div>

              {/* Per-category stats table */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border/50">
                  <h2 className="text-sm font-semibold">Category Summary</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Transactions
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Avg per txn
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {anaLoading
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-b border-border/40">
                              {[1, 2, 3, 4].map((j) => (
                                <td key={j} className="px-5 py-3">
                                  <div className="h-4 bg-muted rounded animate-pulse" />
                                </td>
                              ))}
                            </tr>
                          ))
                        : (analytics?.categoryTotals ?? []).map((item) => {
                            const cat = CATEGORIES.find(
                              (c) => c.value === item._id,
                            );
                            if (!cat) return null;
                            return (
                              <tr
                                key={item._id}
                                className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                              >
                                <td className="px-5 py-3">
                                  <span
                                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor: cat.bg,
                                      color: cat.color,
                                    }}
                                  >
                                    {cat.emoji} {cat.label}
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-right tabular-nums">
                                  {item.count}
                                </td>
                                <td className="px-5 py-3 text-right font-semibold tabular-nums">
                                  {formatCurrency(item.total)}
                                </td>
                                <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">
                                  {formatCurrency(item.total / item.count)}
                                </td>
                              </tr>
                            );
                          })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit form modal */}
      <ExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editTarget}
      />
    </div>
  );
}
