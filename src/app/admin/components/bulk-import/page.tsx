"use client";

import { useState } from "react";
import { useAuth } from "@/components/telegram-provider";
import { useLocale } from "@/components/locale-provider";
import { bulkCreateComponents } from "@/lib/api";
import type { BulkImportResponse, ComponentInput } from "@/lib/types";
import { BULK_IMPORT_MAX_ITEMS, buildCsvTemplate, csvRowToComponentInput, parseCsvFile, parseJsonInput } from "@/lib/bulk-import";
import { BackButton } from "@/components/back-button";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Mode = "csv" | "json";

export default function BulkImportPage() {
  const auth = useAuth();
  const { t } = useLocale();
  const b = t.admin.bulkImport;

  const [mode, setMode] = useState<Mode>("csv");
  const [items, setItems] = useState<ComponentInput[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [showExample, setShowExample] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<BulkImportResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleDownloadTemplate() {
    const blob = new Blob([buildCsvTemplate()], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pc-forge-components-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCsvUpload(file: File) {
    setParseError(null);
    setResult(null);
    try {
      const rows = await parseCsvFile(file);
      const parsed: ComponentInput[] = [];
      const errors: string[] = [];
      rows.forEach((row, i) => {
        const mapped = csvRowToComponentInput(row);
        if ("error" in mapped) errors.push(`${i + 1}: ${mapped.error}`);
        else parsed.push(mapped.input);
      });
      setItems(parsed);
      if (errors.length > 0) setParseError(`${b.parseErrorPrefix}${errors.join("; ")}`);
    } catch (e) {
      setItems([]);
      setParseError(`${b.parseErrorPrefix}${e instanceof Error ? e.message : String(e)}`);
    }
  }

  function handleJsonParse() {
    setParseError(null);
    setResult(null);
    const parsed = parseJsonInput(jsonText);
    if ("error" in parsed) {
      setItems([]);
      setParseError(`${b.parseErrorPrefix}${parsed.error}`);
      return;
    }
    setItems(parsed.items);
  }

  async function handleSubmit() {
    if (auth.status !== "authenticated") return;
    if (items.length === 0) {
      setSubmitError(b.noItemsParsed);
      return;
    }
    if (items.length > BULK_IMPORT_MAX_ITEMS) {
      setSubmitError(b.tooManyItems(BULK_IMPORT_MAX_ITEMS));
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setResult(null);
    try {
      const response = await bulkCreateComponents(items, auth.accessToken);
      setResult(response);
    } catch {
      setSubmitError(b.submitErrorFallback);
    } finally {
      setSubmitting(false);
    }
  }

  const failedResults = result?.results.filter((r) => r.status === "error") ?? [];

  return (
    <>
      <BackButton fallbackHref="/admin/components" />
      <h1 className="text-xl font-semibold">{b.title}</h1>

      <div className="flex gap-2">
        <Button type="button" size="sm" variant={mode === "csv" ? "default" : "outline"} onClick={() => setMode("csv")}>
          {b.modeCsv}
        </Button>
        <Button type="button" size="sm" variant={mode === "json" ? "default" : "outline"} onClick={() => setMode("json")}>
          {b.modeJson}
        </Button>
      </div>

      {mode === "csv" && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <Button type="button" variant="outline" size="sm" onClick={handleDownloadTemplate} className="self-start">
              {b.downloadTemplate}
            </Button>
            <div className="flex flex-col gap-1">
              <label htmlFor="csv-upload" className="text-sm font-medium">
                {b.uploadLabel}
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleCsvUpload(file);
                }}
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "json" && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              onBlur={() => jsonText.trim() && handleJsonParse()}
              placeholder={b.jsonPlaceholder}
              rows={10}
              className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <button type="button" className="self-start text-xs text-muted-foreground underline" onClick={() => setShowExample((v) => !v)}>
              {b.jsonExampleToggle}
            </button>
            {showExample && (
              <pre className="overflow-x-auto rounded-lg bg-muted p-2 text-xs whitespace-pre-wrap">{b.jsonExample}</pre>
            )}
          </CardContent>
        </Card>
      )}

      {parseError && <p className="text-sm text-destructive">{parseError}</p>}

      {items.length > 0 && !result && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">{b.parsedRowsLabel(items.length)}</p>
          <Button type="button" size="sm" disabled={submitting} onClick={handleSubmit}>
            {submitting ? b.submitting : b.submit}
          </Button>
        </div>
      )}

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      {result && (
        <Card>
          <CardContent className="flex flex-col gap-2">
            <p className="text-sm font-medium">{b.resultsSummary(result.createdCount, result.failedCount)}</p>
            {failedResults.length > 0 && (
              <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto text-sm text-destructive">
                {failedResults.map((r) => (
                  <li key={r.index}>
                    {b.rowErrorPrefix(r.index + 1)}
                    {r.status === "error" ? r.message : ""}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
