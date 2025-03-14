import {
  integer,
  numeric,
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: varchar("createdAt").notNull(),
});

export const UserFinancialStats = pgTable("user_financial_stats", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  userEmail: varchar("userEmail").notNull(),
  totalBudget: numeric("totalBudget").notNull().default(0),
  totalSpend: numeric("totalSpend").notNull().default(0),
  totalIncome: numeric("totalIncome").notNull().default(0),
  budgetCount: integer("budgetCount").notNull().default(0),
  financialAdvice: text("financialAdvice"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});
