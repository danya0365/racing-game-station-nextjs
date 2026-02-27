/**
 * Machine Configuration
 * Constants for machine-related settings and master data
 */

export const MACHINE_TYPES = [
  { value: 'simulator', label: 'Racing Simulator' },
  { value: 'ps5', label: 'PS5' },
  { value: 'pc', label: 'PC' },
  { value: 'other', label: 'อื่นๆ' },
] as const;

export type MachineType = typeof MACHINE_TYPES[number]['value'];
