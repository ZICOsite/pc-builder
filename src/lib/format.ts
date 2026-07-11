import type { Dictionary, Locale } from "./i18n";
import { NUMBER_LOCALES } from "./i18n";
import type { Component, HeadsetSpecs, KeyboardSpecs, MonitorSpecs, MouseSpecs } from "./types";

export interface SpecDetail {
  label: string;
  value: string;
}

export function formatPrice(price: number, currency: string, locale: Locale): string {
  return `${price.toLocaleString(NUMBER_LOCALES[locale])} ${currency}`;
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function youtubeSearchUrl(component: Pick<Component, "brand" | "name">): string {
  const query = `${component.brand} ${component.name}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
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

  if (component.specs) {
    switch (component.type) {
      case "MONITOR": {
        const s = component.specs as unknown as MonitorSpecs;
        return `${s.sizeInches}" ${s.resolution} · ${s.refreshRateHz} ${t.specs.hz}`;
      }
      case "KEYBOARD": {
        const s = component.specs as unknown as KeyboardSpecs;
        return [s.layout, s.connection].filter(Boolean).join(" · ") || null;
      }
      case "MOUSE": {
        const s = component.specs as unknown as MouseSpecs;
        return `${s.dpi} ${t.specs.dpi} · ${s.connection}`;
      }
      case "HEADSET": {
        const s = component.specs as unknown as HeadsetSpecs;
        return [s.headsetType, s.connection].filter(Boolean).join(" · ") || null;
      }
    }
  }

  return null;
}

export function specDetails(component: Component, t: Dictionary): SpecDetail[] {
  const f = t.admin.form.fields;

  if (component.cpuSpecs) {
    const s = component.cpuSpecs;
    return [
      { label: f.cores, value: String(s.cores) },
      { label: f.threads, value: String(s.threads) },
      { label: f.socket, value: s.socket },
      { label: f.tdp, value: String(s.tdp) },
      { label: f.baseClock, value: String(s.baseClock) },
      { label: f.boostClock, value: String(s.boostClock) },
    ];
  }
  if (component.gpuSpecs) {
    const s = component.gpuSpecs;
    return [
      { label: f.vram, value: String(s.vram) },
      { label: f.memoryType, value: s.memoryType },
      { label: f.baseClock, value: String(s.baseClock) },
      { label: f.boostClock, value: String(s.boostClock) },
      { label: f.tdp, value: String(s.tdp) },
      { label: f.length, value: String(s.length) },
    ];
  }
  if (component.motherboardSpecs) {
    const s = component.motherboardSpecs;
    return [
      { label: f.socket, value: s.socket },
      { label: f.chipset, value: s.chipset },
      { label: f.formFactor, value: s.formFactor },
      { label: f.memoryType, value: s.memoryType },
      { label: f.memorySlots, value: String(s.memorySlots) },
      { label: f.maxMemoryGb, value: String(s.maxMemoryGb) },
    ];
  }
  if (component.ramSpecs) {
    const s = component.ramSpecs;
    return [
      { label: f.capacityGb, value: String(s.capacityGb) },
      { label: f.speedMhz, value: String(s.speedMhz) },
      { label: f.memoryType, value: s.memoryType },
    ];
  }
  if (component.storageSpecs) {
    const s = component.storageSpecs;
    const details: SpecDetail[] = [
      { label: f.capacityGb, value: String(s.capacityGb) },
      { label: f.storageType, value: s.type },
      { label: f.interfaceType, value: s.interfaceType },
    ];
    if (s.readSpeed != null) details.push({ label: f.readSpeed, value: String(s.readSpeed) });
    if (s.writeSpeed != null) details.push({ label: f.writeSpeed, value: String(s.writeSpeed) });
    return details;
  }
  if (component.psuSpecs) {
    const s = component.psuSpecs;
    return [
      { label: f.wattage, value: String(s.wattage) },
      { label: f.efficiency, value: s.efficiency },
      { label: f.modular, value: s.modular },
    ];
  }
  if (component.caseSpecs) {
    const s = component.caseSpecs;
    return [
      { label: f.formFactor, value: s.formFactor },
      { label: f.maxGpuLength, value: String(s.maxGpuLength) },
      { label: f.maxCoolerHeight, value: String(s.maxCoolerHeight) },
    ];
  }
  if (component.coolingSpecs) {
    const s = component.coolingSpecs;
    const details: SpecDetail[] = [
      { label: f.coolingType, value: s.type },
      { label: f.socket, value: s.socket },
      { label: f.tdpSupport, value: String(s.tdpSupport) },
    ];
    if (s.height != null) details.push({ label: f.height, value: String(s.height) });
    return details;
  }

  if (component.specs) {
    switch (component.type) {
      case "MONITOR": {
        const s = component.specs as unknown as MonitorSpecs;
        const details: SpecDetail[] = [
          { label: f.sizeInches, value: String(s.sizeInches) },
          { label: f.resolution, value: s.resolution },
          { label: f.refreshRateHz, value: String(s.refreshRateHz) },
        ];
        if (s.panelType) details.push({ label: f.panelType, value: s.panelType });
        return details;
      }
      case "KEYBOARD": {
        const s = component.specs as unknown as KeyboardSpecs;
        const details: SpecDetail[] = [{ label: f.connection, value: s.connection }];
        if (s.layout) details.push({ label: f.layout, value: s.layout });
        if (s.switchType) details.push({ label: f.switchType, value: s.switchType });
        return details;
      }
      case "MOUSE": {
        const s = component.specs as unknown as MouseSpecs;
        const details: SpecDetail[] = [
          { label: f.connection, value: s.connection },
          { label: f.dpi, value: String(s.dpi) },
        ];
        if (s.sensor) details.push({ label: f.sensor, value: s.sensor });
        return details;
      }
      case "HEADSET": {
        const s = component.specs as unknown as HeadsetSpecs;
        const details: SpecDetail[] = [{ label: f.connection, value: s.connection }];
        if (s.headsetType) details.push({ label: f.headsetType, value: s.headsetType });
        if (s.microphone != null) {
          details.push({ label: f.microphone, value: s.microphone ? "✓" : "—" });
        }
        return details;
      }
    }
  }

  return [];
}
