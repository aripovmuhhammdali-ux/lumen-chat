import { Check, PanelLeftClose, Pencil, Plus, Search, Settings, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Chat } from '../../types';
import { groupChats } from '../../utils';
import { Logo } from '../ui/Logo';
interface P { chats: Chat[]; activeId: string | null; open: boolean; onSelect: (id: string) => void; onNew: () => void; onRename: (id: string, t: string) => void; onDelete: (id: string) => void; onToggle: () => void; onSettings: () => void; }
export function Sidebar({ chats, activeId, open, onSelect, onNew, onRename, onDelete, onToggle, onSettings }: P) {
  const [q, setQ] = useState(''); const [editing, setEditing] = useState<string | null>(null); const [draft, setDraft] = useState(''); const [del, setDel] = useState<string | null>(null);
  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    return groupChats(s ? chats.filter(c => c.title.toLowerCase().includes(s) || c.messages.some(m => m.content.toLowerCase().includes(s))) : chats);
  }, [chats, q]);
  const icon = 'grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 dark:hover:bg-ink-600 dark:hover:text-white';
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onToggle} />}
      <aside className={`glass-panel fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50 transition-all duration-200 dark:border-ink-700 dark:bg-ink-800 lg:static ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:-ml-72'}`} aria-label="Sidebar">
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <div className="flex items-center gap-2.5"><Logo /><span className="text-[17px] font-semibold tracking-tight">Lumen</span></div>
          <button className={icon} onClick={onToggle} aria-label="Collapse sidebar"><PanelLeftClose size={18} /></button>
        </div>
        <div className="space-y-2 px-3 py-2">
          <button onClick={onNew} className="flex h-11 w-full items-center gap-2 rounded-xl bg-brand-600 px-3 text-sm font-medium text-white transition hover:bg-brand-700"><Plus size={18} />New chat</button>
          <label className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-400 focus-within:border-brand-500 dark:border-ink-600 dark:bg-ink-900">
            <Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search conversations" aria-label="Search conversations" className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-200" />
          </label>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {!groups.length && <p className="px-3 py-6 text-center text-sm text-slate-400">{q ? 'No conversations match your search.' : 'No conversations yet. Start a new chat.'}</p>}
          {groups.map(g => (
            <div key={g.label} className="mb-3">
              <p className="px-3 pb-1 text-xs font-medium text-slate-400">{g.label}</p>
              {g.items.map(c => (
                <div key={c.id} className={`group flex items-center rounded-xl pr-1 ${c.id === activeId ? 'bg-brand-50 dark:bg-ink-700' : 'hover:bg-slate-200/60 dark:hover:bg-ink-700/60'}`}>
                  {editing === c.id ? (
                    <form className="flex flex-1 items-center gap-1 p-1" onSubmit={e => { e.preventDefault(); onRename(c.id, draft); setEditing(null); }}>
                      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={() => setEditing(null)} onKeyDown={e => e.key === 'Escape' && setEditing(null)} aria-label="Conversation name" className="h-9 min-w-0 flex-1 rounded-lg border border-brand-500 bg-white px-2 text-sm outline-none dark:bg-ink-900" />
                      <button type="submit" onMouseDown={e => e.preventDefault()} className={icon} aria-label="Save name"><Check size={16} /></button>
                    </form>
                  ) : (
                    <>
                      <button onClick={() => { onSelect(c.id); }} className="min-h-[44px] flex-1 truncate px-3 text-left text-sm lg:min-h-[40px]">{c.title}{c.demo && <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-ink-600">Demo</span>}</button>
                      <div className="flex opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
                        <button className={icon} aria-label="Rename conversation" onClick={() => { setEditing(c.id); setDraft(c.title); }}><Pencil size={15} /></button>
                        <button className={`${icon} ${del === c.id ? '!bg-red-50 !text-red-600' : ''}`} aria-label={del === c.id ? 'Confirm delete' : 'Delete conversation'} onBlur={() => setDel(null)} onClick={() => { if (del === c.id) { onDelete(c.id); setDel(null); } else setDel(c.id); }}>{del === c.id ? <Check size={15} /> : <Trash2 size={15} />}</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3 dark:border-ink-700">
          <button onClick={onSettings} className="mb-1 flex h-10 w-full items-center gap-2.5 rounded-xl px-3 text-sm text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-ink-700"><Settings size={17} />Settings</button>
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">G</span>
            <div className="min-w-0 leading-tight"><p className="truncate text-sm font-medium">Guest</p><p className="truncate text-xs text-slate-400">Saved on this device</p></div>
          </div>
        </div>
      </aside>
    </>
  );
}
