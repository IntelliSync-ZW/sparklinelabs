import { auth } from "@clerk/nextjs/server";
import { getInterestState } from "@/lib/learning/interest";
import { CourseInterest } from "./course-interest";

/** Server wrapper: looks up who is signed in and whether they already registered. */
export async function CourseInterestPanel({ courseId }: { courseId: string }) {
  const { userId } = await auth();
  const state = userId ? await getInterestState(userId, courseId) : { registered: false, whatsappUrl: null };
  return (
    <CourseInterest courseId={courseId} signedIn={Boolean(userId)} registered={state.registered} whatsappUrl={state.whatsappUrl} />
  );
}
