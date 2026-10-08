/**
 * Walk-In Queue Stats API Route
 * 
 * GET /api/walk-in-queue/stats - Get queue statistics
 */

import { SupabaseWalkInQueueRepository } from '@/src/infrastructure/repositories/supabase/SupabaseWalkInQueueRepository';
import { createClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/walk-in-queue/stats
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const repository = new SupabaseWalkInQueueRepository(supabase);
    
    // Optional ?branch=<uuid> — restrict stats to one branch
    const branchId = new URL(request.url).searchParams.get('branch') || undefined;
    const stats = await repository.getStats(branchId);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching queue stats:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ไม่สามารถโหลดสถิติคิวได้' },
      { status: 500 }
    );
  }
}
