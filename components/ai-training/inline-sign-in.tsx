"use client";

import { usePathname } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

/**
 * Clerk sign-in rendered directly on the page (no button → modal step).
 * `withSignUp` lets new learners register in the same widget, and the learner
 * lands back on the page they were reading once signed in.
 */
export function InlineSignIn({ id = "sign-in" }: { id?: string }) {
  const returnUrl = usePathname();

  return (
    <div id={id} className="scroll-mt-24 flex justify-center w-full">
      <SignIn
        routing="hash"
        withSignUp
        forceRedirectUrl={returnUrl}
        signUpForceRedirectUrl={returnUrl}
        appearance={{
          elements: {
            rootBox: "w-full flex justify-center",
            cardBox: "shadow-xl border border-border",
          },
        }}
      />
    </div>
  );
}
