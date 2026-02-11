/**
 * LineMessagingService
 * 
 * Utility for LINE Messaging API integration
 * Handles signature verification, message formatting, and reply
 * 
 * Ported from Laravel LineMessagingService
 */

import { ChatResponse } from '@/src/domain/types/chatTypes';
import crypto from 'crypto';

const LINE_API_BASE = 'https://api.line.me/v2/bot';

export class LineMessagingService {
  private channelAccessToken: string;
  private channelSecret: string;

  constructor() {
    this.channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN ?? '';
    this.channelSecret = process.env.LINE_CHANNEL_SECRET ?? '';
  }

  /**
   * Check if LINE is configured
   */
  isConfigured(): boolean {
    return !!(this.channelAccessToken && this.channelSecret);
  }

  /**
   * Verify LINE webhook signature (HMAC-SHA256)
   */
  verifySignature(body: string, signature: string): boolean {
    if (!this.channelSecret) return false;

    const hash = crypto
      .createHmac('SHA256', this.channelSecret)
      .update(body)
      .digest('base64');

    return hash === signature;
  }

  /**
   * Reply to a message via LINE Reply API
   */
  async replyMessage(replyToken: string, messages: Record<string, unknown>[]): Promise<void> {
    if (!this.channelAccessToken) {
      console.warn('LINE_CHANNEL_ACCESS_TOKEN is not set, skipping reply');
      return;
    }

    const response = await fetch(`${LINE_API_BASE}/message/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify({
        replyToken,
        messages: messages.slice(0, 5), // LINE limit: max 5 messages
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LINE Reply API Error:', error);
      throw new Error(`LINE Reply API Error: ${response.status}`);
    }
  }

  // ==========================================
  // Message Format Builders
  // ==========================================

  textMessage(text: string): Record<string, unknown> {
    return { type: 'text', text };
  }

  quickReplyItem(label: string, actionType: 'message' | 'postback', data?: string): Record<string, unknown> {
    const truncatedLabel = label.length > 20 ? label.substring(0, 17) + '...' : label;

    if (actionType === 'postback') {
      return {
        type: 'action',
        action: {
          type: 'postback',
          label: truncatedLabel,
          data: data ?? '',
          displayText: truncatedLabel,
        },
      };
    }

    return {
      type: 'action',
      action: {
        type: 'message',
        label: truncatedLabel,
        text: data ?? label,
      },
    };
  }

  quickReply(text: string, items: Record<string, unknown>[]): Record<string, unknown> {
    return {
      type: 'text',
      text,
      quickReply: { items },
    };
  }

  separator(): Record<string, unknown> {
    return { type: 'separator', margin: 'md' };
  }

  infoRow(label: string, value: string, valueColor = '#111111'): Record<string, unknown> {
    return {
      type: 'box',
      layout: 'horizontal',
      contents: [
        { type: 'text', text: label, size: 'sm', color: '#555555', flex: 0 },
        { type: 'text', text: value, size: 'sm', color: valueColor, align: 'end' },
      ],
      margin: 'md',
    };
  }

  bubbleContainer(
    title: string,
    subtitle: string,
    bodyContents: Record<string, unknown>[],
    headerColor = '#6366F1'
  ): Record<string, unknown> {
    return {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          { type: 'text', text: title, color: '#ffffff', weight: 'bold', size: 'lg' },
          ...(subtitle ? [{ type: 'text', text: subtitle, color: '#ffffffcc', size: 'sm' }] : []),
        ],
        backgroundColor: headerColor,
        paddingAll: '15px',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: bodyContents,
        paddingAll: '15px',
      },
    };
  }

  flexMessage(altText: string, contents: Record<string, unknown>): Record<string, unknown> {
    return {
      type: 'flex',
      altText,
      contents,
    };
  }

  // ==========================================
  // Convert ChatResponse → LINE Messages
  // ==========================================

  convertChatResponseToLineMessages(response: ChatResponse): Record<string, unknown>[] {
    switch (response.type) {
      case 'text':
        return [this.textMessage(response.text ?? 'ไม่มีข้อมูล')];

      case 'menu': {
        const text = response.text ?? 'กรุณาเลือกเมนู';
        const items = this.buildQuickReplyItems(response.quickReplies ?? []);
        if (items.length === 0) {
          return [this.textMessage(text)];
        }
        return [this.quickReply(text, items)];
      }

      case 'card': {
        const bodyContents = this.buildCardBody(response);
        const bubble = this.bubbleContainer(
          response.title ?? 'ข้อมูล',
          response.subtitle ?? '',
          bodyContents,
          response.headerColor ?? '#6366F1'
        );
        return [this.flexMessage(response.title ?? 'ข้อมูล', bubble)];
      }

      default:
        return [this.textMessage(JSON.stringify(response))];
    }
  }

  private buildQuickReplyItems(replies: (string | { label: string; action?: string; data?: Record<string, string> })[]): Record<string, unknown>[] {
    const items: Record<string, unknown>[] = [];

    for (const reply of replies) {
      if (typeof reply === 'string') {
        items.push(this.quickReplyItem(reply, 'message', reply));
      } else {
        const label = reply.label;
        const action = reply.action;
        const data = reply.data ?? {};

        if (action) {
          let postbackData = `action=${action}`;
          for (const [key, value] of Object.entries(data)) {
            postbackData += `&${key}=${value}`;
          }
          items.push(this.quickReplyItem(label, 'postback', postbackData));
        } else {
          items.push(this.quickReplyItem(label, 'message', label));
        }
      }
    }

    return items;
  }

  private buildCardBody(response: ChatResponse): Record<string, unknown>[] {
    const contents: Record<string, unknown>[] = [];

    for (const row of response.rows ?? []) {
      if (row.type === 'separator') {
        contents.push(this.separator());
      } else if (row.bold && !row.value) {
        // Section header
        contents.push({
          type: 'text',
          text: row.label,
          size: 'sm',
          weight: 'bold',
          margin: 'md',
        });
      } else if (row.bold) {
        // Bold row with value
        contents.push({
          type: 'box',
          layout: 'horizontal',
          contents: [
            { type: 'text', text: row.label, size: 'sm', weight: 'bold', color: '#111111', flex: 0 },
            { type: 'text', text: row.value ?? '', size: 'sm', color: row.valueColor ?? '#111111', align: 'end', weight: 'bold' },
          ],
          margin: 'md',
        });
      } else {
        contents.push(this.infoRow(row.label ?? '', row.value ?? '', row.valueColor ?? '#111111'));
      }
    }

    if (contents.length === 0) {
      contents.push(this.infoRow('ข้อมูล', 'ไม่พบข้อมูลที่จะแสดง'));
    }

    return contents;
  }
}
