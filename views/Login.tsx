import React, { useState } from 'react';
import { AppView } from '../types';
import { authService } from '../services/auth';

interface LoginProps {
  onNavigate: (view: AppView) => void;
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [authType, setAuthType] = useState<'standard' | 'incognito' | 'specialist'>('standard');
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const email = authType === 'incognito'
        ? `${formData.identifier.replace(/\s+/g, '').toLowerCase()}@anonymous.aura`
        : formData.identifier;

      const data = await authService.login(email, formData.password);
      onLogin({ ...data.user });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const { signInWithGoogle } = await import('../services/firebaseClient');
      const idToken = await signInWithGoogle();
      const roleMap = { standard: 'user', specialist: 'doctor', incognito: 'anonymous' };
      const data = await authService.googleAuth(idToken, roleMap[authType]);
      onLogin({ ...data.user });
    } catch (err: any) {
      setError(err.message || 'Google Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 flex flex-col items-center min-h-screen">
      <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight text-center">
        Welcome <span className="text-primary italic">Back.</span>
      </h1>
      <p className="text-gray-500 mb-12 font-medium">Continue your journey where you left off.</p>

      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* Identity Selector */}
        <div className="flex flex-wrap bg-white dark:bg-aura-black border-2 border-black rounded-2xl p-1 shadow-retro">
          <button
            type="button"
            onClick={() => setAuthType('standard')}
            className={`flex-1 min-w-[120px] py-3 px-2 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${authType === 'standard' ? 'bg-primary text-white shadow-retro' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setAuthType('incognito')}
            className={`flex-1 min-w-[120px] py-3 px-2 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${authType === 'incognito' ? 'bg-black text-white shadow-retro' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            Anonymous
          </button>
          <button
            type="button"
            onClick={() => setAuthType('specialist')}
            className={`flex-1 min-w-[120px] py-3 px-2 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${authType === 'specialist' ? 'bg-blue-600 text-white shadow-retro' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            Doctor
          </button>
        </div>

        {/* Google Quick Login (Not for Doctors) */}
        {authType !== 'specialist' && (
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 py-4 bg-white dark:bg-card-dark border-2 border-black rounded-xl font-bold shadow-retro hover:translate-y-[-2px] transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Login with Google</span>
          </button>
        )}

        <div className="flex items-center gap-4 py-2">
          <div className="h-0.5 flex-grow bg-black/10 dark:bg-white/10"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">OR USE CREDENTIALS</span>
          <div className="h-0.5 flex-grow bg-black/10 dark:bg-white/10"></div>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-card-dark border-2 border-black rounded-3xl p-8 md:p-10 shadow-retro">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                {authType === 'standard' ? 'Email or Username' : authType === 'specialist' ? 'Doctor ID / Email' : 'Secret Nickname'}
              </label>
              <input
                type="text"
                required
                value={formData.identifier}
                onChange={e => setFormData({ ...formData, identifier: e.target.value })}
                placeholder={authType === 'standard' ? 'your@email.com' : authType === 'specialist' ? 'dr.name@clinic.com' : 'Your_Shadow_ID'}
                className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-white dark:bg-aura-black text-black dark:text-white transition-colors shadow-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-white dark:bg-aura-black text-black dark:text-white transition-colors shadow-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => onNavigate(AppView.FORGOT_PASSWORD)} className="text-sm font-bold text-gray-400 hover:text-primary transition-colors">
                Forgot password?
              </button>
            </div>

            <div className="mt-4 pt-6 border-t border-gray-100 flex flex-col items-center gap-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 font-bold rounded-xl border-2 border-black shadow-retro hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${authType === 'standard' ? 'bg-primary text-white' : authType === 'specialist' ? 'bg-blue-600 text-white shadow-retro' : 'bg-black text-white'}`}
              >
                <span>{loading ? 'Processing...' : (authType === 'standard' ? 'Sign In' : authType === 'specialist' ? 'Doctor Dashboard Login' : 'Unlock Identity')}</span>
                {!loading && <span className="material-symbols-outlined">{authType === 'standard' ? 'login' : authType === 'specialist' ? 'clinical_notes' : 'key'}</span>}
                {loading && <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>}
              </button>
              <div className="text-gray-500 font-medium text-center">
                {authType === 'specialist' ? "Not a doctor yet? " : "Don't have an account? "}
                <button type="button" onClick={() => onNavigate(AppView.SIGNUP)} className="text-primary font-bold hover:underline">
                  {authType === 'specialist' ? "Register here" : "Join Now"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
