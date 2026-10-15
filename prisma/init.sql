-- Prisma 8 Learning Models Migration
-- Generated from prisma/contract.prisma

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE IF NOT EXISTS "public"."Enrollment" (
  "id" text NOT NULL,
  "clerkUserId" text NOT NULL,
  "sanityCourseId" text NOT NULL,
  "status" text DEFAULT 'ACTIVE' NOT NULL,
  "startedAt" timestamptz DEFAULT (now()) NOT NULL,
  "completedAt" timestamptz,
  "progressPercent" int4 DEFAULT 0 NOT NULL,
  "finalScore" int4,
  "createdAt" timestamptz DEFAULT (now()) NOT NULL,
  "updatedAt" timestamptz DEFAULT (now()) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "Enrollment_status_check_897bfa6f" CHECK ("status" IN ('ACTIVE', 'COMPLETED', 'SUSPENDED'))
);

CREATE TABLE IF NOT EXISTS "public"."LessonProgress" (
  "id" text NOT NULL,
  "enrollmentId" text NOT NULL,
  "sanityLessonId" text NOT NULL,
  "status" text DEFAULT 'LOCKED' NOT NULL,
  "contentStartedAt" timestamptz,
  "contentCompletedAt" timestamptz,
  "requiredTasksPassed" bool DEFAULT false NOT NULL,
  "bestAssessmentScore" int4,
  "assessmentPassed" bool DEFAULT false NOT NULL,
  "completedAt" timestamptz,
  "createdAt" timestamptz DEFAULT (now()) NOT NULL,
  "updatedAt" timestamptz DEFAULT (now()) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "LessonProgress_status_check_07facb5f" CHECK ("status" IN ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'))
);

CREATE TABLE IF NOT EXISTS "public"."TaskAttempt" (
  "id" text NOT NULL,
  "enrollmentId" text NOT NULL,
  "lessonProgressId" text NOT NULL,
  "sanityTaskId" text NOT NULL,
  "attemptNumber" int4 DEFAULT 1 NOT NULL,
  "status" text DEFAULT 'IN_PROGRESS' NOT NULL,
  "submission" json,
  "score" int4,
  "passed" bool DEFAULT false NOT NULL,
  "feedback" text,
  "startedAt" timestamptz DEFAULT (now()) NOT NULL,
  "completedAt" timestamptz,
  "createdAt" timestamptz DEFAULT (now()) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "TaskAttempt_status_check_b97b07df" CHECK ("status" IN ('IN_PROGRESS', 'PASSED', 'FAILED'))
);

CREATE TABLE IF NOT EXISTS "public"."AssessmentAttempt" (
  "id" text NOT NULL,
  "enrollmentId" text NOT NULL,
  "lessonProgressId" text,
  "sanityAssessmentId" text NOT NULL,
  "attemptNumber" int4 DEFAULT 1 NOT NULL,
  "status" text DEFAULT 'IN_PROGRESS' NOT NULL,
  "score" int4,
  "passed" bool DEFAULT false NOT NULL,
  "startedAt" timestamptz DEFAULT (now()) NOT NULL,
  "completedAt" timestamptz,
  "createdAt" timestamptz DEFAULT (now()) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "AssessmentAttempt_status_check_b97b07df" CHECK ("status" IN ('IN_PROGRESS', 'PASSED', 'FAILED'))
);

CREATE TABLE IF NOT EXISTS "public"."AssessmentResponse" (
  "id" text NOT NULL,
  "assessmentAttemptId" text NOT NULL,
  "sanityQuestionId" text NOT NULL,
  "response" json,
  "isCorrect" bool,
  "pointsAwarded" int4 DEFAULT 0 NOT NULL,
  "createdAt" timestamptz DEFAULT (now()) NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "public"."Certificate" (
  "id" text NOT NULL,
  "enrollmentId" text NOT NULL,
  "clerkUserId" text NOT NULL,
  "certificateNumber" text NOT NULL,
  "recipientName" text NOT NULL,
  "courseTitle" text NOT NULL,
  "completionDate" timestamptz NOT NULL,
  "certificatePrice" int4 DEFAULT 500 NOT NULL,
  "currency" text DEFAULT 'USD' NOT NULL,
  "paymentStatus" text DEFAULT 'PENDING' NOT NULL,
  "paymentReference" text,
  "issuedAt" timestamptz,
  "createdAt" timestamptz DEFAULT (now()) NOT NULL,
  "updatedAt" timestamptz DEFAULT (now()) NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "Certificate_paymentStatus_check_60515b20" CHECK ("paymentStatus" IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED'))
);

-- Unique constraints
ALTER TABLE "public"."AssessmentResponse" DROP CONSTRAINT IF EXISTS "AssessmentResponse_assessmentAttemptId_sanityQuestionId_key";
ALTER TABLE "public"."AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_assessmentAttemptId_sanityQuestionId_key" UNIQUE ("assessmentAttemptId", "sanityQuestionId");

ALTER TABLE "public"."Certificate" DROP CONSTRAINT IF EXISTS "Certificate_enrollmentId_key";
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_enrollmentId_key" UNIQUE ("enrollmentId");

ALTER TABLE "public"."Certificate" DROP CONSTRAINT IF EXISTS "Certificate_certificateNumber_key";
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_certificateNumber_key" UNIQUE ("certificateNumber");

ALTER TABLE "public"."Enrollment" DROP CONSTRAINT IF EXISTS "Enrollment_clerkUserId_sanityCourseId_key";
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_clerkUserId_sanityCourseId_key" UNIQUE ("clerkUserId", "sanityCourseId");

ALTER TABLE "public"."LessonProgress" DROP CONSTRAINT IF EXISTS "LessonProgress_enrollmentId_sanityLessonId_key";
ALTER TABLE "public"."LessonProgress" ADD CONSTRAINT "LessonProgress_enrollmentId_sanityLessonId_key" UNIQUE ("enrollmentId", "sanityLessonId");

-- Indexes
CREATE INDEX IF NOT EXISTS "AssessmentAttempt_enrollmentId_idx_ee5e79c5" ON "public"."AssessmentAttempt" ("enrollmentId");
CREATE INDEX IF NOT EXISTS "AssessmentAttempt_enrollmentId_sanityAssessmentId_idx_0b780885" ON "public"."AssessmentAttempt" ("enrollmentId", "sanityAssessmentId");
CREATE INDEX IF NOT EXISTS "AssessmentAttempt_lessonProgressId_idx_555ff96a" ON "public"."AssessmentAttempt" ("lessonProgressId");
CREATE INDEX IF NOT EXISTS "AssessmentResponse_assessmentAttemptId_idx_71b37739" ON "public"."AssessmentResponse" ("assessmentAttemptId");
CREATE INDEX IF NOT EXISTS "AssessmentResponse_sanityQuestionId_idx_deeb9508" ON "public"."AssessmentResponse" ("sanityQuestionId");
CREATE INDEX IF NOT EXISTS "Certificate_certificateNumber_idx_57e448cc" ON "public"."Certificate" ("certificateNumber");
CREATE INDEX IF NOT EXISTS "Certificate_clerkUserId_idx_17dc593a" ON "public"."Certificate" ("clerkUserId");
CREATE INDEX IF NOT EXISTS "Enrollment_clerkUserId_idx_17dc593a" ON "public"."Enrollment" ("clerkUserId");
CREATE INDEX IF NOT EXISTS "Enrollment_sanityCourseId_idx_39b3b4ef" ON "public"."Enrollment" ("sanityCourseId");
CREATE INDEX IF NOT EXISTS "LessonProgress_enrollmentId_idx_ee5e79c5" ON "public"."LessonProgress" ("enrollmentId");
CREATE INDEX IF NOT EXISTS "LessonProgress_sanityLessonId_idx_b22fa489" ON "public"."LessonProgress" ("sanityLessonId");
CREATE INDEX IF NOT EXISTS "TaskAttempt_enrollmentId_idx_ee5e79c5" ON "public"."TaskAttempt" ("enrollmentId");
CREATE INDEX IF NOT EXISTS "TaskAttempt_enrollmentId_sanityTaskId_idx_7409a053" ON "public"."TaskAttempt" ("enrollmentId", "sanityTaskId");
CREATE INDEX IF NOT EXISTS "TaskAttempt_lessonProgressId_idx_555ff96a" ON "public"."TaskAttempt" ("lessonProgressId");

-- Foreign keys
ALTER TABLE "public"."AssessmentAttempt" DROP CONSTRAINT IF EXISTS "AssessmentAttempt_enrollmentId_fkey";
ALTER TABLE "public"."AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "public"."Enrollment" ("id") ON DELETE CASCADE;

ALTER TABLE "public"."AssessmentAttempt" DROP CONSTRAINT IF EXISTS "AssessmentAttempt_lessonProgressId_fkey";
ALTER TABLE "public"."AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_lessonProgressId_fkey" FOREIGN KEY ("lessonProgressId") REFERENCES "public"."LessonProgress" ("id") ON DELETE CASCADE;

ALTER TABLE "public"."AssessmentResponse" DROP CONSTRAINT IF EXISTS "AssessmentResponse_assessmentAttemptId_fkey";
ALTER TABLE "public"."AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_assessmentAttemptId_fkey" FOREIGN KEY ("assessmentAttemptId") REFERENCES "public"."AssessmentAttempt" ("id") ON DELETE CASCADE;

ALTER TABLE "public"."Certificate" DROP CONSTRAINT IF EXISTS "Certificate_enrollmentId_fkey";
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "public"."Enrollment" ("id") ON DELETE CASCADE;

ALTER TABLE "public"."LessonProgress" DROP CONSTRAINT IF EXISTS "LessonProgress_enrollmentId_fkey";
ALTER TABLE "public"."LessonProgress" ADD CONSTRAINT "LessonProgress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "public"."Enrollment" ("id") ON DELETE CASCADE;

ALTER TABLE "public"."TaskAttempt" DROP CONSTRAINT IF EXISTS "TaskAttempt_enrollmentId_fkey";
ALTER TABLE "public"."TaskAttempt" ADD CONSTRAINT "TaskAttempt_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "public"."Enrollment" ("id") ON DELETE CASCADE;

ALTER TABLE "public"."TaskAttempt" DROP CONSTRAINT IF EXISTS "TaskAttempt_lessonProgressId_fkey";
ALTER TABLE "public"."TaskAttempt" ADD CONSTRAINT "TaskAttempt_lessonProgressId_fkey" FOREIGN KEY ("lessonProgressId") REFERENCES "public"."LessonProgress" ("id") ON DELETE CASCADE;
