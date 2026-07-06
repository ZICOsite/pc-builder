import {
  CircuitBoard,
  Cpu,
  Fan,
  Gpu,
  HardDrive,
  Headphones,
  Keyboard,
  MemoryStick,
  Monitor,
  Mouse,
  PcCase,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "./types";

export const CATEGORY_ICONS: Record<ComponentType, LucideIcon> = {
  CPU: Cpu,
  MOTHERBOARD: CircuitBoard,
  RAM: MemoryStick,
  GPU: Gpu,
  STORAGE: HardDrive,
  PSU: Zap,
  CASE: PcCase,
  COOLING: Fan,
  MONITOR: Monitor,
  KEYBOARD: Keyboard,
  MOUSE: Mouse,
  HEADSET: Headphones,
};
