
import React from 'react';
import { AppView } from '../types';

interface ForgotPasswordProps {
  onNavigate: (view: AppView) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 flex flex-col items-center min-h-screen">
      <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white mb-12 tracking-tight text-center">
        Forgot password
      </h1>
      
      <div className="w-full max-w-xl bg-white dark:bg-card-dark border-2 border-black rounded-3xl p-8 md:p-12 shadow-retro relative z-10">
        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            Enter the email address associated with your account and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onNavigate(AppView.CHECK_EMAIL); }}>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-black dark:text-white ml-1 text-sm uppercase tracking-widest">Email address</label>
            <input type="email" placeholder="Enter your email" required className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-white dark:bg-aura-black text-black dark:text-white" />
          </div>
          
          <div className="mt-4">
            <button type="submit" className="w-full py-4 bg-black text-white font-bold rounded-xl border-2 border-black shadow-retro-white hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
              <span>Send Reset Link</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button type="button" onClick={() => onNavigate(AppView.LOGIN)} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
              Return to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
