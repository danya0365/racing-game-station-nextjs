/**
 * BackendPresenterServerFactory
 * Factory for creating BackendPresenter instances on the server side
 * 
 * ✅ Uses new IWalkInQueueRepository and ISessionRepository
 * ✅ Uses IBookingRepository (TIMESTAMPTZ-based)
 */

import { SupabaseBookingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingRepository';
import { SupabaseMachineRepository } from '@/src/infrastructure/repositories/supabase/SupabaseMachineRepository';
import { SupabaseSessionRepository } from '@/src/infrastructure/repositories/supabase/SupabaseSessionRepository';
import { SupabaseStorageRepository } from '@/src/infrastructure/repositories/supabase/SupabaseStorageRepository';
import { SupabaseWalkInQueueRepository } from '@/src/infrastructure/repositories/supabase/SupabaseWalkInQueueRepository';
import { createClient } from '@/src/infrastructure/supabase/server';
import { BackendPresenter } from './BackendPresenter';

export class BackendPresenterServerFactory {
  static async create(): Promise<BackendPresenter> {
    const supabase = await createClient();
    const machineRepository = new SupabaseMachineRepository(supabase);
    const walkInQueueRepository = new SupabaseWalkInQueueRepository(supabase);
    const sessionRepository = new SupabaseSessionRepository(supabase);
    const bookingRepository = new SupabaseBookingRepository(supabase);
    const storageRepository = new SupabaseStorageRepository(supabase);

    return new BackendPresenter(
      machineRepository,
      walkInQueueRepository,
      sessionRepository,
      bookingRepository,
      storageRepository
    );
  }
}

export async function createServerBackendPresenter(): Promise<BackendPresenter> {
  return await BackendPresenterServerFactory.create();
}
