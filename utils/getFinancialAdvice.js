// Function to generate personalized financial advice using Groq API in INR
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log("User Financial Data:", { totalBudget, totalIncome, totalSpend });

  try {
    const userPrompt = `
      You are a friendly financial advisor who explains things in simple terms. Look at this user's financial data:

      💰 Monthly Income: ₹${totalIncome}
      💳 Monthly Expenses: ₹${totalSpend}
      📊 Budget Set: ₹${totalBudget}

      Please provide easy-to-understand advice in these areas:

      1. Simple Monthly Budget Breakdown:
         - Break down how to spend their income in simple percentages
         - Use common categories like food, rent, travel, etc.
         - Suggest a realistic savings target

      2. Money-Saving Tips:
         - Give 3-4 practical, everyday tips to save money
         - Focus on common expenses that can be reduced
         - Keep suggestions realistic and doable

      3. Simple Investment Ideas:
         - Suggest 2-3 safe investment options
         - Explain expected returns in simple terms
         - Focus on beginner-friendly options

      4. Quick Action Steps:
         - List 3 immediate steps they can take to improve their finances
         - Make them simple and achievable

      Important:
      - Use simple language, avoid financial jargon
      - Give practical advice that can be implemented immediately
      - Format in easy-to-read bullet points
      - Keep explanations brief and clear
      - Use emojis to make points more engaging
      - If expenses are higher than income, prioritize giving cost-cutting advice

      Response Format:
      💡 Monthly Budget Plan:
      [Simple budget breakdown]

      ✂️ Smart Saving Tips:
      [Easy saving tips]

      🏦 Simple Investment Ideas:
      [Beginner-friendly investment suggestions]

      ⚡ Quick Actions to Take:
      [3 immediate steps]
    `;

    if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
      throw new Error("Groq API key is not configured");
    }

    // Send request to Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_GROQ_MODEL || "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a friendly financial advisor who explains complex financial concepts in simple, everyday language. Use examples and simple terms that anyone can understand."
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("Groq API Response:", data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from Groq API");
    }

    const advice = data.choices[0].message.content;
    console.log("Financial Advice:", advice);
    return advice;

  } catch (error) {
    console.error("Error fetching financial advice:", error);
    if (error.message.includes("API key")) {
      return "Error: API key is not configured. Please check your environment settings.";
    }
    return "Unable to generate financial advice at the moment. Please check your connection and try again.";
  }
};

export default getFinancialAdvice;
