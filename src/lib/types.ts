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

export const COMPONENT_TYPES: ComponentType[] = [
  "CPU",
  "MOTHERBOARD",
  "RAM",
  "GPU",
  "STORAGE",
  "PSU",
  "CASE",
  "COOLING",
  "MONITOR",
  "KEYBOARD",
  "MOUSE",
  "HEADSET",
];

// Обязательные для "полной сборки ПК" категории теперь настраиваются админом
// (см. GET /settings/required-categories) — см. RequiredCategory на бэкенде.
export interface RequiredCategory {
  type: ComponentType;
  required: boolean;
}

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
  // Считается на бэкенде из актуальных цен компонентов при каждом запросе, не хранится и не
  // "замораживается" — в отличие от Order.totalPrice, который фиксируется на момент покупки.
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
  items: BuildItem[];
  // Присутствует только когда запрос сделан владельцем сборки (см. BuildsService.findOne)
  user?: { discountPercent: number };
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
  isAdmin: boolean;
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

export interface AdminDashboard {
  totalComponents: number;
  totalUsers: number;
  totalBuilds: number;
  lowStock: { id: number; name: string; type: ComponentType; stock: number }[];
  lowStockThreshold: number;
  pendingOrders: number;
}

export type StatsRangeDays = 7 | 30 | 90;

export interface AdminStatsPoint {
  date: string;
  revenue: number;
  orders: number;
  newUsers: number;
}

export interface TopProduct {
  componentId: number;
  name: string;
  brand: string;
  quantitySold: number;
  revenue: number;
}

export interface TopBuyer {
  buyer: {
    id: number;
    telegramId: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
  };
  orders: number;
  totalSpent: number;
}

export interface AdminLeaderboards {
  topProducts: TopProduct[];
  topBuyers: TopBuyer[];
}

export interface AdminUser {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  discountPercent: number;
  createdAt: string;
  _count: { builds: number; orders: number; referralsSent: number };
}

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface OrderItemSnapshot {
  componentId: number;
  name: string;
  brand: string;
  price: string;
  currency: string;
  quantity: number;
}

export interface Order {
  id: number;
  buildId: string | null;
  buyerId: number;
  buildName: string;
  itemsSnapshot: OrderItemSnapshot[];
  totalPrice: string;
  currency: string;
  discountPercent: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  buyer: {
    id: number;
    telegramId: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface ComponentInput {
  type: ComponentType;
  brand: string;
  name: string;
  slug: string;
  price: number;
  currency?: string;
  stock?: number;
  imageUrl?: string;
  isActive?: boolean;
  specs?: Record<string, unknown>;
  cpuSpecs?: CpuSpecs;
  gpuSpecs?: GpuSpecs;
  motherboardSpecs?: MotherboardSpecs;
  ramSpecs?: RamSpecs;
  storageSpecs?: { capacityGb: number; type: string; interfaceType: string; readSpeed?: number; writeSpeed?: number };
  psuSpecs?: PsuSpecs;
  caseSpecs?: CaseSpecs;
  coolingSpecs?: { type: string; socket: string; tdpSupport: number; height?: number };
}
