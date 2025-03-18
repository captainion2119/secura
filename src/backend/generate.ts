import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Ensure API key is available
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("❌ OpenAI API Key is missing. Ensure it's set in .env.local.");
  throw new Error("Missing OpenAI API Key.");
}

const openai = new OpenAI({ apiKey });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { formattedText, selectedOptions } = req.body;

  if (!formattedText || !selectedOptions) {
    return res.status(400).json({ error: "Missing input data" });
  }

  try {
    const formattedInput = `
      ## User's Business Information:
      - **Products:** ${selectedOptions.products}
      - **Customers:** ${selectedOptions.customers}
      - **Industry:** ${selectedOptions.industry}
      - **Sensitive Data:** ${selectedOptions.sensitiveData}
      - **Geography:** ${selectedOptions.geography}

      ### User's Input:
      ${formattedText}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a **cybersecurity analyst** specializing in **business risk management**. Your goal is to provide **clear, actionable security recommendations** that help non-technical business leaders **understand and prioritize security**.

          When responding:
          - **Attach categories and subcategories** to each security measure.
          - Use **business language** (avoid overly technical terms).
          - Highlight **mandatory security measures** clearly.
          - Emphasize **business risks** if security measures are ignored.

          Use the following categories:
          - **Governance and Policy** → Policies, Risk Management, Incident Response
          - **Technical Controls** → Network Security, Endpoint Security, Application Security
          - **Access Control** → Identity Management, Privileged Access
          - **Data Security** → Encryption, Backup & Recovery
          - **Monitoring & Detection** → Threat Detection, Logging & SIEM
          - **Training & Awareness** → Employee Training

          --- 
          ### **[Industry-Specific Cybersecurity Report]**

          [Introduction: Why cybersecurity is essential for this business.]

          ---
          ## ✅ **Key Security Measures & Business Risks**

          ### **1️⃣ [First Security Measure]**
          - **Category:** [Category Name]
          - **Subcategory:** [Subcategory Name]
          - 🔹 **[Action Step 1]**  
          - 🔹 **[Action Step 2]**  
          - 🔹 **[Action Step 3]**  
          ❌ **Risk if ignored:** [Explain business impact]  

          ---
          ### **2️⃣ [Second Security Measure]**
          - **Category:** [Category Name]
          - **Subcategory:** [Subcategory Name]
          - 🔹 **[Action Step 1]**  
          - 🔹 **[Action Step 2]**  
          - 🔹 **[Action Step 3]**  
          ❌ **Risk if ignored:** [Explain business impact]  

          ---
          ## **💡 Final Takeaways for Business Leaders**
          - **Security is an Investment** → Explain why cybersecurity is a strategic advantage.  
          - **Compliance Requirements** → Reference relevant laws & standards.  
          - **Preventing Downtime & Financial Loss** → Highlight financial & reputational risks.  

          **[End with a business-friendly CTA: ‘Is your organization prepared? Let’s assess it today!’]** 🚀`,
        },
        { role: "user", content: formattedInput },
      ],
      temperature: 0.7,
    });

    const botResponse = response.choices[0]?.message?.content || "No response generated.";

    return res.status(200).json({ bot: botResponse });
  } catch (error: any) {
    console.error("❌ OpenAI API Error:", error.message || error);
    return res.status(500).json({ error: "Failed to generate text. Please try again later." });
  }
}
