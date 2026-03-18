"use client";

import { useState } from "react";
import { Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getCategoryMeta, formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@/hooks/useExpenses";

interface ExpenseTableProps {
  expenses: Expense[];
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => Promise<void>;
}

type SortKey = "date" | "amount" | "title" | "category";
type SortDir = "asc" | "desc";

function SkeletonRow() {
  return (
    <tr className="border-b border-border/50">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-muted rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function ExpenseTable({ expenses, loading, onEdit, onDelete }: ExpenseTableProps) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "date", dir: "desc" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function toggleSort(key: SortKey) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === "desc" ? "asc" : "desc" }));
  }

  const sorted = [...expenses].sort((a, b) => {
    const mult = sort.dir === "asc" ? 1 : -1;
    if (sort.key === "date") return mult * (new Date(a.date).getTime() - new Date(b.date).getTime());
    if (sort.key === "amount") return mult * (a.amount - b.amount);
    if (sort.key === "title") return mult * a.title.localeCompare(b.title);
    if (sort.key === "category") return mult * a.category.localeCompare(b.category);
    return 0;
  });

  async function handleDelete(id: string) {
    setDeletingId(id);
    try { await onDelete(id); } finally { setDeletingId(null); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sort.key !== col) return <ChevronUp className="h-3 w-3 opacity-20" />;
    return sort.dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />;
  }

  function SortTh({ col, children }: { col: SortKey; children: React.ReactNode }) {
    return (
      <th
        className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors"
        onClick={() => toggleSort(col)}
      >
        <span className="flex items-center gap-1">
          {children}
          <SortIcon col={col} />
        </span>
      </th>
    );
  }

  if (!loading && expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <div className="text-4xl mb-3">🧾</div>
        <p className="text-sm font-medium">No expenses yet</p>
        <p className="text-xs mt-1">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/30">
            <SortTh col="title">Title</SortTh>
            <SortTh col="category">Category</SortTh>
            <SortTh col="amount">Amount</SortTh>
            <SortTh col="date">Date</SortTh>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Note</th>
            <th className="px-4 py-3 w-20" />
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            : sorted.map((expense) => {
                const cat = getCategoryMeta(expense.category);
                return (
                  <tr
                    key={expense._id}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-4 py-3 font-medium max-w-[180px] truncate">{expense.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: cat.bg, color: cat.color }}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{formatCurrency(expense.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(expense.date)}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[160px] truncate">
                      {expense.description || <span className="opacity-30">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onEdit(expense)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete expense?</AlertDialogTitle>
                              <AlertDialogDescription>
                                &quot;{expense.title}&quot; ({formatCurrency(expense.amount)}) will be permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(expense._id)}
                                disabled={deletingId === expense._id}
                              >
                                {deletingId === expense._id ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
}
