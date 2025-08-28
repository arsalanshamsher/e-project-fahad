export interface User {
  id: string;
  email: string;
  role: 'admin' | 'organizer' | 'exhibitor' | 'attendee';
  first_name?: string;
  last_name?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  theme: string;
  banner_url?: string;
  status: 'draft' | 'published' | 'completed';
  max_exhibitors: number;
  created_by: string;
  created_at: string;
}

export interface Exhibitor {
  id: string;
  event_id: string;
  user_id: string;
  company_name: string;
  company_description: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  booth_size_preference: 'small' | 'medium' | 'large';
  booth_number?: string;
  status: 'pending' | 'approved' | 'rejected';
  application_date: string;
}

export interface Schedule {
  id: string;
  event_id: string;
  title: string;
  description: string;
  speaker_name: string;
  speaker_bio?: string;
  start_time: string;
  end_time: string;
  location: string;
  session_type: 'keynote' | 'workshop' | 'panel' | 'networking';
  max_attendees?: number;
  created_at: string;
}

export interface Analytics {
  total_events: number;
  total_exhibitors: number;
  total_attendees: number;
  revenue: number;
  event_registrations: Array<{ date: string; count: number }>;
  popular_sessions: Array<{ title: string; attendees: number }>;
}