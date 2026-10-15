import type { PortableTextValue } from "@/components/learn/blocks/types";

/** A task as sent to the browser — never includes answers. */
export type PublicTask = {
  id?: string;
  title?: string;
  taskType: string;
  objective?: string;
  estimatedMinutes?: number;
  points?: number;
  passingScore?: number;
  context?: PortableTextValue;
  steps?: { _key: string; title: string; detail?: string }[];
  deliverable?: string;
  classificationOptions?: string[];
  classificationColumns?: { itemLabel?: string; answerLabel?: string } | null;
  classificationRows?: { _key: string; item: string }[];
  question?: string;
  allowMultiple?: boolean;
  choices?: { _key: string; label: string }[];
  matchColumns?: { keyLabel?: string; optionLabel?: string } | null;
  matchKeys?: { _key: string; key: string }[];
  matchOptions?: string[];
  orderingItems?: string[];
  claims?: { _key: string; claim: string }[];
  starterPrompt?: string;
  targetAiTool?: string;
  wordRange?: { min?: number | null; max?: number | null } | null;
  responsePlaceholder?: string;
  checklistItems?: string[];
  rubric?: { _key: string; criterion: string; description?: string }[];
  hints?: string[];
};

export type PublicTaskSlot = { required?: boolean; task?: PublicTask | null };
