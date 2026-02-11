/**
 * LINE Webhook API Route
 * POST /api/chat/webhook
 * 
 * Receives webhook events from LINE OA
 * Processes messages and replies via LINE Messaging API
 * 
 * NOTE: LINE tokens must be set in env vars:
 * - LINE_CHANNEL_ACCESS_TOKEN
 * - LINE_CHANNEL_SECRET
 */

import { ChatService } from '@/src/application/services/ChatService';
import { LineMessagingService } from '@/src/infrastructure/line/LineMessagingService';
import { SupabaseChatRepository } from '@/src/infrastructure/repositories/supabase/SupabaseChatRepository';
import { createClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const lineService = new LineMessagingService();

  // Check if LINE is configured
  if (!lineService.isConfigured()) {
    console.warn('LINE webhook called but LINE is not configured');
    return NextResponse.json({ status: 'ok', message: 'LINE not configured' });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('x-line-signature') ?? '';

    // Verify signature
    if (!signature || !lineService.verifySignature(body, signature)) {
      console.warn('LINE Webhook: Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);
    const events = data.events ?? [];

    // LINE verification: respond 200 even if no events
    if (events.length === 0) {
      return NextResponse.json({ status: 'ok' });
    }

    const supabase = await createClient();
    const repo = new SupabaseChatRepository(supabase);
    const chatService = new ChatService(repo);

    for (const event of events) {
      try {
        await handleEvent(event, chatService, lineService);
      } catch (error) {
        console.error('LINE Webhook: Error handling event', { error, event });

        // Try to send error reply
        if (event.replyToken) {
          try {
            await lineService.replyMessage(event.replyToken, [
              lineService.textMessage('⚠️ เกิดข้อผิดพลาดชั่วคราว\nกรุณาลองใหม่อีกครั้ง หรือพิมพ์ "เมนู"'),
            ]);
          } catch (innerError) {
            console.error('LINE Webhook: Failed to send error reply', innerError);
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('LINE Webhook Error:', error);
    return NextResponse.json({ status: 'ok' }); // Always return 200 to LINE
  }
}

async function handleEvent(
  event: Record<string, unknown>,
  chatService: ChatService,
  lineService: LineMessagingService
): Promise<void> {
  const replyToken = event.replyToken as string | undefined;
  if (!replyToken) return;

  const eventType = event.type as string;

  switch (eventType) {
    case 'message': {
      const message = event.message as Record<string, unknown>;
      if (message?.type !== 'text') {
        // Non-text message → show menu
        const response = chatService.getMainMenu('กรุณาเลือกเมนูด้านล่าง หรือพิมพ์ "เมนู"');
        const messages = lineService.convertChatResponseToLineMessages(response);
        await lineService.replyMessage(replyToken, messages);
        return;
      }

      const text = ((message.text as string) ?? '').trim();
      const response = await chatService.processCommand(text);
      const messages = lineService.convertChatResponseToLineMessages(response);
      await lineService.replyMessage(replyToken, messages);
      break;
    }

    case 'postback': {
      const postback = event.postback as Record<string, unknown>;
      const dataStr = (postback?.data as string) ?? '';

      // Parse postback data (format: action=value&key=value)
      const params = new URLSearchParams(dataStr);
      const action = params.get('action') ?? '';
      params.delete('action');
      const paramsObj: Record<string, string> = {};
      params.forEach((value, key) => { paramsObj[key] = value; });

      const response = await chatService.processAction(action, paramsObj);
      const messages = lineService.convertChatResponseToLineMessages(response);
      await lineService.replyMessage(replyToken, messages);
      break;
    }

    case 'follow': {
      // User added bot as friend
      const response = chatService.getMainMenu('🎉 ยินดีต้อนรับสู่ Racing Game Station!\n\nผมพร้อมช่วยเหลือคุณเรื่องข้อมูลร้านเกม กรุณาเลือกเมนูด้านล่าง:');
      const messages = lineService.convertChatResponseToLineMessages(response);
      await lineService.replyMessage(replyToken, messages);
      break;
    }

    default:
      break;
  }
}
