import React from "react";
import { 
  Home, 
  Compass, 
  Cpu, 
  MessageSquare, 
  History, 
  Bookmark, 
  TrendingUp, 
  Settings, 
  Flame,
  Brain,
  Sun,
  Moon
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeModel: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, activeModel }) => {
  const [isLightMode, setIsLightMode] = React.useState(false);

  React.useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, [isLightMode]);

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "recommendations", label: "AI Recommendations", icon: Compass },
    { id: "analyzer", label: "Video Analyzer", icon: Cpu },
    { id: "chatbot", label: "AI Chatbot", icon: MessageSquare },
    { id: "history", label: "History", icon: History },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ];

  return (
    <nav className="w-full glass-panel border-b border-slate-800/80 sticky top-0 z-30 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand Logo & Name */}
      <div 
        onClick={() => setActiveTab("home")}
        className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
      >
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg group-hover:shadow-indigo-500/35 transition-all">
          <Flame className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-wider flex items-center leading-none">
            TubeMind<span className="text-indigo-400 font-semibold text-[10px] ml-1 bg-indigo-500/20 px-1 py-0.5 rounded">AI</span>
          </h1>
          <p className="text-[9px] text-slate-400 font-medium">Video Intelligence SaaS</p>
        </div>
      </div>

      {/* Center Section: Navigation Links */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full py-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap duration-200 ${
                isActive
                  ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-300 shadow-sm"
                  : "bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Section: Badges & Profile triggers */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Model status */}
        <div className="hidden lg:flex items-center space-x-1.5 bg-indigo-950/30 border border-indigo-500/20 px-3 py-1.5 rounded-xl">
          <Brain className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">
            Model: {activeModel}
          </span>
        </div>

        {/* Theme toggle button */}
        <button
          onClick={() => setIsLightMode(!isLightMode)}
          className="p-2.5 rounded-xl border transition-colors duration-200 bg-slate-900/30 border-slate-800 text-slate-400 hover:text-white hover:border-slate-750 preserve-colors"
          title="Toggle Light/Dark Mode"
        >
          {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Settings shortcut button */}
        <button
          onClick={() => setActiveTab("settings")}
          className={`p-2.5 rounded-xl border transition-colors duration-200 ${
            activeTab === "settings"
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-slate-900/30 border-slate-800 text-slate-400 hover:text-white hover:border-slate-750"
          }`}
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User profile avatar */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center border transition-all ${
            activeTab === "profile"
              ? "bg-gradient-to-tr from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-md shadow-indigo-500/20 scale-105"
              : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
          }`}
          title="Account Profile"
        >
          JD
        </button>
      </div>
    </nav>
  );
};
