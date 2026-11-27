import { X } from 'lucide-react';
import { useEffect } from 'react';
export function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose} role="dialog" aria-label="Image preview">
      <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={onClose} aria-label="Close preview"><X size={20} /></button>
      <img src={src} alt="Attached" className="max-h-full max-w-full rounded-xl object-contain" onClick={e => e.stopPropagation()} />
    </div>
  );
}
