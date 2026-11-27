import { Moon, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { API_BASE_URL } from '../../services/aiService';
interface P { theme: 'light' | 'dark'; setTheme: (t: 'light' | 'dark') => void; onClear: () => void; onClose: () => void; }
export function SettingsModal({ theme, setTheme, onClear, onClose }: P) {
  const [confirm, setConfirm] = useState(false);
  const seg = (t: 'light' | 'dark', Icon: typeof Sun, label: string) => (
    <button onClick={() => setTheme(t)} aria-pressed={theme === t} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${theme === t ? 'bg-white text-brand-700 shadow-sm dark:bg-ink-600 dark:text-white' : 'text-slate-500'}`}><Icon size={16} />{label}</button>
  );
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div role="dialog" aria-label="Settings" className="glass-panel w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-ink-600 dark:bg-ink-800" onClick={e => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold">Settings</h2><button onClick={onClose} aria-label="Close settings" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100 dark:hover:bg-ink-700"><X size={18} /></button></div>
        <p className="mb-2 text-sm font-medium">Appearance</p>
        <div className="mb-6 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-ink-900">{seg('light', Sun, 'Light')}{seg('dark', Moon, 'Dark')}</div>
        <p className="mb-2 text-sm font-medium">AI server</p>
        <p className="mb-6 break-all rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-500 dark:border-ink-600">{API_BASE_URL || 'Not connected. Set VITE_API_URL in .env'}</p>
        <p className="mb-2 text-sm font-medium">Data</p>
        <button onClick={() => { if (confirm) { onClear(); onClose(); } else setConfirm(true); }} className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950">{confirm ? 'Click again to delete all chats' : 'Delete all conversations'}</button>
      </div>
    </div>
  );
}
