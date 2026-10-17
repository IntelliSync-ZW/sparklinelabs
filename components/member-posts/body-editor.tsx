"use client";

import { EditorProvider, PortableTextEditable, type PortableTextBlock } from "@portabletext/editor";
import { EventListenerPlugin, NodePlugin } from "@portabletext/editor/plugins";
import { EditorDialogs } from "./editor-dialogs";
import { editorNodes } from "./editor-nodes";
import { ReviewCommentsPanel } from "./review-comments-panel";
import { schemaDefinition } from "./editor-schema";
import { Toolbar } from "./toolbar";

/**
 * The Portable Text editor for the post body. Browser-only: the editor reads
 * external stores without a server snapshot, so post-editor.tsx loads this
 * file with `ssr: false`.
 */
export function BodyEditor({
  initialBody,
  onChange,
  labelledBy,
}: {
  initialBody: PortableTextBlock[];
  onChange: (body: PortableTextBlock[]) => void;
  labelledBy: string;
}) {
  return (
    <EditorProvider
      initialConfig={{
        schemaDefinition,
        initialValue: initialBody.length ? initialBody : undefined,
      }}
    >
      <EventListenerPlugin
        on={(event) => {
          if (event.type === "mutation") onChange(event.value ?? []);
        }}
      />
      <NodePlugin nodes={editorNodes} />
      <EditorDialogs>
        <ReviewCommentsPanel />
        <div className="rounded-xl border border-border focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30">
          <Toolbar />
          <PortableTextEditable
            aria-labelledby={labelledBy}
            className="min-h-80 px-5 py-4 text-base outline-none"
            renderPlaceholder={() => <span className="text-muted-foreground">Start writing…</span>}
          />
        </div>
      </EditorDialogs>
    </EditorProvider>
  );
}
