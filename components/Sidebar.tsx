"use client";

import {
  LayoutDashboard,
  List,
  BarChart2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { addMonths, format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/constants/categories";

type View = "dashboard" | "expenses" | "analytics";

interface SidebarProps {
  activeView: View;
  onViewChange: (v: View) => void;
  activeCategory: string;
  onCategoryChange: (c: string) => void;
  selectedMonth: string;
  onMonthChange: (m: string) => void;
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
}

const NAV = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "expenses" as View, label: "All Expenses", icon: List },
  { id: "analytics" as View, label: "Analytics", icon: BarChart2 },
];

const monthToDate = (ym: string) => parse(ym, "yyyy-MM", new Date());
const dateToMonth = (d: Date) => format(d, "yyyy-MM");

const prevMonth = (ym: string) => dateToMonth(addMonths(monthToDate(ym), -1));
const nextMonth = (ym: string) => dateToMonth(addMonths(monthToDate(ym), 1));
const fmtMonth = (ym: string) => format(monthToDate(ym), "MMMM yyyy");

export function Sidebar({
  activeView,
  onViewChange,
  activeCategory,
  onCategoryChange,
  selectedMonth,
  onMonthChange,
  collapsed,
  onCollapse,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-r border-border/50 transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-56",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5 border-b border-border/50",
          collapsed && "justify-center px-2",
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground text-sm font-bold">S</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold leading-none">Spendy</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Expense Tracker
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {/* Main nav */}
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              collapsed && "justify-center px-2",
              activeView === id
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
            title={collapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}

        {/* Categories filter — only show on relevant views */}
        {!collapsed &&
          (activeView === "dashboard" || activeView === "expenses") && (
            <div className="pt-4">
              <p className="px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
                Categories
              </p>
              <button
                onClick={() => onCategoryChange("all")}
                className={cn(
                  "w-full flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                  activeCategory === "all"
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <span className="w-2 h-2 rounded-full bg-foreground/30 shrink-0" />
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onCategoryChange(cat.value)}
                  className={cn(
                    "w-full flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                    activeCategory === cat.value
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.label}
                </button>
              ))}
            </div>
          )}
      </nav>

      {/* Month picker */}
      {!collapsed && (
        <div className="border-t border-border/50 p-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-2 px-1">
            Period
          </p>
          <div className="flex items-center justify-between bg-muted rounded-lg px-2 py-1.5">
            <button
              onClick={() => onMonthChange(prevMonth(selectedMonth))}
              className="p-1 hover:text-foreground text-muted-foreground transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs font-medium text-center leading-tight">
              {fmtMonth(selectedMonth)}
            </span>
            <button
              onClick={() => onMonthChange(nextMonth(selectedMonth))}
              className="p-1 hover:text-foreground text-muted-foreground transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => onCollapse(!collapsed)}
        className="flex items-center justify-center py-3 border-t border-border/50 text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
