#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/d8184a0a4c390f86c6eb6974f6d99fb89f8cf3a26a535c91a9e3785420ed0c19/contract';
import endContract from '../../snapshots/d8184a0a4c390f86c6eb6974f6d99fb89f8cf3a26a535c91a9e3785420ed0c19/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'AssessmentAttempt',
        columns: [
          col('attemptNumber', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('enrollmentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lessonProgressId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('passed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('sanityAssessmentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('score', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('startedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('IN_PROGRESS'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'AssessmentAttempt_status_check_b97b07df',
            "\"status\" IN ('IN_PROGRESS', 'PASSED', 'FAILED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'AssessmentResponse',
        columns: [
          col('assessmentAttemptId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isCorrect', 'bool', { codecRef: { codecId: 'pg/bool@1' } }),
          col('pointsAwarded', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('response', 'json', { codecRef: { codecId: 'pg/json@1' } }),
          col('sanityQuestionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Certificate',
        columns: [
          col('certificateNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('certificatePrice', 'int4', {
            notNull: true,
            default: lit(500),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('clerkUserId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('completionDate', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('courseTitle', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('currency', 'text', {
            notNull: true,
            default: lit('USD'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('enrollmentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('issuedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('paymentReference', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('paymentStatus', 'text', {
            notNull: true,
            default: lit('PENDING'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('recipientName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Certificate_paymentStatus_check_60515b20',
            "\"paymentStatus\" IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Enrollment',
        columns: [
          col('clerkUserId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('finalScore', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('progressPercent', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('sanityCourseId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('startedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('ACTIVE'),
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
            'Enrollment_status_check_897bfa6f',
            "\"status\" IN ('ACTIVE', 'COMPLETED', 'SUSPENDED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'LessonProgress',
        columns: [
          col('assessmentPassed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('bestAssessmentScore', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('contentCompletedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('contentStartedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('enrollmentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('requiredTasksPassed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('sanityLessonId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('LOCKED'),
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
            'LessonProgress_status_check_07facb5f',
            "\"status\" IN ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED')",
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'TaskAttempt',
        columns: [
          col('attemptNumber', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('completedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('enrollmentId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('feedback', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('lessonProgressId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('passed', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('sanityTaskId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('score', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('startedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('status', 'text', {
            notNull: true,
            default: lit('IN_PROGRESS'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('submission', 'json', { codecRef: { codecId: 'pg/json@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'TaskAttempt_status_check_b97b07df',
            "\"status\" IN ('IN_PROGRESS', 'PASSED', 'FAILED')",
          ),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'AssessmentResponse',
        constraint: 'AssessmentResponse_assessmentAttemptId_sanityQuestionId_key',
        columns: ['assessmentAttemptId', 'sanityQuestionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Certificate',
        constraint: 'Certificate_enrollmentId_key',
        columns: ['enrollmentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Certificate',
        constraint: 'Certificate_certificateNumber_key',
        columns: ['certificateNumber'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Enrollment',
        constraint: 'Enrollment_clerkUserId_sanityCourseId_key',
        columns: ['clerkUserId', 'sanityCourseId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'LessonProgress',
        constraint: 'LessonProgress_enrollmentId_sanityLessonId_key',
        columns: ['enrollmentId', 'sanityLessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssessmentAttempt',
        index: 'AssessmentAttempt_enrollmentId_idx_ee5e79c5',
        columns: ['enrollmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssessmentAttempt',
        index: 'AssessmentAttempt_enrollmentId_sanityAssessmentId_idx_0b780885',
        columns: ['enrollmentId', 'sanityAssessmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssessmentAttempt',
        index: 'AssessmentAttempt_lessonProgressId_idx_555ff96a',
        columns: ['lessonProgressId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssessmentResponse',
        index: 'AssessmentResponse_assessmentAttemptId_idx_71b37739',
        columns: ['assessmentAttemptId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssessmentResponse',
        index: 'AssessmentResponse_sanityQuestionId_idx_deeb9508',
        columns: ['sanityQuestionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Certificate',
        index: 'Certificate_certificateNumber_idx_57e448cc',
        columns: ['certificateNumber'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Certificate',
        index: 'Certificate_clerkUserId_idx_17dc593a',
        columns: ['clerkUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Enrollment',
        index: 'Enrollment_clerkUserId_idx_17dc593a',
        columns: ['clerkUserId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Enrollment',
        index: 'Enrollment_sanityCourseId_idx_39b3b4ef',
        columns: ['sanityCourseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LessonProgress',
        index: 'LessonProgress_enrollmentId_idx_ee5e79c5',
        columns: ['enrollmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LessonProgress',
        index: 'LessonProgress_sanityLessonId_idx_b22fa489',
        columns: ['sanityLessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TaskAttempt',
        index: 'TaskAttempt_enrollmentId_idx_ee5e79c5',
        columns: ['enrollmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TaskAttempt',
        index: 'TaskAttempt_enrollmentId_sanityTaskId_idx_7409a053',
        columns: ['enrollmentId', 'sanityTaskId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TaskAttempt',
        index: 'TaskAttempt_lessonProgressId_idx_555ff96a',
        columns: ['lessonProgressId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AssessmentAttempt',
        foreignKey: {
          name: 'AssessmentAttempt_enrollmentId_fkey',
          columns: ['enrollmentId'],
          references: { schema: 'public', table: 'Enrollment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AssessmentAttempt',
        foreignKey: {
          name: 'AssessmentAttempt_lessonProgressId_fkey',
          columns: ['lessonProgressId'],
          references: { schema: 'public', table: 'LessonProgress', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AssessmentResponse',
        foreignKey: {
          name: 'AssessmentResponse_assessmentAttemptId_fkey',
          columns: ['assessmentAttemptId'],
          references: { schema: 'public', table: 'AssessmentAttempt', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Certificate',
        foreignKey: {
          name: 'Certificate_enrollmentId_fkey',
          columns: ['enrollmentId'],
          references: { schema: 'public', table: 'Enrollment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'LessonProgress',
        foreignKey: {
          name: 'LessonProgress_enrollmentId_fkey',
          columns: ['enrollmentId'],
          references: { schema: 'public', table: 'Enrollment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TaskAttempt',
        foreignKey: {
          name: 'TaskAttempt_enrollmentId_fkey',
          columns: ['enrollmentId'],
          references: { schema: 'public', table: 'Enrollment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TaskAttempt',
        foreignKey: {
          name: 'TaskAttempt_lessonProgressId_fkey',
          columns: ['lessonProgressId'],
          references: { schema: 'public', table: 'LessonProgress', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
