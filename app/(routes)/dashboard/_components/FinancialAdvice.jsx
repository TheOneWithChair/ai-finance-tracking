"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/dbConfig";
import { UserFinancialStats } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

function FinancialAdvice({ budgetList, expensesList, incomeList }) {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoLoaded, setAutoLoaded] = useState(false);
  const { user } = useUser();

  // Load saved advice when component mounts
  useEffect(() => {
    if (user && !autoLoaded) {
      loadSavedAdvice();
    }
  }, [user]);

  const loadSavedAdvice = async () => {
    if (!user) return;

    try {
      const savedStats = await db
        .select()
        .from(UserFinancialStats)
        .where(eq(UserFinancialStats.userEmail, user.primaryEmailAddress.emailAddress))
        .limit(1);

      if (savedStats.length > 0 && savedStats[0].financialAdvice) {
        setAdvice(savedStats[0].financialAdvice);
        setAutoLoaded(true);
      }
    } catch (error) {
      console.error("Error loading saved advice:", error);
    }
  };

  const saveAdvice = async (newAdvice) => {
    if (!user) return;

    try {
      const existingStats = await db
        .select()
        .from(UserFinancialStats)
        .where(eq(UserFinancialStats.userEmail, user.primaryEmailAddress.emailAddress))
        .limit(1);

      if (existingStats.length > 0) {
        await db
          .update(UserFinancialStats)
          .set({
            financialAdvice: newAdvice,
            updatedAt: new Date(),
          })
          .where(eq(UserFinancialStats.userEmail, user.primaryEmailAddress.emailAddress));
      } else {
        await db.insert(UserFinancialStats).values({
          userId: user.id,
          userEmail: user.primaryEmailAddress.emailAddress,
          financialAdvice: newAdvice,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      console.log("Financial advice saved successfully");
    } catch (error) {
      console.error("Error saving financial advice:", error);
    }
  };

  const generateAdvice = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate totals
      const totalIncome = incomeList.reduce((acc, income) => acc + Number(income.amount || 0), 0);
      const totalExpenses = expensesList.reduce((acc, expense) => acc + Number(expense.amount || 0), 0);
      const totalBudget = budgetList.reduce((acc, budget) => acc + Number(budget.amount || 0), 0);

      console.log("Sending data for advice:", { totalIncome, totalExpenses, totalBudget });

      const response = await fetch("/api/generate-advice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalIncome,
          totalExpenses,
          totalBudget,
          budgetList,
          expensesList,
          incomeList,
          currency: "₹"
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get advice: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const newAdvice = data.advice;
      setAdvice(newAdvice);
      
      // Save the new advice to the database
      await saveAdvice(newAdvice);

    } catch (error) {
      console.error("Error generating advice:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAdviceSection = (content, title, emoji) => {
    if (!content) return null;
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <span className="text-xl">{emoji}</span>
          {title}
        </h3>
        <div className="space-y-2">
          {content.split('\n').map((line, index) => (
            line.trim() && (
              <p key={index} className="text-gray-700">
                {line.trim()}
              </p>
            )
          ))}
        </div>
      </div>
    );
  };

  const parseAdvice = (adviceText) => {
    if (!adviceText) return {};

    const sections = {
      monthlyBudget: { emoji: "💡", title: "Monthly Budget Plan" },
      savingTips: { emoji: "✂️", title: "Smart Saving Tips" },
      investmentIdeas: { emoji: "🏦", title: "Simple Investment Ideas" },
      quickActions: { emoji: "⚡", title: "Quick Actions to Take" }
    };

    const parsed = {};
    let currentSection = null;
    let currentContent = [];

    adviceText.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Check if this line is a section header
      for (const [key, section] of Object.entries(sections)) {
        if (trimmedLine.includes(section.emoji)) {
          if (currentSection) {
            parsed[currentSection] = currentContent.join('\n');
          }
          currentSection = key;
          currentContent = [];
          return;
        }
      }

      if (currentSection) {
        currentContent.push(trimmedLine);
      }
    });

    // Add the last section
    if (currentSection) {
      parsed[currentSection] = currentContent.join('\n');
    }

    return parsed;
  };

  const parsedAdvice = parseAdvice(advice);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">SmartBudget AI 🤖</h2>
          <p className="text-blue-600 text-sm mt-1">Your Personal Financial Advisor</p>
        </div>
        <Button
          onClick={generateAdvice}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⌛</span> 
              Analyzing...
            </span>
          ) : (
            "Get New Advice"
          )}
        </Button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          <p className="flex items-center gap-2">
            <span>⚠️</span>
            {error}
          </p>
        </div>
      )}

      {loading && !advice && (
        <div className="mt-6 text-center p-8">
          <div className="animate-pulse flex flex-col items-center">
            <span className="text-3xl mb-4">🤔</span>
            <p className="text-blue-600">Analyzing your financial data...</p>
          </div>
        </div>
      )}

      {advice && !error && (
        <div className="mt-6 grid gap-4">
          {renderAdviceSection(parsedAdvice.monthlyBudget, "Monthly Budget Plan", "💡")}
          {renderAdviceSection(parsedAdvice.savingTips, "Smart Saving Tips", "✂️")}
          {renderAdviceSection(parsedAdvice.investmentIdeas, "Simple Investment Ideas", "🏦")}
          {renderAdviceSection(parsedAdvice.quickActions, "Quick Actions to Take", "⚡")}
        </div>
      )}
    </div>
  );
}

export default FinancialAdvice; 