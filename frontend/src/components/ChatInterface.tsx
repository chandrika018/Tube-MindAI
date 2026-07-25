import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Sparkles, 
  Download, 
  FileText, 
  Share2, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Cpu, 
  ListOrdered, 
  HelpCircle,
  Copy,
  Check,
  Award,
  AlertCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { jsPDF } from "jspdf";
import { apiService, AnalyzeResponse, ChatSession, ChatMessage } from "../services/api";

interface ChatInterfaceProps {
  initialVideoUrl?: string;
  onAnalysisSuccess?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialVideoUrl = "", 
  onAnalysisSuccess 
}) => {
  // Analyzer State
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [summaryTab, setSummaryTab] = useState<"short" | "medium" | "detailed" | "bullet" | "executive">("medium");

  // Chat State
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activeModel, setActiveModel] = useState("gemini");

  // Audio / Voice Settings
  const [isRecording, setIsRecording] = useState(false);
  const [voiceOutputActive, setVoiceOutputActive] = useState(false);
  const [copyStatus, setCopyStatus] = useState<Record<number, boolean>>({});
  const [shareStatus, setShareStatus] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load Settings
  useEffect(() => {
    apiService.getSettings().then((s) => {
      setActiveModel(s.active_model);
    }).catch(console.error);
    
    // Init speech recognition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-US";
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInputMessage(prev => prev + " " + text);
        setIsRecording(false);
      };
      
      rec.onerror = () => {
        setIsRecording(false);
      };
      
      rec.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = rec;
    }
  }, []);

  const handleAnalyze = async (urlToUse?: string) => {
    const targetUrl = urlToUse || videoUrl;
    if (!targetUrl.trim()) return;
    setLoading(true);
    try {
      const data = await apiService.analyzeVideo(targetUrl);
      setAnalysis(data);
      
      // Initialize or load chat session for this video
      const sessions = await apiService.getChatSessions();
      // Look for a chat related to this video title or create one
      const existing = sessions.find(s => s.title.includes(data.details.title.substring(0, 15)));
      if (existing) {
        setSessionId(existing.id);
        const fullChat = await apiService.getChatSession(existing.id);
        setMessages(fullChat.messages);
      } else {
        const newChat = await apiService.createChatSession(`Chat: ${data.details.title.substring(0, 20)}...`, activeModel);
        setSessionId(newChat.id);
        setMessages([]);
      }
      
      if (onAnalysisSuccess) onAnalysisSuccess();
    } catch (e) {
      const err = e as Error;
      alert(err.message || "Failed to analyze video. Check URL.");
    } finally {
      setLoading(false);
    }
  };

  // Sync initial URL if passed from dashboard
  useEffect(() => {
    if (initialVideoUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVideoUrl(initialVideoUrl);
      handleAnalyze(initialVideoUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialVideoUrl]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || !analysis || !sessionId) return;

    if (!textToSend) setInputMessage("");
    setChatLoading(true);

    // Optimistically append user message
    const tempUserMsg: ChatMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
      source_type: analysis.analysis.source_type
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const data = await apiService.sendChatMessage(sessionId, analysis.video_id, query);
      setMessages(data.chat.messages);

      // Speak assistant's response if active
      if (voiceOutputActive) {
        speakResponse(data.response);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  // Web Speech API - Voice Input
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Web Speech API - Voice Output
  const speakResponse = (text: string) => {
    window.speechSynthesis.cancel(); // stop previous speech
    const utterance = new SpeechSynthesisUtterance(text.replace(/[\*\#\`]/g, ""));
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceOutput = () => {
    setVoiceOutputActive(prev => {
      const next = !prev;
      if (!next) {
        window.speechSynthesis.cancel();
      } else if (messages.length > 0 && messages[messages.length - 1].role === "assistant") {
        speakResponse(messages[messages.length - 1].content);
      }
      return next;
    });
  };

  // Clipboard Copier
  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
      setCopyStatus(prev => ({ ...prev, [index]: false }));
    }, 2000);
  };

  // PDF Exporter
  const exportPDF = () => {
    if (!analysis) return;
    const doc = new jsPDF();
    const video = analysis.details;
    const notes = analysis.analysis.summaries[summaryTab];
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("TubeMind AI Video Report", 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Title: ${video.title}`, 20, 32);
    doc.text(`Creator: ${video.channel_name}`, 20, 39);
    doc.text(`AI Recommendation Score: ${analysis.analysis.scores.overall_score}/100`, 20, 46);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 20, 53);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 58, 190, 58);
    
    doc.setFont("helvetica", "bold");
    doc.text(`${summaryTab.toUpperCase()} SUMMARY`, 20, 68);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // Split text into wrapped lines for PDF printing
    const splitText = doc.splitTextToSize(notes, 170);
    doc.text(splitText, 20, 78);
    
    doc.save(`summary_${video.id}.pdf`);
  };

  // Markdown Exporter
  const exportMarkdown = () => {
    if (!analysis) return;
    
    const video = analysis.details;
    const notes = analysis.analysis.summaries[summaryTab];
    const insights = analysis.analysis.insights;
    
    let mdContent = `# TubeMind AI intelligence: ${video.title}\n\n`;
    mdContent += `* **Channel:** ${video.channel_name}\n`;
    mdContent += `* **Views:** ${video.views.toLocaleString()}\n`;
    mdContent += `* **AI Scoring:** ${analysis.analysis.scores.overall_score}/100\n`;
    mdContent += `* **Source:** ${analysis.analysis.source_type === "transcript" ? "Official Transcript" : "Web Crawler Crawler Fallback"}\n\n`;
    
    mdContent += `## ${summaryTab.toUpperCase()} SUMMARY\n\n${notes}\n\n`;
    
    mdContent += `## KEY CONCEPTS\n\n`;
    insights.key_concepts.forEach(c => mdContent += `- ${c}\n`);
    mdContent += `\n## TECHNOLOGIES MENTIONED\n\n`;
    insights.technologies_mentioned.forEach(t => mdContent += `- ${t}\n`);
    
    mdContent += `\n## CHAT LOGS\n\n`;
    messages.forEach(msg => {
      mdContent += `### **${msg.role.toUpperCase()}** (${new Date(msg.timestamp).toLocaleTimeString()})\n${msg.content}\n\n`;
    });
    
    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes_${video.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareChat = () => {
    if (!analysis) return;
    const shareText = `TubeMind AI Chat for video "${analysis.details.title}":\n${messages.map(m => `${m.role}: ${m.content}`).join("\n\n")}`;
    navigator.clipboard.writeText(shareText);
    setShareStatus(true);
    setTimeout(() => setShareStatus(false), 2000);
  };

  // Quick Action Prompts
  const quickPrompts = [
    { label: "Summarize Video", prompt: "Summarize this video and extract the 3 key takeaways." },
    { label: "Create MCQ Quiz", prompt: "Generate a 3-question MCQ quiz based on this video with correct answers highlighted." },
    { label: "Explain in Hindi", prompt: "Explain the main points of this video in clean Hindi language." },
    { label: "Extract Resources & Links", prompt: "Extract all important references, libraries, websites, and resources mentioned in the context." },
    { label: "Create Flashcards", prompt: "Create 3 memory flashcards for revision from this video's technical concepts." },
    { label: "Extract Mindmap", prompt: "Create a hierarchical markdown-styled mindmap of the video topic structure." }
  ];

  return (
    <div className="space-y-8">
      {/* Video Ingest Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Video Intelligence Analyzer
        </label>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="Paste YouTube Video URL or ID (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
            className="flex-1 px-4 py-3.5 bg-slate-950/40 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 text-sm transition-all"
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Brain className="w-4.5 h-4.5" />
                <span>Extract Intelligence</span>
              </>
            )}
          </button>
        </div>
      </div>

      {analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Video Meta & Summary Tabs (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Video Details Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
              <div className="relative w-44 shrink-0 rounded-xl overflow-hidden aspect-video shadow-md">
                <img
                  src={analysis.details.thumbnail}
                  alt={analysis.details.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-bold text-slate-100 line-clamp-2 leading-relaxed">
                  {analysis.details.title}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">{analysis.details.channel_name}</p>
                <div className="flex items-center space-x-3 pt-1 text-[11px] text-slate-500">
                  <span>{analysis.details.views.toLocaleString()} views</span>
                  <span>•</span>
                  <span>{analysis.details.duration}</span>
                  <span>•</span>
                  <span className="bg-indigo-500/10 text-indigo-400 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                    {analysis.analysis.source_type}
                  </span>
                </div>
              </div>
            </div>

            {/* Fallback Warning Alert Banner */}
            {analysis.analysis.source_type === "web_search" && (
              <div className="bg-amber-950/20 border border-amber-500/25 p-4 rounded-xl flex items-start space-x-3 animate-pulse">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300">Transcript Not Available</h4>
                  <p className="text-[11px] text-amber-400/80 leading-relaxed mt-0.5">
                    This video lacks closed captions. Context answers and summaries were compiled from official documentation, blog articles, and educational sources related to the topic.
                  </p>
                </div>
              </div>
            )}

            {/* Summaries Panel */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>AI Summary Briefings</span>
                </h3>
                {/* Export triggers */}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={exportPDF}
                    title="Export as PDF" 
                    className="p-1.5 hover:bg-slate-800/80 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={exportMarkdown}
                    title="Download Markdown" 
                    className="p-1.5 hover:bg-slate-800/80 text-slate-400 hover:text-white rounded-lg border border-slate-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-slate-950/60 p-1 rounded-xl">
                {(["short", "medium", "detailed", "bullet", "executive"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSummaryTab(tab)}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                      summaryTab === tab
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Summary Text Render Box */}
              <div className="bg-slate-950/20 border border-slate-900 p-4.5 rounded-xl text-slate-300 text-xs leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                {analysis.analysis.summaries[summaryTab]}
              </div>
            </div>

          </div>

          {/* RIGHT: ChatGPT-Style RAG Bot (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col h-[750px] glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            
            {/* Bot Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/35 flex items-center justify-center">
                  <Brain className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">TubeMind Chat</h4>
                  <p className="text-[9px] text-slate-400 capitalize">Model: {activeModel}</p>
                </div>
              </div>

              {/* Actions dropdown */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={toggleVoiceOutput}
                  title={voiceOutputActive ? "Mute Voice Response" : "Unmute Voice Response"}
                  className={`p-1.5 rounded-lg border transition-colors ${voiceOutputActive ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  {voiceOutputActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleShareChat}
                  title="Share Chat"
                  className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
                >
                  {shareStatus ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                </button>
                <a
                  href={apiService.getDownloadTranscriptUrl(analysis.video_id)}
                  download
                  title="Download Raw Transcript"
                  className="p-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6">
                  <Sparkles className="w-8 h-8 text-indigo-400/40 animate-pulse" />
                  <p className="text-xs font-semibold text-slate-400">Ask any question about this video</p>
                  <p className="text-[10px] text-slate-500 max-w-[220px]">
                    Use the prompts below to query timestamps, generate tests, explanations, or key takeaways.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col space-y-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center space-x-1 text-[9px] text-slate-500 px-1">
                      <span>{msg.role === "user" ? "You" : "TubeMind AI"}</span>
                      <span>•</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] relative group ${
                      msg.role === "user" 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      
                      {/* Copy button overlay inside message bubble */}
                      <button
                        onClick={() => handleCopyText(msg.content, index)}
                        className="absolute right-2 top-2 bg-slate-950/80 p-1 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy content"
                      >
                        {copyStatus[index] ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      </button>
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 p-2">
                  <span className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin"></span>
                  <span>Generating RAG context...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action prompts console */}
            <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/20 overflow-x-auto flex space-x-2 no-scrollbar scroll-smooth">
              {quickPrompts.map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(btn.prompt)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-[10px] font-bold text-slate-300 px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Message Input Panel */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center space-x-2">
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-xl border transition-colors ${
                  isRecording 
                    ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse" 
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
                title={isRecording ? "Stop voice input" : "Speak to input"}
              >
                {isRecording ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={isRecording ? "Listening..." : "Ask AI details (e.g. explain roadmap...)"}
                className="flex-1 px-4 py-3 bg-slate-950/60 border border-slate-800/80 rounded-xl focus:outline-none focus:border-indigo-500 text-white text-xs placeholder-slate-500 transition-all"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={chatLoading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl shadow shadow-indigo-600/20 transition-colors disabled:opacity-50"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        <div className="glass-panel p-20 text-center rounded-3xl border border-slate-800/60 max-w-xl mx-auto space-y-4">
          <div className="bg-indigo-600/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-md">
            <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">Video Analysis Workspace</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter a YouTube video URL or select one from the recommendations engine. The agent will fetch the transcript, index it using a local FAISS index, and compile insights, timeline roadmaps, and custom summaries for interactive chat.
          </p>
        </div>
      )}
    </div>
  );
};
