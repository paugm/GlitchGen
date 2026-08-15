import * as z from "zod";
import { DEFAULT_FONT } from "./fonts";

export const FORMAT_VERSION = "1.9";

const SECRET_KEY = /api[_-]?key/i;

const finiteNumber = z.coerce.number().finite().catch(0);

const elementSchema = z.looseObject({
  id: z.string().min(1),
  type: z.string().min(1),
  left: finiteNumber,
  top: finiteNumber,
  width: finiteNumber,
  height: finiteNumber,
  layerOrder: finiteNumber.optional().default(0),
  zIndex: z.union([z.string(), z.number()]).optional(),
  properties: z.record(z.string(), z.unknown()).optional().default({}),
});

export const glitchGenFileSchema = z.looseObject({
  version: z.union([z.string(), z.number()]).transform(String),
  appVersion: z.string().optional(),
  title: z.string().optional().default(""),
  gridSize: finiteNumber.optional().default(20),
  font: z.string().optional().default(DEFAULT_FONT),
  textColor: z.string().optional().default("#000000"),
  dropZoneWidth: z.coerce.number().finite().optional(),
  dropZoneHeight: z.coerce.number().finite().optional(),
  background: z.string().optional().default(""),
  mobileMode: z.enum(["shrink", "zoom", "stack"]).catch("shrink"),
  elements: z.array(elementSchema).optional().default([]),
});

/**
 * Drops API keys so they never land in .glitchGen files or drafts.
 * @param {Record<string, unknown>} properties
 * @returns {Record<string, unknown>}
 */
export function stripSecrets(properties = {}) {
  const out = {};
  Object.entries(properties).forEach(([key, value]) => {
    if (SECRET_KEY.test(key)) return;
    out[key] = value;
  });
  return out;
}

/**
 * Normalizes legacy files that stored the app semver in `version`.
 * @param {unknown} raw
 * @returns {object}
 */
export function migrateGlitchGenFile(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("File is not a .glitchGen document");
  }
  const data = { ...raw };
  const version = String(data.version ?? "1.7");
  if (/^0\./.test(version)) {
    data.appVersion = data.appVersion || version;
    data.version = "1.7";
  }
  data.elements = Array.isArray(data.elements)
    ? data.elements.map((el) => ({
        ...el,
        properties: stripSecrets(el.properties || {}),
      }))
    : [];
  return data;
}

/**
 * @param {unknown} error
 * @returns {string}
 */
export function formatGlitchGenError(error) {
  if (error instanceof z.ZodError) {
    const pretty =
      typeof z.prettifyError === "function" ? z.prettifyError(error) : "";
    if (pretty) return `This .glitchGen file looks invalid:\n${pretty}`;
    const first = error.issues?.[0];
    if (first) {
      const path = first.path?.length ? first.path.join(".") : "file";
      return `This .glitchGen file looks invalid (${path}): ${first.message}`;
    }
  }
  return error instanceof Error
    ? error.message
    : "This .glitchGen file looks invalid.";
}

/**
 * Migrates, strips secrets, and validates a loaded document.
 * @param {unknown} raw
 * @returns {object}
 */
export function parseGlitchGenFile(raw) {
  return glitchGenFileSchema.parse(migrateGlitchGenFile(raw));
}

/**
 * Validates outbound save payload and stamps the current format version.
 * @param {object} appData
 * @returns {object}
 */
export function serializeGlitchGenFile(appData) {
  const migrated = migrateGlitchGenFile(appData);
  migrated.version = FORMAT_VERSION;
  return glitchGenFileSchema.parse(migrated);
}
