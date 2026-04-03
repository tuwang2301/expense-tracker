# Spendy — Expense Tracker

A single-page expense tracking application that helps users monitor, categorise, and visualise their personal spending habits.

## Problem Statement

Managing personal finances is tedious when expenses are scattered across bank apps and spreadsheets. Spendy provides a unified, intuitive interface to log, edit, and analyse spending — with real-time category breakdowns and monthly trends — so users always know where their money goes.

## Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| **Frontend**   | Next.js 14 (App Router), React 18             |
| **Styling**    | Tailwind CSS, shadcn/ui (Radix UI primitives) |
| **Charts**     | Recharts                                      |
| **Backend**    | Next.js API Routes (serverless)               |
| **Database**   | MongoDB Atlas via Mongoose ODM                |
| **Deployment** | Vercel (recommended)                          |

## Features

- **Single-page application** — all views (Dashboard, All Expenses, Analytics) swap in-place with no page reloads
- **Full CRUD** — create, read, update, and delete expenses with instant UI feedback
- **Category filtering** — filter expenses by 8 categories (Food, Transport, Shopping, Entertainment, Utilities, Health, Education, Other)
- **Month picker** — navigate between months to view historical data
- **Full-text search** — search expenses by title or description
- **Sortable table** — click any column header to sort ascending/descending
- **Dashboard view** — stat cards (monthly total, transactions, top category, daily average) with trend indicators
- **Analytics view** — monthly bar chart (Recharts), category breakdown with progress bars, summary table with averages
- **Delete confirmation** — AlertDialog prevents accidental deletions
- **Toast notifications** — success/error feedback on every CRUD operation
- **Skeleton loaders** — smooth loading states across all data-fetching components
- **Collapsible sidebar** — saves screen space on smaller displays
- **Input validation** — client-side and server-side validation with inline error messages
- **Error handling** — graceful API failure states with user-friendly messages
- **Responsive design** — works on desktop and tablet

## Folder Structure

```
expense-tracker/
├── app/
│   ├── api/
│   │   ├── expenses/
│   │   │   ├── route.ts          # GET (list + filter) / POST (create)
│   │   │   └── [id]/route.ts     # GET / PUT (update) / DELETE
│   │   ├── analytics/
│   │   │   └── route.ts          # Aggregated stats for charts
│   ├── globals.css               # Tailwind base + CSS variables
│   ├── layout.tsx                # Root layout with fonts and Toaster
│   └── page.tsx                  # Main SPA shell — all views rendered here
├── components/
│   ├── ui/                       # Reusable primitives (shadcn/ui + Radix UI)
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── sonner.tsx
│   │   └── toast.tsx
│   ├── Sidebar.tsx               # Navigation + category filter + month picker
│   ├── StatCards.tsx             # Dashboard KPI cards
│   ├── ExpenseTable.tsx          # Sortable table with inline edit/delete
│   ├── ExpenseForm.tsx           # Add/Edit modal form
│   ├── CategoryChart.tsx         # Category breakdown with progress bars
│   └── MonthlyChart.tsx          # Recharts bar chart
├── constants/
│   └── categories.ts             # Category definitions (emoji, colors, labels)
├── hooks/
│   ├── useExpenses.ts            # CRUD operations + filter state
│   └── useAnalytics.ts           # Analytics data fetching
├── lib/
│   ├── mongodb.ts                # Mongoose connection with hot-reload cache
│   └── utils.ts                  # Utility functions (cn, classname helpers)
├── models/
│   └── Expense.ts                # Mongoose schema + model
├── utils/
│   └── format.ts                 # Currency & date formatters
├── components.json               # shadcn/ui configuration
├── next.config.mjs               # Next.js configuration
├── postcss.config.js             # PostCSS configuration (for Tailwind)
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
├── seed-data.json                # Sample MongoDB data
└── README.md
```

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd expense-tracker
npm install
```

### 2. Configure MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a database user and whitelist your IP
3. Copy the connection string

```bash
cp .env.local.example .env.local
# Edit .env.local and paste your connection string
```

### 3. Run the dev server

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Seed sample data (optional)

Start the dev server, then visit:

```bash
http://localhost:3000/api/seed
```

This will populate the database with 35 sample expenses across multiple categories and months.

> Note: delete `app/api/seed/route.ts` after seeding — it is blocked in production automatically.

## Challenges Overcome

Building a truly seamless SPA within Next.js required careful state management — all three views (Dashboard, All Expenses, Analytics) share a single component tree, with filters and view state lifted to the root `page.tsx` to avoid redundant fetches. Implementing MongoDB aggregation pipelines for the analytics endpoint was the most technically demanding aspect, particularly getting the monthly totals to correctly zero-fill missing months on the frontend. Designing the `useExpenses` hook with `useCallback` dependency arrays prevented infinite re-render loops when filter objects were constructed inline. The inline edit/delete pattern in `ExpenseTable` required careful handling of hover states and stale-closure issues with the `deletingId` state. Finally, integrating a lightweight custom toast system without a heavy external library kept the bundle lean while still providing per-action feedback.
