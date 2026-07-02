import type { Dictionary, Locale } from "./i18n";
import { NUMBER_LOCALES } from "./i18n";
import type { Component } from "./types";

export function formatPrice(price: number, currency: string, locale: Locale): string {
  return `${price.toLocaleString(NUMBER_LOCALES[locale])} ${currency}`;
}

export function specSummary(component: Component, t: Dictionary): string | null {
  if (component.cpuSpecs) return `${component.cpuSpecs.cores} ${t.specs.cores} · ${component.cpuSpecs.socket}`;
  if (component.motherboardSpecs) return `${component.motherboardSpecs.socket} · ${component.motherboardSpecs.formFactor}`;
  if (component.ramSpecs) return `${component.ramSpecs.capacityGb} ${t.specs.gb} · ${component.ramSpecs.memoryType}`;
  if (component.gpuSpecs) return `${component.gpuSpecs.vram} ${t.specs.gb} VRAM`;
  if (component.storageSpecs) return `${component.storageSpecs.capacityGb} ${t.specs.gb} · ${component.storageSpecs.type}`;
  if (component.psuSpecs) return `${component.psuSpecs.wattage} ${t.specs.watts} · ${component.psuSpecs.modular}`;
  if (component.caseSpecs) return component.caseSpecs.formFactor;
  if (component.coolingSpecs) return component.coolingSpecs.type;
  return null;
}
