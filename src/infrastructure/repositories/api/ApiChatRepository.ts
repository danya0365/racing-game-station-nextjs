/**
 * ApiChatRepository
 * 
 * Client-side chat repository that calls API routes
 * 
 * ✅ For use in CLIENT-SIDE components only
 * ✅ Does NOT directly call Supabase — goes through Next.js API routes
 */

'use client';

import { ChatActionRequest, ChatApiResponse, ChatMessageRequest } from '@/src/domain/types/chatTypes';

export class ApiChatRepository {
  private baseUrl = '/api/chat';

  /**
   * Send a text message and get response
   */
  async sendMessage(text: string): Promise<ChatApiResponse> {
    const body: ChatMessageRequest = { text };

    const res = await fetch(`${this.baseUrl}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return { success: false, error: 'กรุณาเข้าสู่ระบบในฐานะ Admin ก่อนใช้งาน Chat' };
      }
      const error = await res.json().catch(() => ({}));
      return { success: false, error: error.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่' };
    }

    return res.json();
  }

  /**
   * Send a postback action and get response
   */
  async sendAction(action: string, params?: Record<string, string>): Promise<ChatApiResponse> {
    const body: ChatActionRequest = { action, params };

    const res = await fetch(`${this.baseUrl}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return { success: false, error: 'กรุณาเข้าสู่ระบบในฐานะ Admin ก่อนใช้งาน Chat' };
      }
      const error = await res.json().catch(() => ({}));
      return { success: false, error: error.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่' };
    }

    return res.json();
  }

  /**
   * Get welcome message
   */
  async getWelcome(): Promise<ChatApiResponse> {
    const res = await fetch(`${this.baseUrl}/welcome`);

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return { success: false, error: 'กรุณาเข้าสู่ระบบในฐานะ Admin ก่อนใช้งาน Chat' };
      }
      const error = await res.json().catch(() => ({}));
      return { success: false, error: error.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่' };
    }

    return res.json();
  }
}
