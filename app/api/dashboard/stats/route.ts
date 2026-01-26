/**
 * Home Dashboard Stats API Route
 * 
 * GET /api/dashboard/stats - Get home page dashboard statistics
 */

import { SupabaseDashboardRepository } from '@/src/infrastructure/repositories/supabase/SupabaseDashboardRepository';
import { createClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const repository = new SupabaseDashboardRepository(supabase);
    
    const stats = await repository.getHomeDashboardStats();
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลแดชบอร์ดได้' },
      { status: 500 }
    );
  }
}
