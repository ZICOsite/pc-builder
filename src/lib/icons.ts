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
  type LucideIcon,
} from "lucide-react";
import type { ComponentType as PcComponentType } from "./types";
import { MotherboardIcon } from "@/components/motherboard-icon";
import { PsuIcon } from "@/components/psu-icon";

type CustomIcon = typeof MotherboardIcon | typeof PsuIcon;

export const CATEGORY_ICONS: Record<PcComponentType, LucideIcon | CustomIcon> = {
  CPU: Cpu,
  MOTHERBOARD: MotherboardIcon,
  RAM: MemoryStick,
  GPU: Gpu,
  STORAGE: HardDrive,
  PSU: PsuIcon,
  CASE: PcCase,
  COOLING: Fan,
  MONITOR: Monitor,
  KEYBOARD: Keyboard,
  MOUSE: Mouse,
  HEADSET: Headphones,
};
