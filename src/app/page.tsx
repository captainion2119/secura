'use client';
import { useState, useEffect, useRef } from "react";
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import styles from '@/styles/Home.module.css';
import { PieChart, Pie, Cell } from 'recharts';
import Cookies from 'js-cookie';

export default function Home() {
  const [showGraph, setShowGraph] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showDetailedSurvey, setShowDetailedSurvey] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string[] }>({});
  const [userInput, setUserInput] = useState(""); // User's input text
  const [aiResponse, setAiResponse] = useState<string | null>(null); // AI Response
  const [loading, setLoading] = useState(false); // Loading state

  const svgRef = useRef<any>(null);

  // ✅ Define dropdown options
  const dropdownOptions: { title: string; options: string[] }[] = [
    { title: "Products offered", options: ["Software services", "Financial services", "Healthcare", "Retail", "Manufacturing", "Other"] },
    { title: "Customers", options: ["B2B", "B2C", "B2G", "In-house", "Mixed (B2B and B2C)", "Other"] },
    { title: "Industry", options: ["Technology & Software", "Finance & Banking", "Healthcare & Biotech", "Retail & E-commerce", "Education", "Other"] },
    { title: "Sensitive data that you handle", options: ["Customer data - PII", "Financial Data", "Healthcare Data", "Intellectual Property", "Employee Data", "Other"] },
    { title: "Geography", options: ["North America", "Europe", "Asia", "South America", "Africa", "Australia"] }
  ];

  // ✅ Define Pie Chart data
  const data = [
    { name: "Technical Controls", value: 100, color: "#dc2626" }, 
    { name: "Data Security", value: 100, color: "#f87171" }, 
    { name: "Access Control", value: 100, color: "#fca5a5" }, 
    { name: "Governance", value: 100, color: "#fee2e2" }  
  ];

  const handleDropdownChange = (title: string, selectedValues: string[]) => {
    const updatedOptions: { [key: string]: string[] } = { ...selectedOptions, [title]: selectedValues };
    setSelectedOptions(updatedOptions);
    Cookies.set('selectedOptions', JSON.stringify(updatedOptions), { expires: 1 });
  };

  useEffect(() => {
    const storedOptions = Cookies.get('selectedOptions');
    if (storedOptions) {
      try {
        setSelectedOptions(JSON.parse(storedOptions) as { [key: string]: string[] });
      } catch (error) {
        console.error("Error parsing cookies:", error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowGraph(true);
    setShowDetailedSurvey(true);

    setLoading(true);
    setAiResponse(null); // Reset previous AI response

    // 🔹 Collect selected options from cookies dynamically
    const storedOptions = Cookies.get('selectedOptions');
    let parsedOptions = storedOptions ? JSON.parse(storedOptions) : {};

    // 🔹 Format data dynamically for OpenAI
    const formattedOptions = Object.entries(parsedOptions)
      .map(([key, values]) => `- **${key}**: ${Array.isArray(values) ? values.join(", ") : values}`)
      .join("\n");

    const formattedInput = `
      **User's Business Information:**
      ${formattedOptions}

      **User's Input:**
      ${userInput}
    `;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formattedText: formattedInput, selectedOptions: parsedOptions }),
      });

      const data = await response.json();
      setAiResponse(data.bot);
    } catch (error) {
      console.error("❌ Error fetching AI response:", error);
      setAiResponse("Failed to generate response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.mainContainer}>
        <Topbar />
        <div className={styles.contentLayout}>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            {dropdownOptions.map(({ title, options }, index) => (
              <div key={index} className={styles.box}>
                <Dropdown 
                  title={title} 
                  options={options} 
                  onChange={(selectedValues: string[]) => handleDropdownChange(title, selectedValues)}
                />
              </div>
            ))}

            

            <div className={styles.submitContainer}>
              <Button type="submit">Submit</Button>
            </div>
          </form>

          {showGraph && (
            <div className={styles.graphContainer}>
              <div className={styles.pieChartContainer}>
                {!imageUrl ? (
                  <PieChart width={500} height={300} ref={svgRef}>
                    {data.map((entry, index) => (
                      <Pie 
                        key={index} 
                        data={[entry]} 
                        cx={250} 
                        cy={150} 
                        startAngle={180} 
                        endAngle={0} 
                        outerRadius={120 - index * 30} 
                        innerRadius={90 - index * 30} 
                        dataKey="value"
                        isAnimationActive={false} 
                      >
                        <Cell fill={entry.color} />
                      </Pie>
                    ))}
                  </PieChart>
                ) : (
                  <img src={imageUrl} alt="Pie Chart" className={styles.graphImage} />
                )}
              </div>

              <div className={styles.responseContainer}>
                <h3>AI Response</h3>
                {loading ? <p>Loading...</p> : <p>{aiResponse || "No response yet."}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
