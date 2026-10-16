import "server-only";
import { Temporal } from "temporal-polyfill/full";
import { db } from "@/prisma/db";
import { validateProfile } from "./profile-options";

/**
 * Whether this learner has finished onboarding. The database being unreachable
 * must never lock someone out of a lesson, so a failed lookup counts as "done".
 */
export async function hasLearnerProfile(userId: string): Promise<boolean> {
  try {
    const row = await db.orm.public.LearnerProfile.where({ clerkUserId: userId }).first();
    return Boolean(row);
  } catch (error) {
    console.warn("hasLearnerProfile failed:", error);
    return true;
  }
}

/** Stores (or replaces) the learner's answers in the LearnerProfile table. */
export async function saveLearnerProfile(userId: string, input: unknown): Promise<boolean> {
  const clean = validateProfile(input);
  if (!clean) return false;

  const values = {
    stage: clean.stage,
    level: clean.level ?? null,
    field: clean.field ?? null,
    fieldOther: clean.fieldOther ?? null,
    aiExperience: clean.aiExperience,
  };

  try {
    const existing = await db.orm.public.LearnerProfile.where({ clerkUserId: userId }).first();
    if (existing) {
      await db.orm.public.LearnerProfile.where({ id: existing.id }).update({ ...values, updatedAt: Temporal.Now.instant() });
    } else {
      await db.orm.public.LearnerProfile.create({ clerkUserId: userId, ...values });
    }
    return true;
  } catch (error) {
    console.warn("saveLearnerProfile failed:", error);
    return false;
  }
}
