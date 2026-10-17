"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, MessageSquareText, Sparkles } from "lucide-react";
import { Prose } from "./prose";
import type { PortableTextValue } from "./types";

type PromptValue = {
  title?: string;
  prompt?: string;
  targetAiTool?: string;
  expectedOutput?: string;
  whyItWorks?: PortableTextValue;
};

// Only tools that accept a pre-filled prompt in the URL get an "Open in" link.
const tools: Record<string, { label: string; open?: (q: string) => string }> = {
  chatgpt: { label: "ChatGPT", open: (q) => `https://chatgpt.com/?q=${q}` },
  claude: { label: "Claude", open: (q) => `https://claude.ai/new?q=${q}` },
  perplexity: { label: "Perplexity", open: (q) => `https://www.perplexity.ai/search?q=${q}` },
  gemini: { label: "Gemini" },
  any: { label: "Any AI assistant" },
};

const MAX_URL_PROMPT = 1800;

/** A prompt shown the way it looks in a chat composer, with copy and open-in actions. */
export function PromptBlock({ value }: { value: PromptValue }) {
  const [copied, setCopied] = useState(false);
  const prompt = value.prompt ?? "";
  const tool = tools[value.targetAiTool ?? "any"] ?? tools.any;
  const openHref = tool.open && prompt && prompt.length <= MAX_URL_PROMPT ? tool.open(encodeURIComponent(prompt)) : null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context); the text stays selectable.
    }
  }

  return (
    <figure className="my-9 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100">
      <figcaption className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
        <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-zinc-200">
          <MessageSquareText className="size-4 shrink-0 text-zinc-400" />
          <span className="truncate">{value.title || "Try this prompt"}</span>
        </span>
        <span className="shrink-0 rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-400">
          {tool.label}
        </span>
      </figcaption>

      <pre className="whitespace-pre-wrap break-words px-5 py-4 font-mono text-sm leading-relaxed text-zinc-100 selection:bg-zinc-700">
        {prompt}
      </pre>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-900/60 px-4 py-2.5">
        <span className="text-xs text-zinc-500">Paste this into your AI tool, then compare the answer.</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-white"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          </button>
          {openHref && (
            <a
              href={openHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-800"
            >
              Open in {tool.label} <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </div>

      {value.expectedOutput && (
        <details className="group border-t border-zinc-800">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 [&::-webkit-details-marker]:hidden">
            <Sparkles className="size-4 text-amber-400" />
            What a good response looks like
            <span className="ml-auto text-xs text-zinc-500 group-open:hidden">Show</span>
          </summary>
          <div className="mx-4 mb-4 rounded-md bg-zinc-800/70 px-4 py-3 text-sm leading-relaxed text-zinc-200">
            {value.expectedOutput}
          </div>
        </details>
      )}

      {value.whyItWorks && (
        <details className="group border-t border-zinc-800">
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-900 [&::-webkit-details-marker]:hidden">
            Why it works
            <span className="ml-auto text-xs text-zinc-500 group-open:hidden">Show</span>
          </summary>
          <div className="px-4 pb-4 text-zinc-300 [&_li]:text-zinc-300 [&_p]:text-zinc-300 [&_strong]:text-zinc-100">
            <Prose value={value.whyItWorks} />
          </div>
        </details>
      )}
    </figure>
  );
}
