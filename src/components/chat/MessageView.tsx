import { Check, Copy, RefreshCw, ThumbsDown, ThumbsUp, TriangleAlert } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { motion } from 'framer-motion';
import type { Message } from '../../types';
import { timeFmt } from '../../utils';
import { Lightbox } from '../ui/Lightbox';
import { Logo } from '../ui/Logo';

function useCopy() { const [ok, setOk] = useState(false); return { ok, copy: (t: string) => { void navigator.clipboard.writeText(t); setOk(true); setTimeout(() => setOk(false), 1500); } }; }
function Pre({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null); const { ok, copy } = useCopy();
  const cls = ((children as { props?: { className?: string } } | undefined)?.props?.className) ?? ''; const lang = /language-([\w-]+)/.exec(cls)?.[1];
  return (
    <div className="not-prose my-4 overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117]">
      <div className="flex items-center justify-between bg-white/5 px-4 py-1.5 text-xs text-slate-400"><span>{lang ?? 'code'}</span>
        <button onClick={() => copy(ref.current?.innerText ?? '')} className="flex min-h-[32px] items-center gap-1.5 rounded px-2 hover:text-white">{ok ? <Check size={14} /> : <Copy size={14} />}{ok ? 'Copied' : 'Copy'}</button></div>
      <pre ref={ref} className="overflow-x-auto p-4 font-mono text-[13px] leading-6">{children}</pre>
    </div>
  );
}
interface P { m: Message; isLast: boolean; busy: boolean; onRegenerate: () => void; onFeedback: (id: string, f: 'up' | 'down') => void; }
export function MessageView({ m, isLast, busy, onRegenerate, onFeedback }: P) {
  const { ok, copy } = useCopy(); const [zoom, setZoom] = useState<string | null>(null);
  const act = 'grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-ink-700 dark:hover:text-slate-200';
  const anim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.18 } };
  if (m.role === 'user') return (
    <motion.div {...anim} className="flex flex-col items-end gap-1.5">
      {m.images && <div className={`grid max-w-[85%] gap-2 ${m.images.length > 1 ? 'grid-cols-2' : ''}`}>{m.images.map((s, i) => <button key={i} onClick={() => setZoom(s)} aria-label="Open image"><img src={s} alt="Attachment" className="max-h-60 rounded-2xl border border-slate-200 object-cover dark:border-ink-600" /></button>)}</div>}
      {m.content && <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-[15px] leading-relaxed text-white">{m.content}</div>}
      <span className="px-1 text-xs text-slate-400">{timeFmt(m.createdAt)}</span>
      {zoom && <Lightbox src={zoom} onClose={() => setZoom(null)} />}
    </motion.div>
  );
  return (
    <motion.div {...anim} className="flex gap-3">
      <div className="mt-0.5 shrink-0"><Logo size={28} /></div>
      <div className="min-w-0 flex-1">
        {m.error ? (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
            <TriangleAlert size={18} className="mt-0.5 shrink-0" /><div><p>{m.error}</p>{isLast && <button disabled={busy} onClick={onRegenerate} className="mt-2 font-medium underline disabled:opacity-50">Try again</button>}</div>
          </div>
        ) : (
          <>
            <div className="prose prose-slate max-w-none text-[15px] dark:prose-invert prose-p:leading-7"><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={{ pre: Pre }}>{m.content}</ReactMarkdown></div>
            <div className="mt-2 flex items-center gap-0.5">
              <button className={act} onClick={() => copy(m.content)} aria-label="Copy message">{ok ? <Check size={16} /> : <Copy size={16} />}</button>
              {isLast && <button className={act} disabled={busy} onClick={onRegenerate} aria-label="Regenerate response"><RefreshCw size={16} /></button>}
              <button className={`${act} ${m.feedback === 'up' ? '!text-brand-600' : ''}`} onClick={() => onFeedback(m.id, 'up')} aria-pressed={m.feedback === 'up'} aria-label="Good response"><ThumbsUp size={16} /></button>
              <button className={`${act} ${m.feedback === 'down' ? '!text-brand-600' : ''}`} onClick={() => onFeedback(m.id, 'down')} aria-pressed={m.feedback === 'down'} aria-label="Bad response"><ThumbsDown size={16} /></button>
              <span className="ml-2 text-xs text-slate-400">{timeFmt(m.createdAt)}</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
