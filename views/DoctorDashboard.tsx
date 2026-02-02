
import React, { useState, useMemo, useEffect } from 'react';
import { Meeting } from '../types';
import { doctorService } from '../services/doctorService';

interface Slot {
  _id?: string;
  startTime: string;
  endTime: string;
  duration?: number;
  status: 'available' | 'booked' | 'in-progress' | 'completed' | 'off';
  sessionType: 'Video' | 'Voice' | 'Chat';
  patientId?: any;
  lockExpires?: Date | string;
  clinicalFormData?: {
    formId: string;
    title: string;
    responses: any;
    filledAt: string;
  };
}

interface DailySchedule {
  date: string;
  slots: Slot[];
}

interface DoctorDashboardProps {
  name: string;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ name }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'patients' | 'availability'>('schedule');
  const [profile, setProfile] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedForm, setSelectedForm] = useState<any>(null);

  const [dailySchedules, setDailySchedules] = useState<DailySchedule[]>([]);
  const [viewDate, setViewDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    specialization: '',
    experienceYears: 0,
    education: '',
    bio: '',
    profileImage: ''
  });

  const [setupConfig, setSetupConfig] = useState({
    startTime: '09:00',
    endTime: '17:00',
    gracePeriod: 5,
    slotDuration: 30
  });

  // Fetch Data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prof, cons] = await Promise.all([
        doctorService.getProfile(),
        doctorService.getConsultations()
      ]);
      setProfile(prof);
      setConsultations(cons);
      setDailySchedules(prof.dailySchedules || []);
      setEditForm({
        fullName: prof.fullName,
        specialization: prof.specialization,
        experienceYears: prof.experienceYears,
        education: prof.education || 'Medical Degree',
        bio: prof.bio,
        profileImage: prof.profileImage || ''
      });
    } catch (err) {
      console.error("Failed to fetch doctor data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctorService.updateProfile(editForm);
      await fetchData();
      setIsEditingProfile(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

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

  const generateSlots = (startStr: string, endStr: string, slotMinutes: number, graceMinutes: number) => {
    const slots: Slot[] = [];
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);

    const start = new Date(2000, 0, 1, startH, startM);
    const end = new Date(2000, 0, 1, endH, endM);

    let current = new Date(start);

    while (new Date(current.getTime() + slotMinutes * 60000) <= end) {
      const slotEnd = new Date(current.getTime() + slotMinutes * 60000);

      slots.push({
        startTime: current.toTimeString().slice(0, 5),
        endTime: slotEnd.toTimeString().slice(0, 5),
        duration: slotMinutes,
        status: 'available',
        sessionType: 'Video'
      });

      current = new Date(slotEnd.getTime() + Math.max(2, graceMinutes) * 60000);
    }
    return slots;
  };

  const selectDate = (day: number) => {
    const d = new Date(calendarData.year, calendarData.month, day);
    const dateStr = d.toLocaleDateString('en-CA');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date();
    limit.setDate(today.getDate() + 7);
    limit.setHours(23, 59, 59, 999);

    if (d < today || d > limit) {
      alert("Scheduling is allowed only for the next 7 days.");
      return;
    }
    setSelectedDate(dateStr);
  };

  const toggleSlotType = (index: number) => {
    if (!selectedDate) return;
    setDailySchedules(prev => {
      const day = prev.find(d => d.date === selectedDate);
      if (!day) return prev;

      const newSlots = [...day.slots];
      const slot = newSlots[index];

      // Don't modify booked slots here
      if (slot.status === 'booked' || slot.status === 'in-progress') return prev;

      const types: ('Video' | 'Voice' | 'Chat')[] = ['Video', 'Voice', 'Chat'];
      if (slot.status === 'available') {
        const nextTypeIndex = (types.indexOf(slot.sessionType) + 1);
        if (nextTypeIndex < types.length) {
          slot.sessionType = types[nextTypeIndex];
        } else {
          slot.status = 'off';
        }
      } else {
        slot.status = 'available';
        slot.sessionType = 'Video';
      }

      return prev.map(d => d.date === selectedDate ? { ...d, slots: newSlots } : d);
    });
  };

  const handleApplyBaseSlots = () => {
    if (!selectedDate) return;
    const newSlots = generateSlots(setupConfig.startTime, setupConfig.endTime, setupConfig.slotDuration, setupConfig.gracePeriod);

    setDailySchedules(prev => {
      const existingDay = prev.find(d => d.date === selectedDate);
      if (!existingDay) {
        return [...prev, { date: selectedDate, slots: newSlots }];
      }

      // Protect important slots
      const protectedSlots = existingDay.slots.filter(s => s.status === 'booked' || s.status === 'in-progress');
      const merged = [...newSlots];
      protectedSlots.forEach(ps => {
        const idx = merged.findIndex(ms => ms.startTime === ps.startTime);
        if (idx !== -1) merged[idx] = ps;
        else merged.push(ps);
      });
      merged.sort((a, b) => a.startTime.localeCompare(b.startTime));
      return prev.map(d => d.date === selectedDate ? { ...d, slots: merged } : d);
    });
  };

  const handleClearSlots = () => {
    if (!selectedDate) return;

    setDailySchedules(prev => {
      const existingDay = prev.find(d => d.date === selectedDate);
      if (!existingDay) return prev;

      const protectedSlots = existingDay.slots.filter(s => s.status === 'booked' || s.status === 'in-progress');

      if (protectedSlots.length > 0) {
        alert("Cannot clear schedule with active bookings.");
        return prev;
      }

      return prev.filter(d => d.date !== selectedDate);
    });

    setSelectedDate(null);
  };

  const handlePostSchedule = async () => {
    try {
      console.log('🔄 Starting sync...');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Clean up past dates
      const cleaned = dailySchedules.filter(d => new Date(d.date) >= today);

      // Ensure all slots have required fields
      const formattedSchedules = cleaned.map(day => ({
        date: day.date,
        slots: day.slots.map(slot => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          duration: slot.duration || setupConfig.slotDuration,
          status: slot.status || 'available',
          sessionType: slot.sessionType || 'Video',
          ...(slot.patientId && { patientId: slot.patientId }),
          ...(slot.lockExpires && { lockExpires: slot.lockExpires }),
          ...(slot.clinicalFormData && { clinicalFormData: slot.clinicalFormData })
        }))
      }));

      console.log('📤 Sending data:', JSON.stringify(formattedSchedules, null, 2));

      await doctorService.updateProfile({ dailySchedules: formattedSchedules });

      console.log('✅ Sync successful');
      alert("Practice schedule synchronized successfully!");

      // Refresh to get latest data from server
      await fetchData();

    } catch (err: any) {
      console.error('❌ Sync Error:', err);
      console.error('Response:', err.response?.data);

      const serverMessage = err.response?.data?.message || err.message;
      alert(`Synchronization Failed: ${serverMessage}`);
    }
  };

  const renderSchedule = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Profile & Stats Sidebar Layout */}
      <div className="grid lg:grid-cols-12 gap-8">

        {/* Profile Card */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-card-dark border-4 border-black p-10 rounded-[3rem] shadow-brutalist relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
              <div className="relative group">
                <div className="w-40 h-40 rounded-[2.5rem] border-4 border-black shadow-brutalist-sm overflow-hidden bg-aura-cream">
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-card-blue">
                      <span className="material-symbols-outlined text-6xl text-black">person</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-white border-2 border-black rounded-xl flex items-center justify-center shadow-brutalist-sm hover:scale-110 transition-all">
                  <span className="material-symbols-outlined text-xl">edit</span>
                </button>
              </div>

              <div className="flex-grow space-y-4">
                <div className="space-y-1">
                  <h2 className="text-5xl font-display font-bold text-black dark:text-white">{profile?.fullName || name}</h2>
                  <p className="text-xl font-bold text-primary italic">{profile?.specialization}</p>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                  <span className="px-4 py-2 bg-aura-cream border-2 border-black rounded-xl text-[10px] font-bold uppercase tracking-widest">{profile?.experienceYears} Years Exp</span>
                  <span className="px-4 py-2 bg-card-blue border-2 border-black rounded-xl text-[10px] font-bold uppercase tracking-widest">{profile?.education || 'Medical Degree'}</span>
                </div>

                <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
                  {profile?.bio || 'Professional medical practitioner specialized in patient-centric care.'}
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Consultations */}
          <div className="space-y-6">
            <h3 className="text-3xl font-display font-bold dark:text-white italic">Upcoming <span className="text-primary not-italic">Encounters.</span></h3>
            <div className="grid gap-6">
              {consultations.filter(c => c.status === 'upcoming').length > 0 ? consultations.filter(c => c.status === 'upcoming').map((session) => (
                <div key={session._id} className="bg-white dark:bg-card-dark border-2 border-black p-8 rounded-[2.5rem] shadow-brutalist flex flex-col md:flex-row items-center gap-8 hover:translate-x-2 transition-all">
                  <div className="w-16 h-16 bg-card-yellow border-2 border-black rounded-2xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-black text-2xl">event_upcoming</span>
                  </div>
                  <div className="flex-grow">
                    <h5 className="text-xl font-display font-bold dark:text-white">{session.patientId?.displayName || 'Unknown Patient'}</h5>
                    <div className="flex gap-4 mt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">calendar_month</span> {new Date(session.scheduledTime).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">schedule</span> {new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      doctorService.getPatientSummary(session.patientId?._id).then(setSelectedPatient);
                    }}
                    className="px-6 py-4 bg-black text-white border-2 border-black rounded-xl font-bold uppercase text-[10px] shadow-retro">
                    Clinical Deck
                  </button>
                </div>
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-black/10 rounded-[2.5rem]">
                  <p className="font-bold text-gray-400 italic">No upcoming patient interactions.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats & Reviews Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card-blue border-2 border-black p-6 rounded-[2rem] shadow-brutalist flex flex-col items-center justify-center text-center">
              <p className="text-[9px] font-bold text-black/40 uppercase tracking-tighter mb-2">Total Earnings</p>
              <p className="text-3xl font-display font-bold text-black">${profile?.stats?.amountEarned || 0}</p>
            </div>
            <div className="bg-secondary border-2 border-black p-6 rounded-[2rem] shadow-brutalist flex flex-col items-center justify-center text-center">
              <p className="text-[9px] font-bold text-black/40 uppercase tracking-tighter mb-2">Meetings</p>
              <p className="text-3xl font-display font-bold text-black">{profile?.stats?.meetingsTaken || 0}</p>
            </div>
            <div className="bg-card-yellow border-2 border-black p-6 rounded-[2rem] shadow-brutalist flex flex-col items-center justify-center text-center col-span-2">
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className="material-symbols-outlined text-black text-sm">{s <= (profile?.stats?.avgRating || 0) ? 'star' : 'star_outline'}</span>
                ))}
              </div>
              <p className="text-3xl font-display font-bold text-black">{profile?.stats?.avgRating || 0}<span className="text-sm">/5.0</span></p>
              <p className="text-[9px] font-bold text-black/40 uppercase tracking-tighter">Avg Patient Satisfaction</p>
            </div>
          </div>

          {/* Patient Feedback */}
          <div className="bg-white dark:bg-card-dark border-2 border-black p-8 rounded-[2.5rem] shadow-brutalist">
            <h4 className="text-xl font-display font-bold mb-6 italic">Patient <span className="text-primary not-italic">Voices.</span></h4>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {profile?.reviews && profile.reviews.length > 0 ? profile.reviews.map((rev: any, i: number) => (
                <div key={i} className="space-y-2 border-b-2 border-black/5 pb-4 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-black dark:text-white">{rev.patientName || 'Anonymous'}</span>
                    <span className="text-[9px] text-gray-400 font-bold">{new Date(rev.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span key={s} className="material-symbols-outlined text-xs text-secondary">{s <= rev.rating ? 'star' : 'star_outline'}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 italic">"{rev.comment}"</p>
                </div>
              )) : (
                <p className="text-xs text-gray-400 italic">No reviews yet. New practices take time to flourish.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAvailability = () => {
    const selectedDaySchedule = selectedDate ? dailySchedules.find(ds => ds.date === selectedDate) : null;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Calendar Section */}
          <div className={`lg:col-span-6 bg-white dark:bg-card-dark border-4 border-black rounded-[3rem] shadow-brutalist overflow-hidden`}>
            <div className="p-8 bg-aura-cream border-b-2 border-black/10 flex items-center justify-between">
              <h3 className="text-3xl font-display font-bold italic">{calendarData.monthName} <span className="text-primary not-italic">{calendarData.year}</span></h3>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center bg-white shadow-brutalist-sm hover:translate-y-[-2px] transition-all"><span className="material-symbols-outlined">chevron_left</span></button>
                <button onClick={handleNextMonth} className="w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center bg-white shadow-brutalist-sm hover:translate-y-[-2px] transition-all"><span className="material-symbols-outlined">chevron_right</span></button>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-7 gap-4 text-center text-[9px] font-bold text-gray-400 mb-6 uppercase tracking-[0.2em]">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>

              <div className="grid grid-cols-7 gap-4">
                {calendarData.days.map((day, idx) => {
                  if (day === null) return <div key={`empty-${idx}`} className="aspect-square"></div>;
                  const d = new Date(calendarData.year, calendarData.month, day);
                  const dateStr = d.toLocaleDateString('en-CA');
                  const daySchedule = dailySchedules.find(ds => ds.date === dateStr);
                  const isSelected = selectedDate === dateStr;

                  const today = new Date(); today.setHours(0, 0, 0, 0);
                  const limit = new Date(); limit.setDate(today.getDate() + 7);
                  const isClickable = d >= today && d <= limit;

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => selectDate(day)}
                      disabled={!isClickable}
                      className={`aspect-square flex flex-col items-center justify-center rounded-2xl border-2 transition-all relative ${!isClickable ? 'opacity-20 grayscale cursor-not-allowed' : isSelected ? 'bg-primary text-white border-black shadow-brutalist scale-110' : daySchedule ? 'bg-aura-cream border-black hover:border-primary' : 'bg-white border-gray-100 hover:border-black'}`}
                    >
                      <span className="text-xl font-display font-bold">{day}</span>
                      {daySchedule && !isSelected && <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse shadow-sm" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Slot Setup Panel */}
          <div className="lg:col-span-6 bg-white dark:bg-card-dark border-4 border-black rounded-[3rem] shadow-brutalist overflow-hidden">
            {selectedDate ? (
              <>
                <div className="p-8 bg-black text-white border-b-2 border-black flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-display font-bold">Slot Architect</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <button onClick={() => setSelectedDate(null)} className="w-10 h-10 bg-white text-black border-2 border-black rounded-xl hover:rotate-90 transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="p-10 space-y-10">
                  {/* Setup Controls */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Start</label>
                      <input type="time" value={setupConfig.startTime} onChange={e => setSetupConfig({ ...setupConfig, startTime: e.target.value })} className="w-full h-11 px-3 border-2 border-black rounded-xl font-bold text-xs" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block ml-1">End</label>
                      <input type="time" value={setupConfig.endTime} onChange={e => setSetupConfig({ ...setupConfig, endTime: e.target.value })} className="w-full h-11 px-3 border-2 border-black rounded-xl font-bold text-xs" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Slot(m)</label>
                      <input type="number" value={setupConfig.slotDuration} onChange={e => setSetupConfig({ ...setupConfig, slotDuration: Number(e.target.value) })} className="w-full h-11 px-3 border-2 border-black rounded-xl font-bold text-xs" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Grace</label>
                      <input type="number" value={setupConfig.gracePeriod} onChange={e => setSetupConfig({ ...setupConfig, gracePeriod: Number(e.target.value) })} className="w-full h-11 px-3 border-2 border-black rounded-xl font-bold text-xs" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <h4 className="text-xl font-display font-bold italic">Generated <span className="text-primary not-italic">Slots.</span></h4>
                      <button onClick={handleApplyBaseSlots} className="px-4 py-2 bg-secondary text-black border-2 border-black rounded-xl font-bold text-[9px] uppercase shadow-brutalist-sm hover:translate-y-[-2px] transition-all">Apply Parameters</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 custom-scrollbar border-2 border-black/5 rounded-[2rem] bg-aura-cream">
                      {selectedDaySchedule?.slots.map((s, i) => {
                        let typeIcon = 'videocam';
                        let typeColor = 'bg-primary';
                        let typeLabel = 'Video';
                        if (s.sessionType === 'Voice') { typeIcon = 'mic'; typeColor = 'bg-secondary'; typeLabel = 'Audio'; }
                        if (s.sessionType === 'Chat') { typeIcon = 'chat'; typeColor = 'bg-card-blue'; typeLabel = 'Text'; }
                        if (s.status === 'off') { typeIcon = 'block'; typeColor = 'bg-gray-200 grayscale'; typeLabel = 'Off'; }

                        const isBooked = s.status === 'booked' || s.status === 'in-progress';

                        return (
                          <div
                            key={i}
                            onClick={() => !isBooked && toggleSlotType(i)}
                            className={`p-5 border-2 border-black rounded-2xl flex flex-col gap-3 transition-all shadow-brutalist-sm relative overflow-hidden ${isBooked ? 'bg-black text-white' : 'bg-white hover:scale-105 cursor-pointer'}`}
                          >
                            <div className="flex justify-between items-start z-10">
                              <div className={`p-2 rounded-lg border-2 border-black transition-colors ${isBooked ? 'bg-white/20' : typeColor}`}>
                                <span className="material-symbols-outlined text-sm font-bold text-white">{isBooked ? 'lock' : typeIcon}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold leading-none">{s.startTime} - {s.endTime}</p>
                                <p className="text-[8px] font-bold opacity-50 mt-1">{s.duration || setupConfig.slotDuration} MINS</p>
                              </div>
                            </div>

                            <div className="z-10 mt-auto flex justify-between items-center">
                              <span className="text-[9px] font-black uppercase tracking-widest">{isBooked ? 'Booked Session' : typeLabel}</span>
                              {isBooked && (
                                <span className="text-[10px] font-bold border-b border-primary text-primary">{s.patientId?.displayName || 'Reserved'}</span>
                              )}
                            </div>

                            {isBooked && s.clinicalForm && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedForm(s.clinicalForm); }}
                                className="z-20 mt-2 py-1.5 bg-primary text-black text-[8px] font-bold uppercase rounded-lg border border-black shadow-brutalist-sm hover:scale-105 transition-all">
                                View Clinical Form
                              </button>
                            )}

                            {!isBooked && (
                              <div className="absolute top-1 right-1 opacity-10">
                                <span className="material-symbols-outlined text-4xl">edit</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {!selectedDaySchedule?.slots.length && (
                        <div className="col-span-full py-10 text-center opacity-40">
                          <p className="text-xs font-bold italic">Set parameters above and "Apply" to create slots.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t-2 border-black/5 flex gap-4">
                    <button onClick={handlePostSchedule} className="flex-grow py-5 bg-black text-white border-2 border-black rounded-2xl font-bold uppercase text-xs shadow-retro hover:scale-105 transition-all">Synchronize Everything</button>
                    <button onClick={handleClearSlots} className="px-8 py-5 border-2 border-black rounded-2xl font-bold uppercase text-xs hover:bg-red-50 transition-all">Purge Day</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-6">
                <div className="w-24 h-24 bg-aura-cream border-2 border-dashed border-black rounded-full flex items-center justify-center opacity-30">
                  <span className="material-symbols-outlined text-4xl">calendar_month</span>
                </div>
                <div>
                  <h3 className="text-2xl font-display font-medium text-gray-400">Select a date to</h3>
                  <h3 className="text-2xl font-display font-bold text-black dark:text-white">Orchestrate Availability</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-aura-cream dark:bg-aura-black">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-primary rounded-full" />
        <p className="font-display font-bold text-xl">Loading Clinical Workspace...</p>
      </div>
    </div>
  );

  return (
    <div className="pt-28 pb-40 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-aura-cream dark:bg-background-dark min-h-screen relative font-sans">

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-card-dark border-4 border-black rounded-[3rem] shadow-brutalist w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-8 bg-aura-cream border-b-2 border-black flex justify-between items-center">
              <h2 className="text-3xl font-display font-bold italic">Update <span className="text-primary not-italic">Identity.</span></h2>
              <button onClick={() => setIsEditingProfile(false)} className="w-10 h-10 border-2 border-black rounded-xl flex items-center justify-center"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-10 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Full Name</label>
                  <input type="text" value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} className="w-full h-12 px-4 border-2 border-black rounded-xl font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Specialization</label>
                  <input type="text" value={editForm.specialization} onChange={e => setEditForm({ ...editForm, specialization: e.target.value })} className="w-full h-12 px-4 border-2 border-black rounded-xl font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Exp Years</label>
                  <input type="number" value={editForm.experienceYears} onChange={e => setEditForm({ ...editForm, experienceYears: Number(e.target.value) })} className="w-full h-12 px-4 border-2 border-black rounded-xl font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">Education</label>
                  <input type="text" value={editForm.education} onChange={e => setEditForm({ ...editForm, education: e.target.value })} className="w-full h-12 px-4 border-2 border-black rounded-xl font-bold" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Profile Image URL</label>
                <input type="text" value={editForm.profileImage} onChange={e => setEditForm({ ...editForm, profileImage: e.target.value })} className="w-full h-12 px-4 border-2 border-black rounded-xl font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Bio</label>
                <textarea value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} rows={4} className="w-full p-4 border-2 border-black rounded-xl font-bold text-sm resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-5 bg-primary text-white border-2 border-black rounded-2xl font-bold uppercase text-xs shadow-retro hover:translate-y-[-2px] transition-all">Save Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Clinical Form Modal */}
      {selectedForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-card-dark border-4 border-black rounded-[4rem] shadow-brutalist w-full max-w-xl overflow-hidden flex flex-col">
            <div className="p-10 bg-aura-cream border-b-2 border-black flex justify-between items-center">
              <h2 className="text-3xl font-display font-bold italic">Patient <span className="text-primary not-italic">Intake.</span></h2>
              <button onClick={() => setSelectedForm(null)} className="w-12 h-12 border-2 border-black rounded-2xl flex items-center justify-center shadow-brutalist-sm"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-12 overflow-y-auto max-h-[70vh] space-y-8">
              <div className="pb-4 border-b-2 border-black/5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Form Title</p>
                <p className="text-xl font-bold">{selectedForm.title || "Pre-Session Assessment"}</p>
              </div>
              <div className="space-y-6">
                {Object.entries(selectedForm.data || {}).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">{key.replace(/_/g, ' ')}</p>
                    <div className="p-6 bg-aura-cream rounded-2xl border-2 border-black italic font-medium">
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[9px] font-bold text-gray-400 uppercase text-center pt-8 border-t-2 border-black/5">Submitted on {new Date(selectedForm.filledAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Header */}
      <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border-2 border-black">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Live Clinical Suite
          </div>
          <h1 className="text-6xl lg:text-8xl font-display font-bold text-black dark:text-white leading-[0.9]">
            Studio. <span className="italic text-primary">Doctor.</span>
          </h1>
          <p className="text-xl text-gray-500 mt-6 font-medium italic">Welcome back, {profile?.fullName?.split(' ')[0]}. Here is your practice at a glance.</p>
        </div>

        <div className="flex bg-white dark:bg-card-dark border-4 border-black rounded-[2.5rem] p-2 shadow-brutalist items-center">
          <button onClick={() => setActiveTab('schedule')} className={`px-10 py-5 rounded-[1.8rem] font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'schedule' ? 'bg-primary text-white shadow-retro' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('availability')} className={`px-10 py-5 rounded-[1.8rem] font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'availability' ? 'bg-primary text-white shadow-retro' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400'}`}>Availability</button>
          <button onClick={() => setActiveTab('patients')} className={`px-10 py-5 rounded-[1.8rem] font-bold uppercase text-[10px] tracking-widest transition-all ${activeTab === 'patients' ? 'bg-primary text-white shadow-retro' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400'}`}>Patient Vault</button>
        </div>
      </header>

      <main>
        {activeTab === 'schedule' && renderSchedule()}
        {activeTab === 'availability' && renderAvailability()}
        {activeTab === 'patients' && (
          <div className="py-40 text-center border-4 border-dashed border-black/10 rounded-[4rem]">
            <span className="material-symbols-outlined text-8xl text-gray-200 mb-6">database</span>
            <p className="text-2xl font-display font-bold text-gray-300 uppercase tracking-[0.2em]">Archival Data Synchronization in Progress</p>
            <p className="text-gray-400 italic mt-2">Extended patient clinical histories are being moved to the new Daily Records standard.</p>
          </div>
        )}
      </main>

      {/* Patient Summary Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-card-dark border-4 border-black rounded-[4rem] shadow-brutalist w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-10 border-b-2 border-black/10 flex justify-between items-center bg-aura-cream">
              <div>
                <h2 className="text-4xl font-display font-bold">Clinical File: {selectedPatient.patient?.displayName}</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedPatient.patient?.email}</p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="w-14 h-14 bg-white border-2 border-black rounded-2xl flex items-center justify-center shadow-brutalist-sm hover:rotate-90 transition-all">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-12 overflow-y-auto space-y-12 custom-scrollbar">
              <div>
                <p className="font-display font-bold text-primary mb-6 uppercase tracking-[0.2em] text-sm">Psychological Trajectory</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {selectedPatient.insights.filter((ins: any) => ins.mood).map((ins: any, i: number) => (
                    <div key={i} className="p-6 bg-aura-cream dark:bg-white/5 rounded-3xl border-2 border-black shadow-brutalist-sm transform hover:rotate-2 transition-transform">
                      <p className="text-[10px] font-bold text-gray-500 mb-4">{new Date(ins.date).toLocaleDateString()}</p>
                      <p className="text-2xl font-bold text-black dark:text-white uppercase tracking-tighter">{ins.mood}</p>
                      <div className="mt-4 flex gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, Math.floor(ins.score || 5)).map(s => (
                          <div key={s} className="w-1.5 h-4 bg-primary rounded-full" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-display font-bold text-primary mb-6 uppercase tracking-[0.2em] text-sm">Journal Reflexes</p>
                <div className="space-y-6">
                  {selectedPatient.journals.map((j: any) => (
                    <div key={j.id} className="p-8 bg-white border-2 border-black rounded-[2.5rem] shadow-brutalist-sm italic text-gray-600 leading-relaxed">
                      "{j.content}"
                      <div className="mt-6 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-primary not-italic">
                        <span>AI Decoding: {j.aiAnalysis?.mood || 'Neutral'}</span>
                        <span className="text-gray-300">{new Date(j.date).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
