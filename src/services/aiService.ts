import type { Message } from '../types';
/** Set VITE_API_URL (see .env.example) to your FastAPI server that proxies Qwen via Ollama. */
export const API_BASE_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? 'https://lumen-chat-api.onrender.com').replace(/\/$/, '');
export class AIServiceError extends Error {
  constructor(message: string, public code: 'not_connected' | 'network' | 'http') { super(message); }
}
/**
 * Contract: POST {API_BASE_URL}/api/chat
 *   body: { messages: [{ role, content, images?: base64[] }] }   (images are raw base64 JPEG, Ollama-style)
 *   returns: { content: string }
 * Streaming can replace this later (SSE) without touching the UI: keep the signal for the Stop button.
 */
export async function sendChat(messages: Message[], signal?: AbortSignal): Promise<string> {
  if (!API_BASE_URL) throw new AIServiceError('Development mode: the AI backend isn’t connected yet. Set VITE_API_URL to your FastAPI server to enable replies.', 'not_connected');
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
      body: JSON.stringify({ messages: messages.map(m => ({ role: m.role, content: m.content, images: m.images?.map(i => i.split(',')[1]) })) }),
    });
    if (!res.ok) throw new AIServiceError(`The server responded with status ${res.status}.`, 'http');
    const data = await res.json() as {
  content?: string;
  reply?: string;
};

const answer = data.content ?? data.reply;

if (!answer) {
  throw new AIServiceError(
    'The AI returned an empty response.',
    'http'
  );
}

return answer;
  } catch (e) {
    if (e instanceof AIServiceError || (e as Error).name === 'AbortError') throw e;
    throw new AIServiceError('Couldn’t reach the server. Check that the backend is running and try again.', 'network');
  }
}
