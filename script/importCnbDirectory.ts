/**
 * Import the CNB (Conseil National des Barreaux) lawyer directory into the
 * `cnb_directory` table.
 *
 * Source: https://www.data.gouv.fr/datasets/annuaire-des-avocats-de-france
 * Licence: Etalab 2.0 (open licence).
 *
 * The CSV is monthly and lives in `script/data/annuaire-avocats-YYYYMMDD.csv`.
 * This script:
 *   1. Parses the CSV (semicolon-separated, UTF-8 with BOM, CR or CRLF terminators).
 *   2. Normalizes nom / prénom for fast matching at signup time.
 *   3. Tags every row with the snapshot date so we can wipe one snapshot at a time.
 *   4. Bulk-inserts in batches.
 *
 * Usage:
 *   tsx script/importCnbDirectory.ts                 # default: 100 rows from the most recent CSV
 *   tsx script/importCnbDirectory.ts --limit=500     # custom row cap
 *   tsx script/importCnbDirectory.ts --all           # full import (~81k rows)
 *   tsx script/importCnbDirectory.ts --file=<path>   # explicit CSV path
 *   tsx script/importCnbDirectory.ts --reset         # wipe table first, then import
 */

import "dotenv/config";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { eq } from "drizzle-orm";
import { db, pool } from "../server/db";
import { cnbDirectory, type InsertCnbDirectoryEntry } from "../shared/schema";
import { normalizeName } from "../shared/utils/normalize";

const DATA_DIR = join(process.cwd(), "script", "data");
const BATCH_SIZE = 500;
const DEFAULT_LIMIT = 100;

interface CliArgs {
  file?: string;
  limit: number; // 0 means no cap
  reset: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { limit: DEFAULT_LIMIT, reset: false };
  for (const a of argv.slice(2)) {
    if (a === "--all") args.limit = 0;
    else if (a === "--reset") args.reset = true;
    else if (a.startsWith("--limit=")) args.limit = parseInt(a.split("=")[1], 10);
    else if (a.startsWith("--file=")) args.file = a.split("=")[1];
    else throw new Error(`Unknown arg: ${a}`);
  }
  return args;
}

/** Find the most recent annuaire CSV in script/data/ if no path is given. */
function findLatestCsv(): string {
  const candidates = readdirSync(DATA_DIR)
    .filter((f) => /^annuaire-avocats-\d{8}\.csv$/i.test(f))
    .sort()
    .reverse();
  if (candidates.length === 0) {
    throw new Error(
      `No annuaire CSV found in ${DATA_DIR}. Download from data.gouv.fr first.`,
    );
  }
  return join(DATA_DIR, candidates[0]);
}

/** Extract YYYYMMDD from the filename for the source_snapshot column. */
function extractSnapshot(filename: string): string {
  const match = filename.match(/(\d{8})/);
  if (!match) throw new Error(`Cannot extract snapshot date from ${filename}`);
  return match[1];
}

/**
 * Minimal CSV splitter: ';'-separated, no embedded quotes in this dataset.
 * The CNB files are very regular — no escaping needed (we sampled the file).
 */
function splitCsvLine(line: string): string[] {
  return line.split(";").map((s) => s.trim());
}

function parseDateSerment(raw: string | undefined): string | null {
  if (!raw) return null;
  // Format observed: YYYYMMDD or empty
  if (!/^\d{8}$/.test(raw)) return null;
  const yyyy = raw.slice(0, 4);
  const mm = raw.slice(4, 6);
  const dd = raw.slice(6, 8);
  return `${yyyy}-${mm}-${dd}`;
}

function emptyToNull(s: string | undefined): string | null {
  if (!s) return null;
  const t = s.trim();
  return t.length === 0 ? null : t;
}

function parseCsv(content: string, snapshot: string, limit: number): InsertCnbDirectoryEntry[] {
  // Strip UTF-8 BOM if present
  const stripped = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
  // Handle CRLF, LF, and lone CR
  const lines = stripped.split(/\r\n|\n|\r/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];

  // First line is the header (NomBarreau;avNom;avPrenom;...)
  const header = splitCsvLine(lines[0]);
  const idx = (col: string) => {
    const i = header.indexOf(col);
    return i === -1 ? null : i;
  };
  const c = {
    barreau: idx("NomBarreau"),
    nom: idx("avNom"),
    prenom: idx("avPrenom"),
    raisonSociale: idx("cbRaisonSociale"),
    siren: idx("cbSiretSiren"),
    adresse1: idx("cbAdresse1"),
    adresse2: idx("cbAdresse2"),
    codePostal: idx("cbCp"),
    ville: idx("cbVille"),
    spec1: idx("spLibelle1"),
    spec2: idx("spLibelle2"),
    spec3: idx("spLibelle3"),
    spec4: idx("spLibelle4"),
    dateSerment: idx("acDateSerment"),
    langues: idx("avLang"),
  };

  if (c.barreau === null || c.nom === null || c.prenom === null) {
    throw new Error("CSV missing required columns: NomBarreau / avNom / avPrenom");
  }

  const dataLines = lines.slice(1);
  const rows: InsertCnbDirectoryEntry[] = [];
  const cap = limit > 0 ? Math.min(limit, dataLines.length) : dataLines.length;

  for (let i = 0; i < cap; i++) {
    const cells = splitCsvLine(dataLines[i]);
    const barreau = cells[c.barreau];
    const nom = cells[c.nom];
    const prenom = cells[c.prenom];
    if (!barreau || !nom || !prenom) continue; // skip malformed lines

    rows.push({
      barreau: barreau.toUpperCase(),
      nom,
      prenom,
      nomNormalized: normalizeName(nom),
      prenomNormalized: normalizeName(prenom),
      raisonSociale: emptyToNull(cells[c.raisonSociale ?? -1]),
      siren: emptyToNull(cells[c.siren ?? -1])?.padStart(9, "0").slice(0, 9) ?? null,
      adresse1: emptyToNull(cells[c.adresse1 ?? -1]),
      adresse2: emptyToNull(cells[c.adresse2 ?? -1]),
      codePostal: emptyToNull(cells[c.codePostal ?? -1])?.slice(0, 5) ?? null,
      ville: emptyToNull(cells[c.ville ?? -1]),
      specialite1: emptyToNull(cells[c.spec1 ?? -1]),
      specialite2: emptyToNull(cells[c.spec2 ?? -1]),
      specialite3: emptyToNull(cells[c.spec3 ?? -1]),
      specialite4: emptyToNull(cells[c.spec4 ?? -1]),
      dateSerment: parseDateSerment(cells[c.dateSerment ?? -1]),
      langues: emptyToNull(cells[c.langues ?? -1]),
      sourceSnapshot: snapshot,
    });
  }

  return rows;
}

async function insertInBatches(rows: InsertCnbDirectoryEntry[]): Promise<number> {
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const result = await db.insert(cnbDirectory).values(batch).returning({ id: cnbDirectory.id });
    inserted += result.length;
    if (rows.length > BATCH_SIZE) {
      process.stdout.write(`\r[cnb-import] inserted ${inserted}/${rows.length}…`);
    }
  }
  if (rows.length > BATCH_SIZE) process.stdout.write("\n");
  return inserted;
}

async function wipeSnapshot(snapshot: string): Promise<number> {
  const result = await db
    .delete(cnbDirectory)
    .where(eq(cnbDirectory.sourceSnapshot, snapshot))
    .returning({ id: cnbDirectory.id });
  return result.length;
}

async function main() {
  const args = parseArgs(process.argv);
  const filepath = args.file ?? findLatestCsv();
  const snapshot = extractSnapshot(filepath);

  console.log(`[cnb-import] Source : ${filepath}`);
  console.log(`[cnb-import] Snapshot : ${snapshot}`);
  console.log(
    `[cnb-import] Mode : ${args.limit === 0 ? "FULL" : `limited to ${args.limit} rows`}${
      args.reset ? " (reset first)" : ""
    }`,
  );

  if (args.reset) {
    const removed = await wipeSnapshot(snapshot);
    console.log(`[cnb-import] Removed ${removed} existing rows for snapshot ${snapshot}.`);
  }

  const csv = readFileSync(filepath, "utf8");
  const rows = parseCsv(csv, snapshot, args.limit);
  console.log(`[cnb-import] Parsed ${rows.length} rows. Inserting…`);

  const inserted = await insertInBatches(rows);
  console.log(`[cnb-import] ✅ Inserted ${inserted} rows into cnb_directory.`);
}

main()
  .catch((err) => {
    console.error("[cnb-import] FAILED:", err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
