import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense extends Document {
  title: string;
  category: string;
  amount: number;
  date: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["food", "transport", "shopping", "entertainment", "utilities", "health", "education", "other"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev hot reload
const Expense: Model<IExpense> =
  mongoose.models.Expense ?? mongoose.model<IExpense>("Expense", ExpenseSchema);

export default Expense;
