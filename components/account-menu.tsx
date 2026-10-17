"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";

/**
 * Clerk's profile dropdown, with a link to the author dashboard for authors.
 * The role check only decides whether to show the link; the dashboard checks
 * access again on the server.
 */
export function AccountMenu() {
  const { user } = useUser();
  const isAuthor = user?.publicMetadata.roles?.includes("author") ?? false;

  return (
    <UserButton>
      {isAuthor && (
        <UserButton.MenuItems>
          <UserButton.Link
            label="Author dashboard"
            href="/dashboard/posts"
            labelIcon={<LayoutDashboard className="size-4" />}
          />
        </UserButton.MenuItems>
      )}
    </UserButton>
  );
}
