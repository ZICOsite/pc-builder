import type { BuildItem, Component, ComponentType } from "./types";
import { CORE_COMPONENT_TYPES } from "./types";

export type Selections = Partial<Record<ComponentType, Component>>;

// Категории core-сборки, которых не хватает в этом наборе items — пустой массив значит сборка полная
export function missingCoreTypes(items: BuildItem[]): ComponentType[] {
  const presentTypes = new Set(items.map((item) => item.component.type));
  return CORE_COMPONENT_TYPES.filter((type) => !presentTypes.has(type));
}

// Заказать можно полностью собранный ПК (все core-категории) или набор из одной периферии
// (0 core-категорий) — недобранный ПК (часть core-категорий) заказать нельзя, см. builds.service.ts
export function canOrderBuild(items: BuildItem[]): boolean {
  const presentTypes = new Set(items.map((item) => item.component.type));
  const coreCount = CORE_COMPONENT_TYPES.filter((type) => presentTypes.has(type)).length;
  return coreCount === 0 || coreCount === CORE_COMPONENT_TYPES.length;
}

const PSU_WATTAGE_MIN_BUFFER = 100;
const PSU_WATTAGE_MARGIN = 1.3;

export function isCompatible(type: ComponentType, component: Component, selections: Selections): boolean {
  const cpu = selections.CPU;
  const motherboard = selections.MOTHERBOARD;
  const gpu = selections.GPU;
  const pcCase = selections.CASE;
  const cooling = selections.COOLING;

  switch (type) {
    case "CPU":
      return !motherboard?.motherboardSpecs || component.cpuSpecs?.socket === motherboard.motherboardSpecs.socket;

    case "MOTHERBOARD":
      return !cpu?.cpuSpecs || component.motherboardSpecs?.socket === cpu.cpuSpecs.socket;

    case "RAM":
      return !motherboard?.motherboardSpecs || component.ramSpecs?.memoryType === motherboard.motherboardSpecs.memoryType;

    case "GPU":
      return (
        !pcCase?.caseSpecs ||
        !component.gpuSpecs ||
        component.gpuSpecs.length <= pcCase.caseSpecs.maxGpuLength
      );

    case "COOLING": {
      if (cpu?.cpuSpecs && component.coolingSpecs) {
        const supportedSockets = component.coolingSpecs.socket.split(",").map((s) => s.trim());
        if (!supportedSockets.includes(cpu.cpuSpecs.socket)) return false;
      }
      if (pcCase?.caseSpecs && component.coolingSpecs?.height) {
        if (component.coolingSpecs.height > pcCase.caseSpecs.maxCoolerHeight) return false;
      }
      return true;
    }

    case "CASE": {
      if (gpu?.gpuSpecs && component.caseSpecs && component.caseSpecs.maxGpuLength < gpu.gpuSpecs.length) {
        return false;
      }
      if (cooling?.coolingSpecs?.height && component.caseSpecs && component.caseSpecs.maxCoolerHeight < cooling.coolingSpecs.height) {
        return false;
      }
      return true;
    }

    case "PSU": {
      const drawWattage = (cpu?.cpuSpecs?.tdp ?? 0) + (gpu?.gpuSpecs?.tdp ?? 0);
      if (drawWattage === 0 || !component.psuSpecs) return true;
      // Запас растёт вместе с мощностью сборки (правило ~30%), но не меньше фиксированного минимума
      const requiredWattage = Math.max(drawWattage * PSU_WATTAGE_MARGIN, drawWattage + PSU_WATTAGE_MIN_BUFFER);
      return component.psuSpecs.wattage >= requiredWattage;
    }

    default:
      return true;
  }
}
