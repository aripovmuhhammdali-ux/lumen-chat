import { useEffect, useRef, useState } from 'react';
import type { Chat, Message } from '../types';
import { sendChat } from '../services/aiService';
import { uid } from '../utils';
import { demoChats } from '../data/demo';
const KEY = 'lumen.chats.v1';
function load(): Chat[] { try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r) as Chat[]; } catch { /* ignore */ } return demoChats(); }
export function useChats() {
  const [chats, setChats] = useState<Chat[]>(load);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(chats)); } catch { /* quota */ } }, [chats]);
  const active = chats.find(c => c.id === activeId) ?? null;
  const patch = (id: string, fn: (c: Chat) => Chat) => setChats(p => p.map(c => (c.id === id ? fn(c) : c)));
  const run = async (id: string, history: Message[]) => {
    const ctrl = new AbortController(); abort.current = ctrl; setBusy(true);
    try {
      const content = await sendChat(history, ctrl.signal);
      patch(id, c => ({ ...c, updatedAt: Date.now(), messages: [...c.messages, { id: uid(), role: 'assistant', content, createdAt: Date.now() }] }));
    } catch (e) {
      if ((e as Error).name !== 'AbortError')
        patch(id, c => ({ ...c, messages: [...c.messages, { id: uid(), role: 'assistant', content: '', error: (e as Error).message, createdAt: Date.now() }] }));
    } finally { setBusy(false); }
  };
  const send = (text: string, images: string[]) => {
    const msg: Message = { id: uid(), role: 'user', content: text, images: images.length ? images : undefined, createdAt: Date.now() };
    let id = activeId; let history: Message[];
    if (!active) {
      id = uid(); history = [msg];
      const title = (text || 'Image conversation').replace(/\s+/g, ' ').slice(0, 42);
      setChats(p => [{ id: id!, title, createdAt: Date.now(), updatedAt: Date.now(), messages: [msg] }, ...p]); setActiveId(id);
    } else {
      history = [...active.messages.filter(m => !m.error), msg];
      patch(active.id, c => ({ ...c, updatedAt: Date.now(), messages: [...c.messages, msg] }));
    }
    void run(id!, history);
  };
  const regenerate = () => {
    if (!active || busy) return;
    const msgs = [...active.messages]; while (msgs.length && msgs[msgs.length - 1].role === 'assistant') msgs.pop();
    if (!msgs.length) return; patch(active.id, c => ({ ...c, messages: msgs })); void run(active.id, msgs);
  };
  return {
    chats, active, activeId, busy, setActiveId, send, regenerate,
    stop: () => { abort.current?.abort(); setBusy(false); },
    rename: (id: string, title: string) => { if (title.trim()) patch(id, c => ({ ...c, title: title.trim() })); },
    remove: (id: string) => { setChats(p => p.filter(c => c.id !== id)); if (id === activeId) setActiveId(null); },
    clearAll: () => { setChats([]); setActiveId(null); },
    feedback: (mid: string, f: 'up' | 'down') => { if (active) patch(active.id, c => ({ ...c, messages: c.messages.map(m => (m.id === mid ? { ...m, feedback: m.feedback === f ? undefined : f } : m)) })); },
  };
}
