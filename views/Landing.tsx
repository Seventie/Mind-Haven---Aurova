
import React, { useEffect } from 'react';
import { AppView } from '../types';

interface LandingProps {
  onStart: () => void;
  onNavigate: (view: AppView) => void;
}

const Landing: React.FC<LandingProps> = ({ onStart, onNavigate }) => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    { color: "bg-card-purple", quote: "Being able to talk without revealing my identity helped me open up for the first time.", author: "Rahul S.", img: "https://picsum.photos/seed/moody/400/300" },
    { color: "bg-card-yellow", quote: "The journaling feature with mood tracking makes me feel so much more in control.", author: "Priya M.", img: "https://picsum.photos/seed/city/400/300" },
    { color: "bg-card-orange", quote: "Our team's productivity and mental wellbeing have seen a massive boost.", author: "Corporate Partner", img: "https://picsum.photos/seed/forest/400/300" },
    { color: "bg-card-blue", quote: "It feels like a community that actually cares, not just another app.", author: "Ananya K.", img: "https://picsum.photos/seed/nature/400/300" },
  ];

  return (
    <div className="bg-aura-cream dark:bg-background-dark overflow-x-hidden">
      {/* Hero Header */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center text-center">
        {/* Animated Background Ornaments */}
        <div className="absolute top-32 left-10 lg:left-32 animate-float opacity-30">
          <svg className="text-primary" fill="currentColor" height="60" viewBox="0 0 24 24" width="60">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"></path>
          </svg>
        </div>
        <div className="absolute top-24 right-10 lg:right-32 animate-spin-slow opacity-20">
          <svg className="text-secondary" height="80" width="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="20 10" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float-slow opacity-20 hidden lg:block">
           <span className="material-symbols-outlined text-6xl text-card-blue transform -rotate-12">cloud</span>
        </div>

        <div className="reveal inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 border-black bg-white dark:bg-card-dark mb-8 shadow-sm hover:shadow-retro transition-all cursor-default group">
          <span className="material-symbols-outlined text-primary text-sm group-hover:scale-125 transition-transform">favorite</span>
          <span className="text-xs font-bold tracking-widest text-gray-800 dark:text-gray-200 uppercase">Mental Health, Reimagined for You.</span>
        </div>

        <h1 className="reveal max-w-4xl mx-auto px-4 mb-6 [transition-delay:200ms]">
          <div className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-gray-900 dark:text-white leading-[1.1] mb-2 tracking-tighter">
            Find your <span className="text-primary italic">calm</span>
          </div>
          <div className="text-6xl md:text-8xl lg:text-9xl font-hand text-gray-900 dark:text-primary transform -rotate-2 mt-4 block">
            in the chaos.
          </div>
        </h1>

        <p className="reveal text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed px-4 [transition-delay:400ms]">
          A safe, private, and stigma-free space for your emotional well-being. Built for real life, real struggles, and real healing.
        </p>

        <div className="reveal flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full px-4 [transition-delay:600ms]">
          <button 
            onClick={onStart}
            className="bg-primary text-white text-lg px-10 py-4 rounded-full border-2 border-black font-bold shadow-retro hover:shadow-retro-hover hover:-translate-y-1 transition-all duration-200"
          >
            Start Your Journey
          </button>
          <button className="bg-white dark:bg-card-dark text-gray-900 dark:text-white text-lg px-10 py-4 rounded-full border-2 border-black font-bold shadow-retro hover:shadow-retro-hover hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">play_circle</span>
            Watch Video
          </button>
        </div>
      </header>

      {/* "Who We Help" Section */}
      <section className="py-32 bg-secondary/5 dark:bg-card-dark/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="reveal text-6xl md:text-8xl font-display font-bold dark:text-white mb-4">
              Your space to <span className="text-primary italic">thrive.</span>
            </h2>
            <p className="reveal text-xl text-gray-500 max-w-3xl mx-auto [transition-delay:200ms]">
              Whatever your journey, wherever you stand—we've designed support specifically for your world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Women Card */}
            <div className="reveal flex flex-col bg-card-blue p-8 rounded-[2.5rem] border-2 border-black shadow-brutalist hover:shadow-brutalist-hover hover:-translate-y-3 transition-all duration-500 group [transition-delay:100ms]">
              <div className="mb-8 w-20 h-20 bg-white border-2 border-black rounded-2xl flex items-center justify-center shadow-brutalist-sm group-hover:rotate-12 transition-transform">
                <span className="material-symbols-outlined text-4xl text-black">self_care</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-black mb-4">For Every Woman</h3>
              <p className="text-gray-800 leading-relaxed mb-8 flex-grow">
                From college students to married professionals and homemakers. We address burnout, identity, and the weight of "doing it all."
              </p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-black/70">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Life-Stage Support
                </li>
                <li className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-black/70">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Confidence & Growth
                </li>
              </ul>
              <button onClick={onStart} className="w-full py-4 bg-black text-white rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-gray-900 transition-colors">
                Explore For Women
              </button>
            </div>

            {/* Teens Card */}
            <div className="reveal flex flex-col bg-card-yellow p-8 rounded-[2.5rem] border-2 border-black shadow-brutalist hover:shadow-brutalist-hover hover:-translate-y-3 transition-all duration-500 group [transition-delay:300ms]">
              <div className="mb-8 w-20 h-20 bg-white border-2 border-black rounded-2xl flex items-center justify-center shadow-brutalist-sm group-hover:-rotate-12 transition-transform">
                <span className="material-symbols-outlined text-4xl text-black">rocket_launch</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-black mb-4">For Modern Teens</h3>
              <p className="text-gray-800 leading-relaxed mb-8 flex-grow">
                Navigating social media, exam pressure, and finding your place. Digital-first support that actually speaks your language.
              </p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-black/70">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Safe Anonymous Spaces
                </li>
                <li className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-black/70">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Self-Discovery Tools
                </li>
              </ul>
              <button onClick={onStart} className="w-full py-4 bg-primary text-white rounded-2xl border-2 border-black font-bold uppercase text-xs tracking-widest hover:bg-orange-600 transition-colors shadow-brutalist-sm">
                Explore For Youth
              </button>
            </div>

            {/* Individuals / Men Card */}
            <div className="reveal flex flex-col bg-card-orange p-8 rounded-[2.5rem] border-2 border-black shadow-brutalist hover:shadow-brutalist-hover hover:-translate-y-3 transition-all duration-500 group [transition-delay:500ms]">
              <div className="mb-8 w-20 h-20 bg-white border-2 border-black rounded-2xl flex items-center justify-center shadow-brutalist-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl text-black">diversity_3</span>
              </div>
              <h3 className="text-3xl font-display font-bold text-black mb-4">For Every Individual</h3>
              <p className="text-gray-800 leading-relaxed mb-8 flex-grow">
                Whether you're a man seeking clarity or an individual who feels unheard—mental health has no gender. Strength starts here.
              </p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-black/70">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Stigma-Free Zone
                </li>
                <li className="flex items-center gap-2 text-sm font-bold uppercase tracking-tight text-black/70">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Personal Reflection
                </li>
              </ul>
              <button onClick={onStart} className="w-full py-4 bg-white text-black rounded-2xl border-2 border-black font-bold uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors">
                Explore For You
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Doctors Section */}
      <section className="py-24 bg-aura-black dark:bg-black/40 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex flex-col lg:flex-row items-center justify-between gap-16 bg-white dark:bg-card-dark p-12 lg:p-20 rounded-[4rem] border-4 border-black shadow-brutalist relative">
               <div className="flex-grow max-w-2xl">
                  <div className="inline-block bg-primary text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border-2 border-black">
                     Expert Network
                  </div>
                  <h3 className="text-5xl lg:text-7xl font-display font-bold text-black dark:text-white mb-6 italic leading-tight">Are you a Mental Health <span className="text-primary not-italic">Doctor?</span></h3>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                     Join India's most innovative empathetic care network. Provide verified sessions, manage your practice, and reach a wider community of souls in need.
                  </p>
                  <div className="flex flex-wrap gap-4">
                     <button 
                        onClick={() => onNavigate(AppView.SIGNUP)} 
                        className="px-10 py-5 bg-black text-white dark:bg-primary font-bold rounded-2xl border-2 border-black shadow-retro-white hover:scale-105 transition-all text-sm uppercase tracking-widest"
                     >
                        Register as Doctor
                     </button>
                     <button 
                        onClick={() => onNavigate(AppView.LOGIN)} 
                        className="px-10 py-5 bg-white text-black font-bold rounded-2xl border-2 border-black shadow-retro hover:bg-gray-50 transition-all text-sm uppercase tracking-widest"
                     >
                        Doctor Login
                     </button>
                  </div>
               </div>
               <div className="shrink-0 relative hidden lg:block">
                  <div className="w-80 h-80 bg-card-blue border-4 border-black rounded-[3rem] rotate-6 shadow-brutalist relative overflow-hidden">
                     <img src="https://picsum.photos/seed/docprof/500/500" className="w-full h-full object-cover grayscale" alt="Doctor" />
                  </div>
                  <span className="material-symbols-outlined absolute -top-8 -left-8 text-8xl text-primary animate-float">clinical_notes</span>
               </div>
            </div>
         </div>
      </section>

      {/* Help Section - Clean transition */}
      <section className="py-24 bg-aura-cream dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="reveal flex flex-col md:flex-row items-center justify-between gap-12 bg-aura-black p-12 rounded-[3rem] border-2 border-primary/30 shadow-2xl">
              <div className="flex-grow">
                <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 italic">Still not sure where to start?</h3>
                <p className="text-gray-400 text-lg">Take our 2-minute "Aura Check" to find the right path for your current needs.</p>
              </div>
              <button 
                onClick={onStart}
                className="shrink-0 px-10 py-5 bg-primary text-white font-bold rounded-2xl border-2 border-white shadow-retro-white hover:scale-105 transition-all text-xl"
              >
                Take the Aura Check
              </button>
           </div>
        </div>
      </section>

      {/* Testimonials Infinite Scroll */}
      <section className="py-32 bg-aura-cream dark:bg-background-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="reveal text-6xl md:text-8xl font-display font-bold text-center dark:text-white leading-tight">
            What they're <span className="text-primary italic">saying...</span>
          </h2>
        </div>
        
        <div className="relative w-full overflow-hidden pause-on-hover py-12">
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-aura-cream dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-aura-cream dark:from-background-dark to-transparent z-10 pointer-events-none"></div>
          
          <div className="animate-marquee flex gap-8 whitespace-nowrap w-max px-4">
            {testimonials.map((t, idx) => (
              <TestimonialCard key={`t1-${idx}`} {...t} />
            ))}
            {testimonials.map((t, idx) => (
              <TestimonialCard key={`t2-${idx}`} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section - Smooth color transition */}
      <section className="py-32 bg-white dark:bg-card-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="reveal-left order-2 lg:order-1">
              <div className="inline-block bg-primary/10 text-primary px-6 py-2 rounded-full text-xs font-bold mb-8 border-2 border-primary/20 tracking-widest uppercase">
                EXPERT CARE
              </div>
              <h2 className="text-6xl font-display font-bold mb-8 dark:text-white leading-tight">Built by doctors who <span className="text-primary italic underline decoration-wavy decoration-2 underline-offset-8">listen.</span></h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                Our clinical protocols are designed by leading psychologists and psychiatrists. We combine medical expertise with human empathy to ensure every interaction is safe, effective, and meaningful.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-card-yellow border-2 border-black flex items-center justify-center group-hover:rotate-12 transition-transform">
                    <span className="material-symbols-outlined text-black text-3xl">psychology</span>
                  </div>
                  <span className="font-bold text-xl text-gray-800 dark:text-gray-200">Licensed Clinical Psychologists</span>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-card-blue border-2 border-black flex items-center justify-center group-hover:-rotate-12 transition-transform">
                    <span className="material-symbols-outlined text-black text-3xl">diversity_1</span>
                  </div>
                  <span className="font-bold text-xl text-gray-800 dark:text-gray-200">Culturally Relevant Therapy</span>
                </div>
              </div>
            </div>
            
            <div className="reveal-right order-1 lg:order-2 relative flex justify-center">
              <div className="relative w-full max-w-lg aspect-[4/5] bg-card-yellow rounded-[4rem] border-2 border-black p-4 shadow-brutalist transform rotate-2 hover:rotate-0 transition-all duration-700">
                <div className="w-full h-full overflow-hidden rounded-[3.5rem] border-2 border-black relative">
                  <img alt="Doctor Portrait" className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700" src="https://picsum.photos/seed/doctor/600/800" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white text-black px-6 py-3 rounded-full border-2 border-black font-bold uppercase text-xs tracking-widest shadow-retro">Meet The Team</button>
                  </div>
                </div>
                <div className="absolute -bottom-8 -left-8 bg-white px-8 py-5 rounded-2xl border-2 border-black shadow-retro transform -rotate-3 z-10">
                  <p className="font-hand text-2xl text-black">"Healing starts here"</p>
                  <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-widest">Dr. Sharma, Lead Psychiatrist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-32 bg-card-purple/10 dark:bg-card-purple/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h2 className="reveal text-5xl md:text-7xl font-display font-bold mb-6 dark:text-white">Find your tribe</h2>
          <p className="reveal text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto [transition-delay:200ms]">Connect with people who understand what you're going through in our moderated, safe communities.</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-10">
          <TribeCard icon="school" title="Student Life" desc="Navigating exams, peer pressure, and future anxiety together." color="bg-card-orange" delay="200" />
          <TribeCard icon="work" title="Work Stress" desc="For professionals dealing with burnout and career challenges." color="bg-card-blue" delay="400" />
          <TribeCard icon="family_restroom" title="Relationships" desc="Discussing family dynamics, dating, and interpersonal growth." color="bg-card-yellow" delay="600" />
        </div>
      </section>

      <footer className="bg-aura-black border-t border-gray-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
               <div className="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-full border-2 border-white">
                <span className="material-symbols-outlined text-xl font-bold">spa</span>
              </div>
              <span className="text-3xl font-display font-bold text-white tracking-tight">aura</span>
            </div>
            <div className="flex gap-8 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Safety</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 text-center">
            <p className="text-gray-600 text-sm">© 2024 Aura Mental Wellness by TENAWell. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const TestimonialCard: React.FC<{ color: string; quote: string; author: string; img: string }> = ({ color, quote, author, img }) => (
  <div className={`shrink-0 w-[380px] md:w-[450px] ${color} rounded-[3rem] p-10 border-2 border-black shadow-brutalist flex flex-col justify-between h-[520px] group transition-all duration-700 whitespace-normal`}>
    <div>
      <span className="text-6xl font-display text-gray-800 opacity-20 group-hover:opacity-100 transition-opacity leading-none">“</span>
      <p className="text-2xl font-medium text-gray-800 mt-2 leading-relaxed italic">
        {quote}
      </p>
    </div>
    <div className="mt-8 border-2 border-black rounded-[2rem] overflow-hidden h-44 w-full relative">
      <img alt={author} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" src={img} />
    </div>
    <div className="mt-8 flex items-center gap-4">
      <div className="h-0.5 w-12 bg-black"></div>
      <div className="font-hand text-2xl text-black">{author}</div>
    </div>
  </div>
);

const TribeCard: React.FC<{ icon: string; title: string; desc: string; color: string; delay: string }> = ({ icon, title, desc, color, delay }) => (
  <div className={`reveal bg-white dark:bg-card-dark p-10 rounded-[2.5rem] border-2 border-black shadow-brutalist hover:shadow-brutalist-hover hover:-translate-y-2 transition-all duration-500 [transition-delay:${delay}ms]`}>
    <div className={`w-16 h-16 ${color} rounded-2xl border-2 border-black flex items-center justify-center mb-8 shadow-brutalist-sm group-hover:rotate-6 transition-transform`}>
      <span className="material-symbols-outlined text-black text-3xl">{icon}</span>
    </div>
    <h3 className="font-bold text-3xl mb-4 dark:text-white font-display">{title}</h3>
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{desc}</p>
    <div className="flex -space-x-3">
      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?u=1" /></div>
      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?u=2" /></div>
      <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"><img src="https://i.pravatar.cc/100?u=3" /></div>
      <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">+1k</div>
    </div>
  </div>
);

export default Landing;
