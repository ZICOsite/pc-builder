"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/components/locale-provider";
import { COMPONENT_TYPES, type Component, type ComponentInput, type ComponentType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FormState {
  type: ComponentType;
  brand: string;
  name: string;
  slug: string;
  price: string;
  currency: string;
  stock: string;
  imageUrl: string;
  isActive: boolean;
  cores: string;
  threads: string;
  socket: string;
  tdp: string;
  baseClock: string;
  boostClock: string;
  vram: string;
  memoryType: string;
  length: string;
  chipset: string;
  formFactor: string;
  memorySlots: string;
  maxMemoryGb: string;
  capacityGb: string;
  speedMhz: string;
  variantType: string;
  interfaceType: string;
  readSpeed: string;
  writeSpeed: string;
  wattage: string;
  efficiency: string;
  modular: string;
  maxGpuLength: string;
  maxCoolerHeight: string;
  tdpSupport: string;
  height: string;
  sizeInches: string;
  resolution: string;
  refreshRateHz: string;
  panelType: string;
  connection: string;
  layout: string;
  switchType: string;
  dpi: string;
  sensor: string;
  headsetType: string;
  microphone: boolean;
}

function emptyForm(type: ComponentType): FormState {
  return {
    type,
    brand: "",
    name: "",
    slug: "",
    price: "",
    currency: "UZS",
    stock: "0",
    imageUrl: "",
    isActive: true,
    cores: "",
    threads: "",
    socket: "",
    tdp: "",
    baseClock: "",
    boostClock: "",
    vram: "",
    memoryType: "",
    length: "",
    chipset: "",
    formFactor: "",
    memorySlots: "",
    maxMemoryGb: "",
    capacityGb: "",
    speedMhz: "",
    variantType: "",
    interfaceType: "",
    readSpeed: "",
    writeSpeed: "",
    wattage: "",
    efficiency: "",
    modular: "",
    maxGpuLength: "",
    maxCoolerHeight: "",
    tdpSupport: "",
    height: "",
    sizeInches: "",
    resolution: "",
    refreshRateHz: "",
    panelType: "",
    connection: "",
    layout: "",
    switchType: "",
    dpi: "",
    sensor: "",
    headsetType: "",
    microphone: false,
  };
}

function fromComponent(c: Component): FormState {
  const form = emptyForm(c.type);
  Object.assign(form, {
    brand: c.brand,
    name: c.name,
    slug: c.slug,
    price: String(c.price),
    currency: c.currency,
    stock: String(c.stock),
    imageUrl: c.imageUrl ?? "",
    isActive: c.isActive,
  });

  if (c.cpuSpecs) {
    Object.assign(form, {
      cores: String(c.cpuSpecs.cores),
      threads: String(c.cpuSpecs.threads),
      socket: c.cpuSpecs.socket,
      tdp: String(c.cpuSpecs.tdp),
      baseClock: String(c.cpuSpecs.baseClock),
      boostClock: String(c.cpuSpecs.boostClock),
    });
  }
  if (c.gpuSpecs) {
    Object.assign(form, {
      vram: String(c.gpuSpecs.vram),
      memoryType: c.gpuSpecs.memoryType,
      baseClock: String(c.gpuSpecs.baseClock),
      boostClock: String(c.gpuSpecs.boostClock),
      tdp: String(c.gpuSpecs.tdp),
      length: String(c.gpuSpecs.length),
    });
  }
  if (c.motherboardSpecs) {
    Object.assign(form, {
      socket: c.motherboardSpecs.socket,
      chipset: c.motherboardSpecs.chipset,
      formFactor: c.motherboardSpecs.formFactor,
      memoryType: c.motherboardSpecs.memoryType,
      memorySlots: String(c.motherboardSpecs.memorySlots),
      maxMemoryGb: String(c.motherboardSpecs.maxMemoryGb),
    });
  }
  if (c.ramSpecs) {
    Object.assign(form, {
      capacityGb: String(c.ramSpecs.capacityGb),
      speedMhz: String(c.ramSpecs.speedMhz),
      memoryType: c.ramSpecs.memoryType,
    });
  }
  if (c.storageSpecs) {
    Object.assign(form, {
      capacityGb: String(c.storageSpecs.capacityGb),
      variantType: c.storageSpecs.type,
      interfaceType: c.storageSpecs.interfaceType,
      readSpeed: c.storageSpecs.readSpeed != null ? String(c.storageSpecs.readSpeed) : "",
      writeSpeed: c.storageSpecs.writeSpeed != null ? String(c.storageSpecs.writeSpeed) : "",
    });
  }
  if (c.psuSpecs) {
    Object.assign(form, {
      wattage: String(c.psuSpecs.wattage),
      efficiency: c.psuSpecs.efficiency,
      modular: c.psuSpecs.modular,
    });
  }
  if (c.caseSpecs) {
    Object.assign(form, {
      formFactor: c.caseSpecs.formFactor,
      maxGpuLength: String(c.caseSpecs.maxGpuLength),
      maxCoolerHeight: String(c.caseSpecs.maxCoolerHeight),
    });
  }
  if (c.coolingSpecs) {
    Object.assign(form, {
      variantType: c.coolingSpecs.type,
      socket: c.coolingSpecs.socket,
      tdpSupport: String(c.coolingSpecs.tdpSupport),
      height: c.coolingSpecs.height != null ? String(c.coolingSpecs.height) : "",
    });
  }
  if (c.specs) {
    switch (c.type) {
      case "MONITOR": {
        const s = c.specs as { sizeInches: number; resolution: string; refreshRateHz: number; panelType?: string };
        Object.assign(form, {
          sizeInches: String(s.sizeInches),
          resolution: s.resolution,
          refreshRateHz: String(s.refreshRateHz),
          panelType: s.panelType ?? "",
        });
        break;
      }
      case "KEYBOARD": {
        const s = c.specs as { connection: string; layout?: string; switchType?: string };
        Object.assign(form, { connection: s.connection, layout: s.layout ?? "", switchType: s.switchType ?? "" });
        break;
      }
      case "MOUSE": {
        const s = c.specs as { connection: string; dpi: number; sensor?: string };
        Object.assign(form, { connection: s.connection, dpi: String(s.dpi), sensor: s.sensor ?? "" });
        break;
      }
      case "HEADSET": {
        const s = c.specs as { connection: string; headsetType?: string; microphone?: boolean };
        Object.assign(form, {
          connection: s.connection,
          headsetType: s.headsetType ?? "",
          microphone: s.microphone ?? false,
        });
        break;
      }
    }
  }

  return form;
}

function buildInput(form: FormState): ComponentInput {
  const base: ComponentInput = {
    type: form.type,
    brand: form.brand,
    name: form.name,
    slug: form.slug,
    price: Number(form.price),
    currency: form.currency || undefined,
    stock: form.stock ? Number(form.stock) : undefined,
    imageUrl: form.imageUrl || undefined,
    isActive: form.isActive,
  };

  switch (form.type) {
    case "CPU":
      return {
        ...base,
        cpuSpecs: {
          cores: Number(form.cores),
          threads: Number(form.threads),
          socket: form.socket,
          tdp: Number(form.tdp),
          baseClock: Number(form.baseClock),
          boostClock: Number(form.boostClock),
        },
      };
    case "GPU":
      return {
        ...base,
        gpuSpecs: {
          vram: Number(form.vram),
          memoryType: form.memoryType,
          baseClock: Number(form.baseClock),
          boostClock: Number(form.boostClock),
          tdp: Number(form.tdp),
          length: Number(form.length),
        },
      };
    case "MOTHERBOARD":
      return {
        ...base,
        motherboardSpecs: {
          socket: form.socket,
          chipset: form.chipset,
          formFactor: form.formFactor,
          memoryType: form.memoryType,
          memorySlots: Number(form.memorySlots),
          maxMemoryGb: Number(form.maxMemoryGb),
        },
      };
    case "RAM":
      return {
        ...base,
        ramSpecs: { capacityGb: Number(form.capacityGb), speedMhz: Number(form.speedMhz), memoryType: form.memoryType },
      };
    case "STORAGE":
      return {
        ...base,
        storageSpecs: {
          capacityGb: Number(form.capacityGb),
          type: form.variantType,
          interfaceType: form.interfaceType,
          readSpeed: form.readSpeed ? Number(form.readSpeed) : undefined,
          writeSpeed: form.writeSpeed ? Number(form.writeSpeed) : undefined,
        },
      };
    case "PSU":
      return { ...base, psuSpecs: { wattage: Number(form.wattage), efficiency: form.efficiency, modular: form.modular } };
    case "CASE":
      return {
        ...base,
        caseSpecs: {
          formFactor: form.formFactor,
          maxGpuLength: Number(form.maxGpuLength),
          maxCoolerHeight: Number(form.maxCoolerHeight),
        },
      };
    case "COOLING":
      return {
        ...base,
        coolingSpecs: {
          type: form.variantType,
          socket: form.socket,
          tdpSupport: Number(form.tdpSupport),
          height: form.height ? Number(form.height) : undefined,
        },
      };
    case "MONITOR":
      return {
        ...base,
        specs: {
          sizeInches: Number(form.sizeInches),
          resolution: form.resolution,
          refreshRateHz: Number(form.refreshRateHz),
          panelType: form.panelType || undefined,
        },
      };
    case "KEYBOARD":
      return {
        ...base,
        specs: { connection: form.connection, layout: form.layout || undefined, switchType: form.switchType || undefined },
      };
    case "MOUSE":
      return { ...base, specs: { connection: form.connection, dpi: Number(form.dpi), sensor: form.sensor || undefined } };
    case "HEADSET":
      return {
        ...base,
        specs: { connection: form.connection, headsetType: form.headsetType || undefined, microphone: form.microphone },
      };
  }
}

interface ComponentFormProps {
  initial?: Component;
  submitting: boolean;
  errorMessage?: string;
  onSubmit: (input: ComponentInput) => void;
  onCancel: () => void;
}

export function ComponentForm({ initial, submitting, errorMessage, onSubmit, onCancel }: ComponentFormProps) {
  const { t } = useLocale();
  const f = t.admin.form;
  const [form, setForm] = useState<FormState>(() => (initial ? fromComponent(initial) : emptyForm("CPU")));

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(buildInput(form));
  }

  function textField(
    key: keyof FormState,
    label: string,
    type: "text" | "number" = "text",
    options?: { required?: boolean; min?: number },
  ) {
    const required = options?.required ?? true;
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={key}>
          {label}
          {!required && <span className="text-muted-foreground">({f.optionalHint})</span>}
        </Label>
        <Input
          id={key}
          type={type}
          required={required}
          min={type === "number" ? (options?.min ?? 0) : undefined}
          step={type === "number" ? "any" : undefined}
          value={form[key] as string}
          onChange={(e) => set(key, e.target.value as FormState[typeof key])}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="type">{f.typeLabel}</Label>
        <select
          id="type"
          value={form.type}
          disabled={Boolean(initial)}
          onChange={(e) => setForm(emptyForm(e.target.value as ComponentType))}
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 md:text-sm"
        >
          {COMPONENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {t.categories[type]}
            </option>
          ))}
        </select>
      </div>

      {textField("brand", f.brandLabel)}
      {textField("name", f.nameLabel)}
      {textField("slug", f.slugLabel)}
      {textField("price", f.priceLabel, "number", { min: 1 })}
      {textField("currency", f.currencyLabel)}
      {textField("stock", f.stockLabel, "number")}
      {textField("imageUrl", f.imageUrlLabel, "text", { required: false })}

      <Label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => set("isActive", e.target.checked)}
          className="size-4"
        />
        {f.isActiveLabel}
      </Label>

      <div className="text-sm font-medium text-muted-foreground">{f.specsTitle}</div>

      {form.type === "CPU" && (
        <>
          {textField("cores", f.fields.cores, "number", { min: 1 })}
          {textField("threads", f.fields.threads, "number", { min: 1 })}
          {textField("socket", f.fields.socket)}
          {textField("tdp", f.fields.tdp, "number", { min: 1 })}
          {textField("baseClock", f.fields.baseClock, "number", { min: 0.1 })}
          {textField("boostClock", f.fields.boostClock, "number", { min: 0.1 })}
        </>
      )}

      {form.type === "GPU" && (
        <>
          {textField("vram", f.fields.vram, "number", { min: 1 })}
          {textField("memoryType", f.fields.memoryType)}
          {textField("baseClock", f.fields.baseClock, "number", { min: 0.1 })}
          {textField("boostClock", f.fields.boostClock, "number", { min: 0.1 })}
          {textField("tdp", f.fields.tdp, "number", { min: 1 })}
          {textField("length", f.fields.length, "number", { min: 1 })}
        </>
      )}

      {form.type === "MOTHERBOARD" && (
        <>
          {textField("socket", f.fields.socket)}
          {textField("chipset", f.fields.chipset)}
          {textField("formFactor", f.fields.formFactor)}
          {textField("memoryType", f.fields.memoryType)}
          {textField("memorySlots", f.fields.memorySlots, "number", { min: 1 })}
          {textField("maxMemoryGb", f.fields.maxMemoryGb, "number", { min: 1 })}
        </>
      )}

      {form.type === "RAM" && (
        <>
          {textField("capacityGb", f.fields.capacityGb, "number", { min: 1 })}
          {textField("speedMhz", f.fields.speedMhz, "number", { min: 1 })}
          {textField("memoryType", f.fields.memoryType)}
        </>
      )}

      {form.type === "STORAGE" && (
        <>
          {textField("capacityGb", f.fields.capacityGb, "number", { min: 1 })}
          {textField("variantType", f.fields.storageType)}
          {textField("interfaceType", f.fields.interfaceType)}
          {textField("readSpeed", f.fields.readSpeed, "number", { required: false })}
          {textField("writeSpeed", f.fields.writeSpeed, "number", { required: false })}
        </>
      )}

      {form.type === "PSU" && (
        <>
          {textField("wattage", f.fields.wattage, "number", { min: 1 })}
          {textField("efficiency", f.fields.efficiency)}
          {textField("modular", f.fields.modular)}
        </>
      )}

      {form.type === "CASE" && (
        <>
          {textField("formFactor", f.fields.formFactor)}
          {textField("maxGpuLength", f.fields.maxGpuLength, "number", { min: 1 })}
          {textField("maxCoolerHeight", f.fields.maxCoolerHeight, "number", { min: 1 })}
        </>
      )}

      {form.type === "COOLING" && (
        <>
          {textField("variantType", f.fields.coolingType)}
          {textField("socket", f.fields.socket)}
          {textField("tdpSupport", f.fields.tdpSupport, "number", { min: 1 })}
          {textField("height", f.fields.height, "number", { required: false })}
        </>
      )}

      {form.type === "MONITOR" && (
        <>
          {textField("sizeInches", f.fields.sizeInches, "number", { min: 1 })}
          {textField("resolution", f.fields.resolution)}
          {textField("refreshRateHz", f.fields.refreshRateHz, "number", { min: 1 })}
          {textField("panelType", f.fields.panelType, "text", { required: false })}
        </>
      )}

      {form.type === "KEYBOARD" && (
        <>
          {textField("connection", f.fields.connection)}
          {textField("layout", f.fields.layout, "text", { required: false })}
          {textField("switchType", f.fields.switchType, "text", { required: false })}
        </>
      )}

      {form.type === "MOUSE" && (
        <>
          {textField("connection", f.fields.connection)}
          {textField("dpi", f.fields.dpi, "number", { min: 1 })}
          {textField("sensor", f.fields.sensor, "text", { required: false })}
        </>
      )}

      {form.type === "HEADSET" && (
        <>
          {textField("connection", f.fields.connection)}
          {textField("headsetType", f.fields.headsetType, "text", { required: false })}
          <Label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.microphone}
              onChange={(e) => set("microphone", e.target.checked)}
              className="size-4"
            />
            {f.fields.microphone}
          </Label>
        </>
      )}

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="flex-1">
          {submitting ? f.saving : f.save}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {f.cancel}
        </Button>
      </div>
    </form>
  );
}
