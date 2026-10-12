/**
 * Machines API Route
 * GET /api/machines - Get all machines
 * POST /api/machines - Create machine (admin)
 */

import { SupabaseMachineRepository } from '@/src/infrastructure/repositories/supabase/SupabaseMachineRepository';
import { createClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const repo = new SupabaseMachineRepository(supabase);

    // Check for specific query params
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // Optional ?branch=<uuid> — restrict results to one branch.
    // Omit for staff/admin views that need every branch.
    const branchId = searchParams.get('branch') || undefined;

    if (action === 'available') {
      const machines = await repo.getAvailable(branchId);
      return NextResponse.json(machines);
    }

    if (action === 'stats') {
      const stats = await repo.getStats(branchId);
      return NextResponse.json(stats);
    }

    if (action === 'dashboard') {
      const dashboard = await repo.getDashboardInfo();
      return NextResponse.json(dashboard);
    }

    // Default: get all machines
    const machines = await repo.getAll(branchId);
    return NextResponse.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดข้อมูลเครื่องได้' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const repo = new SupabaseMachineRepository(supabase);

    const data = await request.json();
    const machine = await repo.create(data);
    return NextResponse.json(machine, { status: 201 });
  } catch (error) {
    console.error('Error creating machine:', error);
    return NextResponse.json(
      { error: 'ไม่สามารถสร้างเครื่องได้' },
      { status: 500 }
    );
  }
}
