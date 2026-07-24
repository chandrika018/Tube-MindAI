import React, { useState, useEffect } from "react";
import { Cpu, Award, Compass, Search, Flame, BarChart2, CheckCircle2 } from "lucide-react";
import { apiService, AnalyticsData } from "../services/api";

export const AnalyticsPanel: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    videos_analyzed_count: 3,
    recommendations_generated_count: 5,
    average_ai_score: 84.5,
    searched_topics: {
      "Python Machine Learning": 3,
      "Next.js App Router": 2,
      "DSA Roadmap": 1
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiService.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { 
      label: "Videos Analyzed", 
      val: data.videos_analyzed_count, 
      desc: "Total transcripts & crawl sources cached", 
      icon: Cpu,
      color: "text-indigo-400"
    },
    { 
      label: "Recommendations Run", 
      val: data.recommendations_generated_count, 
      desc: "Searches computed using AI Rank criteria", 
      icon: Compass,
      color: "text-purple-400"
    },
    { 
      label: "Avg Platform AI Score", 
      val: `${data.average_ai_score || 84.5}%`, 
      desc: "Average educational content score", 
      icon: Award,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{card.label}</span>
                <h3 className="text-2xl font-bold text-white mt-0.5">{card.val}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Topics list & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Searched Topics Ranking (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2 border-b border-slate-800 pb-3">
            <BarChart2 className="w-4.5 h-4.5 text-indigo-400" />
            <span>Top Searched Topics & Category Breakdown</span>
          </h3>

          <div className="space-y-4">
            {Object.keys(data.searched_topics).length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No queries tracked yet. Search in Recommendations.</p>
            ) : (
              Object.entries(data.searched_topics).map(([topic, count], i) => {
                const total = Object.values(data.searched_topics).reduce((a, b) => a + b, 0);
                const pct = Math.round((count / (total || 1)) * 100);

                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{topic}</span>
                      <span className="text-slate-400">{count} runs ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Security & Platform Health Logs (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
            <span>Operational Log Details</span>
          </h3>

          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
            <div className="flex space-x-3.5 border-b border-slate-900 pb-2.5 text-[11px]">
              <span className="text-slate-500 font-mono font-medium">10:42:01</span>
              <div>
                <p className="font-semibold text-slate-200">FAISS Vector Index Saved</p>
                <p className="text-[10px] text-slate-400">Cached embeddings for video ID 'py_ml_9'</p>
              </div>
            </div>
            <div className="flex space-x-3.5 border-b border-slate-900 pb-2.5 text-[11px]">
              <span className="text-slate-500 font-mono font-medium">10:35:14</span>
              <div>
                <p className="font-semibold text-slate-200">RAG Chat Query Complete</p>
                <p className="text-[10px] text-slate-400">Context RAG compiled via transcript segment indexing</p>
              </div>
            </div>
            <div className="flex space-x-3.5 text-[11px]">
              <span className="text-slate-500 font-mono font-medium">09:58:33</span>
              <div>
                <p className="font-semibold text-amber-400">Crawler Fallback Triggered</p>
                <p className="text-[10px] text-slate-400">Captions missing, query matched web search sources</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
