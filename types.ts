
export enum AppView {
  LANDING = 'landing',
  DASHBOARD = 'dashboard',
  DOCTOR_DASHBOARD = 'doctor_dashboard',
  JOURNAL = 'journal',
  CHAT = 'chat',
  REPORTS = 'reports',
  COMMUNITY = 'community',
  EXPERTS = 'experts',
  RESOURCES = 'resources',
  SOUL_FEED = 'soul_feed',
  LOGIN = 'login',
  SIGNUP = 'signup',
  FORGOT_PASSWORD = 'forgot_password',
  CHECK_EMAIL = 'check_email',
  RESET_PASSWORD = 'reset_password'
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  analysis?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MoodData {
  day: string;
  score: number;
}

export interface Meeting {
  id: string;
  patientName?: string;
  doctorName?: string;
  doctorImg?: string;
  date: string;
  time: string;
  type: 'Video' | 'Audio' | 'Chat';
  status: 'upcoming' | 'completed' | 'cancelled';
}

export type UserRole = 'user' | 'doctor' | 'anonymous';

export interface UserProfile {
  id?: string;
  email?: string;
  displayName?: string;
  name?: string; // fallback for current usage
  isAnonymous: boolean;
  role: UserRole;
}
