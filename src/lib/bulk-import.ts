import Papa from "papaparse";
import { slugify } from "./format";
import type { ComponentInput, ComponentType } from "./types";

// Держать в синхроне с BULK_IMPORT_MAX_ITEMS на бэкенде (pc-builder-api/.../bulk-create-components.dto.ts)
export const BULK_IMPORT_MAX_ITEMS = 500;

const COMMON_COLUMNS = ["type", "brand", "name", "slug", "price", "currency", "stock", "imageUrl", "isActive"] as const;

// Колонки для specs — с префиксом по типу, чтобы избежать коллизий имён между типами
// (например socket встречается у CPU/MOTHERBOARD/COOLING, а type — у STORAGE и у самого товара).
const TYPE_COLUMNS: Record<ComponentType, readonly string[]> = {
  CPU: ["cpu_cores", "cpu_threads", "cpu_socket", "cpu_tdp", "cpu_baseClock", "cpu_boostClock"],
  GPU: ["gpu_vram", "gpu_memoryType", "gpu_baseClock", "gpu_boostClock", "gpu_tdp", "gpu_length"],
  MOTHERBOARD: ["mb_socket", "mb_chipset", "mb_formFactor", "mb_memoryType", "mb_memorySlots", "mb_maxMemoryGb"],
  RAM: ["ram_capacityGb", "ram_speedMhz", "ram_memoryType"],
  STORAGE: ["storage_capacityGb", "storage_type", "storage_interfaceType", "storage_readSpeed", "storage_writeSpeed"],
  PSU: ["psu_wattage", "psu_efficiency", "psu_modular"],
  CASE: ["case_formFactor", "case_maxGpuLength", "case_maxCoolerHeight"],
  COOLING: ["cooling_type", "cooling_socket", "cooling_tdpSupport", "cooling_height"],
  MONITOR: ["monitor_sizeInches", "monitor_resolution", "monitor_refreshRateHz", "monitor_panelType"],
  KEYBOARD: ["keyboard_connection", "keyboard_layout", "keyboard_switchType"],
  MOUSE: ["mouse_connection", "mouse_dpi", "mouse_sensor"],
  HEADSET: ["headset_connection", "headset_headsetType", "headset_microphone"],
};

const EXAMPLE_ROWS: Record<ComponentType, Record<string, string>> = {
  CPU: { brand: "AMD", name: "Ryzen 5 7500F", price: "1800000", stock: "5", cpu_cores: "6", cpu_threads: "12", cpu_socket: "AM5", cpu_tdp: "65", cpu_baseClock: "3.7", cpu_boostClock: "5.0" },
  GPU: { brand: "NVIDIA", name: "RTX 4060", price: "4200000", stock: "3", gpu_vram: "8", gpu_memoryType: "GDDR6", gpu_baseClock: "1830", gpu_boostClock: "2460", gpu_tdp: "115", gpu_length: "245" },
  MOTHERBOARD: { brand: "ASUS", name: "TUF Gaming B650-Plus", price: "1500000", stock: "4", mb_socket: "AM5", mb_chipset: "B650", mb_formFactor: "ATX", mb_memoryType: "DDR5", mb_memorySlots: "4", mb_maxMemoryGb: "128" },
  RAM: { brand: "Kingston", name: "Fury Beast 16GB", price: "450000", stock: "10", ram_capacityGb: "16", ram_speedMhz: "3200", ram_memoryType: "DDR4" },
  STORAGE: { brand: "Samsung", name: "980 1TB", price: "700000", stock: "8", storage_capacityGb: "1000", storage_type: "NVMe SSD", storage_interfaceType: "PCIe 3.0", storage_readSpeed: "3500", storage_writeSpeed: "3000" },
  PSU: { brand: "Corsair", name: "RM650", price: "800000", stock: "6", psu_wattage: "650", psu_efficiency: "80+ Gold", psu_modular: "Full" },
  CASE: { brand: "DeepCool", name: "CC560", price: "500000", stock: "5", case_formFactor: "ATX", case_maxGpuLength: "330", case_maxCoolerHeight: "165" },
  COOLING: { brand: "DeepCool", name: "AK400", price: "250000", stock: "7", cooling_type: "Air", cooling_socket: "AM5", cooling_tdpSupport: "220", cooling_height: "155" },
  MONITOR: { brand: "LG", name: "27GP850", price: "3500000", stock: "2", monitor_sizeInches: "27", monitor_resolution: "2560x1440", monitor_refreshRateHz: "165", monitor_panelType: "Nano IPS" },
  KEYBOARD: { brand: "Logitech", name: "G413", price: "600000", stock: "9", keyboard_connection: "USB", keyboard_layout: "TKL", keyboard_switchType: "Tactile" },
  MOUSE: { brand: "Logitech", name: "G Pro X Superlight", price: "900000", stock: "6", mouse_connection: "Wireless", mouse_dpi: "25600", mouse_sensor: "HERO 25K" },
  HEADSET: { brand: "HyperX", name: "Cloud II", price: "550000", stock: "8", headset_connection: "USB", headset_headsetType: "Over-ear", headset_microphone: "true" },
};

export function buildCsvTemplate(): string {
  const allColumns = [...COMMON_COLUMNS, ...Object.values(TYPE_COLUMNS).flat()];
  const header = allColumns.join(",");

  const rows = (Object.keys(EXAMPLE_ROWS) as ComponentType[]).map((type) => {
    const example = EXAMPLE_ROWS[type];
    return allColumns
      .map((column) => {
        const value = column === "type" ? type : (example[column] ?? "");
        return value.includes(",") ? `"${value}"` : value;
      })
      .join(",");
  });

  return [header, ...rows].join("\n");
}

function num(v: string | undefined): number | undefined {
  if (!v || !v.trim()) return undefined;
  const parsed = Number(v);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function bool(v: string | undefined, fallback: boolean): boolean {
  if (!v || !v.trim()) return fallback;
  return v.trim().toLowerCase() === "true" || v.trim() === "1";
}

function str(v: string | undefined): string | undefined {
  return v && v.trim() ? v.trim() : undefined;
}

export function csvRowToComponentInput(
  row: Record<string, string>,
): { input: ComponentInput } | { error: string } {
  const type = row.type?.trim() as ComponentType;
  if (!type || !(type in TYPE_COLUMNS)) {
    return { error: `unknown or missing "type": "${row.type ?? ""}"` };
  }

  const brand = row.brand?.trim() ?? "";
  const name = row.name?.trim() ?? "";
  const price = num(row.price);
  if (!brand || !name || price === undefined) {
    return { error: "brand, name and price are required" };
  }

  const base: ComponentInput = {
    type,
    brand,
    name,
    slug: str(row.slug) ?? slugify(`${brand} ${name}`),
    price,
    currency: str(row.currency) ?? "UZS",
    stock: num(row.stock),
    imageUrl: str(row.imageUrl),
    isActive: bool(row.isActive, true),
  };

  switch (type) {
    case "CPU":
      return {
        input: {
          ...base,
          cpuSpecs: {
            cores: num(row.cpu_cores) ?? 0,
            threads: num(row.cpu_threads) ?? 0,
            socket: row.cpu_socket ?? "",
            tdp: num(row.cpu_tdp) ?? 0,
            baseClock: num(row.cpu_baseClock) ?? 0,
            boostClock: num(row.cpu_boostClock) ?? 0,
          },
        },
      };
    case "GPU":
      return {
        input: {
          ...base,
          gpuSpecs: {
            vram: num(row.gpu_vram) ?? 0,
            memoryType: row.gpu_memoryType ?? "",
            baseClock: num(row.gpu_baseClock) ?? 0,
            boostClock: num(row.gpu_boostClock) ?? 0,
            tdp: num(row.gpu_tdp) ?? 0,
            length: num(row.gpu_length) ?? 0,
          },
        },
      };
    case "MOTHERBOARD":
      return {
        input: {
          ...base,
          motherboardSpecs: {
            socket: row.mb_socket ?? "",
            chipset: row.mb_chipset ?? "",
            formFactor: row.mb_formFactor ?? "",
            memoryType: row.mb_memoryType ?? "",
            memorySlots: num(row.mb_memorySlots) ?? 0,
            maxMemoryGb: num(row.mb_maxMemoryGb) ?? 0,
          },
        },
      };
    case "RAM":
      return {
        input: {
          ...base,
          ramSpecs: {
            capacityGb: num(row.ram_capacityGb) ?? 0,
            speedMhz: num(row.ram_speedMhz) ?? 0,
            memoryType: row.ram_memoryType ?? "",
          },
        },
      };
    case "STORAGE":
      return {
        input: {
          ...base,
          storageSpecs: {
            capacityGb: num(row.storage_capacityGb) ?? 0,
            type: row.storage_type ?? "",
            interfaceType: row.storage_interfaceType ?? "",
            readSpeed: num(row.storage_readSpeed),
            writeSpeed: num(row.storage_writeSpeed),
          },
        },
      };
    case "PSU":
      return {
        input: {
          ...base,
          psuSpecs: {
            wattage: num(row.psu_wattage) ?? 0,
            efficiency: row.psu_efficiency ?? "",
            modular: row.psu_modular ?? "",
          },
        },
      };
    case "CASE":
      return {
        input: {
          ...base,
          caseSpecs: {
            formFactor: row.case_formFactor ?? "",
            maxGpuLength: num(row.case_maxGpuLength) ?? 0,
            maxCoolerHeight: num(row.case_maxCoolerHeight) ?? 0,
          },
        },
      };
    case "COOLING":
      return {
        input: {
          ...base,
          coolingSpecs: {
            type: row.cooling_type ?? "",
            socket: row.cooling_socket ?? "",
            tdpSupport: num(row.cooling_tdpSupport) ?? 0,
            height: num(row.cooling_height),
          },
        },
      };
    case "MONITOR":
      return {
        input: {
          ...base,
          specs: {
            sizeInches: num(row.monitor_sizeInches) ?? 0,
            resolution: row.monitor_resolution ?? "",
            refreshRateHz: num(row.monitor_refreshRateHz) ?? 0,
            panelType: str(row.monitor_panelType),
          },
        },
      };
    case "KEYBOARD":
      return {
        input: {
          ...base,
          specs: {
            connection: row.keyboard_connection ?? "",
            layout: str(row.keyboard_layout),
            switchType: str(row.keyboard_switchType),
          },
        },
      };
    case "MOUSE":
      return {
        input: {
          ...base,
          specs: {
            connection: row.mouse_connection ?? "",
            dpi: num(row.mouse_dpi) ?? 0,
            sensor: str(row.mouse_sensor),
          },
        },
      };
    case "HEADSET":
      return {
        input: {
          ...base,
          specs: {
            connection: row.headset_connection ?? "",
            headsetType: str(row.headset_headsetType),
            microphone: row.headset_microphone ? bool(row.headset_microphone, false) : undefined,
          },
        },
      };
  }
}

export function parseCsvFile(file: File): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
}

export function parseJsonInput(raw: string): { items: ComponentInput[] } | { error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "invalid JSON" };
  }
  if (!Array.isArray(parsed)) {
    return { error: "expected a JSON array of products" };
  }
  return { items: parsed as ComponentInput[] };
}
