export interface Attendance {
  id: string;
  school_id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  course: string | null;
  year_level: string | null;
  purpose: string;
  status: string;
  date: string;
  time_in_date: string | null;
  time_out_date: string | null;
  classification: string | null;
  has_already_timed_in: boolean;
  has_already_timed_out: boolean;
  baggage_number: number | null;
  baggage_returned: boolean;
}

export interface WebSocketMessage {
  type?: string;
  action?: string;
  attendance?: Attendance;
  message?: string;
}
