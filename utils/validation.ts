export interface ExpenseFormData {
  title: string;
  category: string;
  amount: string;
  date: string;
  description: string;
}

export function validateExpenseForm(
  form: ExpenseFormData,
): Record<string, string> {
  const errs: Record<string, string> = {};

  if (!form.title.trim()) {
    errs.title = "Title is required";
  }

  if (!form.category) {
    errs.category = "Category is required";
  }

  if (!form.amount || isNaN(Number(form.amount))) {
    errs.amount = "Enter a valid amount";
  } else if (Number(form.amount) <= 0) {
    errs.amount = "Amount must be greater than 0";
  }

  if (!form.date) {
    errs.date = "Date is required";
  }

  return errs;
}
