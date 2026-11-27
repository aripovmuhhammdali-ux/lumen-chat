import { ArrowUp, ImagePlus, Square, X } from 'lucide-react';
import { useEffect, useRef, useState, type ClipboardEvent, type DragEvent } from 'react';
import { MAX_IMAGES, fileToDataUrl } from '../../utils';
import { Lightbox } from '../ui/Lightbox';
interface P { value: string; onChange: (v: string) => void; images: string[]; onImages: (i: string[]) => void; busy: boolean; onSend: () => void; onStop: () => void; large?: boolean; }
export function Composer({ value, onChange, images, onImages, busy, onSend, onStop, large }: P) {
  const ta = useRef<HTMLTextAreaElement>(null); const file = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false); const [note, setNote] = useState(''); const [zoom, setZoom] = useState<string | null>(null);
  useEffect(() => { const t = ta.current; if (!t) return; t.style.height = 'auto'; t.style.height = `${Math.min(t.scrollHeight, 220)}px`; }, [value]);
  const add = async (files: File[]) => {
    const imgs = files.filter(f => f.type.startsWith('image/')); if (!imgs.length) return;
    const room = MAX_IMAGES - images.length; setNote(imgs.length > room ? `You can attach up to ${MAX_IMAGES} photos per message.` : '');
    const out: string[] = []; for (const f of imgs.slice(0, room)) { try { out.push(await fileToDataUrl(f)); } catch (e) { setNote((e as Error).message); } }
    if (out.length) onImages([...images, ...out]);
  };
  const canSend = !busy && (value.trim().length > 0 || images.length > 0);
  const submit = () => { if (canSend) { setNote(''); onSend(); } };
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDrag(false); void add(Array.from(e.dataTransfer.files)); };
  const onPaste = (e: ClipboardEvent) => { const f = Array.from(e.clipboardData.files); if (f.length) { e.preventDefault(); void add(f); } };
  return (
    <div className="w-full">
      <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}
        className={`glass-panel rounded-[18px] border bg-white shadow-sm transition-all focus-within:border-brand-500 focus-within:shadow-md dark:bg-ink-800 ${drag ? 'border-brand-500 bg-brand-50 dark:bg-ink-700' : 'border-slate-200 dark:border-ink-600'}`}>
        {images.length > 0 && (
          <ul className="flex flex-wrap gap-2 px-3 pt-3">{images.map((s, i) => (
            <li key={i} className="relative"><button onClick={() => setZoom(s)} aria-label="Preview photo"><img src={s} alt={`Attachment ${i + 1}`} className="h-16 w-16 rounded-xl border border-slate-200 object-cover dark:border-ink-600" /></button>
              <button onClick={() => onImages(images.filter((_, j) => j !== i))} aria-label="Remove photo" className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-slate-800 text-white shadow hover:bg-black"><X size={13} /></button></li>))}</ul>
        )}
        <textarea ref={ta} value={value} rows={large ? 2 : 1} onChange={e => onChange(e.target.value)} onPaste={onPaste} aria-label="Message"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }}
          placeholder={drag ? 'Drop photos to attach' : 'Message Lumen'} className="block w-full resize-none bg-transparent px-4 pb-1 pt-3.5 text-[15px] leading-6 outline-none placeholder:text-slate-400" />
        <div className="flex items-center justify-between px-2.5 pb-2.5">
          <div>
            <input ref={file} type="file" accept="image/*" multiple hidden onChange={e => { void add(Array.from(e.target.files ?? [])); e.target.value = ''; }} />
            <button onClick={() => file.current?.click()} disabled={images.length >= MAX_IMAGES} aria-label="Attach photos" title="Attach photos" className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-ink-700"><ImagePlus size={20} /></button>
          </div>
          {busy ? (
            <button onClick={onStop} aria-label="Stop generating" className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900"><Square size={14} fill="currentColor" /></button>
          ) : (
            <button onClick={submit} disabled={!canSend} aria-label="Send message" className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-ink-600"><ArrowUp size={20} /></button>
          )}
        </div>
      </div>
      <p className="mt-2 min-h-[16px] px-2 text-center text-xs text-slate-400" role={note ? 'status' : undefined}>{note || 'Enter to send, Shift + Enter for a new line. Drop or paste photos to attach.'}</p>
      {zoom && <Lightbox src={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}
