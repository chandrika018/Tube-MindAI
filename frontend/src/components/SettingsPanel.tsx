import React, { useState, useEffect } from "react";
import { Save, Brain, Database, ShieldAlert, Check } from "lucide-react";
import { apiService, AppSettings } from "../services/api";

interface SettingsPanelProps {
  onSettingsSaved?: (model: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSettingsSaved }) => {
  const [settings, setSettings] = useState<AppSettings>({
    active_model: "gemini",
    vector_db: "faiss",
    api_keys: {
      gemini_api_key: "",
      openai_api_key: "",
      groq_api_key: "",
      claude_api_key: ""
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiService.getSettings()
      .then((data) => {
        // Enforce structures
        setSettings({
          active_model: data.active_model || "gemini",
          vector_db: data.vector_db || "faiss",
          api_keys: {
            gemini_api_key: data.api_keys?.gemini_api_key || "",
            openai_api_key: data.api_keys?.openai_api_key || "",
            groq_api_key: data.api_keys?.groq_api_key || "",
            claude_api_key: data.api_keys?.claude_api_key || "",
          }
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleKeyChange = (keyName: string, val: string) => {
    setSettings(prev => ({
      ...prev,
      api_keys: {
        ...prev.api_keys,
        [keyName]: val
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await apiService.updateSettings(settings);
      setSaveSuccess(true);
      if (onSettingsSaved) {
        onSettingsSaved(updated.active_model);
      }
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      alert("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <span>Model Provider & LLM Orchestrator</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-1">Configure active LLM systems for transcript summarization & similarity analysis.</p>
      </div>

      {/* Model Selection grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {["gemini", "openai", "groq", "claude", "ollama"].map((model) => (
          <button
            key={model}
            onClick={() => setSettings(prev => ({ ...prev, active_model: model }))}
            className={`py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
              settings.active_model === model
                ? "bg-indigo-600/10 border-indigo-500 text-indigo-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}
          >
            {model}
          </button>
        ))}
      </div>

      {/* Vector DB selection */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
          <Database className="w-4 h-4 text-purple-400" />
          <span>Vector Database Store</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {["faiss", "chromadb"].map((dbType) => (
            <button
              key={dbType}
              onClick={() => setSettings(prev => ({ ...prev, vector_db: dbType }))}
              className={`py-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                settings.vector_db === dbType
                  ? "bg-purple-600/10 border-purple-500 text-purple-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-750"
              }`}
            >
              {dbType === "faiss" ? "FAISS Index (Local flat CPU)" : "ChromaDB Store (Local directory)"}
            </button>
          ))}
        </div>
      </div>

      {/* API Key Inputs */}
      <div className="space-y-4 pt-4 border-t border-slate-900">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Custom Provider API Keys (Stored in Database)
        </h3>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Gemini API Key</label>
            <input
              type="password"
              value={settings.api_keys.gemini_api_key}
              onChange={(e) => handleKeyChange("gemini_api_key", e.target.value)}
              placeholder={settings.active_model === "gemini" ? "Required for Gemini intelligence..." : "Optional..."}
              className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white placeholder-slate-600 transition-all"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">OpenAI API Key</label>
            <input
              type="password"
              value={settings.api_keys.openai_api_key}
              onChange={(e) => handleKeyChange("openai_api_key", e.target.value)}
              placeholder={settings.active_model === "openai" ? "Required for GPT analysis..." : "Optional..."}
              className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white placeholder-slate-600 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Groq API Key</label>
            <input
              type="password"
              value={settings.api_keys.groq_api_key}
              onChange={(e) => handleKeyChange("groq_api_key", e.target.value)}
              placeholder={settings.active_model === "groq" ? "Required for Groq Llama3..." : "Optional..."}
              className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white placeholder-slate-600 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Anthropic Claude Key</label>
            <input
              type="password"
              value={settings.api_keys.claude_api_key}
              onChange={(e) => handleKeyChange("claude_api_key", e.target.value)}
              placeholder={settings.active_model === "claude" ? "Required for Sonnet reasoning..." : "Optional..."}
              className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white placeholder-slate-600 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Note about Mock Fallback */}
      <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl flex items-start space-x-3 text-[10px] text-slate-400">
        <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Security Note:</strong> All API keys provided here are saved to the local configuration cache of the platform. If you leave keys blank, the backend will auto-detect your environment variables or fall back to mock templates to keep the UI fully functional.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-indigo-600/10 disabled:opacity-50"
        >
          {saveSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span className="text-emerald-300">Configurations Saved</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Configurations</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
