
import React from 'react';
import { AppView } from '../types';

interface ResetPasswordProps {
  onNavigate: (view: AppView) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 flex flex-col items-center min-h-screen">
      <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white mb-12 tracking-tight text-center">
        Reset Password
      </h1>
      
      <div className="w-full max-w-xl bg-white dark:bg-card-dark border-2 border-black rounded-3xl p-8 md:p-12 shadow-retro relative z-10">
        <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onNavigate(AppView.LOGIN); }}>
          <div className="space-y-6">
            <input type="password" placeholder="New Password*" required className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-white dark:bg-aura-black text-black dark:text-white" />
            <input type="password" placeholder="Confirm New Password*" required className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-white dark:bg-aura-black text-black dark:text-white" />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button type="submit" className="w-full md:w-auto px-10 py-3 bg-black text-white font-bold rounded-xl border-2 border-black shadow-retro-white hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
              <span>Reset Password</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
