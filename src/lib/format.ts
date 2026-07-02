import type { Component } from "./types";

export function formatPrice(price: number, currency: string): string {
  return `${price.toLocaleString("ru-RU")} ${currency}`;
}

export function specSummary(component: Component): string | null {
  if (component.cpuSpecs) return `${component.cpuSpecs.cores} ядер · ${component.cpuSpecs.socket}`;
  if (component.motherboardSpecs) return `${component.motherboardSpecs.socket} · ${component.motherboardSpecs.formFactor}`;
  if (component.ramSpecs) return `${component.ramSpecs.capacityGb} ГБ · ${component.ramSpecs.memoryType}`;
  if (component.gpuSpecs) return `${component.gpuSpecs.vram} ГБ VRAM`;
  if (component.storageSpecs) return `${component.storageSpecs.capacityGb} ГБ · ${component.storageSpecs.type}`;
  if (component.psuSpecs) return `${component.psuSpecs.wattage} Вт · ${component.psuSpecs.modular}`;
  if (component.caseSpecs) return component.caseSpecs.formFactor;
  if (component.coolingSpecs) return component.coolingSpecs.type;
  return null;
}
