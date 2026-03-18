import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

// GET /api/expenses/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const expense = await Expense.findById(params.id).lean();
    if (!expense) {
      return NextResponse.json({ success: false, error: "Expense not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    console.error("GET /api/expenses/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch expense" }, { status: 500 });
  }
}

// PUT /api/expenses/[id]  — update expense
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const { title, category, amount, date, description } = body;

    if (!title || !category || !amount || !date) {
      return NextResponse.json(
        { success: false, error: "Title, category, amount, and date are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    const expense = await Expense.findByIdAndUpdate(
      params.id,
      { title, category, amount, date, description },
      { new: true, runValidators: true }
    ).lean();

    if (!expense) {
      return NextResponse.json({ success: false, error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    console.error("PUT /api/expenses/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update expense" }, { status: 500 });
  }
}

// DELETE /api/expenses/[id]
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const expense = await Expense.findByIdAndDelete(params.id);
    if (!expense) {
      return NextResponse.json({ success: false, error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Expense deleted" });
  } catch (error) {
    console.error("DELETE /api/expenses/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete expense" }, { status: 500 });
  }
}
