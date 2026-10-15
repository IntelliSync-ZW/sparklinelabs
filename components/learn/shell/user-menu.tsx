"use client";

import { UserButton, useUser } from "@clerk/nextjs";

/** Avatar menu for signed-in learners; signed-out visitors use the on-page form. */
export function LearnUserMenu() {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return <div className="size-7" aria-hidden="true" />;
  if (isSignedIn) return <UserButton />;
  return (
    <a href="#sign-in" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
      Sign in
    </a>
  );
}
