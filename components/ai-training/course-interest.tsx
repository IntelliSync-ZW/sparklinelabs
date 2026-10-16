"use client";

import { useState, useTransition } from "react";
import { BellRing, Check, MessageCircle } from "lucide-react";
import { InlineSignIn } from "@/components/ai-training/inline-sign-in";
import { registerInterestAction, whatsappClickAction } from "@/lib/learning/actions";
import { track } from "@/lib/analytics";

/**
 * "Tell me the day it launches" for a course that isn't live yet:
 * sign in -> one tap to register -> join the WhatsApp group (link from the CMS).
 */
export function CourseInterest({
  courseId,
  signedIn,
  registered,
  whatsappUrl,
}: {
  courseId: string;
  signedIn: boolean;
  registered: boolean;
  whatsappUrl: string | null;
}) {
  const [isRegistered, setRegistered] = useState(registered);
  const [group, setGroup] = useState(whatsappUrl);
  const [showSignIn, setShowSignIn] = useState(false);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  function register() {
    setError(false);
    startTransition(async () => {
      const result = await registerInterestAction({ courseId }).catch(() => null);
      if (result?.ok) {
        setRegistered(true);
        setGroup(result.whatsappUrl);
        track("course_interest_registered");
      } else {
        setError(true);
      }
    });
  }

  if (isRegistered) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <p className="flex items-center gap-2 font-semibold">
          <span className="grid size-6 place-items-center rounded-full bg-accent text-accent-foreground">
            <Check className="size-4" />
          </span>
          You&apos;re on the list
        </p>
        {group ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Join the WhatsApp group and you&apos;ll hear the day the course goes live.
            </p>
            <a
              href={group}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                track("course_interest_whatsapp_click");
                void whatsappClickAction({ courseId });
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-[#06361b] transition-colors hover:bg-[#20bd5b]"
            >
              <MessageCircle className="size-4" /> Join the WhatsApp group
            </a>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            We&apos;ll let you know the day the course goes live.
          </p>
        )}
      </div>
    );
  }

  if (signedIn) {
    return (
      <div>
        <button
          type="button"
          onClick={register}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
        >
          <BellRing className="size-5" /> {pending ? "Saving…" : "Notify me when it launches"}
        </button>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
            We couldn&apos;t save that just now. Please try again.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {!showSignIn ? (
        <>
          <button
            type="button"
            onClick={() => setShowSignIn(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            <BellRing className="size-5" /> Register your interest
          </button>
          <p className="mt-3 text-sm text-muted-foreground">Free account. We&apos;ll tell you the day it opens.</p>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="mb-4 text-sm text-muted-foreground">
            Create a free account or sign in, then tap one button to join the list.
          </p>
          <InlineSignIn />
        </div>
      )}
    </div>
  );
}
