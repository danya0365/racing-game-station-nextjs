/**
 * useChatStore - Chat State Management
 * 
 * Zustand store for chat widget state
 * Handles messages, loading state, open/close, and API communication
 * 
 * Admin-only: requires authenticated admin user
 */

'use client';

import { ChatMessage, ChatResponse } from '@/src/domain/types/chatTypes';
import { ApiChatRepository } from '@/src/infrastructure/repositories/api/ApiChatRepository';
import { create } from 'zustand';

interface ChatState {
  // State
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  hasLoadedWelcome: boolean;
  error: string | null;

  // Actions
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  sendAction: (action: string, params?: Record<string, string>) => Promise<void>;
  loadWelcome: () => Promise<void>;
  clearMessages: () => void;
}

const chatRepo = new ApiChatRepository();

function createBotMessage(response: ChatResponse): ChatMessage {
  return {
    id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role: 'bot',
    content: response.text ?? response.title ?? '',
    response,
    timestamp: Date.now(),
  };
}

function createUserMessage(text: string): ChatMessage {
  return {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role: 'user',
    content: text,
    timestamp: Date.now(),
  };
}

function createErrorMessage(error: string): ChatMessage {
  return {
    id: `error-${Date.now()}`,
    role: 'bot',
    content: error,
    response: { type: 'text', text: `⚠️ ${error}` },
    timestamp: Date.now(),
  };
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  hasLoadedWelcome: false,
  error: null,

  toggleChat: () => {
    const wasOpen = get().isOpen;
    set({ isOpen: !wasOpen });
    if (!wasOpen && !get().hasLoadedWelcome) {
      get().loadWelcome();
    }
  },

  openChat: () => {
    set({ isOpen: true });
    if (!get().hasLoadedWelcome) {
      get().loadWelcome();
    }
  },

  closeChat: () => set({ isOpen: false }),

  loadWelcome: async () => {
    if (get().hasLoadedWelcome) return;

    set({ isLoading: true, error: null });

    try {
      const result = await chatRepo.getWelcome();

      if (result.success && result.data) {
        set({
          messages: [createBotMessage(result.data)],
          hasLoadedWelcome: true,
          isLoading: false,
        });
      } else {
        set({
          messages: [createErrorMessage(result.error ?? 'ไม่สามารถโหลดข้อมูลได้')],
          isLoading: false,
        });
      }
    } catch {
      set({
        messages: [createErrorMessage('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้')],
        isLoading: false,
      });
    }
  },

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = createUserMessage(trimmed);

    set(state => ({
      messages: [...state.messages, userMsg],
      isLoading: true,
      error: null,
    }));

    try {
      const result = await chatRepo.sendMessage(trimmed);

      if (result.success && result.data) {
        set(state => ({
          messages: [...state.messages, createBotMessage(result.data!)],
          isLoading: false,
        }));
      } else {
        set(state => ({
          messages: [...state.messages, createErrorMessage(result.error ?? 'เกิดข้อผิดพลาด')],
          isLoading: false,
        }));
      }
    } catch {
      set(state => ({
        messages: [...state.messages, createErrorMessage('ไม่สามารถส่งข้อความได้')],
        isLoading: false,
      }));
    }
  },

  sendAction: async (action: string, params?: Record<string, string>) => {
    set({ isLoading: true, error: null });

    try {
      const result = await chatRepo.sendAction(action, params);

      if (result.success && result.data) {
        set(state => ({
          messages: [...state.messages, createBotMessage(result.data!)],
          isLoading: false,
        }));
      } else {
        set(state => ({
          messages: [...state.messages, createErrorMessage(result.error ?? 'เกิดข้อผิดพลาด')],
          isLoading: false,
        }));
      }
    } catch {
      set(state => ({
        messages: [...state.messages, createErrorMessage('ไม่สามารถส่งข้อมูลได้')],
        isLoading: false,
      }));
    }
  },

  clearMessages: () => set({ messages: [], hasLoadedWelcome: false }),
}));
