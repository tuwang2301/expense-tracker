import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

// GET /api/analytics?year=2025
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year") ?? String(new Date().getFullYear()));

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    // Monthly totals for the year
    const monthlyTotals = await Expense.aggregate([
      { $match: { date: { $gte: startOfYear, $lt: endOfYear } } },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // Category totals for the year
    const categoryTotals = await Expense.aggregate([
      { $match: { date: { $gte: startOfYear, $lt: endOfYear } } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Current month summary
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [currentMonthStats] = await Expense.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const [lastMonthStats] = await Expense.aggregate([
      { $match: { date: { $gte: startOfLastMonth, $lt: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        monthlyTotals,
        categoryTotals,
        currentMonth: currentMonthStats ?? { total: 0, count: 0 },
        lastMonth: lastMonthStats ?? { total: 0, count: 0 },
      },
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
