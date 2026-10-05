"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  ChevronRight,
  Lock,
  CheckCircle,
  BookOpen,
  Clock,
  BarChart3,
  Play,
  AlertCircle,
  Lightbulb,
  AlertTriangle,
  Zap,
  MapPin,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/sanity/lib/image";
import { STLReact } from "../stl-render-react/latest";

// ─── Types ───────────────────────────────────────────────────────────────────

type Duration = { value: number; unit: string };

type SectionItem = {
  _key: string;
  _type: string;
  [key: string]: unknown;
};

type LessonSection = {
  _key: string;
  title: string;
  sectionId?: string;
  order?: number;
  defaultOpen?: boolean;
  duration?: Duration;
  progression?: { required?: boolean; completionType?: string };
  content?: SectionItem[];
  task?: SectionItem[];
  assessment?: SectionItem[];
};

type Lesson = {
  _id: string;
  title: string;
  slug: string;
  accessLevel?: string;
  duration?: Duration;
  summary?: string;
  learningOutcomes?: string[];
  videoUrl?: string;
  image?: { url: string; alt?: string; caption?: string };
  sections?: LessonSection[];
};

type CourseModule = {
  _id: string;
  number: number;
  title: string;
  slug: string;
  description?: SectionItem[];
  accessLevel?: string;
  course?: {
    _id: string;
    title: string;
    slug: string;
    accessLevel?: string;
    certificate?: { enabled: boolean; priceUsd?: number; certificateTitle?: string };
    allModules?: Array<{
      _id: string;
      number: number;
      title: string;
      slug: string;
      lessons?: Array<{ _id: string; order: number; title: string; slug: string; accessLevel?: string; duration?: Duration }>;
    }>;
  };
  lessons?: Lesson[];
  moduleAssessment?: { _id: string; title: string; passingScore: number };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatDuration(value?: number, unit?: string) {
  if (!value) return null;
  if (unit === "hours") return `${value}h`;
  if (unit === "seconds") return `${value}s`;
  return `${value} min`;
}

// ─── Portable Text components (lesson-scoped: H3+) ───────────────────────────

const lessonPtComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-relaxed text-muted-foreground mb-4 last:mb-0">{children}</p>
    ),
    h3: ({ children, value }) => {
      const text = (value?.children as { text?: string }[] | undefined)?.map((c) => c.text ?? "").join("") ?? "";
      const id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      return <h3 id={id} className="text-xl font-semibold mt-8 mb-3 text-foreground scroll-mt-24">{children}</h3>;
    },
    h4: ({ children }) => <h4 className="text-lg font-semibold mt-6 mb-2 text-foreground">{children}</h4>,
    h5: ({ children }) => <h5 className="text-base font-semibold mt-4 mb-1 text-foreground">{children}</h5>,
    h6: ({ children }) => <h6 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-1">{children}</h6>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-accent pl-5 py-1 my-5 italic text-muted-foreground">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-5 space-y-1.5 my-4 text-muted-foreground">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal ml-5 space-y-1.5 my-4 text-muted-foreground">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-base leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="text-base leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded border border-border">{children}</code>
    ),
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const isExt = href.startsWith("http");
      return (
        <a
          href={href}
          target={isExt ? "_blank" : undefined}
          rel={isExt ? "noopener noreferrer" : undefined}
          className="underline underline-offset-4 hover:text-accent transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const url = urlFor(value).width(900).quality(85).url();
      return (
        <figure className="my-6">
          <div className="relative w-full overflow-hidden rounded-xl border border-border">
            <Image src={url} alt={value.alt ?? ""} width={900} height={506} className="w-full h-auto object-cover" />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
    stlTableBlock: ({ value }) => {
      let parsedData = value?.stlParsed;
      if (typeof parsedData === "string") {
        try { parsedData = JSON.parse(parsedData); } catch { parsedData = null; }
      }
      if (!parsedData && typeof value?.stlString === "string") {
        try { parsedData = JSON.parse(value.stlString); } catch { parsedData = null; }
      }
      if (!parsedData || !parsedData.body) return null;
      return (
        <div className="my-6 w-full">
          <STLReact.Table data={parsedData} />
        </div>
      );
    },
  },
};

// ─── Callout ─────────────────────────────────────────────────────────────────

const calloutConfig: Record<string, { icon: React.ElementType; bg: string; border: string; label: string }> = {
  important: { icon: Lightbulb, bg: "bg-blue-500/8", border: "border-blue-500/30", label: "Important Note" },
  tip: { icon: Zap, bg: "bg-accent/8", border: "border-accent/30", label: "Pro Tip" },
  warning: { icon: AlertTriangle, bg: "bg-yellow-500/8", border: "border-yellow-500/30", label: "Warning" },
  example: { icon: BookOpen, bg: "bg-secondary", border: "border-border", label: "Example" },
  zimbabwe: { icon: MapPin, bg: "bg-green-500/8", border: "border-green-500/30", label: "Zimbabwe Context" },
};

function CalloutBlock({ value }: { value: { type?: string; title?: string; body?: unknown[] } }) {
  const cfg = calloutConfig[value.type ?? "important"] ?? calloutConfig.important;
  const Icon = cfg.icon;
  return (
    <div className={`${cfg.bg} ${cfg.border} border rounded-xl px-5 py-4 my-6`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4 text-accent shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {value.title || cfg.label}
        </span>
      </div>
      {value.body && (
        <PortableText value={value.body as Parameters<typeof PortableText>[0]["value"]} components={lessonPtComponents} />
      )}
    </div>
  );
}

// ─── Prompt Block ─────────────────────────────────────────────────────────────

function PromptBlockView({ value }: { value: { title?: string; prompt?: string; targetAiTool?: string; expectedOutput?: string; whyItWorks?: unknown[] } }) {
  const [copied, setCopied] = useState(false);
  const toolLabels: Record<string, string> = { chatgpt: "ChatGPT", gemini: "Gemini", claude: "Claude", perplexity: "Perplexity", any: "Any AI" };
  return (
    <div className="border border-accent/30 rounded-xl overflow-hidden my-6">
      <div className="flex items-center justify-between px-5 py-3 bg-accent/10 border-b border-accent/20">
        <div className="flex items-center gap-2">
          <Play className="size-4 text-accent" />
          <span className="text-sm font-semibold text-accent">{value.title || "Try this prompt"}</span>
        </div>
        {value.targetAiTool && value.targetAiTool !== "any" && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent font-medium">
            {toolLabels[value.targetAiTool] ?? value.targetAiTool}
          </span>
        )}
      </div>
      <pre className="whitespace-pre-wrap font-mono text-sm px-5 py-4 bg-muted/40 text-foreground leading-relaxed overflow-x-auto">
        {value.prompt}
      </pre>
      <div className="flex items-center justify-between px-5 py-3 bg-secondary border-t border-border">
        <span className="text-xs text-muted-foreground">Copy the prompt above and paste it into your AI tool.</span>
        <button
          onClick={() => {
            if (value.prompt) {
              navigator.clipboard.writeText(value.prompt);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }}
          className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {value.expectedOutput && (
        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What to look for</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{value.expectedOutput}</p>
        </div>
      )}
      {value.whyItWorks && (
        <div className="px-5 py-4 border-t border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Why it works</p>
          <PortableText value={value.whyItWorks as Parameters<typeof PortableText>[0]["value"]} components={lessonPtComponents} />
        </div>
      )}
    </div>
  );
}

// ─── Scenario Block ────────────────────────────────────────────────────────────

function ScenarioBlockView({ value }: { value: { title?: string; badge?: string; body?: unknown[]; questionOrChallenge?: string } }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden my-6 bg-secondary/50">
      <div className="flex items-center gap-2 px-5 py-3 bg-secondary border-b border-border">
        <AlertCircle className="size-4 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {value.badge || "Real-World Scenario"}
        </span>
      </div>
      <div className="px-5 py-5">
        {value.title && <h4 className="font-semibold text-base mb-3">{value.title}</h4>}
        {value.body && (
          <PortableText value={value.body as Parameters<typeof PortableText>[0]["value"]} components={lessonPtComponents} />
        )}
        {value.questionOrChallenge && (
          <div className="mt-4 p-4 rounded-lg bg-accent/8 border border-accent/20">
            <p className="text-sm font-medium text-accent mb-1">Challenge</p>
            <p className="text-sm text-foreground leading-relaxed">{value.questionOrChallenge}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Classification / Matching Table Task View ──────────────────────────────

type ClassificationRow = {
  task: string;
  correctAnswer: string;
  explanation?: string;
};

type ClassificationTaskData = {
  title?: string;
  taskType?: string;
  taskMode?: string;
  requirement?: string;
  classificationInstruction?: string;
  classificationOptions?: string[];
  classificationColumns?: {
    taskLabel?: string;
    answerLabel?: string;
    whyLabel?: string;
  };
  classificationRows?: ClassificationRow[];
  taskRef?: ClassificationTaskData;
  instructions?: unknown[];
  promptToTest?: string;
  deliverable?: string;
};

function ClassificationTaskView({ value }: { value: ClassificationTaskData }) {
  const data = value.taskMode === "reference" && value.taskRef ? value.taskRef : value;
  const title = value.title || data.title || "Interactive Classification Exercise";
  const instruction = data.classificationInstruction || "For each task, choose the job type.";
  const rows = data.classificationRows ?? [];
  const taskLabel = data.classificationColumns?.taskLabel || "Task";
  const answerLabel = data.classificationColumns?.answerLabel || "Job Type";
  const whyLabel = data.classificationColumns?.whyLabel || "Why";

  const explicitOptions = data.classificationOptions?.filter(Boolean) ?? [];
  const derivedOptions = Array.from(new Set(rows.map((r) => r.correctAnswer).filter(Boolean)));
  const options = explicitOptions.length > 0 ? explicitOptions : derivedOptions;

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (rowIndex: number, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [rowIndex]: option }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = rows.length > 0 && answeredCount === rows.length;
  const correctCount = rows.filter(
    (row, idx) => selectedAnswers[idx]?.trim().toLowerCase() === row.correctAnswer?.trim().toLowerCase()
  ).length;
  const isComplete = showFeedback && isAllAnswered;

  const handleReset = () => {
    setSelectedAnswers({});
    setShowFeedback(false);
  };

  return (
    <div className="my-8">
      {/* Task label strip */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-accent/15 flex items-center justify-center">
            <Sparkles className="size-3.5 text-accent" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {value.requirement === "required" ? "🔒 Required Exercise" : "Interactive Exercise"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isComplete && (
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${correctCount === rows.length ? "bg-green-500/15 text-green-500" : "bg-yellow-500/15 text-yellow-500"}`}>
              {correctCount} / {rows.length} correct
            </span>
          )}
          <Button size="sm" variant="ghost" onClick={handleReset} className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground">
            <RotateCcw className="size-3 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-base font-semibold text-foreground mb-1">{title}</h4>

      {/* Instructions — always shown first */}
      {data.instructions && (
        <div className="mb-4 text-sm text-muted-foreground leading-relaxed">
          <PortableText value={data.instructions as Parameters<typeof PortableText>[0]["value"]} components={lessonPtComponents} />
        </div>
      )}

      {/* Classification instruction */}
      <p className="text-sm text-foreground mb-3">{instruction}</p>

      {/* Available options legend */}
      {options.length > 0 && (
        <div className="flex items-center flex-wrap gap-2 mb-4 text-xs">
          <span className="text-muted-foreground font-medium">Choices:</span>
          {options.map((opt) => (
            <span key={opt} className="px-2.5 py-0.5 rounded-full bg-secondary border border-border text-foreground font-medium">
              {opt}
            </span>
          ))}
        </div>
      )}

      {/* Rows — clean list, no nested cards */}
      <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
        {rows.map((row, idx) => {
          const selected = selectedAnswers[idx];
          const isCorrect = selected?.trim().toLowerCase() === row.correctAnswer?.trim().toLowerCase();
          const evaluated = showFeedback && selected !== undefined;

          return (
            <div
              key={idx}
              className={`px-5 py-4 transition-colors ${evaluated ? isCorrect ? "bg-green-500/[0.03]" : "bg-red-500/[0.03]" : ""}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="size-5 rounded-full bg-secondary border border-border text-[11px] font-mono text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-0.5">{taskLabel}</span>
                    <p className="text-sm font-medium text-foreground leading-relaxed">{row.task}</p>
                  </div>
                </div>
                {evaluated && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                        <Check className="size-3" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                        <X className="size-3" /> Expected: {row.correctAnswer}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="ml-7">
                <span className="text-xs text-muted-foreground block mb-2">Select {answerLabel}:</span>
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => {
                    const isSelected = selected === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelect(idx, option)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${isSelected
                          ? evaluated
                            ? isCorrect
                              ? "bg-green-500/15 border-green-500 text-green-600 dark:text-green-400"
                              : "bg-red-500/15 border-red-500 text-red-600 dark:text-red-400"
                            : "bg-accent text-accent-foreground border-accent shadow-sm"
                          : "bg-secondary hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              {evaluated && row.explanation && (
                <div className="ml-7 mt-3 p-3 rounded-lg bg-secondary/80 border border-border/60 text-xs leading-relaxed">
                  <span className="font-semibold text-foreground block mb-0.5">{whyLabel}:</span>
                  <p className="text-muted-foreground">{row.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-muted-foreground">{answeredCount} of {rows.length} answered</p>
        <Button
          size="sm"
          disabled={answeredCount === 0}
          onClick={() => setShowFeedback(true)}
          className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs px-4"
        >
          Check Answers
        </Button>
      </div>
    </div>
  );
}

// ─── Generic Task View ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GenericTaskView({ value }: { value: any }) {
  const data = value.taskMode === "reference" && value.taskRef ? value.taskRef : value;
  const title = value.title || data.title || "Task";
  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-6 rounded-md bg-accent/15 flex items-center justify-center">
          <Sparkles className="size-3.5 text-accent" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {value.requirement === "required" ? "🔒 Required Task" : "Exercise"}
        </span>
      </div>
      <h4 className="text-base font-semibold text-foreground mb-3">{title}</h4>

      {/* Instructions shown before the prompt/deliverable — plain prose, no card */}
      {data.instructions && (
        <div className="mb-4">
          <PortableText value={data.instructions as Parameters<typeof PortableText>[0]["value"]} components={lessonPtComponents} />
        </div>
      )}

      {data.promptToTest && (
        <div className="my-4 p-3 bg-muted rounded-lg font-mono text-xs text-foreground overflow-x-auto">
          {data.promptToTest}
        </div>
      )}
      {data.deliverable && (
        <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
          <strong className="text-foreground">Expected deliverable:</strong> {data.deliverable}
        </div>
      )}
    </div>
  );
}

// ─── Section Content Renderer ─────────────────────────────────────────────────

function renderSectionContent(items: SectionItem[]) {
  const ptItems: SectionItem[] = [];
  const output: React.ReactNode[] = [];
  let keyIdx = 0;

  function flushPt() {
    if (ptItems.length > 0) {
      const snapshot = [...ptItems];
      ptItems.length = 0;
      output.push(
        <PortableText
          key={`pt-${keyIdx++}`}
          value={snapshot as Parameters<typeof PortableText>[0]["value"]}
          components={lessonPtComponents}
        />
      );
    }
  }

  for (const item of items) {
    if (item._type === "block") {
      ptItems.push(item);
    } else {
      flushPt();
      if (item._type === "callout") {
        output.push(<CalloutBlock key={item._key ?? keyIdx++} value={item as Parameters<typeof CalloutBlock>[0]["value"]} />);
      } else if (item._type === "promptBlock") {
        output.push(<PromptBlockView key={item._key ?? keyIdx++} value={item as Parameters<typeof PromptBlockView>[0]["value"]} />);
      } else if (item._type === "scenarioBlock") {
        output.push(<ScenarioBlockView key={item._key ?? keyIdx++} value={item as Parameters<typeof ScenarioBlockView>[0]["value"]} />);
      } else if (item._type === "sectionTask" || item._type === "courseTask" || item._type === "lessonTaskRef") {
        const taskData = (item.taskRef || item.task || item) as ClassificationTaskData;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (taskData.taskType === "classification" || (item as any).taskType === "classification") {
          output.push(<ClassificationTaskView key={item._key ?? keyIdx++} value={item as ClassificationTaskData} />);
        } else {
          output.push(<GenericTaskView key={item._key ?? keyIdx++} value={item} />);
        }
      } else if (item._type === "image") {
        const url = item.asset ? urlFor(item as Parameters<typeof urlFor>[0]).width(900).quality(85).url() : "";
        if (url) {
          output.push(
            <figure key={item._key ?? keyIdx++} className="my-6">
              <div className="relative w-full overflow-hidden rounded-xl border border-border">
                <Image src={url} alt={(item.alt as string) ?? ""} width={900} height={506} className="w-full h-auto" />
              </div>
              {typeof item.caption === "string" && item.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{item.caption}</figcaption>}
            </figure>
          );
        }
      }
    }
  }
  flushPt();
  return output;
}

// ─── Section Assessment View ──────────────────────────────────────────────────

type QuestionOption = {
  id?: string;
  label?: string;
  isCorrect?: boolean;
  explanation?: string;
};

type AssessmentQuestionItem = {
  points?: number;
  question?: {
    _id?: string;
    questionType?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    question?: any;
    options?: QuestionOption[];
    correctAnswer?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    explanation?: any;
  };
};

type SectionAssessmentData = {
  _key?: string;
  _type?: string;
  title?: string;
  instructions?: unknown[];
  passingScore?: number;
  requiredToAdvance?: boolean;
  feedbackOnPass?: string;
  feedbackOnFail?: string;
  assessmentMode?: string;
  questions?: AssessmentQuestionItem[];
  assessmentRef?: {
    _id?: string;
    title?: string;
    passingScore?: number;
    questions?: AssessmentQuestionItem[];
  };
};

function SectionAssessmentView({
  value,
  onPass,
  isAlreadyPassed,
}: {
  value: SectionAssessmentData;
  onPass?: () => void;
  isAlreadyPassed?: boolean;
}) {
  const data = value.assessmentMode === "reference" && value.assessmentRef ? value.assessmentRef : value;
  const title = value.title || data.title || "Section Assessment";
  const passingScore = data.passingScore ?? 80;
  const questions = data.questions ?? [];

  // Support both single (string) and multi-select (string[]) per question
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | string[]>>({});
  const [submitted, setSubmitted] = useState(isAlreadyPassed || false);
  const [passed, setPassed] = useState(isAlreadyPassed || false);
  const [scorePercent, setScorePercent] = useState(isAlreadyPassed ? 100 : 0);

  const isMultiple = (qIdx: number) =>
    questions[qIdx]?.question?.questionType === "multiple_choice";

  const handleSelectSingle = (qIdx: number, val: string) => {
    if (submitted && passed) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: val }));
  };

  const handleToggleMulti = (qIdx: number, val: string) => {
    if (submitted && passed) return;
    setSelectedAnswers((prev) => {
      const current = (prev[qIdx] as string[] | undefined) ?? [];
      const exists = current.includes(val);
      return { ...prev, [qIdx]: exists ? current.filter((v) => v !== val) : [...current, val] };
    });
  };

  const handleSubmit = () => {
    let earned = 0;
    let total = 0;
    questions.forEach((qItem, idx) => {
      const q = qItem.question;
      const points = qItem.points ?? 1;
      total += points;

      if (isMultiple(idx)) {
        // Multi-choice: must select ALL correct and NO wrong options
        const chosen = (selectedAnswers[idx] as string[] | undefined) ?? [];
        const correctIds = (q?.options ?? []).filter((o) => o.isCorrect).map((o) => o.id || o.label || "");
        const wrongChosen = chosen.some((c) => !correctIds.includes(c));
        const allCorrectChosen = correctIds.every((cid) => chosen.includes(cid));
        if (!wrongChosen && allCorrectChosen && chosen.length > 0) earned += points;
      } else {
        const userChoice = selectedAnswers[idx] as string | undefined;
        const correctOpt = q?.options?.find((o) => o.isCorrect);
        if (correctOpt) {
          if (userChoice === correctOpt.id || userChoice === correctOpt.label) earned += points;
        } else if (q?.correctAnswer) {
          if (userChoice?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) earned += points;
        }
      }
    });
    const percent = total > 0 ? Math.round((earned / total) * 100) : 100;
    setScorePercent(percent);
    setSubmitted(true);
    const didPass = percent >= passingScore;
    setPassed(didPass);
    if (didPass && onPass) onPass();
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setPassed(false);
  };

  // A question counts as answered if it has at least one selection
  const answeredCount = questions.filter((_, idx) => {
    const v = selectedAnswers[idx];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  }).length;

  return (
    <div className="my-8">
      {/* Assessment header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-md bg-accent/15 flex items-center justify-center">
            <Award className="size-3.5 text-accent" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Knowledge Check · Passing: {passingScore}%
          </span>
        </div>
        <div>
          {passed ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
              <CheckCircle className="size-3" /> Passed ({scorePercent}%)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">
              <Lock className="size-3" /> Required
            </span>
          )}
        </div>
      </div>

      <h4 className="text-base font-semibold text-foreground mb-4">{title}</h4>

      {/* Instructions — plain prose, no card wrapper */}
      {value.instructions && value.instructions.length > 0 && (
        <div className="mb-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PortableText value={value.instructions as any} components={lessonPtComponents} />
        </div>
      )}

      {/* Questions */}
      <div className="space-y-8">
        {questions.map((qItem, qIdx) => {
          const q = qItem.question;
          const isMulti = isMultiple(qIdx);
          const chosenSingle = selectedAnswers[qIdx] as string | undefined;
          const chosenMulti = (selectedAnswers[qIdx] as string[] | undefined) ?? [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const questionText = Array.isArray(q?.question)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? q.question.map((b: any) => b.children?.map((c: any) => c.text).join("")).join("\n")
            : typeof q?.question === "string"
              ? q.question
              : `Question ${qIdx + 1}`;

          // For explanation: show the correct option explanation, or any chosen-wrong explanation
          const correctOpts = q?.options?.filter((o) => o.isCorrect) ?? [];
          const explanationOpt = correctOpts.find((o) => o.explanation) ?? correctOpts[0];

          return (
            <div key={q?._id ?? qIdx}>
              {/* Question stem */}
              <div className="flex items-start gap-2.5 mb-3">
                <span className="size-5 rounded-full bg-secondary border border-border text-[11px] font-mono text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground leading-relaxed">{questionText}</p>
                  {isMulti && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">Select all that apply</p>
                  )}
                </div>
              </div>

              {/* Options */}
              {q?.options && q.options.length > 0 && (
                <div className="ml-7 space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const optVal = opt.id || opt.label || String(optIdx);
                    const isSelected = isMulti
                      ? chosenMulti.includes(optVal)
                      : chosenSingle === optVal;
                    const isOptionCorrect = opt.isCorrect;

                    // Colour states
                    let rowStyle = "border-border hover:border-muted-foreground/40";
                    let indicatorStyle = isMulti
                      ? "border-border bg-background"
                      : "border-border bg-background";
                    let labelStyle = "text-muted-foreground";

                    if (isSelected && !submitted) {
                      rowStyle = "border-accent bg-accent/5";
                      indicatorStyle = isMulti
                        ? "border-accent bg-accent"
                        : "border-accent bg-accent";
                      labelStyle = "text-foreground font-medium";
                    }
                    if (submitted) {
                      if (isOptionCorrect) {
                        rowStyle = "border-green-500 bg-green-500/5";
                        indicatorStyle = "border-green-500 bg-green-500";
                        labelStyle = "text-green-700 dark:text-green-400 font-medium";
                      } else if (isSelected && !isOptionCorrect) {
                        rowStyle = "border-red-500 bg-red-500/5";
                        indicatorStyle = "border-red-500 bg-red-500";
                        labelStyle = "text-red-600 dark:text-red-400 line-through";
                      } else {
                        rowStyle = "border-border opacity-50";
                        labelStyle = "text-muted-foreground";
                      }
                    }

                    return (
                      <label
                        key={optVal}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer select-none transition-all group ${
                          submitted && passed ? "pointer-events-none" : ""
                        } ${rowStyle}`}
                      >
                        {/* Hidden native input for accessibility */}
                        <input
                          type={isMulti ? "checkbox" : "radio"}
                          name={`question-${qIdx}`}
                          value={optVal}
                          checked={isSelected}
                          onChange={() =>
                            isMulti
                              ? handleToggleMulti(qIdx, optVal)
                              : handleSelectSingle(qIdx, optVal)
                          }
                          disabled={submitted && passed}
                          className="sr-only"
                        />
                        {/* Custom visual indicator */}
                        {isMulti ? (
                          // Checkbox
                          <span
                            className={`size-4 rounded flex items-center justify-center shrink-0 border-2 transition-all ${indicatorStyle}`}
                          >
                            {isSelected && <Check className="size-2.5 text-accent-foreground" strokeWidth={3} />}
                            {submitted && isOptionCorrect && <Check className="size-2.5 text-white" strokeWidth={3} />}
                          </span>
                        ) : (
                          // Radio
                          <span
                            className={`size-4 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${indicatorStyle}`}
                          >
                            {(isSelected || (submitted && isOptionCorrect)) && (
                              <span className="size-1.5 rounded-full bg-accent-foreground block" />
                            )}
                          </span>
                        )}
                        <span className={`text-sm leading-snug flex-1 transition-colors ${labelStyle}`}>
                          {opt.label}
                        </span>
                        {submitted && isOptionCorrect && <Check className="size-3.5 text-green-500 shrink-0" />}
                        {submitted && isSelected && !isOptionCorrect && <X className="size-3.5 text-red-500 shrink-0" />}
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Explanation after submit */}
              {submitted && explanationOpt?.explanation && (
                <p className="ml-7 mt-2 text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground font-semibold">Explanation: </strong>
                  {explanationOpt.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-border">
        {submitted ? (
          <div>
            {passed ? (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-green-500/15 text-green-500 flex items-center justify-center shrink-0">
                    <CheckCircle className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Passed with {scorePercent}%!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{value.feedbackOnPass || "Great work! The next section has been unlocked."}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center shrink-0">
                    <AlertCircle className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Scored {scorePercent}% — need {passingScore}%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{value.feedbackOnFail || "Review the material above and try again."}</p>
                  </div>
                </div>
                <Button size="sm" onClick={handleRetry} variant="outline" className="text-xs">
                  <RotateCcw className="size-3.5 mr-1.5" /> Retake
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">{answeredCount} of {questions.length} answered</span>
            <Button
              size="sm"
              disabled={answeredCount === 0}
              onClick={handleSubmit}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs px-5"
            >
              Submit & Unlock Next Section
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lesson Section — flat document style (no accordion) ─────────────────────

function LessonSectionBlock({
  section,
  isFirst,
  isLocked,
  lockedByTitle,
  lockedByAssessment,
  isCompleted,
  onComplete,
}: {
  section: LessonSection;
  isFirst: boolean;
  isLocked: boolean;
  lockedByTitle?: string;
  lockedByAssessment?: boolean;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const dur = formatDuration(section.duration?.value, section.duration?.unit);

  const assessmentData =
    section.assessment && section.assessment.length > 0
      ? (section.assessment[0] as SectionAssessmentData)
      : (section.content?.find((c) => c._type === "sectionAssessment") as SectionAssessmentData | undefined);

  const hasAssessment = Boolean(assessmentData);

  // Section divider (except first)
  return (
    <div
      className={`${!isFirst ? "mt-12 pt-10 border-t border-border" : ""} ${isLocked ? "opacity-60 pointer-events-none" : ""}`}
      id={section.sectionId}
    >
      {/* Section heading row */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          {section.order !== undefined && (
            <span className="text-xs font-mono text-muted-foreground pt-1 w-5 shrink-0">{section.order}</span>
          )}
          <div>
            <h2 className={`text-2xl font-semibold tracking-tight ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
              {section.title}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              {dur && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> {dur}
                </span>
              )}
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-500">
                  <CheckCircle className="size-3" /> Completed
                </span>
              )}
              {isLocked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                  <Lock className="size-3" /> Locked
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Locked state message */}
      {isLocked ? (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/60 border border-border">
          <Lock className="size-4 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Section Locked</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {lockedByAssessment
                ? `You must pass the assessment in "${lockedByTitle}" to unlock this section.`
                : `Complete "${lockedByTitle}" to advance to this section.`}
            </p>
          </div>
        </div>
      ) : (
        <div>
          {/* Section content */}
          {section.content && section.content.length > 0 && renderSectionContent(section.content)}

          {/* Section tasks */}
          {section.task && section.task.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border/60">
              {section.task.map((t, ti) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const taskData = (t.taskRef || (t as any).task || t) as ClassificationTaskData;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (taskData.taskType === "classification" || (t as any).taskType === "classification") {
                  return <ClassificationTaskView key={t._key ?? ti} value={t as ClassificationTaskData} />;
                }
                return <GenericTaskView key={t._key ?? ti} value={t} />;
              })}
            </div>
          )}

          {/* Section assessment */}
          {assessmentData && (
            <div className="mt-8 pt-8 border-t border-border/60">
              <SectionAssessmentView
                value={assessmentData}
                onPass={onComplete}
                isAlreadyPassed={isCompleted}
              />
            </div>
          )}

          {/* Mark as complete (no assessment) */}
          {!hasAssessment && !isCompleted && section.progression?.required && (
            <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">Complete this section to advance.</p>
              <Button
                size="sm"
                onClick={onComplete}
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs px-4"
              >
                Mark as Complete & Unlock Next →
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Lesson Card (locked) ────────────────────────────────────────────────────

function LockedLessonCard({ lesson, lessonNumber }: { lesson: Lesson; lessonNumber: number }) {
  const dur = formatDuration(lesson.duration?.value, lesson.duration?.unit);
  return (
    <div className="border border-border rounded-xl p-6 bg-muted/30 opacity-70 relative overflow-hidden mb-8">
      <div className="absolute top-4 right-4">
        <Lock className="size-5 text-muted-foreground" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="size-8 flex items-center justify-center rounded-full bg-secondary border border-border text-sm font-medium text-muted-foreground shrink-0">
          {lessonNumber}
        </span>
        <h3 className="font-semibold text-base text-muted-foreground">{lesson.title}</h3>
      </div>
      {lesson.summary && (
        <p className="text-sm text-muted-foreground/70 leading-relaxed ml-11">{lesson.summary}</p>
      )}
      {dur && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mt-3 ml-11">
          <Clock className="size-3" /> {dur}
        </div>
      )}
      <div className="mt-4 ml-11">
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Lock className="size-3" /> Complete previous lesson to unlock
        </span>
      </div>
    </div>
  );
}

// ─── Lesson Player ────────────────────────────────────────────────────────────

function LessonPlayer({
  lesson,
  lessonNumber,
  totalLessons,
  nextLesson,
}: {
  lesson: Lesson;
  lessonNumber: number;
  totalLessons: number;
  courseSlug: string;
  moduleSlug: string;
  nextLesson?: Lesson;
}) {
  const dur = formatDuration(lesson.duration?.value, lesson.duration?.unit);
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});

  const handleCompleteSection = (key: string) => {
    setCompletedSections((prev) => ({ ...prev, [key]: true }));
  };

  const sections = lesson.sections ?? [];

  return (
    <div id={lesson.slug} className="mb-16 scroll-mt-24">
      {/* Lesson header — clean, not a card */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <span className="size-9 flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0">
            {lessonNumber}
          </span>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Lesson {lessonNumber} of {totalLessons}</p>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">{lesson.title}</h2>
          </div>
        </div>
        {dur && (
          <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 pt-2">
            <Clock className="size-3.5" /> {dur}
          </span>
        )}
      </div>

      {/* Thin accent line under lesson title */}
      <div className="ml-12 mt-3 mb-8 h-px bg-border" />

      {/* Lesson image */}
      {lesson.image?.url && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 border border-border">
          <Image
            src={lesson.image.url}
            alt={lesson.image.alt ?? lesson.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      {/* Video embed */}
      {lesson.videoUrl && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black mb-8">
          <iframe
            src={lesson.videoUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            title={lesson.title}
          />
        </div>
      )}

      {/* Summary */}
      {lesson.summary && (
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">{lesson.summary}</p>
      )}

      {/* Learning outcomes */}
      {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
        <div className="mb-8 p-5 rounded-xl bg-secondary/60 border border-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">What you will learn</p>
          <ul className="space-y-2">
            {lesson.learningOutcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-accent shrink-0 mt-0.5" />
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sections — rendered as continuous document flow */}
      {sections.length > 0 && (
        <div>
          {sections.map((section, i) => {
            const sectionKey = section._key || String(i);
            const isCompleted = Boolean(completedSections[sectionKey]);

            let isLocked = false;
            let lockedByTitle = "";
            let lockedByAssessment = false;

            if (i > 0) {
              for (let k = 0; k < i; k++) {
                const prev = sections[k];
                const prevKey = prev._key || String(k);
                const prevHasAssessment = Boolean(
                  (prev.assessment && prev.assessment.length > 0) ||
                  prev.content?.some((c) => c._type === "sectionAssessment")
                );
                const prevRequired = prev.progression?.required ?? prevHasAssessment;

                if (prevRequired && !completedSections[prevKey]) {
                  isLocked = true;
                  lockedByTitle = prev.title;
                  lockedByAssessment = prevHasAssessment;
                  break;
                }
              }
            }

            return (
              <LessonSectionBlock
                key={sectionKey}
                section={section}
                isFirst={i === 0}
                isLocked={isLocked}
                lockedByTitle={lockedByTitle}
                lockedByAssessment={lockedByAssessment}
                isCompleted={isCompleted}
                onComplete={() => handleCompleteSection(sectionKey)}
              />
            );
          })}
        </div>
      )}

      {/* Next lesson CTA */}
      <div className="mt-12 pt-6 border-t border-border flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="size-4 text-accent" />
          <span>Mark lesson as complete</span>
        </div>
        {nextLesson ? (
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0" asChild>
            <a href={`#${nextLesson.slug}`}>
              Next: {nextLesson.title.length > 30 ? `${nextLesson.title.slice(0, 30)}…` : nextLesson.title}
              <ChevronRight className="ml-1 size-4" />
            </a>
          </Button>
        ) : (
          <span className="text-sm text-muted-foreground italic">Last lesson in this module</span>
        )}
      </div>
    </div>
  );
}

// ─── Main Client Component ───────────────────────────────────────────────────

export function ModuleLessonPlayer({
  module: mod,
  courseSlug,
}: {
  module: CourseModule;
  courseSlug: string;
}) {
  const course = mod.course;
  const isCourseLevel = course?.accessLevel === "free" || course?.accessLevel === "registration";

  const allModules = course?.allModules ?? [];
  const currentModuleIdx = allModules.findIndex((m) => m.slug === mod.slug);
  const prevModule = currentModuleIdx > 0 ? allModules[currentModuleIdx - 1] : null;
  const nextModule = currentModuleIdx < allModules.length - 1 ? allModules[currentModuleIdx + 1] : null;

  const lessons = mod.lessons ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top nav breadcrumb ─────────────────────────────────────────────── */}
      <div className="border-b border-border bg-secondary/60 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/ai-training" className="hover:text-foreground transition-colors">AI Training</Link>
          <ChevronRight className="size-3.5" />
          <Link href={`/ai-training/${courseSlug}`} className="hover:text-foreground transition-colors truncate max-w-[120px]">
            {course?.title ?? "Course"}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground font-medium truncate max-w-[180px]">{mod.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-16 items-start">
          {/* ── Main lesson content ─────────────────────────────────────────── */}
          <div className="min-w-0">
            {/* Module header */}
            <div className="mb-12">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Module {mod.number}</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{mod.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="size-4" /> {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
                </span>
                {mod.accessLevel && (
                  <span className="flex items-center gap-1.5">
                    {mod.accessLevel === "paid" ? <Lock className="size-4" /> : <BarChart3 className="size-4" />}
                    {mod.accessLevel === "free" ? "Free" : mod.accessLevel === "registration" ? "Free with registration" : "Paid"}
                  </span>
                )}
              </div>
            </div>

            {/* Lessons */}
            {lessons.map((lesson, idx) => {
              const isLocked = lesson.accessLevel === "paid" && !isCourseLevel;
              const nextLesson = idx < lessons.length - 1 ? lessons[idx + 1] : undefined;

              return isLocked ? (
                <LockedLessonCard key={lesson._id} lesson={lesson} lessonNumber={idx + 1} />
              ) : (
                <LessonPlayer
                  key={lesson._id}
                  lesson={lesson}
                  lessonNumber={idx + 1}
                  totalLessons={lessons.length}
                  courseSlug={courseSlug}
                  moduleSlug={mod.slug}
                  nextLesson={nextLesson}
                />
              );
            })}

            {/* Module nav */}
            <div className="flex items-center justify-between mt-10 pt-10 border-t border-border">
              {prevModule ? (
                <Button variant="outline" asChild>
                  <Link href={`/ai-training/${courseSlug}/${prevModule.slug}`}>
                    ← Module {prevModule.number}: {prevModule.title.length > 24 ? `${prevModule.title.slice(0, 24)}…` : prevModule.title}
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              {nextModule ? (
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link href={`/ai-training/${courseSlug}/${nextModule.slug}`}>
                    Module {nextModule.number}: {nextModule.title.length > 24 ? `${nextModule.title.slice(0, 24)}…` : nextModule.title} →
                  </Link>
                </Button>
              ) : (
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link href={`/ai-training/${courseSlug}`}>
                    <CheckCircle className="mr-2 size-4" /> Back to Course
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* ── Sidebar: course outline ─────────────────────────────────────── */}
          <aside className="hidden lg:block sticky top-[57px]">
            <div className="border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 bg-secondary border-b border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course Outline</p>
                <Link href={`/ai-training/${courseSlug}`} className="text-sm font-medium hover:text-accent transition-colors mt-0.5 block">
                  {course?.title}
                </Link>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {allModules.map((m) => (
                  <div key={m._id}>
                    <Link
                      href={`/ai-training/${courseSlug}/${m.slug}`}
                      className={`flex items-center gap-3 px-5 py-3.5 text-sm border-b border-border hover:bg-muted/50 transition-colors ${m.slug === mod.slug ? "bg-accent/8 text-accent font-semibold" : "text-muted-foreground"}`}
                    >
                      <span className="size-6 flex items-center justify-center rounded-full bg-secondary text-xs font-medium border border-border shrink-0">
                        {m.number}
                      </span>
                      <span className="truncate">{m.title}</span>
                    </Link>
                    {m.slug === mod.slug &&
                      lessons.map((l, li) => (
                        <a
                          key={l._id}
                          href={`#${l.slug}`}
                          className="flex items-center gap-2.5 pl-14 pr-5 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors border-b border-border/50 last:border-b-0"
                        >
                          <span className="size-4 flex items-center justify-center rounded-full border border-border/60 text-[10px] shrink-0">
                            {li + 1}
                          </span>
                          <span className="truncate">{l.title}</span>
                        </a>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
