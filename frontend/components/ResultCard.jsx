export default function ResultCard({ result }) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 bg-red-50 p-6 rounded-xl border border-red-200 text-red-700">
        <p className="font-bold">Error</p>
        <p>{result.error}</p>
      </div>
    );
  }

  const problem_class = result.problem_class || "Unknown";
  const estimated_rating = result.estimated_rating || 0;
  const raw_score = result.problem_score || 0;

  const displayScore = Number(raw_score).toFixed(1);

  const getDifficultyStyle = (diff) => {
    const d = diff.toString().toLowerCase();
    
    if (d === 'easy') return { 
      bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "text-green-600/70" 
    };
    if (d === 'medium') return { 
      bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", label: "text-yellow-600/70" 
    };
    if (d === 'hard') return { 
      bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "text-red-600/70" 
    };
    
    return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", label: "text-gray-500" };
  };

  const getRatingInfo = (rating) => {
    if (rating < 1200) return { range: "0 - 1199", color: "text-gray-500" };
    if (rating < 1400) return { range: "1200 - 1399", color: "text-green-600" };
    if (rating < 1600) return { range: "1400 - 1599", color: "text-cyan-600" };
    if (rating < 1900) return { range: "1600 - 1899", color: "text-blue-600" };
    if (rating < 2100) return { range: "1900 - 2099", color: "text-purple-600" };
    if (rating < 2300) return { range: "2100 - 2299", color: "text-orange-500" };
    if (rating < 2400) return { range: "2300 - 2399", color: "text-orange-600" };
    return { range: "2400+", color: "text-red-600" };
  };

  const diffStyle = getDifficultyStyle(problem_class);
  const ratingInfo = getRatingInfo(estimated_rating);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className={`${diffStyle.bg} ${diffStyle.border} border p-8 rounded-xl shadow-sm flex flex-col items-center justify-center transition-all hover:scale-[1.02]`}>
          <h3 className={`${diffStyle.label} font-bold tracking-widest text-xs uppercase mb-2`}>
            Difficulty Level
          </h3>
          <p className={`text-4xl font-black capitalize ${diffStyle.text}`}>
            {problem_class}
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-xl shadow-sm flex flex-col items-center justify-center transition-all hover:scale-[1.02]">
          <h3 className="text-gray-400 font-bold tracking-widest text-xs uppercase mb-2">
            Complexity Score
          </h3>
          
          <div className="flex items-baseline">
            <p className="text-4xl font-black text-gray-800">
              {displayScore}
            </p>
            <span className="text-xl text-gray-400 font-medium ml-1">/10</span>
          </div>
        </div>

      </div>
      
      
      {/* BOTTOM SECTION: TIER & RANGE */}
      <div className="mt-6 text-center border-t border-gray-100 pt-6">
        <p className="text-gray-900 font-bold text-lg mt-1">
          Estimated Codeforces Range: {ratingInfo.range}
        </p>
      </div>

    </div>
  );
}