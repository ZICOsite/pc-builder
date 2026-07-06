import {
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
  Cable,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType as PcComponentType } from "./types";
import { MotherboardIcon } from "@/components/motherboard-icon";

export const CATEGORY_ICONS: Record<PcComponentType, LucideIcon | typeof MotherboardIcon> = {
  CPU: Cpu,
  MOTHERBOARD: MotherboardIcon,
  RAM: MemoryStick,
  GPU: Gpu,
  STORAGE: HardDrive,
  PSU: Cable,
  CASE: PcCase,
  COOLING: Fan,
  MONITOR: Monitor,
  KEYBOARD: Keyboard,
  MOUSE: Mouse,
  HEADSET: Headphones,
};
