import { NextResponse } from "next/server";
import getFinancialAdvice from "@/utils/getFinancialAdvice";

export async function POST(req) {
  try {
    const { totalIncome, totalExpenses, totalBudget } = await req.json();

    // Validate inputs
    if (totalIncome === undefined || totalExpenses === undefined || totalBudget === undefined) {
      return NextResponse.json(
        { error: "Missing required financial data" },
        { status: 400 }
      );
    }

    // Get financial advice
    const advice = await getFinancialAdvice(totalBudget, totalIncome, totalExpenses);

    // Check if advice was generated successfully
    if (advice.includes("Error:") || advice.includes("Unable to generate")) {
      return NextResponse.json(
        { error: advice },
        { status: 500 }
      );
    }

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("Error in generate-advice API:", error);
    return NextResponse.json(
      { error: "Failed to generate financial advice" },
      { status: 500 }
    );
  }
} 