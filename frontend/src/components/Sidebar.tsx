import React from "react";
import { 
  Home, 
  Compass, 
  Search, 
  Cpu, 
  MessageSquare, 
  History, 
  Bookmark, 
  TrendingUp, 
  User, 
  Settings, 
  Flame 
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "recommendations", label: "AI Recommendations", icon: Compass },
    { id: "search", label: "AI Search Modes", icon: Search },
    { id: "analyzer", label: "Video Analyzer", icon: Cpu },
    { id: "chatbot", label: "AI Chatbot", icon: MessageSquare },
    { id: "history", label: "Chat History", icon: History },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-slate-800 flex flex-col z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
          <Flame className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wider flex items-center">
            TubeMind<span className="text-indigo-400 font-semibold text-xs ml-1 bg-indigo-500/20 px-1.5 py-0.5 rounded">AI</span>
          </h1>
          <p className="text-[10px] text-slate-400">Video Intelligence SaaS</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-200 group text-left ${
                isActive
                  ? "bg-indigo-600/20 border border-indigo-500/40 text-white font-medium shadow-md shadow-indigo-600/10"
                  : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/80 flex items-center space-x-3 bg-slate-950/20">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow">
          JD
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-200 truncate">John Doe</p>
          <p className="text-[11px] text-indigo-400 font-medium truncate">Premium Member</p>
        </div>
      </div>
    </div>
  );
};
