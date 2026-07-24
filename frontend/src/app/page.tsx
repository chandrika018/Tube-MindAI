"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  ArrowRight, 
  Bookmark, 
  History as HistoryIcon,
  Video,
  Play,
  Share2,
  Trash2,
  Edit2
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { RecommendationDashboard } from "../components/RecommendationDashboard";
import { ChatInterface } from "../components/ChatInterface";
import { AnalyticsPanel } from "../components/AnalyticsPanel";
import { SettingsPanel } from "../components/SettingsPanel";
import { apiService, ChatSession, AppSettings } from "../services/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [activeModel, setActiveModel] = useState("gemini");
  
  // History & Bookmarks tabs states
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [homeInputUrl, setHomeInputUrl] = useState("");

  // Load configuration and data
  useEffect(() => {
    loadSettings();
    loadBookmarksAndChats();
  }, [activeTab]);

  const loadSettings = async () => {
    try {
      const s = await apiService.getSettings();
      setActiveModel(s.active_model);
    } catch (e) {
      console.error(e);
    }
  };

  const loadBookmarksAndChats = async () => {
    try {
      const b = await apiService.getBookmarks();
      setBookmarks(b);
      const c = await apiService.getChatSessions();
      setChatSessions(c);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectVideoForAnalysis = (url: string) => {
    setSelectedVideoUrl(url);
    setActiveTab("analyzer");
  };

  const handleHomeInputAnalyze = () => {
    if (!homeInputUrl.trim()) return;
    setSelectedVideoUrl(homeInputUrl);
    setActiveTab("analyzer");
  };

  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat session?")) {
      const success = await apiService.deleteChatSession(id);
      if (success) {
        setChatSessions(prev => prev.filter(c => c.id !== id));
      }
    }
  };

  const handleRemoveBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await apiService.removeBookmark(id);
    if (success) {
      setBookmarks(prev => prev.filter(b => b.id !== id && b.video_id !== id));
    }
  };

  const handlePredefinedSearch = (topic: string) => {
    setActiveTab("recommendations");
    // Pre-fill query is handled in recommendation tab by loading it or setting url
  };

  // Featured videos removed by user request

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col justify-between">
      {/* Dynamic Top Navbar (Horizontal Navigation Console) */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeModel={activeModel} 
      />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col">
        
        {/* Content Router */}
        <main className="flex-1 p-8">
          
          {/* HOME PANEL */}
          {activeTab === "home" && (
            <div className="space-y-12">
              
              {/* SaaS Hero Section */}
              <div className="text-center py-12 max-w-3xl mx-auto space-y-6">
                <div className="inline-flex items-center space-x-2 bg-indigo-600/10 border border-indigo-500/30 px-3.5 py-1.5 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>Next-Generation Video Intelligence</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                  Understand YouTube Videos <br />
                  <span className="text-gradient font-bold">With Production RAG AI Agents</span>
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
                  Extract summaries, build revision note checklists, test yourself with auto-generated MCQ quizzes, generate roadmap timelines, or translate context to Hindi instantly.
                </p>

                {/* Quick URL Input */}
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 bg-slate-950/40 p-2.5 border border-slate-800 rounded-2xl max-w-2xl mx-auto shadow-xl">
                  <input
                    type="text"
                    value={homeInputUrl}
                    onChange={(e) => setHomeInputUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleHomeInputAnalyze()}
                    placeholder="Enter YouTube Video link (e.g. https://youtube.com/watch?v=...)"
                    className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none text-white placeholder-slate-500"
                  />
                  <button
                    onClick={handleHomeInputAnalyze}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-1.5 text-xs shrink-0"
                  >
                    <span>Analyze Video</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Popular categories keywords search links */}
                <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Topics:</span>
                  {["Machine Learning", "FastAPI", "React Router", "SpaceX", "Next.js 15"].map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => handlePredefinedSearch(topic)}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-[10px] font-semibold text-slate-300 px-3 py-1 rounded-lg transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistics Overview Cards */}
              <div className="border-t border-slate-900 pt-8">
                <AnalyticsPanel />
              </div>

              {/* Featured videos removed by user request */}

            </div>
          )}

          {/* RECOMMENDATIONS PANEL */}
          {activeTab === "recommendations" && (
            <RecommendationDashboard onSelectVideoForAnalysis={handleSelectVideoForAnalysis} />
          )}

          {/* AI SEARCH MODES PANEL */}
          {activeTab === "search" && (
            <RecommendationDashboard onSelectVideoForAnalysis={handleSelectVideoForAnalysis} />
          )}

          {/* VIDEO ANALYZER PANEL */}
          {activeTab === "analyzer" && (
            <ChatInterface 
              initialVideoUrl={selectedVideoUrl} 
              onAnalysisSuccess={() => setSelectedVideoUrl("")} // Clear url after processing
            />
          )}

          {/* CHATBOT PANEL */}
          {activeTab === "chatbot" && (
            <ChatInterface 
              initialVideoUrl={selectedVideoUrl} 
              onAnalysisSuccess={() => setSelectedVideoUrl("")}
            />
          )}

          {/* HISTORY PANEL */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
                <HistoryIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Previous Chat sessions</h3>
              </div>

              {chatSessions.length === 0 ? (
                <div className="glass-panel p-12 text-center text-slate-500 rounded-2xl border border-slate-800">
                  No active chats recorded. Go to Analyzer or Recommendations to start a conversation.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chatSessions.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => {
                        // We need to match video url or title to load. For simplicity, we trigger analyzer panel
                        // In production, we'd load the specific chat session directly
                        setActiveTab("analyzer");
                      }}
                      className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                          {chat.title}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Started {new Date(chat.created_at).toLocaleString()} • {chat.messages.length} messages
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                        title="Delete chat session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOOKMARKS PANEL */}
          {activeTab === "bookmarks" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-slate-900 pb-3">
                <Bookmark className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Bookmarked Videos</h3>
              </div>

              {bookmarks.length === 0 ? (
                <div className="glass-panel p-12 text-center text-slate-500 rounded-2xl border border-slate-800">
                  No bookmarked videos found. Save recommended videos to view them here.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {bookmarks.map((video) => (
                    <div 
                      key={video.id}
                      onClick={() => handleSelectVideoForAnalysis(`https://youtube.com/watch?v=${video.id}`)}
                      className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center space-x-4 cursor-pointer hover:border-indigo-500/30 transition-all"
                    >
                      <img
                        src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-28 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="text-xs font-bold text-slate-200 line-clamp-2 hover:text-indigo-400 leading-snug">
                          {video.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">{video.channel_name}</p>
                      </div>
                      <button
                        onClick={(e) => handleRemoveBookmark(video.id, e)}
                        className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TRENDING PANEL */}
          {activeTab === "trending" && (
            <RecommendationDashboard onSelectVideoForAnalysis={handleSelectVideoForAnalysis} />
          )}

          {/* PROFILE PANEL */}
          {activeTab === "profile" && (
            <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-4xl text-white shadow-xl mx-auto border-2 border-indigo-400">
                JD
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">John Doe</h3>
                <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Premium SaaS Account</p>
                <p className="text-[11px] text-slate-500 mt-1">inspire@gemini-developer.com</p>
              </div>

              <div className="border-t border-slate-900 pt-6 grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-1">
                  <span className="text-slate-500 font-bold">API Requests Used</span>
                  <p className="text-lg font-black text-slate-200">125 / 1,000</p>
                </div>
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 space-y-1">
                  <span className="text-slate-500 font-bold">Plan Renewal</span>
                  <p className="text-lg font-black text-slate-200">Aug 19, 2026</p>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS PANEL */}
          {activeTab === "settings" && (
            <SettingsPanel onSettingsSaved={(model) => setActiveModel(model)} />
          )}

        </main>
        <Footer setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
