
import React from 'react';
import { AppView } from '../types';

interface CheckEmailProps {
  onNavigate: (view: AppView) => void;
}

const CheckEmail: React.FC<CheckEmailProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-card-dark border-2 border-black rounded-3xl p-8 md:p-12 shadow-retro text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 dark:bg-primary/20 mb-6 text-primary animate-pulse border-2 border-black">
            <span className="material-symbols-outlined text-5xl">mark_email_unread</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Check your email
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg leading-relaxed">
            We've sent a password reset link to your email. Please check your inbox (and spam folder).
          </p>
          
          <button 
            onClick={() => onNavigate(AppView.RESET_PASSWORD)}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl border-2 border-black shadow-retro-hover hover:scale-105 transition-all flex items-center justify-center gap-2 mb-4"
          >
            <span>Open email app</span>
            <span className="material-symbols-outlined">open_in_new</span>
          </button>
          
          <div className="text-gray-500 text-sm mb-8">
            Didn't receive the email? <button className="text-primary font-bold hover:underline">Click to resend</button>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
            <button onClick={() => onNavigate(AppView.LOGIN)} className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors group">
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Back to log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
