
import React, { useEffect, useState } from 'react';

interface Routine {
  title: string;
  duration: string;
  level: string;
  color: string;
  icon: string;
  desc: string;
  steps: string[];
}

interface Book {
  title: string;
  author: string;
  tag: string;
  color: string;
  desc: string;
  summary: string;
  takeaways: string[];
}

interface WellnessHubProps {
  onBack: () => void;
  isLoggedIn: boolean;
}

const WellnessHub: React.FC<WellnessHubProps> = ({ onBack, isLoggedIn }) => {
  const [activeTab, setActiveTab] = useState<'movement' | 'books'>('movement');
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal-hub').forEach((el, i) => {
        setTimeout(() => el.classList.add('active'), i * 80);
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab, activeRoutine, activeBook]);

  const yogaRoutines: Routine[] = [
    { 
      title: 'Morning Aura Rise', 
      duration: '15 min', 
      level: 'Beginner', 
      color: 'bg-card-yellow', 
      icon: 'wb_sunny', 
      desc: 'A gentle flow to awaken your senses and set a positive intention for the day.',
      steps: [
        "Find a quiet space and sit cross-legged. Close your eyes and take 3 deep breaths.",
        "Gently roll your neck in circles, letting go of any overnight tension.",
        "Transition to a Cat-Cow stretch on all fours to wake up your spine.",
        "Enter a gentle Child's Pose and focus on your heartbeat for 2 minutes.",
        "Slowly stand up, reach for the sky, and exhale while visualizing a bright orange aura around you."
      ]
    },
    { 
      title: 'Sleepy Soul Flow', 
      duration: '20 min', 
      level: 'All Levels', 
      color: 'bg-card-blue', 
      icon: 'dark_mode', 
      desc: 'Slower movements to calm the nervous system before rest.',
      steps: [
        "Dim the lights. Sit comfortably and observe your breath without changing it.",
        "Extend your legs against a wall (Viparita Karani) to drain the day's fatigue.",
        "Perform a seated forward fold, reaching for your toes while keeping your knees soft.",
        "Lie on your back, hug your knees to your chest, and rock gently side to side.",
        "Enter Savasana (Corpse Pose) and count backwards from 50 until you feel completely heavy."
      ]
    },
    { 
      title: 'Desk Release Yoga', 
      duration: '5 min', 
      level: 'Intermediate', 
      color: 'bg-card-purple', 
      icon: 'chair', 
      desc: 'Targeted stretches for shoulders and neck. Perfect for mid-work breaks.',
      steps: [
        "Sit upright in your chair, feet flat on the floor.",
        "Clasp your hands behind your back and pull your shoulders down and back.",
        "Perform a seated spinal twist, looking over each shoulder for 30 seconds.",
        "Interlace your fingers and push your palms toward the ceiling, arching slightly.",
        "Close your eyes and take 5 deep 'box breaths' (Inhale 4, Hold 4, Exhale 4, Hold 4)."
      ]
    },
    { 
      title: 'Vibrant Energy Flow', 
      duration: '30 min', 
      level: 'Advanced', 
      color: 'bg-primary', 
      icon: 'bolt', 
      desc: 'A high-energy Vinyasa flow to build strength and clear mental fog.',
      steps: [
        "Start with 5 rounds of Sun Salutation A to build internal heat.",
        "Hold Warrior II on each side for 10 breaths, focusing on a steady gaze.",
        "Transition through a balancing tree pose to center your focus.",
        "Lower into a plank, hold for 1 minute, and exhale into a powerful Downward Dog.",
        "Finish with a seated meditation, visualizing your energy flowing freely like liquid light."
      ]
    },
  ];

  const bookList: Book[] = [
    { 
      title: 'The Body Keeps the Score', 
      author: 'Bessel van der Kolk', 
      tag: 'Trauma / Healing', 
      color: 'bg-aura-cream', 
      desc: 'Understanding how trauma affects the body and mind.',
      summary: "This ground-breaking work explores how trauma literally reshapes both body and brain, compromising sufferers' capacities for pleasure, engagement, self-control, and trust.",
      takeaways: [
        "Trauma is not just an event that happened in the past; it is also the imprint left by that experience on mind, brain, and body.",
        "Recovery involves learning how to 'be here now' and reclaiming ownership of your body.",
        "Movement, yoga, and theater can be as effective as traditional talk therapy for trauma recovery."
      ]
    },
    { 
      title: 'Atomic Habits', 
      author: 'James Clear', 
      tag: 'Self-Growth', 
      color: 'bg-card-orange', 
      desc: 'Small changes for remarkable results in your mental routine.',
      summary: "Clear reveals exactly how small changes can grow into life-altering outcomes. He uncovers a handful of simple life hacks (the forgotten art of Habit Stacking, the unexpected power of the Two Minute Rule) to get your life back on track.",
      takeaways: [
        "Focus on systems instead of goals.",
        "Make it obvious, make it attractive, make it easy, and make it satisfying.",
        "Your habits are how you embody your identity."
      ]
    },
    { 
      title: 'Untamed', 
      author: 'Glennon Doyle', 
      tag: 'Empowerment', 
      color: 'bg-card-purple', 
      desc: 'Rediscovering your wild, authentic self beyond expectations.',
      summary: "A wake-up call for women to stop living for everyone else and start living for themselves. Doyle explores how we've been caged by societal expectations and how to break free.",
      takeaways: [
        "The truest, most beautiful life is not the one we build; it's the one we let be built.",
        "We can do hard things.",
        "Stop asking for directions to places you've never been. Trust your inner knowing."
      ]
    },
    { 
      title: 'The Alchemist', 
      author: 'Paulo Coelho', 
      tag: 'Soul / Journey', 
      color: 'bg-card-yellow', 
      desc: 'A fable about following your heart and finding your legend.',
      summary: "The magical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure as extravagant as any ever found.",
      takeaways: [
        "To realize one's Personal Legend is a person's only real obligation.",
        "When you want something, all the universe conspires in helping you to achieve it.",
        "Fear is a larger obstacle than the obstacle itself."
      ]
    },
    { 
      title: 'Quiet', 
      author: 'Susan Cain', 
      tag: 'Personality', 
      color: 'bg-card-blue', 
      desc: 'The power of introverts in a world that can\'t stop talking.',
      summary: "Susan Cain argues that we dramatically undervalue introverts and shows how much we lose in doing so. She charts the rise of the Extrovert Ideal throughout the twentieth century.",
      takeaways: [
        "Introversion is a preference for lower levels of stimulation.",
        "Introverts often possess superior concentration and analytical skills.",
        "Respect your need for solitude; it is where your best work and healing happen."
      ]
    },
  ];

  const handleStartRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
    setCurrentStep(0);
  };

  const handleOpenBook = (book: Book) => {
    setActiveBook(book);
  };

  if (activeRoutine) {
    return (
      <div className="pt-24 pb-40 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen">
        <button 
          onClick={() => setActiveRoutine(null)} 
          className="flex items-center gap-2 mb-10 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">close</span> Exit Routine
        </button>

        <div className="reveal-hub reveal bg-white dark:bg-card-dark border-2 border-black rounded-[4rem] shadow-brutalist overflow-hidden flex flex-col items-center text-center p-12 lg:p-20">
          <div className={`w-24 h-24 ${activeRoutine.color} border-2 border-black rounded-3xl flex items-center justify-center mb-10 shadow-brutalist-sm animate-bounce`}>
            <span className="material-symbols-outlined text-black text-4xl">{activeRoutine.icon}</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">{activeRoutine.title}</h2>
          <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-12">Step {currentStep + 1} of {activeRoutine.steps.length}</p>
          
          <div className="min-h-[200px] flex items-center justify-center mb-16 px-4">
            <p className="text-2xl md:text-3xl font-display leading-relaxed italic animate-in fade-in slide-in-from-bottom-4 duration-700">
              "{activeRoutine.steps[currentStep]}"
            </p>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="w-full sm:w-auto px-10 py-5 border-2 border-black rounded-2xl font-bold uppercase text-xs tracking-widest transition-all disabled:opacity-20 shadow-brutalist-sm hover:bg-gray-50 active:translate-y-1"
            >
              Previous
            </button>
            
            {currentStep < activeRoutine.steps.length - 1 ? (
              <button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="w-full sm:w-auto px-16 py-5 bg-primary text-white border-2 border-black rounded-2xl font-bold uppercase text-xs tracking-widest shadow-retro-white hover:scale-105 active:translate-y-1 transition-all"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={() => setActiveRoutine(null)}
                className="w-full sm:w-auto px-16 py-5 bg-black text-white border-2 border-black rounded-2xl font-bold uppercase text-xs tracking-widest shadow-retro-white hover:scale-105 active:translate-y-1 transition-all"
              >
                Complete Flow
              </button>
            )}
          </div>

          <div className="mt-16 w-full max-w-xs bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden border border-black/10">
            <div 
              className="bg-primary h-full transition-all duration-500" 
              style={{ width: `${((currentStep + 1) / activeRoutine.steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (activeBook) {
    return (
      <div className="pt-24 pb-40 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen">
        <button 
          onClick={() => setActiveBook(null)} 
          className="flex items-center gap-2 mb-10 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span> Back to Library
        </button>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Book visual */}
          <div className="lg:col-span-5 reveal-hub reveal">
            <div className={`aspect-[3/4] ${activeBook.color} border-2 border-black rounded-tr-[5rem] rounded-bl-[2rem] p-12 shadow-brutalist flex flex-col justify-end relative overflow-hidden`}>
              <div className="absolute top-10 left-10 opacity-20">
                <span className="material-symbols-outlined text-8xl">auto_stories</span>
              </div>
              <h2 className="text-5xl font-display font-bold text-black leading-tight mb-4">{activeBook.title}</h2>
              <p className="text-xl font-bold text-gray-700 uppercase tracking-tight">{activeBook.author}</p>
              <div className="absolute top-0 right-0 w-4 h-full bg-black/5"></div>
            </div>
          </div>

          {/* Right Column: Book insights */}
          <div className="lg:col-span-7 space-y-12 reveal-hub reveal [transition-delay:150ms]">
            <header>
               <span className="text-xs font-bold text-primary uppercase tracking-[0.4em] mb-4 block">{activeBook.tag}</span>
               <h3 className="text-4xl font-display font-bold dark:text-white italic">Mindful Insight</h3>
            </header>

            <section className="bg-white dark:bg-card-dark border-2 border-black p-8 rounded-[3rem] shadow-brutalist-sm">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">The Essence</h4>
               <p className="text-xl leading-relaxed text-gray-800 dark:text-gray-200">{activeBook.summary}</p>
            </section>

            <section className="space-y-6">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Key Aura Takeaways</h4>
               <ul className="space-y-6">
                  {activeBook.takeaways.map((point, idx) => (
                    <li key={idx} className="flex gap-4 items-start bg-aura-cream dark:bg-white/5 p-6 rounded-2xl border border-black/5">
                       <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 border border-primary/20">
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                       </span>
                       <p className="text-lg font-medium text-gray-700 dark:text-gray-300 italic">"{point}"</p>
                    </li>
                  ))}
               </ul>
            </section>

            <div className="pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recommended for</p>
                  <p className="text-sm font-bold text-black dark:text-white mt-1">Growth & Mental Resilience</p>
               </div>
               <button className="px-12 py-5 bg-primary text-white border-2 border-black rounded-2xl font-bold uppercase text-xs tracking-widest shadow-retro-white hover:scale-105 active:translate-y-1 transition-all">
                 Buy on Amazon
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-screen">
      <header className="mb-16 reveal-hub reveal">
        <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors active:translate-y-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Dashboard
        </button>
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-6">
          <h1 className="text-6xl md:text-8xl font-display font-bold dark:text-white leading-none">The <span className="text-primary italic">Soul Hub.</span></h1>
          
          <div className="flex bg-white dark:bg-card-dark border-2 border-black rounded-2xl p-1 shadow-brutalist-sm shrink-0">
             <button 
               onClick={() => setActiveTab('movement')}
               className={`px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'movement' ? 'bg-primary text-white shadow-retro' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
             >
               Movement
             </button>
             <button 
               onClick={() => setActiveTab('books')}
               className={`px-8 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'books' ? 'bg-primary text-white shadow-retro' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
             >
               Library
             </button>
          </div>
        </div>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mt-6 leading-relaxed">
          Nourish your temple. Whether through mindful movement or a transformative read, find the calm you deserve.
        </p>
      </header>

      {activeTab === 'movement' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {yogaRoutines.map((routine, i) => (
            <div 
              key={routine.title} 
              className="reveal-hub reveal bg-white dark:bg-card-dark border-2 border-black rounded-[3rem] p-8 shadow-brutalist hover:shadow-brutalist-hover hover:-translate-y-2 transition-all group flex flex-col"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 ${routine.color} border-2 border-black rounded-2xl flex items-center justify-center mb-6 shadow-brutalist-sm group-hover:rotate-12 transition-transform`}>
                 <span className="material-symbols-outlined text-black">{routine.icon}</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors">{routine.title}</h3>
              <div className="flex items-center gap-3 mb-6">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{routine.duration}</span>
                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{routine.level}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic mb-8 flex-grow">"{routine.desc}"</p>
              <button 
                onClick={() => handleStartRoutine(routine)}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-retro-white hover:scale-105 active:translate-y-1 transition-all"
              >
                Start Routine
              </button>
            </div>
          ))}

          {/* AI Recommended Placeholder */}
          <div className="reveal-hub reveal lg:col-span-2 bg-aura-black p-10 rounded-[3rem] border-2 border-primary/30 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative group [transition-delay:400ms]">
             <div className="relative z-10">
                <h4 className="text-3xl font-display font-bold text-white mb-2">Aura Recommended</h4>
                <p className="text-gray-400 mb-8 italic">Based on your recent mood, TENA suggests a grounding Breathwork session.</p>
                <button 
                  onClick={() => handleStartRoutine({
                    title: 'Aura Breathwork',
                    duration: '5 min',
                    level: 'Essential',
                    color: 'bg-primary',
                    icon: 'air',
                    desc: 'A calming practice to ground your energy.',
                    steps: [
                      "Sit comfortably with your spine tall. Relax your jaw and shoulders.",
                      "Place one hand on your belly and the other on your chest.",
                      "Inhale slowly through your nose for 4 counts, feeling your belly expand.",
                      "Hold your breath gently for 4 counts.",
                      "Exhale through your mouth with a 'whoosh' sound for 4 counts.",
                      "Repeat this cycle for 5 minutes, focusing only on the sensation of air."
                    ]
                  })}
                  className="px-10 py-4 bg-primary text-white border-2 border-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-retro-white"
                >
                  Begin Breathwork
                </button>
             </div>
             <span className="material-symbols-outlined text-[10rem] text-primary/10 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform">air</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {bookList.map((book, i) => (
            <div 
              key={book.title} 
              className="reveal-hub reveal flex flex-col group cursor-pointer"
              style={{ transitionDelay: `${i * 80}ms` }}
              onClick={() => handleOpenBook(book)}
            >
              <div className={`aspect-[3/4] ${book.color} border-2 border-black rounded-tr-[3rem] rounded-bl-[1rem] p-8 shadow-brutalist group-hover:shadow-brutalist-hover group-hover:-translate-y-2 group-hover:-rotate-1 transition-all flex flex-col justify-end relative overflow-hidden mb-6`}>
                 <div className="absolute top-6 left-6 opacity-10 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-4xl">auto_stories</span>
                 </div>
                 <h3 className="text-2xl font-display font-bold text-black leading-tight mb-2">{book.title}</h3>
                 <p className="text-xs font-bold text-gray-600 uppercase tracking-tight">{book.author}</p>
                 <div className="absolute top-0 right-0 w-2 h-full bg-black/5"></div>
              </div>
              <div className="px-2">
                 <span className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1 block">{book.tag}</span>
                 <p className="text-xs text-gray-500 line-clamp-2 italic">"{book.desc}"</p>
              </div>
            </div>
          ))}

          {/* Suggest a Book Card */}
          <div className="reveal-hub reveal aspect-[3/4] border-4 border-dashed border-gray-200 dark:border-white/10 rounded-tr-[3rem] rounded-bl-[1rem] flex flex-col items-center justify-center text-center p-8 group hover:bg-white/5 transition-all [transition-delay:500ms]">
             <span className="material-symbols-outlined text-gray-300 text-5xl mb-4">add_circle</span>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Read something <br/> amazing?</p>
             <button className="mt-6 text-primary font-bold text-[10px] uppercase hover:underline">Suggest a Read</button>
          </div>
        </div>
      )}

      {/* Footer Support */}
      <div className="mt-32 reveal-hub reveal bg-aura-cream dark:bg-white/5 p-12 rounded-[4rem] border-2 border-black shadow-brutalist flex flex-col items-center text-center">
         <span className="material-symbols-outlined text-6xl text-primary mb-6">self_care</span>
         <h4 className="text-3xl font-display font-bold dark:text-white mb-2 italic">Mindful consistency is key.</h4>
         <p className="text-gray-500 max-w-xl mx-auto">Remember, Wellness is a marathon, not a sprint. Take your time with these resources—they are here whenever you need a retreat.</p>
      </div>
    </div>
  );
};

export default WellnessHub;
