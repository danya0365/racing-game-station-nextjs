/**
 * HomePresenterClientFactory
 * Factory for creating HomePresenter instances on the client side
 * 
 * ✅ Uses API-based repositories to avoid Supabase connection pool issues
 * ✅ Updated to use ApiWalkInQueueRepository (new schema)
 */

'use client';

import { ApiBookingRepository } from '@/src/infrastructure/repositories/api/ApiBookingRepository';
import { ApiMachineRepository } from '@/src/infrastructure/repositories/api/ApiMachineRepository';
import { ApiWalkInQueueRepository } from '@/src/infrastructure/repositories/api/ApiWalkInQueueRepository';
import { HomePresenter } from './HomePresenter';

export class HomePresenterClientFactory {
  static create(): HomePresenter {
    // ✅ Using API repositories - no direct Supabase connection
    const machineRepository = new ApiMachineRepository();
    const walkInQueueRepository = new ApiWalkInQueueRepository();
    const bookingRepository = new ApiBookingRepository();

    return new HomePresenter(machineRepository, walkInQueueRepository, bookingRepository);
  }
}

export function createClientHomePresenter(): HomePresenter {
  return HomePresenterClientFactory.create();
}
