export type Role = 'user' | 'assistant';
export interface Message { id: string; role: Role; content: string; images?: string[]; createdAt: number; error?: string; feedback?: 'up' | 'down'; }
export interface Chat { id: string; title: string; createdAt: number; updatedAt: number; messages: Message[]; demo?: boolean; }
