/**
 * MockMachineRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    CreateMachineData,
    IMachineRepository,
    Machine,
    MachineDashboardDTO,
    MachineStats,
    MachineStatus,
    UpdateMachineData,
} from '@/src/application/repositories/IMachineRepository';
import dayjs from 'dayjs';

// Mock data for Racing Game Station machines
const MOCK_MACHINES: Machine[] = [
  {
    id: 'machine-001',
    name: 'Game Station 1',
    description: 'Formula Racing Game Station with Fanatec GT DD Pro',
    position: 1,
    imageUrl: '/images/machines/station-1.jpg',
    isActive: true,
    status: 'available',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'machine-002',
    name: 'Game Station 2',
    description: 'GT Racing Game Station with Thrustmaster T300RS',
    position: 2,
    imageUrl: '/images/machines/station-2.jpg',
    isActive: true,
    status: 'occupied',
    type: 'Game Station',
    hourlyRate: 200,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-07T10:00:00.000Z',
  },
  {
    id: 'machine-003',
    name: 'Game Station 3',
    description: 'Rally Racing Game Station with Logitech G923',
    position: 3,
    imageUrl: '/images/machines/station-3.jpg',
    isActive: true,
    status: 'available',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'machine-004',
    name: 'Game Station 4',
    description: 'Drift Game Station with Ultrawide 49"',
    position: 4,
    imageUrl: '/images/machines/station-4.jpg',
    isActive: true,
    status: 'occupied',
    type: 'Game Station',
    hourlyRate: 250,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-07T11:00:00.000Z',
  },
  {
    id: 'machine-005',
    name: 'Game Station 5',
    description: 'F1 Game Station VIP with Motion Platform',
    position: 5,
    imageUrl: '/images/machines/station-5.jpg',
    isActive: true,
    status: 'available',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'machine-006',
    name: 'Game Station 6',
    description: 'Endurance Game Station Pro for E-Sports',
    position: 6,
    imageUrl: '/images/machines/station-6.jpg',
    isActive: false,
    status: 'maintenance',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-06T15:00:00.000Z',
  },
];

export class MockMachineRepository implements IMachineRepository {
  private machines: Machine[] = [...MOCK_MACHINES];

  async getById(id: string): Promise<Machine | null> {
    await this.delay(100);
    return this.machines.find((machine) => machine.id === id) || null;
  }

  async getAll(): Promise<Machine[]> {
    await this.delay(100);
    return [...this.machines].sort((a, b) => a.position - b.position);
  }

  async getAvailable(): Promise<Machine[]> {
    await this.delay(100);
    return this.machines
      .filter((machine) => machine.isActive && machine.status === 'available')
      .sort((a, b) => a.position - b.position);
  }

  async create(data: CreateMachineData): Promise<Machine> {
    await this.delay(200);

    const newMachine: Machine = {
      id: `machine-${dayjs().valueOf()}`,
      ...data,
      isActive: true,
      status: 'available',
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
    };

    this.machines.push(newMachine);
    return newMachine;
  }

  async update(id: string, data: UpdateMachineData): Promise<Machine> {
    await this.delay(200);

    const index = this.machines.findIndex((machine) => machine.id === id);
    if (index === -1) {
      throw new Error('Machine not found');
    }

    const updatedMachine: Machine = {
      ...this.machines[index],
      ...data,
      updatedAt: dayjs().toISOString(),
    };

    this.machines[index] = updatedMachine;
    return updatedMachine;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(200);

    const index = this.machines.findIndex((machine) => machine.id === id);
    if (index === -1) {
      return false;
    }

    this.machines.splice(index, 1);
    return true;
  }

  async getStats(): Promise<MachineStats> {
    await this.delay(100);

    const activeMachines = this.machines.filter((m) => m.isActive);
    const totalMachines = activeMachines.length;
    const availableMachines = activeMachines.filter((m) => m.status === 'available').length;
    const occupiedMachines = activeMachines.filter((m) => m.status === 'occupied').length;
    const maintenanceMachines = this.machines.filter((m) => m.status === 'maintenance').length;

    return {
      totalMachines,
      availableMachines,
      occupiedMachines,
      maintenanceMachines,
    };
  }

  async updateStatus(id: string, status: MachineStatus): Promise<Machine> {
    await this.delay(200);

    const index = this.machines.findIndex((machine) => machine.id === id);
    if (index === -1) {
      throw new Error('Machine not found');
    }

    const updatedMachine: Machine = {
      ...this.machines[index],
      status,
      updatedAt: dayjs().toISOString(),
    };

    this.machines[index] = updatedMachine;
    return updatedMachine;
  }

  async getByIds(ids: string[]): Promise<Machine[]> {
    await this.delay(100);
    return this.machines.filter(m => ids.includes(m.id));
  }

  async getDashboardInfo(): Promise<MachineDashboardDTO[]> {
    await this.delay(100);
    return this.machines.map(m => ({
      machineId: m.id,
      waitingCount: Math.floor(Math.random() * 3),
      playingCount: m.status === 'occupied' ? 1 : 0,
      estimatedWaitMinutes: m.status === 'occupied' ? 30 : 0,
      nextPosition: 10
    }));
  }

  // Helper method to simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance for convenience
export const mockMachineRepository = new MockMachineRepository();
