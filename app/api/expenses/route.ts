import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

// GET /api/expenses  — list with optional filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const month = searchParams.get("month"); // format: "2025-03"
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (category && category !== "all") filter.category = category;

    if (month) {
      const [year, mon] = month.split("-").map(Number);
      filter.date = {
        $gte: new Date(year, mon - 1, 1),
        $lt: new Date(year, mon, 1),
      };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const expenses = await Expense.find(filter).sort({ date: -1 }).lean();

    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    console.error("GET /api/expenses error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

// POST /api/expenses  — create new expense
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, category, amount, date, description } = body;

    // Basic server-side validation
    if (!title || !category || !amount || !date) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, category, amount, and date are required",
        },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    const expense = await Expense.create({
      title,
      category,
      amount,
      date,
      description,
    });

    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error) {
    console.error("POST /api/expenses error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create expense" },
      { status: 500 },
    );
  }
}
