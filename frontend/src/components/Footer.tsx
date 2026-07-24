import React from "react";
import { 
  Flame, 
  Github, 
  Linkedin, 
  BookOpen, 
  Mail, 
  Heart,
  Globe
} from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "Home", tabId: "home" },
    { label: "Recommendations", tabId: "recommendations" },
    { label: "Video Analyzer", tabId: "analyzer" },
    { label: "AI Chat", tabId: "chatbot" },
    { label: "History", tabId: "history" },
    { label: "Saved Videos", tabId: "bookmarks" },
    { label: "Trending", tabId: "trending" },
    { label: "Settings", tabId: "settings" },
  ];

  return (
    <footer className="w-full glass-panel border-t border-slate-800/80 mt-auto">
      {/* Upper footer grid */}
      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left column: logo + tagline */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wider flex items-center">
              TubeMind<span className="text-indigo-400 font-semibold text-xs ml-1 bg-indigo-500/20 px-1.5 py-0.5 rounded">AI</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            AI-Powered YouTube Recommendation & Video Intelligence Platform. Chunk transcripts, index semantic embeddings, and chat with video contents using advanced RAG agents.
          </p>
        </div>

        {/* Center column: navigation links */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Quick Links</h3>
          <div className="grid grid-cols-2 gap-2">
            {links.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab(link.tabId);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-slate-400 hover:text-indigo-400 text-left text-xs font-medium transition-colors hover:translate-x-0.5 duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right column: resources & social handles */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Resources & Legal</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            </li>
            <li>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Workspace</span>
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Documentation</span>
              </a>
            </li>
            <li className="flex gap-2.5 pt-1 text-[11px] text-slate-500 border-t border-slate-900 mt-2">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            </li>
          </ul>
        </div>

      </div>

      {/* Spacing line */}
      <div className="h-px w-full bg-slate-900"></div>

      {/* Lower footer: metadata */}
      <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          &copy; {currentYear} TubeMind AI. All rights reserved. Version 1.0.0
        </div>
        <div className="flex items-center space-x-1 font-medium">
          <span>Made with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse inline mx-0.5" />
          <span>using Next.js, FastAPI, LangChain & AI</span>
        </div>
      </div>
    </footer>
  );
};
