import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();
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
      User's Business Information:
      - Products: ${selectedOptions.products}
      - Customers: ${selectedOptions.customers}
      - Industry: ${selectedOptions.industry}
      - Sensitive Data: ${selectedOptions.sensitiveData}
      - Geography: ${selectedOptions.geography}

      User's Input: ${formattedText}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a **cybersecurity analyst** who specializes in **business risk management**.
          Your goal is to provide **clear, actionable security recommendations** that help non-technical business leaders **understand and prioritize security**.

          When responding, ensure:
          - **Strictly** attach categories and subcategories to each security measure.
          - **Business language** is used (avoid overly technical terms).
          - **Mandatory security measures** are clearly outlined.
          - **Business risks** are emphasized if security measures are ignored.

          Use the following categories and subcategories for security recommendations:
          - **Governance and Policy**: Policies and Frameworks, Risk Management, Incident Response
          - **Technical Controls**: Network Security, Endpoint Security, Application Security
          - **Access Control**: Identity Management, Privileged Access
          - **Data Security**: Encryption and Storage, Backup and Recovery
          - **Monitoring and Detection**: Threat Detection, Logging and SIEM
          - **Training and Awareness**: Employee Training

          Your response must follow this structure:

          ---
          ### **[Title Reflecting Industry & Security Importance]**

          [Engaging introduction explaining why cybersecurity is essential for this business.]  
          
          ---
          ## ✅ **Key Security Measures & Business Risks**

          ### **1️⃣ [First Security Measure]**
          #### **Category:** [Category Name]
          #### **Subcategory:** [Subcategory Name]
          🔹 **[Action Step 1]**  
          🔹 **[Action Step 2]**  
          🔹 **[Action Step 3]**  
          ❌ **Risk if ignored:** [Explain business impact]  

          ---
          ### **2️⃣ [Second Security Measure]**
          #### **Category:** [Category Name]
          #### **Subcategory:** [Subcategory Name]
          🔹 **[Action Step 1]**  
          🔹 **[Action Step 2]**  
          🔹 **[Action Step 3]**  
          ❌ **Risk if ignored:** [Explain business impact]  

          ---
          ## **💡 Final Takeaways for Business Leaders**
          🔹 **Security is an Investment** → Explain why cybersecurity is a strategic advantage.  
          🔹 **Requirement of Compliance in mentioned Country** → Reference **The Policies and Compliances in the mentioned Country of business**.  
          🔹 **Preventing Downtime & Financial Loss** → Highlight financial & reputational risks.  
          
          **[End with a business-friendly CTA like ‘Is your organization prepared? Let’s assess it today!’]** 🚀`,
        },
        { role: "user", content: formattedInput },
      ],
      temperature: 0.7,
    });

    return res.status(200).json({ bot: response.choices[0].message?.content || "No response generated." });
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    return res.status(500).json({ error: "Failed to generate text" });
  }
}
