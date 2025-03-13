"use client";
import { useState, useEffect } from "react";

export default function SecurityReport() {
  const [inputText, setInputText] = useState("");
  const [report, setReport] = useState("");
  const [filteredReport, setFilteredReport] = useState("");
  const [storedOptions, setStoredOptions] = useState<Record<string, string>>({});

  // Load selected options from localStorage
  useEffect(() => {
    const savedOptions = localStorage.getItem("selectedOptions");
    if (savedOptions) {
      setStoredOptions(JSON.parse(savedOptions));
    }
  }, []);

  // Submit stored options to OpenAI API
  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    const requestData = {
      formattedText: inputText,
      selectedOptions: storedOptions,
    };

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    if (response.ok) {
      setReport(data.bot);
      setFilteredReport(data.bot);
    } else {
      setReport("Error generating report. Please try again.");
    }
  };

  // Filter report for "Technical Controls"
  const handleTechnicalControls = () => {
    if (!report) return;
    const techControls = report
      .split("\n")
      .filter((line) =>
        line.includes("Technical Controls") ||
        line.includes("Network Security") ||
        line.includes("Application Security")
      )
      .join("\n");

    setFilteredReport(techControls || "No technical controls found.");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <textarea
        className="w-full p-3 border rounded-md shadow-md"
        rows={4}
        placeholder="Enter your text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <button
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        onClick={handleTechnicalControls}
      >
        Technical Controls
      </button>
      <div className="w-full mt-4 p-3 border rounded-md bg-gray-100">
        <pre className="whitespace-pre-wrap">{filteredReport}</pre>
      </div>
    </div>
  );
}
