import type { Chat } from '../types';
import { uid } from '../utils';
/** Demo data only: seeded on first launch, flagged `demo: true`, never mixed into real services. */
export function demoChats(): Chat[] {
  const now = Date.now(), h = 36e5, d = 24 * h;
  const mk = (title: string, ago: number, q: string, a: string): Chat => ({ id: uid(), title, demo: true, createdAt: now - ago, updatedAt: now - ago,
    messages: [{ id: uid(), role: 'user', content: q, createdAt: now - ago }, { id: uid(), role: 'assistant', content: a, createdAt: now - ago + 6e4 }] });
  return [
    mk('Debounce a search input', 2 * h, 'How do I debounce a search input in React?',
      'Wrap the value in a small hook that delays updates:\n\n```ts\nimport { useEffect, useState } from \'react\';\n\nexport function useDebounce<T>(value: T, delay = 300) {\n  const [v, setV] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setV(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return v;\n}\n```\n\nThen query with the debounced value:\n\n- **Fewer requests** while the user is typing\n- **Cleanup** cancels stale timers automatically'),
    mk('Weekend trip ideas', 28 * h, 'Give me three low-effort weekend trip ideas near a big city.',
      '1. **Small lakeside town** — swim, walk, and eat early.\n2. **National park day hike** — pick a loop under 10 km.\n3. **Historic rail town** — museums plus a slow lunch.'),
    mk('Email tone rewrite', 4 * d, 'Make this friendlier: "Send the report today."',
      'Try: "Could you send over the report today? Thanks so much!"'),
  ];
}
