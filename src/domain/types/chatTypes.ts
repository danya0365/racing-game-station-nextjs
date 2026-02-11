/**
 * Chat System Types
 * 
 * Shared types for the chat system (Web Chat + LINE OA)
 * Mirrors the Laravel ChatService response format
 */

// ==========================================
// Chat Response Types (from ChatService)
// ==========================================

export type ChatResponseType = 'text' | 'menu' | 'card';

export interface QuickReply {
  label: string;
  action?: string;
  data?: Record<string, string>;
}

export interface CardRow {
  label?: string;
  value?: string;
  valueColor?: string;
  bold?: boolean;
  type?: 'separator';
}

export interface ChatResponse {
  type: ChatResponseType;
  text?: string;
  title?: string;
  subtitle?: string;
  headerColor?: string;
  quickReplies?: (string | QuickReply)[];
  rows?: CardRow[];
}

// ==========================================
// Chat Message (for UI state)
// ==========================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;          // text typed by user
  response?: ChatResponse;  // bot response object
  timestamp: number;
}

// ==========================================
// API Request/Response Types
// ==========================================

export interface ChatMessageRequest {
  text: string;
}

export interface ChatActionRequest {
  action: string;
  params?: Record<string, string>;
}

export interface ChatApiResponse {
  success: boolean;
  data?: ChatResponse;
  error?: string;
}
