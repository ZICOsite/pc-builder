export type ComponentType =
  | "CPU"
  | "GPU"
  | "RAM"
  | "MOTHERBOARD"
  | "STORAGE"
  | "PSU"
  | "CASE"
  | "COOLING"
  | "MONITOR"
  | "KEYBOARD"
  | "MOUSE"
  | "HEADSET";

export interface CpuSpecs {
  cores: number;
  threads: number;
  socket: string;
  tdp: number;
  baseClock: number;
  boostClock: number;
}

export interface GpuSpecs {
  vram: number;
  memoryType: string;
  baseClock: number;
  boostClock: number;
  tdp: number;
  length: number;
}

export interface MotherboardSpecs {
  socket: string;
  chipset: string;
  formFactor: string;
  memoryType: string;
  memorySlots: number;
  maxMemoryGb: number;
}

export interface RamSpecs {
  capacityGb: number;
  speedMhz: number;
  memoryType: string;
}

export interface StorageSpecs {
  capacityGb: number;
  type: string;
  interfaceType: string;
  readSpeed: number | null;
  writeSpeed: number | null;
}

export interface PsuSpecs {
  wattage: number;
  efficiency: string;
  modular: string;
}

export interface CaseSpecs {
  formFactor: string;
  maxGpuLength: number;
  maxCoolerHeight: number;
}

export interface CoolingSpecs {
  type: string;
  socket: string;
  tdpSupport: number;
  height: number | null;
}

export interface MonitorSpecs {
  sizeInches: number;
  resolution: string;
  refreshRateHz: number;
  panelType?: string;
}

export interface KeyboardSpecs {
  connection: string;
  layout?: string;
  switchType?: string;
}

export interface MouseSpecs {
  connection: string;
  dpi: number;
  sensor?: string;
}

export interface HeadsetSpecs {
  connection: string;
  headsetType?: string;
  microphone?: boolean;
}

export interface Component {
  id: number;
  type: ComponentType;
  brand: string;
  name: string;
  slug: string;
  price: string;
  currency: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  specs: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  cpuSpecs: CpuSpecs | null;
  gpuSpecs: GpuSpecs | null;
  motherboardSpecs: MotherboardSpecs | null;
  ramSpecs: RamSpecs | null;
  storageSpecs: StorageSpecs | null;
  psuSpecs: PsuSpecs | null;
  caseSpecs: CaseSpecs | null;
  coolingSpecs: CoolingSpecs | null;
}

export interface BuildItem {
  id: number;
  buildId: string;
  componentId: number;
  quantity: number;
  createdAt: string;
  component: Component;
}

export interface Build {
  id: string;
  userId: number;
  name: string;
  description: string | null;
  isPublic: boolean;
  totalPrice: string | null;
  snapshot: unknown;
  createdAt: string;
  updatedAt: string;
  items: BuildItem[];
}

export interface UserProfile {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  languageCode: string | null;
  discountPercent: number;
  createdAt: string;
  updatedAt: string;
}

export type ReferralStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface ReferralEntry {
  id: number;
  referrerId: number;
  referredUserId: number;
  buildId: string;
  status: ReferralStatus;
  reward: string | null;
  createdAt: string;
  referredUser: { id: number; username: string | null; firstName: string | null };
  build: { id: string; name: string };
}

export interface ReferralStats {
  discountPercent: number;
  completedReferrals: number;
  remainingSlots: number;
  referrals: ReferralEntry[];
}
