export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface WebSocketMessage {
  action: "created" | "updated" | "deleted";
  note: Note;
  type?: string;
}
