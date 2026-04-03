import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import seedData from "@/seed-data.json";

// Only allow in development
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not allowed in production" },
      { status: 403 },
    );
  }

  try {
    await connectDB();
    await Expense.deleteMany({});

    // Strip MongoDB-specific fields ($oid, $date) and map to plain objects
    const cleaned = seedData.map((item: any) => ({
      title: item.title,
      category: item.category,
      amount: item.amount,
      date: new Date(item.date.$date),
      ...(item.description ? { description: item.description } : {}),
    }));

    const inserted = await Expense.insertMany(cleaned);
    return NextResponse.json({
      success: true,
      message: `Seeded ${inserted.length} expenses successfully.`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Seed failed" },
      { status: 500 },
    );
  }
}
