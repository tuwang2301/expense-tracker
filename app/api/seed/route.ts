import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

const SEED_DATA = [
  {
    title: "Pho Noodle House",
    category: "food",
    amount: 24.5,
    date: new Date("2025-03-14"),
    description: "Lunch with team",
  },
  {
    title: "Monthly Opal top-up",
    category: "transport",
    amount: 50.0,
    date: new Date("2025-03-13"),
  },
  {
    title: "Uniqlo — winter jacket",
    category: "shopping",
    amount: 149.0,
    date: new Date("2025-03-12"),
    description: "Navy puffer jacket",
  },
  {
    title: "Netflix subscription",
    category: "entertainment",
    amount: 22.99,
    date: new Date("2025-03-11"),
  },
  {
    title: "Electricity bill",
    category: "utilities",
    amount: 118.0,
    date: new Date("2025-03-10"),
  },
  {
    title: "Single O Roasters",
    category: "food",
    amount: 6.5,
    date: new Date("2025-03-10"),
  },
  {
    title: "Uber to airport",
    category: "transport",
    amount: 45.0,
    date: new Date("2025-03-09"),
    description: "Early morning flight",
  },
  {
    title: "Woolworths groceries",
    category: "food",
    amount: 87.3,
    date: new Date("2025-03-08"),
  },
  {
    title: "Gym membership",
    category: "health",
    amount: 55.0,
    date: new Date("2025-03-07"),
  },
  {
    title: "Spotify Premium",
    category: "entertainment",
    amount: 12.99,
    date: new Date("2025-03-06"),
  },
  {
    title: "Internet bill",
    category: "utilities",
    amount: 75.0,
    date: new Date("2025-03-05"),
  },
  {
    title: "Sushi train Haymarket",
    category: "food",
    amount: 38.0,
    date: new Date("2025-03-04"),
  },
  {
    title: "Coursera subscription",
    category: "education",
    amount: 69.0,
    date: new Date("2025-03-03"),
  },
  {
    title: "Bus ticket",
    category: "transport",
    amount: 4.5,
    date: new Date("2025-03-03"),
  },
  {
    title: "Chemist Warehouse",
    category: "health",
    amount: 32.4,
    date: new Date("2025-03-02"),
    description: "Vitamins & cold meds",
  },
  {
    title: "Dan Murphy's",
    category: "shopping",
    amount: 55.0,
    date: new Date("2025-03-01"),
  },
  {
    title: "Myer — shoes",
    category: "shopping",
    amount: 120.0,
    date: new Date("2025-02-28"),
  },
  {
    title: "Coffee at Toby's Estate",
    category: "food",
    amount: 5.5,
    date: new Date("2025-02-27"),
  },
  {
    title: "Cinema tickets",
    category: "entertainment",
    amount: 36.0,
    date: new Date("2025-02-26"),
    description: "2x tickets",
  },
  {
    title: "Gas bill",
    category: "utilities",
    amount: 62.0,
    date: new Date("2025-02-25"),
  },
  {
    title: "Uber Eats — Thai",
    category: "food",
    amount: 42.0,
    date: new Date("2025-02-24"),
  },
  {
    title: "Sydney Trains monthly",
    category: "transport",
    amount: 180.0,
    date: new Date("2025-02-01"),
  },
  {
    title: "Amazon — desk lamp",
    category: "shopping",
    amount: 45.99,
    date: new Date("2025-01-20"),
  },
  {
    title: "Water bill",
    category: "utilities",
    amount: 90.0,
    date: new Date("2025-01-15"),
  },
  {
    title: "Doctor visit",
    category: "health",
    amount: 85.0,
    date: new Date("2025-01-10"),
  },
  {
    title: "Udemy course",
    category: "education",
    amount: 24.99,
    date: new Date("2025-01-05"),
  },
];

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

    // Clear existing data first
    await Expense.deleteMany({});

    // Insert seed data
    const inserted = await Expense.insertMany(SEED_DATA);

    return NextResponse.json({
      success: true,
      message: `Seeded ${inserted.length} expenses successfully`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: "Seed failed" },
      { status: 500 },
    );
  }
}
