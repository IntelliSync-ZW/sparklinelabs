/**
 * Migration script using @neondatabase/serverless (WebSockets over HTTPS port 443)
 * Uses sql.query() for raw SQL string execution.
 */
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env manually
const envPath = resolve(__dirname, "../.env");
const envContent = readFileSync(envPath, "utf8");
const env = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, "");
      env[key] = val;
    }
  }
}

const connectionString = env.PROD_DATABASE_URL || env.DATABASE_URL;
if (!connectionString) {
  console.error("No DATABASE_URL found in .env");
  process.exit(1);
}

console.log("Connecting via Neon serverless (HTTPS/WebSocket)...");
console.log("Host:", connectionString.match(/@([^/?]+)/)?.[1] ?? "unknown");

const sql = neon(connectionString);

const initSqlPath = resolve(__dirname, "../prisma/init.sql");
const initSql = readFileSync(initSqlPath, "utf8");

// Remove comment-only lines, then split on semicolons
const cleanedSql = initSql
  .split("\n")
  .filter((l) => !l.trim().startsWith("--"))
  .join("\n");

const statements = cleanedSql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 5);

console.log(`\nRunning ${statements.length} SQL statements...\n`);

let successCount = 0;
let errorCount = 0;

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const preview = stmt.slice(0, 90).replace(/\s+/g, " ");
  try {
    await sql.query(stmt);
    successCount++;
    console.log(`  ✓ [${i + 1}/${statements.length}] ${preview}`);
  } catch (err) {
    errorCount++;
    console.error(`  ✗ [${i + 1}/${statements.length}] ${preview}`);
    console.error(`    Error: ${err.message}\n`);
  }
}

console.log(`\n─────────────────────────────────────`);
console.log(`Migration complete: ${successCount} succeeded, ${errorCount} failed`);

if (errorCount === 0) {
  console.log("✅ All tables and constraints created successfully!");
} else {
  console.log("⚠️  Some statements failed — check errors above.");
}
