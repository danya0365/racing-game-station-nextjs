/**
 * Chat Welcome API Route
 * GET /api/chat/welcome
 * 
 * Returns welcome message with main menu
 * Requires admin authentication
 */

import { ChatService } from '@/src/application/services/ChatService';
import { SupabaseChatRepository } from '@/src/infrastructure/repositories/supabase/SupabaseChatRepository';
import { createClient } from '@/src/infrastructure/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
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

    const repo = new SupabaseChatRepository(supabase);
    const chatService = new ChatService(repo);
    const response = chatService.getMainMenu('🎉 ยินดีต้อนรับสู่ Racing Game Station!\n\nผมพร้อมช่วยเหลือคุณเรื่องข้อมูลร้านเกม กรุณาเลือกเมนูด้านล่าง:');

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Chat Welcome Error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
