"use client";

import { useEditor, useEditorSelector } from "@portabletext/editor";
import * as selectors from "@portabletext/editor/selectors";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Table,
  Underline,
  Unlink,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOpenDialog } from "./editor-dialogs";

const DECORATORS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "strong", label: "Bold", icon: Bold },
  { name: "em", label: "Italic", icon: Italic },
  { name: "underline", label: "Underline", icon: Underline },
  { name: "code", label: "Inline code", icon: Code },
];
const STYLES: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "normal", label: "Paragraph", icon: Pilcrow },
  { name: "h2", label: "Heading 2", icon: Heading2 },
  { name: "h3", label: "Heading 3", icon: Heading3 },
  { name: "h4", label: "Heading 4", icon: Heading4 },
  { name: "blockquote", label: "Quote", icon: Quote },
];
const LISTS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: "bullet", label: "Bulleted list", icon: List },
  { name: "number", label: "Numbered list", icon: ListOrdered },
];

function ToolButton({
  label,
  pressed,
  disabled,
  onClick,
  icon: Icon,
}: {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: LucideIcon;
}) {
  return (
    <Button
      type="button"
      variant={pressed ? "secondary" : "ghost"}
      size="icon-sm"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      // Keep the editor's selection while clicking
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}

const Separator = () => <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />;

function DecoratorButton({ name, label, icon }: (typeof DECORATORS)[number]) {
  const editor = useEditor();
  const active = useEditorSelector(editor, selectors.isActiveDecorator(name));
  return (
    <ToolButton
      label={label}
      icon={icon}
      pressed={active}
      onClick={() => {
        editor.send({ type: "decorator.toggle", decorator: name });
        editor.send({ type: "focus" });
      }}
    />
  );
}

function StyleButton({ name, label, icon }: (typeof STYLES)[number]) {
  const editor = useEditor();
  const active = useEditorSelector(editor, selectors.isActiveStyle(name));
  return (
    <ToolButton
      label={label}
      icon={icon}
      pressed={active}
      onClick={() => {
        editor.send({ type: "style.toggle", style: name });
        editor.send({ type: "focus" });
      }}
    />
  );
}

function ListButton({ name, label, icon }: (typeof LISTS)[number]) {
  const editor = useEditor();
  const active = useEditorSelector(editor, selectors.isActiveListItem(name));
  return (
    <ToolButton
      label={label}
      icon={icon}
      pressed={active}
      onClick={() => {
        editor.send({ type: "list item.toggle", listItem: name });
        editor.send({ type: "focus" });
      }}
    />
  );
}

function LinkButton() {
  const editor = useEditor();
  const open = useOpenDialog();
  const active = useEditorSelector(editor, selectors.isActiveAnnotation("link"));
  const expanded = useEditorSelector(editor, selectors.isSelectionExpanded);

  if (active) {
    return (
      <ToolButton
        label="Remove link"
        icon={Unlink}
        pressed
        onClick={() => {
          editor.send({ type: "annotation.remove", annotation: { name: "link" } });
          editor.send({ type: "focus" });
        }}
      />
    );
  }
  return (
    <ToolButton
      label={expanded ? "Add link" : "Add link (select some text first)"}
      icon={Link2}
      disabled={!expanded}
      onClick={() => {
        const at = editor.getSnapshot().context.selection;
        if (at) open({ kind: "link", at });
      }}
    />
  );
}

export function Toolbar() {
  const editor = useEditor();
  const open = useOpenDialog();
  // Remember where the caret was, since focus moves into the dialog
  const caret = () => editor.getSnapshot().context.selection ?? undefined;

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="sticky top-14 z-10 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-border bg-background/95 px-2 py-1.5 backdrop-blur"
    >
      {DECORATORS.map((d) => (
        <DecoratorButton key={d.name} {...d} />
      ))}
      <Separator />
      {STYLES.map((s) => (
        <StyleButton key={s.name} {...s} />
      ))}
      <Separator />
      {LISTS.map((l) => (
        <ListButton key={l.name} {...l} />
      ))}
      <Separator />
      <LinkButton />
      <ToolButton label="Insert image" icon={ImagePlus} onClick={() => open({ kind: "image", at: caret() })} />
      <ToolButton label="Insert table" icon={Table} onClick={() => open({ kind: "table", at: caret() })} />
    </div>
  );
}
