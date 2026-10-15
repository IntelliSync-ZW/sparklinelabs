import 'dotenv/config';
import net from 'node:net';
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig as ormConfig } from '@prisma/orm-postgres/config';

// See prisma/db.ts: Node's 250ms per-address connect window is too short for Neon from Zimbabwe.
net.setDefaultAutoSelectFamilyAttemptTimeout(2000);

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./prisma/contract.prisma",
    db: {
      connection: process.env['DATABASE_URL']!,
    },
  }),
});
