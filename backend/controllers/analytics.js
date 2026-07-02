const { CohereClient } = require("cohere-ai");
const db = require("../db");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});


exports.getExpenseSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total spent per category
    const [categorySummary] = await db.query(`
      SELECT c.name AS category, SUM(e.amount) AS total
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = ?
      GROUP BY e.category_id
    `, [userId]);

    // Monthly trend
    const [monthlyTrend] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, SUM(amount) AS total
      FROM expenses
      WHERE user_id = ?
      GROUP BY month
      ORDER BY month
    `, [userId]);

    // Prepare summary text for AI
    let summaryText = `
        You are a financial analyst.

        Write a summary in under 100 words.

        Include:
        1. The category where the user spends the most.
        2. The monthly spending trend.
        3. One practical suggestion to improve spending.

        Return ONLY the summary. Do not include titles, headings, markdown, word counts, or explanations.

        Category Totals:
        `;

        for (const row of categorySummary) {
          summaryText += `- ${row.category}: ₹${row.total}\n`;
        }
        
        summaryText += `\nMonthly Trend:\n`;
        
        for (const row of monthlyTrend) {
          summaryText += `- ${row.month}: ₹${row.total}\n`;
        }

    // Use Cohere to generate a summary
    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: summaryText,
      maxTokens: 120,
      temperature: 0.4,
    });
    // if (!response.generations || !response.generations[0]) {
    // console.error("Invalid response from Cohere:", response);
    // throw new Error("AI response was invalid");
    // }

    const aiSummary = response.text.trim() || "No summary generated.";

    res.status(200).json({
      summary: aiSummary,
      rawData: { categorySummary, monthlyTrend }
    });
  } catch (error) {
    console.error("Error generating AI summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};
