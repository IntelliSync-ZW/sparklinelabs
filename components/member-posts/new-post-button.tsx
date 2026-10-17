import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Opens a blank editor; the post is only created once it has a title (see createPost). */
export function NewPostButton() {
  return (
    <Button asChild>
      <Link href="/dashboard/posts/new">
        <Plus aria-hidden="true" />
        New post
      </Link>
    </Button>
  );
}
