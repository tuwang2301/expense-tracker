export const CATEGORIES = [
  {
    value: "food",
    label: "Food & Dining",
    color: "#378ADD",
    bg: "#E6F1FB",
    emoji: "🍜",
  },
  {
    value: "transport",
    label: "Transport",
    color: "#639922",
    bg: "#EAF3DE",
    emoji: "🚌",
  },
  {
    value: "shopping",
    label: "Shopping",
    color: "#BA7517",
    bg: "#FAEEDA",
    emoji: "🛍",
  },
  {
    value: "entertainment",
    label: "Entertainment",
    color: "#D4537E",
    bg: "#FBEAF0",
    emoji: "🎬",
  },
  {
    value: "utilities",
    label: "Utilities",
    color: "#7F77DD",
    bg: "#EEEDFE",
    emoji: "💡",
  },
  {
    value: "health",
    label: "Health",
    color: "#1D9E75",
    bg: "#E1F5EE",
    emoji: "🏥",
  },
  {
    value: "education",
    label: "Education",
    color: "#E24B4A",
    bg: "#FCEBEB",
    emoji: "📚",
  },
  {
    value: "other",
    label: "Other",
    color: "#888780",
    bg: "#F1EFE8",
    emoji: "📦",
  },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export function getCategoryMeta(value: string) {
  return (
    CATEGORIES.find((c) => c.value === value) ??
    CATEGORIES[CATEGORIES.length - 1]
  );
}
