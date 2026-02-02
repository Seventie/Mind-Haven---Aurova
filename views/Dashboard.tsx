
import React, { useMemo, useState, useEffect } from 'react';
import { AppView, JournalEntry, Meeting } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  journals: JournalEntry[];
  onNavigate: (view: AppView) => void;
  isLoggedIn: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ journals, onNavigate, isLoggedIn }) => {
  // Reveal Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-load');
      elements.forEach((el, i) => {
        setTimeout(() => el.classList.add('active'), i * 100);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Calendar State
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

  // Mock data for care team
  const upcomingMeetings: Meeting[] = [
    {
      id: 'm1',
      doctorName: 'Dr. Sarah Kapur',
      doctorImg: 'https://i.pravatar.cc/150?u=sarah',
      date: '2025-05-24',
      time: '10:30 AM',
      type: 'Video',
      status: 'upcoming'
    },
    {
      id: 'm2',
      doctorName: 'Advait Mehta',
      doctorImg: 'https://i.pravatar.cc/150?u=advait',
      date: '2025-05-28',
      time: '4:00 PM',
      type: 'Audio',
      status: 'upcoming'
    }
  ];

  const pastMeetings: Meeting[] = [
    {
      id: 'm3',
      doctorName: 'Priya Verma',
      doctorImg: 'https://i.pravatar.cc/150?u=priya',
      date: '2025-05-15',
      time: '11:00 AM',
      type: 'Video',
      status: 'completed'
    }
  ];

  // Dynamic Calendar Logic
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days = [];
    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return { days, monthName, year, month };
  }, [viewDate]);

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const handleDateClick = (day: number) => {
    const d = new Date(calendarData.year, calendarData.month, day);
    setSelectedDate(d.toLocaleDateString('en-CA'));
  };

  const quotes = [
    "Healing is not a linear journey, it's a spiral of growth.",
    "Your vulnerability is your greatest strength.",
    "Be patient with yourself. You are blooming.",
    "Self-care is how you take your power back.",
    "Softness is not weakness; it is the ultimate resilience."
  ];
  const dailyQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  const moodData = useMemo(() => {
    return [...journals].reverse().slice(-7).map(j => {
      let score = 5;
      try { if (j.analysis) score = JSON.parse(j.analysis)?.score ?? 5; } catch (e) { }
      return {
        name: new Date(j.date).toLocaleDateString('en-US', { weekday: 'short' }),
        score: score
      };
    });
  }, [journals]);

  const todayStr = new Date().toLocaleDateString('en-CA');

  return (
    <div className="pt-28 pb-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-aura-cream dark:bg-background-dark min-h-screen relative overflow-x-hidden">
      {/* Background Animated Ornaments */}
      <div className="absolute top-40 -left-20 animate-float opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[20rem] text-primary">spa</span>
      </div>
      <div className="absolute top-1/2 -right-20 animate-spin-slow opacity-10 pointer-events-none">
        <span className="material-symbols-outlined text-[15rem] text-secondary">settings_heart</span>
      </div>

      {/* 1. Header */}
      <header className="reveal-on-load reveal mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-display font-bold text-black dark:text-white leading-tight mb-4">
            Welcome home, <br /><span className="italic text-primary">Aura Soul.</span>
          </h1>
          <div className="inline-flex items-center gap-3 bg-white dark:bg-card-dark border-2 border-black p-5 rounded-2xl shadow-retro transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
            <span className="material-symbols-outlined text-secondary font-bold">format_quote</span>
            <p className="font-hand text-xl text-gray-700 dark:text-gray-300">
              {dailyQuote}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <div className="bg-white dark:bg-card-dark border-2 border-black p-4 rounded-2xl shadow-brutalist-sm flex items-center gap-4 hover:translate-y-[-4px] transition-transform">
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Streak</p>
              <p className="text-2xl font-display font-bold">12 Days</p>
            </div>
            <div className="w-12 h-12 bg-secondary rounded-full border-2 border-black flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-black font-bold">local_fire_department</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Primary Tools (Action Cards) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 relative z-10">
        <button
          onClick={() => onNavigate(AppView.JOURNAL)}
          className="reveal-on-load reveal bg-card-yellow p-8 rounded-[4rem] border-2 border-black shadow-brutalist hover:shadow-brutalist-hover hover:-translate-y-2 hover:rotate-1 transition-all text-left group overflow-hidden h-full"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white border-2 border-black rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-brutalist-sm">
              <span className="material-symbols-outlined text-primary text-3xl font-bold">edit_note</span>
            </div>
            <h4 className="text-4xl font-display font-bold text-black mb-4 tracking-tight">Write Journal</h4>
            <p className="text-gray-800 leading-relaxed font-medium">Release the noise. TENA decodes your heart.</p>
          </div>
          <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[12rem] text-black/5 rotate-12 pointer-events-none group-hover:scale-110 transition-transform">auto_awesome_motion</span>
        </button>

        <button
          onClick={() => onNavigate(AppView.CHAT)}
          className="reveal-on-load reveal bg-card-blue p-8 rounded-[4rem] border-2 border-black shadow-brutalist hover:shadow-brutalist-hover hover:-translate-y-2 hover:-rotate-1 transition-all text-left group overflow-hidden h-full"
          style={{ transitionDelay: '100ms' }}
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white border-2 border-black rounded-3xl flex items-center justify-center mb-6 group-hover:-rotate-12 transition-transform shadow-brutalist-sm">
              <span className="material-symbols-outlined text-blue-600 text-3xl font-bold">forum</span>
            </div>
            <h4 className="text-4xl font-display font-bold text-black mb-4 tracking-tight">Chat with TENA</h4>
            <p className="text-gray-800 leading-relaxed font-medium">Empathetic AI. A silent listener, always here.</p>
          </div>
          <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[12rem] text-black/5 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform">smart_toy</span>
        </button>

        <button
          onClick={() => onNavigate(AppView.RESOURCES)}
          className="reveal-on-load reveal bg-card-purple p-8 rounded-[4rem] border-2 border-black shadow-brutalist hover:shadow-brutalist-hover hover:-translate-y-2 hover:rotate-2 transition-all text-left group overflow-hidden h-full"
          style={{ transitionDelay: '200ms' }}
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white border-2 border-black rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-brutalist-sm">
              <span className="material-symbols-outlined text-purple-600 text-3xl font-bold">psychology_alt</span>
            </div>
            <h4 className="text-4xl font-display font-bold text-black mb-4 tracking-tight">Wellness Hub</h4>
            <p className="text-gray-800 leading-relaxed font-medium">Yoga, exercises & curated books for your soul.</p>
          </div>
          <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[12rem] text-black/5 rotate-6 pointer-events-none group-hover:scale-110 transition-transform">library_books</span>
        </button>
      </div>

      {/* 3. Insights & Trends */}
      <div className="grid lg:grid-cols-12 gap-8 mb-16 relative z-10">
        <div className="reveal-on-load reveal lg:col-span-8 bg-white dark:bg-card-dark border-2 border-black p-8 rounded-[3rem] shadow-brutalist relative overflow-hidden group">
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-display font-bold dark:text-white">Emotional Trajectory</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Your Mood Score Over Time</p>
            </div>
            <button onClick={() => onNavigate(AppView.REPORTS)} className="px-6 py-2 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-retro">
              Full Analytics
            </button>
          </div>
          <div className="h-72 w-full relative z-10">
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 700 }} />
                  <YAxis domain={[0, 10]} hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '16px', border: '2px solid #000', boxShadow: '4px 4px 0px 0px #FF7D44' }}
                    itemStyle={{ color: '#FF7D44' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#FF7D44"
                    strokeWidth={8}
                    isAnimationActive={true}
                    animationDuration={1500}
                    dot={{ r: 8, fill: '#FF7D44', stroke: '#000', strokeWidth: 3 }}
                    activeDot={{ r: 10, fill: '#FF7D44', stroke: '#FFF', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem]">
                <span className="material-symbols-outlined text-6xl mb-4 animate-pulse">analytics</span>
                <p className="font-bold text-lg">Journal once to see your trajectory</p>
              </div>
            )}
          </div>
        </div>

        <div className="reveal-on-load reveal lg:col-span-4 bg-white dark:bg-card-dark border-2 border-black p-8 rounded-[3rem] shadow-brutalist flex flex-col [transition-delay:200ms]">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">Recent Vibes</h3>
          <div className="flex-grow space-y-4 overflow-y-auto no-scrollbar pr-1">
            {journals.length > 0 ? journals.slice(0, 4).map((j, idx) => (
              <div key={j.id} className="reveal-on-load reveal p-5 bg-aura-cream dark:bg-white/5 border-2 border-black rounded-3xl hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer hover:shadow-brutalist-sm" style={{ transitionDelay: `${(idx + 5) * 100}ms` }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-primary uppercase">{new Date(j.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm line-clamp-2 italic text-gray-700 dark:text-gray-300 font-medium">"{j.content}"</p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-10">
                <span className="material-symbols-outlined text-5xl mb-3 animate-bounce">history_edu</span>
                <p className="font-bold">Write your first <br /> thought today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Professional Hub & Interactive Calendar */}
      <div className="grid lg:grid-cols-12 gap-8 mb-24 relative z-10">
        <div className="reveal-on-load reveal lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-display font-bold dark:text-white">Care Hub</h3>
            <button onClick={() => onNavigate(AppView.EXPERTS)} className="text-xs font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-1 hover:text-black transition-colors">
              Find New Expert
            </button>
          </div>

          <div className="grid gap-6">
            {upcomingMeetings.map((meeting, i) => (
              <div key={meeting.id} className="reveal-on-load reveal bg-white dark:bg-card-dark border-2 border-black p-8 rounded-[3rem] shadow-brutalist flex flex-col md:flex-row items-center gap-8 group hover:scale-[1.02] transition-all" style={{ transitionDelay: `${i * 150}ms` }}>
                <div className="w-24 h-24 rounded-3xl border-2 border-black overflow-hidden shadow-brutalist-sm group-hover:rotate-6 transition-transform flex-shrink-0">
                  <img src={meeting.doctorImg} alt={meeting.doctorName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h5 className="text-2xl font-display font-bold dark:text-white">{meeting.doctorName}</h5>
                  <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{meeting.type} Session</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5">
                      <span className="material-symbols-outlined text-xs">calendar_month</span> {new Date(meeting.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5">
                      <span className="material-symbols-outlined text-xs">alarm</span> {meeting.time}
                    </span>
                  </div>
                </div>
                <button className="w-full md:w-auto px-10 py-5 bg-black text-white rounded-[2rem] font-bold uppercase text-xs tracking-widest shadow-retro-white active:translate-y-1 transition-all">
                  Join Session
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-on-load reveal lg:col-span-4 space-y-8 [transition-delay:400ms]">
          <div className="bg-white dark:bg-card-dark border-2 border-black p-8 rounded-[3rem] shadow-brutalist overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="font-bold text-xl font-display dark:text-white">{calendarData.monthName}</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{calendarData.year}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-xl hover:bg-aura-cream transition-colors shadow-brutalist-sm active:translate-y-1">
                  <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                </button>
                <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center bg-white border-2 border-black rounded-xl hover:bg-aura-cream transition-colors shadow-brutalist-sm active:translate-y-1">
                  <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-[0.2em]">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold">
              {calendarData.days.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} className="aspect-square"></div>;
                const dateString = `${calendarData.year}-${String(calendarData.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasMeeting = upcomingMeetings.some(m => m.date === dateString);
                const isSelected = selectedDate === dateString;
                const isToday = todayStr === dateString;
                return (
                  <button key={`day-${day}`} onClick={() => handleDateClick(day)} className={`aspect-square flex items-center justify-center rounded-xl relative transition-all border-2 ${isSelected ? 'bg-primary text-white border-black shadow-brutalist-sm scale-110 z-10' : isToday ? 'bg-secondary text-black border-black border-dashed' : 'bg-transparent text-gray-500 border-transparent hover:border-black/20 hover:bg-gray-50'}`}>
                    {day}
                    {hasMeeting && !isSelected && <span className="absolute bottom-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Crisis Support (The Safety Net) */}
      <div className="reveal-on-load reveal bg-aura-black p-12 rounded-[5rem] border-4 border-primary shadow-2xl relative overflow-hidden group mb-20">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
            <div className="text-center lg:text-left">
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 italic">You are not <span className="text-primary not-italic">alone.</span></h2>
              <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
                If you feel overwhelmed, please reach out immediately. Compassionate humans are waiting to hear you.
              </p>
            </div>
            <div className="shrink-0">
              <button className="px-16 py-8 bg-primary text-white font-bold rounded-3xl border-2 border-white shadow-retro-white hover:scale-105 active:scale-95 transition-all text-2xl uppercase tracking-widest">
                Crisis Hotline
              </button>
            </div>
          </div>

          {/* India Helpline Section */}
          <div className="border-t border-white/10 pt-12">
            <div className="flex items-center gap-3 mb-10">
              <span className="w-12 h-1 bg-primary rounded-full"></span>
              <h3 className="text-sm font-bold text-primary uppercase tracking-[0.4em]">Indian Emergency Network</h3>
              <span className="flex-grow h-px bg-white/10"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Emergency */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Police/Emergency</p>
                <p className="text-white text-3xl font-display font-bold">112</p>
              </div>

              {/* Suicide */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Suicide Hotline</p>
                <p className="text-white text-xl font-bold">8888817666</p>
              </div>

              {/* iCALL */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">iCALL Helpline</p>
                <p className="text-white text-sm font-bold mb-2">+91-91529-87821</p>
                <a href="https://icallhelpline.org" target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-bold">icallhelpline.org</a>
              </div>

              {/* KIRAN */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">KIRAN Mental Health</p>
                <p className="text-white text-lg font-bold">1800-599-0019</p>
              </div>

              {/* Sneha India */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Sneha India</p>
                <p className="text-white text-sm font-bold mb-2">91 44 24640050</p>
                <a href="http://www.snehaindia.org" target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-bold">snehaindia.org</a>
              </div>

              {/* Child */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Student/Child Line</p>
                <p className="text-white text-3xl font-display font-bold">1098</p>
                <a href="https://www.csrindia.org/helpline-numbers" target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-bold">csrindia.org</a>
              </div>

              {/* Vandrevala */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Vandrevala Support</p>
                <p className="text-white text-sm font-bold mb-2">+91-9999-666-555</p>
                <a href="https://www.vandrevalafoundation.com" target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-bold">vandrevala.com</a>
              </div>

              {/* Women */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Women Helpline</p>
                <p className="text-white text-3xl font-display font-bold">181</p>
                <a href="https://wcdhry.gov.in/women-helpline-number-181" target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline font-bold">Portal Access</a>
              </div>
            </div>
          </div>
        </div>

        {/* Background pulsing icons */}
        <div className="absolute top-10 right-10 animate-pulse-slow opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[15rem] text-primary">volunteer_activism</span>
        </div>
        <div className="absolute -bottom-20 -left-20 animate-float-slow opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[25rem] text-secondary">shield</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
