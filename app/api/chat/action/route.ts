/**
 * Chat Action API Route
 * POST /api/chat/action
 * 
 * Processes postback actions via ChatService
 * Requires admin authentication
 */

import { ChatService } from '@/src/application/services/ChatService';
import { SupabaseChatRepository } from '@/src/infrastructure/repositories/supabase/SupabaseChatRepository';
import { createClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: role } = await supabase.rpc('get_active_profile_role');
    if (role !== 'admin' && role !== 'moderator') {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const action = body.action?.trim();
    const params = body.params ?? {};

    if (!action || typeof action !== 'string') {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุ action' },
        { status: 400 }
      );
    }

    const repo = new SupabaseChatRepository(supabase);
    const chatService = new ChatService(repo);
    const response = await chatService.processAction(action, params);

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Chat Action Error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
