
import React from 'react';
import { JournalEntry } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReportsProps {
  journals: JournalEntry[];
  onBack: () => void;
  isLoggedIn: boolean;
  onAuthRequired: () => void;
}

const Reports: React.FC<ReportsProps> = ({ journals, onBack, isLoggedIn, onAuthRequired }) => {
  const getAverageMoodScore = () => {
    if (journals.length === 0) return 0;
    const scores = journals.map(j => {
      try {
        const analysis = j.analysis ? JSON.parse(j.analysis) : null;
        return analysis?.score ?? 5;
      } catch (e) {
        return 5;
      }
    });
    return (scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getMoodStatus = (score: number) => {
    if (journals.length === 0) return "Start your journey";
    if (score <= 3) return "Doing Okayish";
    if (score <= 5) return "Finding Your Way";
    if (score <= 7) return "Steady Progress";
    if (score <= 9) return "Closer to Calm";
    return "Vibrant Balance";
  };

  const getMoodSupportText = (score: number) => {
    if (score <= 3) return "Some days are just about showing up. You're doing enough just by being here.";
    if (score <= 5) return "You're navigating the waves. Every small reflection is a step forward.";
    if (score <= 7) return "You're building real momentum. Keep listening to your inner voice.";
    if (score <= 9) return "You're very close to your peak peace. This strength looks good on you.";
    return "You're blooming! Take a moment to appreciate how far you've come.";
  };

  const avgScore = getAverageMoodScore();
  const moodStatus = getMoodStatus(avgScore);
  const supportText = getMoodSupportText(avgScore);

  const moodBreakdown = [
    { name: 'Happy', value: journals.filter(j => j.mood === 'Happy').length },
    { name: 'Anxious', value: journals.filter(j => j.mood === 'Anxious').length },
    { name: 'Sad', value: journals.filter(j => j.mood === 'Sad').length },
    { name: 'Calm', value: journals.filter(j => j.mood === 'Calm').length },
  ].filter(m => m.value > 0);

  const colors = ['#FF7D45', '#A3C9F6', '#E6C6FA', '#FCEFC7'];

  const handleExport = () => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    alert("Preparing your journey summary for export...");
  };

  return (
    <div className="pt-24 pb-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl md:text-6xl font-display italic">Your <span className="text-primary not-italic">Journey.</span></h1>
          <p className="text-gray-500 font-medium">Healing isn't a score, it's a story. Here's yours.</p>
        </div>
        <button onClick={onBack} className="p-4 bg-white border-2 border-black rounded-2xl shadow-brutalist hover:shadow-brutalist-hover transition-all active:translate-y-1">
          <span className="material-icons-outlined">close</span>
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Replaced numerical score with empathetic status */}
        <div className="bg-white dark:bg-card-dark p-8 border-2 border-black rounded-[3rem] shadow-brutalist flex flex-col justify-center">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Current Pulse</h3>
          <div className="flex flex-col gap-2">
            <span className="text-5xl lg:text-6xl font-display font-bold text-primary italic leading-tight">
              {moodStatus}
            </span>
          </div>
          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            {supportText}
          </p>
        </div>

        <div className="bg-secondary p-8 border-2 border-black rounded-[3rem] shadow-brutalist">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-6">Emotional Landscape</h3>
          <div className="h-48">
            {moodBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodBreakdown}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: '2px solid black' }} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {moodBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="#000" strokeWidth={2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-black/30 border-2 border-dashed border-black/10 rounded-3xl">
                <span className="material-symbols-outlined text-4xl mb-2">analytics</span>
                <p className="text-[10px] font-bold uppercase">More reflections needed</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card-dark p-10 border-2 border-black rounded-[4rem] shadow-brutalist relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-display font-bold mb-8 dark:text-white">The Aura Summary</h3>
          <div className="prose dark:prose-invert max-w-none">
            {journals.length > 0 ? (
              <div className="space-y-8">
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  Over your last {journals.length} reflections, we've seen you navigating various states. You started feeling
                  <span className="text-primary font-bold"> {journals[journals.length - 1]?.mood} </span>
                  and your most recent vibe is
                  <span className="text-primary font-bold"> {journals[0]?.mood}</span>.
                  Every entry is proof of your resilience.
                </p>
                <div className="p-8 bg-aura-cream dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-primary/30">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-primary font-bold">lightbulb</span>
                    <h4 className="font-bold text-sm uppercase tracking-widest text-primary">A Gentle Thought for Next Week</h4>
                  </div>
                  <p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
                    {avgScore <= 4
                      ? "Be extra soft with yourself this week. Maybe try just one 5-minute yoga flow from the Soul Hub when you feel heavy. You don't have to climb the whole mountain at once."
                      : "You're finding a beautiful rhythm. Keep using the Soul Hub to nourish this growth. You are becoming your own best support system."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">history_edu</span>
                <p className="text-gray-400 font-bold italic">Start journaling to unlock your emotional story.</p>
              </div>
            )}
          </div>
        </div>
        <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[15rem] text-black/5 pointer-events-none">auto_awesome</span>
      </div>

      <div className="mt-16 flex flex-col items-center gap-6">
        <button
          onClick={handleExport}
          className="px-12 py-5 bg-black text-white rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-retro-white hover:scale-105 active:translate-y-1 transition-all flex items-center gap-3"
        >
          <span className="material-symbols-outlined">file_download</span>
          Save My Story
        </button>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Everything is private and stays on your device.</p>
      </div>
    </div>
  );
};

export default Reports;
