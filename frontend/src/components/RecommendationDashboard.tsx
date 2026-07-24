import React, { useState, useEffect } from "react";
import { 
  Search, 
  Sparkles, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  Cpu, 
  Flame, 
  Clock, 
  ThumbsUp, 
  Eye,
  Info,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { apiService, VideoItem } from "../services/api";

interface RecommendationDashboardProps {
  onSelectVideoForAnalysis: (url: string) => void;
}

export const RecommendationDashboard: React.FC<RecommendationDashboardProps> = ({ 
  onSelectVideoForAnalysis 
}) => {
  const [query, setQuery] = useState("Python Machine Learning");
  const [searchMode, setSearchMode] = useState("ai"); // normal, ai, semantic, trending, latest, channel, playlist
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<Record<string, boolean>>({});

  const searchModes = [
    { id: "ai", label: "AI Search Rank", desc: "Ranked by AI engine" },
    { id: "semantic", label: "Semantic Search", desc: "Embeddings vector matching" },
    { id: "normal", label: "Normal Search", desc: "YouTube default relevancy" },
    { id: "trending", label: "Trending Search", desc: "Trending topic search" },
    { id: "latest", label: "Latest Search", desc: "Fresh upload search" },
    { id: "channel", label: "Channel Search", desc: "Match specific channel videos" },
    { id: "playlist", label: "Playlist Search", desc: "Query whole playlists" },
  ];

  // Fetch initial recommended list
  useEffect(() => {
    handleSearch();
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const bookmarks = await apiService.getBookmarks();
      setSavedIds(bookmarks.map(b => b.id || b.video_id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const results = await apiService.recommendVideos(query, searchMode);
      setVideos(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (video: VideoItem) => {
    const isBookmarked = savedIds.includes(video.id);
    if (isBookmarked) {
      const success = await apiService.removeBookmark(video.id);
      if (success) {
        setSavedIds(prev => prev.filter(id => id !== video.id));
      }
    } else {
      const success = await apiService.addBookmark(video);
      if (success) {
        setSavedIds(prev => [...prev, video.id]);
      }
    }
  };

  const handleShare = (video: VideoItem) => {
    const shareText = `Check out this AI-analyzed video: "${video.title}" on TubeMind AI!\nhttps://youtube.com/watch?v={video.id}`;
    navigator.clipboard.writeText(shareText);
    setShareStatus(prev => ({ ...prev, [video.id]: true }));
    setTimeout(() => {
      setShareStatus(prev => ({ ...prev, [video.id]: false }));
    }, 2000);
  };

  const toggleDetails = (id: string) => {
    setExpandedCardId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Search Console */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter topics, keywords, questions, or interests (e.g. Next.js App Router, DSA crash course)"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-950/40 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-sm transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Recommendations</span>
              </>
            )}
          </button>
        </div>

        {/* Search Mode Toggles */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/60">
          {searchModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setSearchMode(mode.id);
                // Trigger auto-search on mode switch
                setTimeout(() => handleSearch(), 50);
              }}
              title={mode.desc}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                searchMode === mode.id
                  ? "bg-indigo-600/10 border-indigo-500 text-indigo-300 shadow-sm"
                  : "bg-slate-900/30 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Player for Watch mode */}
      {activeVideoId && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 relative animate-fadeIn">
          <button 
            onClick={() => setActiveVideoId(null)}
            className="absolute right-4 top-4 text-slate-400 hover:text-white text-xs font-semibold bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg z-10"
          >
            Close Player
          </button>
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

      {/* Videos List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-96 overflow-hidden flex flex-col animate-pulse">
              <div className="bg-slate-900 h-48 w-full"></div>
              <div className="p-5 flex-1 space-y-3">
                <div className="h-4 bg-slate-900 rounded w-2/3"></div>
                <div className="h-3 bg-slate-900 rounded w-1/2"></div>
                <div className="h-8 bg-slate-900 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const score = video.scores || {};
            const isSaved = savedIds.includes(video.id);
            const isExpanded = expandedCardId === video.id;
            const isShared = shareStatus[video.id] || false;

            return (
              <div 
                key={video.id} 
                className="glass-card rounded-2xl overflow-hidden flex flex-col relative group"
              >
                {/* Score Tag Top-Left overlay */}
                <div className="absolute left-3 top-3 bg-slate-950/80 backdrop-filter blur-md border border-indigo-500/35 px-2.5 py-1.5 rounded-xl z-10 flex items-center space-x-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">
                    AI Score: {score.overall_score || 85}
                  </span>
                </div>

                {/* Duration Tag Bottom-Right image overlay */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-2.5 bottom-2.5 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-slate-200">
                    {video.duration || "10:00"}
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-5 flex-1 flex flex-col space-y-4">
                  {/* Title & Channel */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase">
                      {video.category || "Education"}
                    </span>
                    <h3 
                      className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2 hover:text-indigo-300 cursor-pointer"
                      title={video.title}
                      onClick={() => setActiveVideoId(video.id)}
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {video.channel_name}
                    </p>
                  </div>

                  {/* Metadata Stats */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-900 pb-3">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{video.views ? video.views.toLocaleString() : "125,000"}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{video.likes ? video.likes.toLocaleString() : "5,000"}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{video.published_date || "1 month ago"}</span>
                    </span>
                  </div>

                  {/* Score Breakdown Button */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => toggleDetails(video.id)}
                      className="w-full bg-slate-900/40 hover:bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center space-x-1.5">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        <span>AI Score Breakdown</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {/* Expandable score info */}
                    {isExpanded && (
                      <div className="bg-slate-950/50 border border-slate-900 p-3.5 rounded-xl space-y-2.5 animate-fadeIn text-[11px]">
                        <div className="grid grid-cols-2 gap-2 text-slate-400">
                          <div>Relevance: <span className="text-slate-200 font-semibold">{score.topic_relevance || 80}%</span></div>
                          <div>Similarity: <span className="text-slate-200 font-semibold">{score.similarity_score || 85}%</span></div>
                          <div>Popularity: <span className="text-slate-200 font-semibold">{score.popularity || 75}%</span></div>
                          <div>Freshness: <span className="text-slate-200 font-semibold">{score.freshness || 90}%</span></div>
                          <div>Channel Auth: <span className="text-slate-200 font-semibold">{score.channel_authority || 80}%</span></div>
                          <div>Quality: <span className="text-slate-200 font-semibold">{score.content_quality || 85}%</span></div>
                        </div>
                        <div className="pt-2 border-t border-slate-900 text-slate-300 flex items-start space-x-1.5">
                          <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                          <p className="italic leading-relaxed">{score.why_recommended || "Recommended based on high match scores."}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recommendation action buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => setActiveVideoId(video.id)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/10 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Watch Video</span>
                    </button>
                    <button
                      onClick={() => onSelectVideoForAnalysis(`https://youtube.com/watch?v=${video.id}`)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold px-4 py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 border border-slate-700/50 transition-colors"
                    >
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span>Analyze AI</span>
                    </button>
                  </div>

                  {/* Save/Share icons */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-900/60 mt-1">
                    <button
                      onClick={() => handleBookmark(video)}
                      className={`text-xs flex items-center space-x-1.5 ${isSaved ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-indigo-500' : ''}`} />
                      <span>{isSaved ? "Saved" : "Save"}</span>
                    </button>
                    <button
                      onClick={() => handleShare(video)}
                      className="text-xs flex items-center space-x-1.5 text-slate-400 hover:text-slate-200"
                    >
                      {isShared ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <Search className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Recommendations Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Enter a search topic above and select a ranking mode to fetch custom AI suggestions.
          </p>
        </div>
      )}
    </div>
  );
};
