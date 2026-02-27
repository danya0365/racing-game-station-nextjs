/**
 * BackendPresenterClientFactory
 * Factory for creating BackendPresenter instances on the client side
 * 
 * ✅ Uses API-based repositories to avoid Supabase connection pool issues
 * ✅ Uses new IWalkInQueueRepository and ISessionRepository
 */

'use client';

import { ApiBookingRepository } from '@/src/infrastructure/repositories/api/ApiBookingRepository';
import { ApiMachineRepository } from '@/src/infrastructure/repositories/api/ApiMachineRepository';
import { ApiSessionRepository } from '@/src/infrastructure/repositories/api/ApiSessionRepository';
import { ApiStorageRepository } from '@/src/infrastructure/repositories/api/ApiStorageRepository';
import { ApiWalkInQueueRepository } from '@/src/infrastructure/repositories/api/ApiWalkInQueueRepository';
import { BackendPresenter } from './BackendPresenter';

export class BackendPresenterClientFactory {
  static create(): BackendPresenter {
    // ✅ Using API repositories - no direct Supabase connection
    const machineRepository = new ApiMachineRepository();
    const walkInQueueRepository = new ApiWalkInQueueRepository();
    const sessionRepository = new ApiSessionRepository();
    const bookingRepository = new ApiBookingRepository();
    const storageRepository = new ApiStorageRepository();

    return new BackendPresenter(
      machineRepository,
      walkInQueueRepository,
      sessionRepository,
      bookingRepository,
      storageRepository
    );
  }
}

export function createClientBackendPresenter(): BackendPresenter {
  return BackendPresenterClientFactory.create();
}
