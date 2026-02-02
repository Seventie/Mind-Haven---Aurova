import React, { useState } from 'react';
import { AppView } from '../types';
import { authService } from '../services/auth';

interface SignupProps {
  onNavigate: (view: AppView) => void;
  onSignup: (user: any) => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate, onSignup }) => {
  const [authType, setAuthType] = useState<'standard' | 'incognito' | 'specialist'>('standard');
  const [isReviewing, setIsReviewing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nickname: '',
    password: '',
    licenseNumber: '',
    specialization: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const roleMap = { standard: 'user', specialist: 'doctor', incognito: 'anonymous' };
      const role = roleMap[authType];

      const email = authType === 'incognito'
        ? `${(formData.nickname || 'shadow').replace(/\s+/g, '').toLowerCase()}@anonymous.aura`
        : formData.email;

      const displayName = authType === 'incognito'
        ? (formData.nickname || "Shadow Soul")
        : (authType === 'specialist' ? `Dr. ${formData.firstName} ${formData.lastName}` : `${formData.firstName} ${formData.lastName}`);

      const extraData = authType === 'specialist' ? {
        licenseId: formData.licenseNumber,
        specialization: formData.specialization
      } : {};

      const data = await authService.signup(email, formData.password, displayName, role, extraData);

      if (authType === 'specialist') {
        localStorage.setItem('pending_doctor_review', JSON.stringify(data.user));
        setIsReviewing(true);
      } else {
        onSignup({ ...data.user });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      const { signInWithGoogle } = await import('../services/firebaseClient');
      const idToken = await signInWithGoogle();
      const roleMap = { standard: 'user', specialist: 'doctor', incognito: 'anonymous' };
      const data = await authService.googleAuth(idToken, roleMap[authType]);
      onSignup({ ...data.user });
    } catch (err: any) {
      setError(err.message || 'Google Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  if (isReviewing) {
    return (
      <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-card-dark border-4 border-black rounded-[4rem] p-12 md:p-20 shadow-brutalist text-center max-w-2xl relative overflow-hidden">
          <div className="w-24 h-24 bg-card-blue border-2 border-black rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-brutalist-sm">
            <span className="material-symbols-outlined text-4xl text-black">history_toggle_off</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-black dark:text-white mb-6 italic">Profile Under <span className="text-primary not-italic">Review.</span></h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-medium">
            Thank you, Dr. {formData.lastName}. We've received your credentials and license details.
          </p>
          <div className="bg-card-yellow border-2 border-black p-6 rounded-3xl mb-10">
            <p className="text-sm font-bold uppercase tracking-widest text-black flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Expected Verification Time: 5 to 15 mins
            </p>
          </div>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-12">
            You will receive a notification at {formData.email} once your panel access is active.
          </p>
          <button
            onClick={() => onNavigate(AppView.LANDING)}
            className="px-12 py-5 bg-black text-white rounded-2xl font-bold uppercase text-xs tracking-[0.2em] shadow-retro-white hover:scale-105 active:translate-y-1 transition-all"
          >
            Return to Homepage
          </button>

          <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[15rem] text-black/5 pointer-events-none">verified_user</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 max-w-7xl mx-auto px-4 flex flex-col items-center min-h-screen">
      <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight text-center">
        {authType === 'specialist' ? 'Doctor' : 'Join'} <span className="text-primary italic">Aura.</span>
      </h1>
      <p className="text-gray-500 mb-12 font-medium">Your sanctuary for mental wellness.</p>

      <div className="w-full max-w-xl flex flex-col gap-6">
        {/* Identity Selector */}
        <div className="flex flex-wrap bg-white dark:bg-aura-black border-2 border-black rounded-2xl p-1 shadow-retro">
          <button
            type="button"
            onClick={() => setAuthType('standard')}
            className={`flex-1 min-w-[120px] py-3 px-2 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all ${authType === 'standard' ? 'bg-primary text-white shadow-retro' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            User
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

        {/* Google Quick Auth (Only for Standard) */}
        {authType !== 'specialist' && (
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 py-4 bg-white dark:bg-card-dark border-2 border-black rounded-xl font-bold shadow-retro hover:translate-y-[-2px] transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Sign up with Google</span>
          </button>
        )}

        <div className="flex items-center gap-4 py-2">
          <div className="h-0.5 flex-grow bg-black/10 dark:bg-white/10"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">
            {authType === 'specialist' ? 'MEDICAL CREDENTIALS' : 'OR USE CREDENTIALS'}
          </span>
          <div className="h-0.5 flex-grow bg-black/10 dark:bg-white/10"></div>
        </div>

        {/* Main Signup Form */}
        <div className="bg-white dark:bg-card-dark border-2 border-black rounded-3xl p-8 md:p-10 shadow-retro">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {(authType === 'standard' || authType === 'specialist') ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Sarah"
                      className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-white dark:bg-aura-black text-black dark:text-white transition-colors shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Doe"
                      className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-white dark:bg-aura-black text-black dark:text-white transition-colors shadow-sm"
                    />
                  </div>
                </div>

                {authType === 'specialist' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">License No.</label>
                      <input
                        type="text"
                        required
                        value={formData.licenseNumber}
                        onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                        placeholder="MCI-12345"
                        className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-blue-50/50 dark:bg-blue-900/10 text-black dark:text-white transition-colors shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Medical Specialty</label>
                      <select
                        required
                        value={formData.specialization}
                        onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-blue-50/50 dark:bg-blue-900/10 text-black dark:text-white transition-colors shadow-sm font-bold text-xs"
                      >
                        <option value="">Select Specialty</option>
                        <option value="Clinical Psychology">Clinical Psychology</option>
                        <option value="Psychiatry">Psychiatry</option>
                        <option value="Counseling">Counseling</option>
                        <option value="Psychotherapy">Psychotherapy</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Occupational Therapy">Occupational Therapy</option>
                        <option value="Social Work">Social Work</option>
                        <option value="Pediatric Psychiatry">Pediatric Psychiatry</option>
                        <option value="Geriatric Psychiatry">Geriatric Psychiatry</option>
                        <option value="Addiction Specialist">Addiction Specialist</option>
                        <option value="Marriage & Family Therapy">Marriage & Family Therapy</option>
                        <option value="Trauma Specialist">Trauma Specialist</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="dr.doe@clinic.com"
                    className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-white dark:bg-aura-black text-black dark:text-white transition-colors shadow-sm"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Secret Nickname</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.nickname}
                    onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="Shadow_Seeker_01"
                    className="w-full h-14 px-5 rounded-xl border-2 border-black focus:ring-0 focus:border-primary bg-card-yellow/10 dark:bg-white/5 text-black dark:text-white transition-colors shadow-sm font-hand text-lg"
                  />
                  <span className="material-icons-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">visibility_off</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic px-1">This identifier will be used instead of your real name throughout the app.</p>
              </div>
            )}

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

            <div className="mt-4 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 font-bold rounded-xl border-2 border-black shadow-retro-hover hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${authType === 'standard' ? 'bg-primary text-white' : authType === 'specialist' ? 'bg-blue-600 text-white shadow-retro' : 'bg-black text-white'}`}
              >
                <span>{loading ? 'Processing...' : (authType === 'standard' ? 'Join Securely' : authType === 'specialist' ? 'Apply for Doctor Panel' : 'Enter Anonymously')}</span>
                {!loading && <span className="material-symbols-outlined">{authType === 'standard' ? 'check_circle' : authType === 'specialist' ? 'verified_user' : 'shield'}</span>}
                {loading && <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>}
              </button>
              <div className="text-gray-500 font-medium text-center">
                Already have an account? <button type="button" onClick={() => onNavigate(AppView.LOGIN)} className="text-primary font-bold hover:underline">Sign in</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
