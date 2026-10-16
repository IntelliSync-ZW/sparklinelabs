#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/18e7a314add02f19f4dde39c34b8f53f638ce0e13dfe570d72d2b486ae8cc6ba/contract';
import startContract from '../../snapshots/18e7a314add02f19f4dde39c34b8f53f638ce0e13dfe570d72d2b486ae8cc6ba/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/be2251edcaf31e3b091e09640ffd823d6cb4c4f1533e8afbd79cbf6b79767d0e/contract';
import endContract from '../../snapshots/be2251edcaf31e3b091e09640ffd823d6cb4c4f1533e8afbd79cbf6b79767d0e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'LearnerProfile',
        columns: [
          col('aiExperience', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('clerkUserId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('field', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('fieldOther', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('level', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('stage', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'LearnerProfile',
        constraint: 'LearnerProfile_clerkUserId_key',
        columns: ['clerkUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LearnerProfile',
        index: 'LearnerProfile_stage_field_idx_f44ffec5',
        columns: ['stage', 'field'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LearnerProfile',
        index: 'LearnerProfile_stage_idx_51755035',
        columns: ['stage'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
