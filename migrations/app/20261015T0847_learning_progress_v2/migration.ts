#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/18e7a314add02f19f4dde39c34b8f53f638ce0e13dfe570d72d2b486ae8cc6ba/contract';
import endContract from '../../snapshots/18e7a314add02f19f4dde39c34b8f53f638ce0e13dfe570d72d2b486ae8cc6ba/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/d8184a0a4c390f86c6eb6974f6d99fb89f8cf3a26a535c91a9e3785420ed0c19/contract';
import startContract from '../../snapshots/d8184a0a4c390f86c6eb6974f6d99fb89f8cf3a26a535c91a9e3785420ed0c19/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'SectionProgress',
        columns: [
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lessonProgressId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('sanitySectionKey', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('IN_PROGRESS'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'SectionProgress_status_check_07facb5f',
            "\"status\" IN ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED')",
          ),
        ],
      }),
      this.addColumn({
        schema: 'public',
        table: 'AssessmentAttempt',
        column: col('sanitySectionKey', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Enrollment',
        column: col('lastAccessedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'Enrollment',
        column: col('lastLessonId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'LessonProgress',
        column: col('lastSectionKey', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'LessonProgress',
        column: col('lastViewedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-temporal@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'LessonProgress',
        column: col('timeSpentSeconds', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'TaskAttempt',
        column: col('gradedBy', 'text', {
          notNull: true,
          default: lit('AUTO'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'TaskAttempt',
        column: col('maxScore', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'TaskAttempt',
        column: col('rubricScores', 'json', { codecRef: { codecId: 'pg/json@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'TaskAttempt',
        column: col('sanitySectionKey', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'SectionProgress',
        constraint: 'SectionProgress_lessonProgressId_sanitySectionKey_key',
        columns: ['lessonProgressId', 'sanitySectionKey'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'TaskAttempt',
        constraint: 'TaskAttempt_gradedBy_check_529e0787',
        expression: "\"gradedBy\" IN ('AUTO', 'SELF')",
      }),
      this.createIndex({
        schema: 'public',
        table: 'SectionProgress',
        index: 'SectionProgress_lessonProgressId_idx_555ff96a',
        columns: ['lessonProgressId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SectionProgress',
        foreignKey: {
          name: 'SectionProgress_lessonProgressId_fkey',
          columns: ['lessonProgressId'],
          references: { schema: 'public', table: 'LessonProgress', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
