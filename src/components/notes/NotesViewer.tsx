"use client";
import { useState, useEffect, useRef } from "react";
import { Note, WebSocketMessage } from "@/types/note";
import { env } from "process";

export default function NotesViewer() {
  const [notes, setNotes] = useState<Note[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const isComponentMounted = useRef(true);

  const API_URL = env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const WS_URL = env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

  useEffect(() => {
    isComponentMounted.current = true;
    fetchNotes();
    setupWebSocket();

    return () => {
      isComponentMounted.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/v1/notes`);
      const data = (await response.json()) as Note[];
      if (isComponentMounted.current) {
        const uniqueNotes = Array.from(
          new Map(data.map((note: Note) => [note.id, note])).values()
        ) as Note[];
        setNotes(uniqueNotes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const setupWebSocket = () => {
    if (!isComponentMounted.current) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket(`${WS_URL}/ws/notes/`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      if (!isComponentMounted.current) return;

      const data = JSON.parse(event.data) as WebSocketMessage;
      switch (data.action) {
        case "created":
          setNotes((prevNotes) => {
            const exists = prevNotes.some((note) => note.id === data.note.id);
            if (exists) return prevNotes;
            return [data.note, ...prevNotes];
          });
          break;

        case "updated":
          setNotes((prevNotes) => {
            const noteExists = prevNotes.some(
              (note) => note.id === data.note.id
            );
            if (!noteExists) return prevNotes;
            return prevNotes.map((note) =>
              note.id === data.note.id ? data.note : note
            );
          });
          break;

        case "deleted":
          setNotes((prevNotes) =>
            prevNotes.filter((note) => note.id !== data.note.id)
          );
          break;
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      wsRef.current = null;

      if (isComponentMounted.current) {
        reconnectTimeoutRef.current = setTimeout(() => {
          setupWebSocket();
        }, 3000);
      }
    };
  };

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div key={`viewer-${note.id}`} className="border p-4 rounded">
          <h3 className="font-semibold">{note.title}</h3>
          <p className="mt-2">{note.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Created: {new Date(note.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(note.updated_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
