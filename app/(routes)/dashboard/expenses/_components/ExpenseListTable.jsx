import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React from "react";
import { toast } from "sonner";

function ExpenseListTable({ expensesList, refreshData }) {
  const deleteExpense = async (expense) => {
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result) {
        toast("Expense Deleted!");
        refreshData();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return !isNaN(num) ? num.toFixed(2) : '0.00';
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="grid grid-cols-5 rounded-tl-xl rounded-tr-xl bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Budget</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.length === 0 ? (
        <div className="text-center py-4 bg-slate-50">
          No expenses found
        </div>
      ) : (
        expensesList.map((expense, index) => (
          <div key={expense.id} className="grid grid-cols-5 bg-slate-50 p-2 border-b">
            <h2>{expense.name}</h2>
            <h2>₹{formatAmount(expense.amount)}</h2>
            <h2>{expense.budgetName || expense.budgetId ? expense.budgetName : 'No Budget'}</h2>
            <h2>{expense.createdAt}</h2>
            <button
              onClick={() => deleteExpense(expense)}
              className="text-red-500 cursor-pointer hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ExpenseListTable;
