// Prisma 8 reads and writes timestamps as Temporal values. Node 20-24 have no global
// Temporal, so install the polyfill before the first query (RUNTIME.TEMPORAL_UNAVAILABLE).
import "temporal-polyfill/full/global";
import "dotenv/config";
import net from "node:net";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

// Node tries each resolved address for only 250ms by default ("happy eyeballs").
// From Zimbabwe a TCP handshake to Neon in us-east-2 takes longer than that, so
// every attempt is abandoned and the connection fails with ETIMEDOUT.
net.setDefaultAutoSelectFamilyAttemptTimeout(2000);

export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
});
