"use client"; 

import { useState } from "react";
import InputForm from "../components/InputForm";
import ResultCard from "../components/ResultCard";

export default function Home() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalysis = async (formData) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Server error: Is the Python backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
      
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            AutoJudge
          </h1>
          <p className="text-slate-500">
            Predict Programming Problem Difficulty and Score
          </p>
        </div>

       
        <InputForm onSubmit={handleAnalysis} isLoading={isLoading} />

        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <ResultCard result={result} />
        
      </div>
    </main>
  );
}