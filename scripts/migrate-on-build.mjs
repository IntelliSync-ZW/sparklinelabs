// Applies pending Prisma migrations to the database in DATABASE_URL before the app is built.
// Runs as part of `pnpm build`, so every deploy brings the schema up to date first. If
// the migration fails, the build fails and the previous deployment keeps serving.
import { spawnSync } from "node:child_process";

const url = process.env.DATABASE_URL;
const isProduction = process.env.VERCEL_ENV === "production";

if (!url) {
  if (isProduction) {
    console.error("DATABASE_URL is not set for this production build, so migrations cannot run.");
    process.exit(1);
  }
  console.warn("DATABASE_URL is not set: skipping database migrations.");
  process.exit(0);
}

const host = url.match(/@([^/:?]+)/)?.[1] ?? "unknown host";
console.log(`Applying database migrations to ${host}...`);

const result = spawnSync("pnpm", ["exec", "prisma", "db", "migrate"], { stdio: "inherit", env: process.env });
if (result.status !== 0) {
  console.error("Database migration failed; stopping the build.");
  process.exit(result.status ?? 1);
}
