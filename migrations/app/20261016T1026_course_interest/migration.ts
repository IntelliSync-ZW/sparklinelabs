#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/be2251edcaf31e3b091e09640ffd823d6cb4c4f1533e8afbd79cbf6b79767d0e/contract';
import startContract from '../../snapshots/be2251edcaf31e3b091e09640ffd823d6cb4c4f1533e8afbd79cbf6b79767d0e/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/cbb2431d6473691f05fcdde80894a9d2382efd6449033c9e8a1ccc82419391f2/contract';
import endContract from '../../snapshots/cbb2431d6473691f05fcdde80894a9d2382efd6449033c9e8a1ccc82419391f2/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'CourseInterest',
        columns: [
          col('clerkUserId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sanityCourseId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('whatsappClickedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'CourseInterest',
        constraint: 'CourseInterest_clerkUserId_sanityCourseId_key',
        columns: ['clerkUserId', 'sanityCourseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CourseInterest',
        index: 'CourseInterest_sanityCourseId_idx_39b3b4ef',
        columns: ['sanityCourseId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
