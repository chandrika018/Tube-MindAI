const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface VideoScore {
  similarity_score: number;
  topic_relevance: number;
  popularity: number;
  freshness: number;
  channel_authority: number;
  content_quality: number;
  overall_score: number;
  why_recommended: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channel_name: string;
  views: number;
  likes: number;
  published_date: string;
  duration: string;
  category: string;
  scores: VideoScore;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  source_type: "transcript" | "web_search";
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  model: string;
  messages: ChatMessage[];
}

export interface VideoAnalysis {
  source_type: "transcript" | "web_search";
  summaries: {
    short: string;
    medium: string;
    detailed: string;
    bullet: string;
    executive: string;
  };
  insights: {
    key_concepts: string[];
    important_quotes: string[];
    technologies_mentioned: string[];
    frameworks_and_libraries: string[];
    companies_and_people: string[];
    timeline_roadmap: string[];
    learning_path: string[];
  };
  scores: VideoScore;
}

export interface AnalyzeResponse {
  video_id: string;
  status: string;
  details: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    channel_name: string;
    views: number;
    likes: number;
    published_at: string;
    duration: string;
    category: string;
  };
  analysis: VideoAnalysis;
}

export interface AnalyticsData {
  videos_analyzed_count: number;
  recommendations_generated_count: number;
  average_ai_score: number;
  searched_topics: Record<string, number>;
}

export interface AppSettings {
  active_model: string;
  vector_db: string;
  api_keys: Record<string, string>;
}

export const apiService = {
  // Settings
  async getSettings(): Promise<AppSettings> {
    const res = await fetch(`${API_BASE_URL}/api/settings`);
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
  },

  async updateSettings(settings: AppSettings): Promise<AppSettings> {
    const res = await fetch(`${API_BASE_URL}/api/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE_URL}/api/analytics`);
    if (!res.ok) throw new Error("Failed to fetch analytics");
    return res.json();
  },

  // Recommendations Engine
  async recommendVideos(q: string, mode: string): Promise<VideoItem[]> {
    const params = new URLSearchParams({ q, mode });
    const res = await fetch(`${API_BASE_URL}/api/recommend?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch recommendations");
    return res.json();
  },

  // Video Intelligence Analyzer
  async analyzeVideo(videoUrl: string): Promise<AnalyzeResponse> {
    const res = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_url: videoUrl })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Unknown error occurred" }));
      throw new Error(err.detail || "Failed to analyze video");
    }
    return res.json();
  },

  // Bookmarks
  async getBookmarks(): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/api/bookmarks`);
    if (!res.ok) throw new Error("Failed to fetch bookmarks");
    return res.json();
  },

  async addBookmark(video: any): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/api/bookmarks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(video)
    });
    return res.ok;
  },

  async removeBookmark(videoId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/api/bookmarks/${videoId}`, {
      method: "DELETE"
    });
    return res.ok;
  },

  // Chat
  async getChatSessions(): Promise<ChatSession[]> {
    const res = await fetch(`${API_BASE_URL}/api/chat/sessions`);
    if (!res.ok) throw new Error("Failed to fetch chat sessions");
    return res.json();
  },

  async getChatSession(sessionId: string): Promise<ChatSession> {
    const res = await fetch(`${API_BASE_URL}/api/chat/session/${sessionId}`);
    if (!res.ok) throw new Error("Failed to fetch chat session");
    return res.json();
  },

  async createChatSession(title: string, model: string): Promise<ChatSession> {
    const res = await fetch(`${API_BASE_URL}/api/chat/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, model })
    });
    if (!res.ok) throw new Error("Failed to create chat session");
    return res.json();
  },

  async sendChatMessage(sessionId: string, videoId: string, message: string): Promise<{
    response: string;
    session_id: string;
    chat: ChatSession;
    source_type: "transcript" | "web_search";
  }> {
    const res = await fetch(`${API_BASE_URL}/api/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, video_id: videoId, message })
    });
    if (!res.ok) throw new Error("Failed to send message");
    return res.json();
  },

  async deleteChatSession(sessionId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/api/chat/${sessionId}`, {
      method: "DELETE"
    });
    return res.ok;
  },

  getDownloadTranscriptUrl(videoId: string): string {
    return `${API_BASE_URL}/api/download-transcript/${videoId}`;
  }
};
