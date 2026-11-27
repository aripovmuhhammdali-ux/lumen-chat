import { Layers, Code2, Lightbulb, Moon, PanelLeftOpen, PenLine, Sun, BookOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Chat } from '../types';
import { API_BASE_URL } from '../services/aiService';
import { Composer } from '../components/composer/Composer';
import { MessageView } from '../components/chat/MessageView';
import { Logo } from '../components/ui/Logo';
interface P { chat: Chat | null; busy: boolean; sidebarOpen: boolean; onOpenSidebar: () => void; theme: 'light' | 'dark'; onTheme: () => void; glass: boolean; onGlass: () => void; onSend: (t: string, i: string[]) => void; onStop: () => void; onRegenerate: () => void; onFeedback: (id: string, f: 'up' | 'down') => void; }
const SUGGESTIONS = [
  { Icon: BookOpen, title: 'Learn something new', hint: 'Understand a topic simply', prompt: 'Explain how neural networks learn, using a simple analogy.' },
  { Icon: PenLine, title: 'Write and improve', hint: 'Polish tone and clarity', prompt: 'Improve the clarity and tone of this paragraph:\n\n' },
  { Icon: Code2, title: 'Code and debug', hint: 'Fix errors, explain code', prompt: 'Help me debug this code and explain what went wrong:\n\n' },
  { Icon: Lightbulb, title: 'Brainstorm ideas', hint: 'Projects, names, plans', prompt: 'Give me 10 creative ideas for a side project I can build in a weekend.' },
];
export function ChatPage({ chat, busy, sidebarOpen, onOpenSidebar, theme, onTheme, glass, onGlass, onSend, onStop, onRegenerate, onFeedback }: P) {
  const [draft, setDraft] = useState(''); const [images, setImages] = useState<string[]>([]); const end = useRef<HTMLDivElement>(null);
  const msgs = chat?.messages ?? [];
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs.length, busy, chat?.id]);
  const send = () => { onSend(draft.trim(), images); setDraft(''); setImages([]); };
  const composer = <Composer value={draft} onChange={setDraft} images={images} onImages={setImages} busy={busy} onSend={send} onStop={onStop} large={!chat} />;
  const btn = 'grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-ink-700';
  return (
    <main className="flex h-full min-w-0 flex-1 flex-col">
      <header className="flex h-14 shrink-0 items-center gap-2 px-3">
        {!sidebarOpen && <button className={btn} onClick={onOpenSidebar} aria-label="Open sidebar"><PanelLeftOpen size={19} /></button>}
        <h1 className="min-w-0 flex-1 truncate text-sm font-medium text-slate-600 dark:text-slate-300">{chat?.title ?? ''}</h1>
        {!API_BASE_URL && <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200 sm:inline">Development mode · backend not connected</span>}
        <button className={`${btn} ${glass ? '!bg-brand-50 !text-brand-600 dark:!bg-ink-700' : ''}`} onClick={onGlass} aria-pressed={glass} aria-label="Glass mode" title="Glass mode"><Layers size={19} /></button>
        <button className={btn} onClick={onTheme} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</button>
      </header>
      {!chat ? (
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 pb-10">
          <div className="w-full max-w-2xl">
            <div className="mb-8 flex flex-col items-center text-center"><Logo size={44} />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">What can I help you with?</h2>
              <p className="mt-2 max-w-md text-slate-500">Ask a question, share a photo, or pick a starting point below.</p></div>
            {composer}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">{SUGGESTIONS.map(s => (
              <button key={s.title} onClick={() => setDraft(s.prompt)} className="glass-panel flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-brand-500/50 hover:bg-brand-50/50 dark:border-ink-600 dark:hover:bg-ink-800">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-ink-700"><s.Icon size={19} /></span>
                <span><span className="block text-sm font-semibold">{s.title}</span><span className="block text-sm text-slate-500">{s.hint}</span></span></button>))}</div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 py-6">
              {msgs.map((m, i) => <MessageView key={m.id} m={m} isLast={i === msgs.length - 1} busy={busy} onRegenerate={onRegenerate} onFeedback={onFeedback} />)}
              {busy && <div className="flex items-center gap-3" role="status" aria-label="Generating response"><Logo size={28} /><span className="flex gap-1">{[0, 1, 2].map(d => <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-slate-300 dark:bg-ink-600" style={{ animationDelay: `${d * 150}ms` }} />)}</span></div>}
              <div ref={end} />
            </div>
          </div>
          <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">{composer}</div>
        </>
      )}
    </main>
  );
}
