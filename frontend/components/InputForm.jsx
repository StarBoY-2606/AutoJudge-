"use client";

import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function InputForm({ onSubmit, isLoading }) {
  const [problemText, setProblemText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ description: problemText });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
        <label className="block text-sm font-bold text-slate-700 mb-2">
          Paste the Problem Statement here (Description, Input, and Output details).
        </label>
        <textarea
          required
          value={problemText}
          onChange={(e) => setProblemText(e.target.value)}
          placeholder="Example: Given an array of integers..."
          className="w-full h-64 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 transition-all resize-none font-mono text-sm"
        />
        <div className="text-right text-xs text-gray-500 mt-1">
        <span>{problemText.length} characters</span>
  
        <span className="mx-2">|</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !problemText.trim()}
        className={`
          w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1
          ${isLoading 
            ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
            : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={24} />
            Analyzing...
          </>
        ) : (
          <>
            Predict Difficulty
          </>
        )}
      </button>

    </form>
  );
}