import type { Chat } from '../types';
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const timeFmt = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const MAX_IMAGES = 4;
/** Downscales to max 1280px JPEG so images stay light enough for localStorage and the model. */
export function fileToDataUrl(file: File, max = 1280): Promise<string> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file); const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      const ctx = c.getContext('2d')!; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error(`${file.name} is not a supported image.`)); };
    img.src = url;
  });
}
export function groupChats(chats: Chat[]) {
  const sod = new Date(); sod.setHours(0, 0, 0, 0); const day = 864e5; const t = sod.getTime();
  const groups: { label: string; items: Chat[] }[] = [{ label: 'Today', items: [] }, { label: 'Yesterday', items: [] }, { label: 'Previous 7 days', items: [] }, { label: 'Older', items: [] }];
  [...chats].sort((a, b) => b.updatedAt - a.updatedAt).forEach(c => {
    const i = c.updatedAt >= t ? 0 : c.updatedAt >= t - day ? 1 : c.updatedAt >= t - 7 * day ? 2 : 3; groups[i].items.push(c);
  });
  return groups.filter(g => g.items.length);
}
