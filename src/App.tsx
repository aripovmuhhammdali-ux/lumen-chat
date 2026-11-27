import { useEffect, useState } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { SettingsModal } from './components/ui/SettingsModal';
import { ChatPage } from './pages/ChatPage';
import { useChats } from './hooks/useChats';
export default function App() {
  const c = useChats();
  const [open, setOpen] = useState(() => window.innerWidth >= 1024);
  const [settings, setSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); try { localStorage.setItem('lumen.theme', theme); } catch { /* ignore */ } }, [theme]);
  const [glass, setGlass] = useState(() => { try { return localStorage.getItem('lumen.glass') === '1'; } catch { return false; } });
  useEffect(() => { document.documentElement.classList.toggle('glass', glass); try { localStorage.setItem('lumen.glass', glass ? '1' : '0'); } catch { /* ignore */ } }, [glass]);
  const closeOnMobile = () => { if (window.innerWidth < 1024) setOpen(false); };
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar chats={c.chats} activeId={c.activeId} open={open} onToggle={() => setOpen(o => !o)} onSettings={() => setSettings(true)}
        onSelect={id => { c.setActiveId(id); closeOnMobile(); }} onNew={() => { c.setActiveId(null); closeOnMobile(); }} onRename={c.rename} onDelete={c.remove} />
      <ChatPage key={c.activeId ?? 'new'} chat={c.active} busy={c.busy} sidebarOpen={open} onOpenSidebar={() => setOpen(true)} theme={theme} onTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))} glass={glass} onGlass={() => setGlass(g => !g)}
        onSend={c.send} onStop={c.stop} onRegenerate={c.regenerate} onFeedback={c.feedback} />
      {settings && <SettingsModal theme={theme} setTheme={setTheme} onClear={c.clearAll} onClose={() => setSettings(false)} />}
    </div>
  );
}
