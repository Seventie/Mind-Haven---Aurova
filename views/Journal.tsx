
import React, { useState } from 'react';
import { analyzeMood } from '../services/geminiService';
import { journalService } from '../services/journalService';
import { JournalEntry } from '../types';

interface JournalProps {
  onSave: (entry: JournalEntry) => void;
  onBack: () => void;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

const Journal: React.FC<JournalProps> = ({ onSave, onBack, isLoggedIn, onAuthRequired }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeMood(content);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }

    setIsLoading(true);
    try {
      const savedEntry = await journalService.createEntry(content, analysis);

      const entry: JournalEntry = {
        id: savedEntry._id,
        date: savedEntry.createdAt,
        content: savedEntry.content,
        mood: savedEntry.aiAnalysis?.mood || 'Neutral',
        analysis: savedEntry.aiAnalysis ? JSON.stringify(savedEntry.aiAnalysis) : undefined
      };

      onSave(entry);
      onBack();
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save your reflection to the cloud. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors active:translate-y-0.5">
        <span className="material-icons-outlined text-sm">arrow_back</span> Back to Space
      </button>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-4xl font-display mb-6 italic dark:text-white">Unload Your <span className="text-primary not-italic underline decoration-2 underline-offset-4">Mind.</span></h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 rounded-2xl text-red-700 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          <div className="bg-white dark:bg-card-dark border-2 border-black rounded-2xl shadow-brutalist p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's going on? Nobody is watching..."
              className="w-full h-80 bg-transparent border-none focus:ring-0 text-lg resize-none placeholder-gray-400 dark:placeholder-gray-500 text-black dark:text-white"
            />
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !content.trim()}
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl border-2 border-black shadow-brutalist hover:shadow-brutalist-hover hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 active:translate-y-1 active:shadow-brutalist-sm group"
            >
              {isAnalyzing ? (
                <span className="animate-spin material-icons-outlined">sync</span>
              ) : (
                <span className="material-icons-outlined group-hover:rotate-12 transition-transform">psychology</span>
              )}
              <span className="tracking-tight uppercase text-xs">
                {isAnalyzing ? 'Decoding Soul...' : 'Deep Analysis'}
              </span>
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-4 bg-primary text-white font-bold rounded-2xl border-2 border-black shadow-brutalist hover:shadow-brutalist-hover transition-all flex items-center gap-2 ml-auto active:translate-y-1 active:shadow-brutalist-sm"
            >
              <span className="material-icons-outlined">save</span>
              <span className="tracking-tight uppercase text-xs">Save Reflection</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            <div className={`p-6 border-2 border-black rounded-[2rem] shadow-brutalist transition-all ${analysis ? 'bg-card-purple text-black' : 'bg-white dark:bg-card-dark text-black dark:text-white'}`}>
              <h3 className={`font-bold uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2 ${analysis ? 'text-black/60' : 'text-primary'}`}>
                <span className="material-icons-outlined text-sm">auto_awesome</span>
                AI Insights
              </h3>
              {analysis ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center text-xl shadow-brutalist-sm">
                      {analysis.score > 7 ? '☀️' : analysis.score > 4 ? '☁️' : '🌧️'}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Mood Detected</p>
                      <p className="text-xl font-display font-bold">{analysis.mood}</p>
                    </div>
                  </div>
                  <p className="text-sm italic leading-relaxed text-black/80 font-medium">"{analysis.summary}"</p>

                  {analysis.clinicalInsight && (
                    <div className="pt-4 border-t border-black/10">
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Clinical Insight</p>
                      <p className="text-xs font-medium">{analysis.clinicalInsight}</p>
                    </div>
                  )}

                  {analysis.positiveReframing && (
                    <div className="pt-4 border-t border-black/10">
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Empathetic Shift</p>
                      <p className="text-xs font-medium italic">"{analysis.positiveReframing}"</p>
                    </div>
                  )}

                  {analysis.suggestions && analysis.suggestions.length > 0 && (
                    <div className="pt-4 border-t border-black/10">
                      <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2">Self-Care Rituals</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.suggestions.map((s: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-white border border-black rounded-lg text-[10px] font-bold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">analytics</span>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 italic uppercase tracking-widest">
                    Awaiting Reflection
                  </p>
                </div>
              )}
            </div>

            {/* Forced text-black on yellow card to ensure visibility in dark mode */}
            <div className="p-6 bg-card-yellow border-2 border-black rounded-[2rem] shadow-brutalist text-black">
              <h4 className="font-bold uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">shield</span>
                Privacy First
              </h4>
              <p className="text-[11px] font-bold leading-relaxed text-black/70">
                Your vulnerability is safe. All reflections are now encrypted and backed up to your secure vault.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black rounded bg-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[10px] font-black">check</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest">Encrypted Session Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
