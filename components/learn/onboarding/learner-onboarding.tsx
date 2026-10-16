"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  BookOpen,
  Briefcase,
  Building2,
  ChartColumn,
  Check,
  Compass,
  Cpu,
  Crown,
  FlaskConical,
  GraduationCap,
  HeartPulse,
  Landmark,
  Laptop,
  Loader2,
  Megaphone,
  Microscope,
  MessageSquare,
  Palette,
  Pencil,
  Presentation,
  Scale,
  ScrollText,
  Sparkles,
  Sprout,
  Store,
  TrendingUp,
  Wheat,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { saveLearnerProfileAction } from "@/lib/learning/actions";
import { questionsFor, type Choice, type ProfileAnswers, type StageValue } from "@/lib/learning/profile-options";
import { track } from "@/lib/analytics";

const ICONS: Record<string, LucideIcon> = {
  backpack: Backpack,
  graduation: GraduationCap,
  briefcase: Briefcase,
  store: Store,
  building: Building2,
  compass: Compass,
  sprout: Sprout,
  book: BookOpen,
  pencil: Pencil,
  flask: FlaskConical,
  scroll: ScrollText,
  microscope: Microscope,
  trending: TrendingUp,
  crown: Crown,
  laptop: Laptop,
  wrench: Wrench,
  chart: ChartColumn,
  heart: HeartPulse,
  chalkboard: Presentation,
  wheat: Wheat,
  scale: Scale,
  palette: Palette,
  sparkles: Sparkles,
  megaphone: Megaphone,
  landmark: Landmark,
  message: MessageSquare,
  zap: Zap,
  cpu: Cpu,
};

// Long enough to see the choice register, short enough to feel instant.
const ADVANCE_MS = 320;

/**
 * One question per screen. Tapping an answer highlights it and moves on by
 * itself; nothing needs a separate "Next" press (except typing a custom answer).
 * Answers are validated again on the server before they are stored.
 */
export function LearnerOnboarding({ firstName, courseTitle }: { firstName: string | null; courseTitle: string }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<ProfileAnswers>({});
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [picked, setPicked] = useState<string | null>(null);
  const [otherOpen, setOtherOpen] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [saving, startSaving] = useTransition();
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const questions = questionsFor(answers.stage as StageValue | undefined);
  const question = questions[Math.min(step, questions.length - 1)];
  // Until the stage is chosen the real length is unknown; show a typical one.
  const total = answers.stage ? questions.length : 3;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Move focus to the new question so screen readers announce it.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const save = useCallback(
    (final: ProfileAnswers) => {
      setFailed(false);
      startSaving(async () => {
        const result = await saveLearnerProfileAction(final).catch(() => ({ ok: false }));
        if (result.ok) {
          track("onboarding_complete", { stage: final.stage, field: final.field, level: final.level });
          router.refresh();
        } else {
          setFailed(true);
        }
      });
    },
    [router],
  );

  const advance = useCallback(
    (next: ProfileAnswers) => {
      const list = questionsFor(next.stage as StageValue | undefined);
      setPicked(null);
      setOtherOpen(false);
      setOtherText("");
      if (step + 1 >= list.length) {
        save(next);
        return;
      }
      setDirection("forward");
      setStep(step + 1);
    },
    [save, step],
  );

  const choose = useCallback(
    (choice: Choice) => {
      if (saving) return;
      if (timer.current) clearTimeout(timer.current);
      setPicked(choice.value);
      setOtherOpen(false);

      // Changing the stage invalidates every later answer.
      const base: ProfileAnswers = question.key === "stage" ? {} : answers;
      const next: ProfileAnswers = { ...base, [question.key]: choice.value };

      if (question.key === "field" && choice.value === "other") {
        setAnswers(next);
        setOtherOpen(true);
        return;
      }
      delete next.fieldOther;
      setAnswers(next);
      track("onboarding_answer", { question: question.key, value: choice.value });
      timer.current = setTimeout(() => advance(next), ADVANCE_MS);
    },
    [advance, answers, question.key, saving],
  );

  const submitOther = () => {
    const text = otherText.trim();
    if (!text) return;
    advance({ ...answers, fieldOther: text });
  };

  const back = () => {
    if (saving || step === 0) return;
    if (timer.current) clearTimeout(timer.current);
    setPicked(null);
    setOtherOpen(false);
    setDirection("back");
    setStep(step - 1);
  };

  // 1-9 picks the matching card, Backspace goes back (not while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= question.choices.length) {
        e.preventDefault();
        choose(question.choices[n - 1]);
      } else if (e.key === "Backspace") {
        back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const selected = answers[question.key];
  const greeting = step === 0 ? (firstName ? `Welcome, ${firstName}` : "Welcome") : null;

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <header className="flex items-center justify-between px-4 sm:px-8 h-14 border-b border-border">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || saving}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0 transition"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        <span className="text-xs text-muted-foreground tabular-nums">
          {Math.min(step + 1, total)} of {total}
        </span>
      </header>
      <div className="h-1 bg-secondary" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={saving ? total : step}>
        <div
          className="h-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${((saving ? total : step) / total) * 100}%` }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        {saving ? (
          <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
            <Loader2 className="size-8 animate-spin text-accent mb-4" />
            <p className="text-lg font-semibold">Setting up {courseTitle}…</p>
            <p className="text-sm text-muted-foreground mt-1">Just a moment.</p>
          </div>
        ) : (
          <div
            key={step}
            className={`w-full max-w-2xl animate-in fade-in duration-300 ${
              direction === "forward" ? "slide-in-from-right-6" : "slide-in-from-left-6"
            }`}
          >
            {greeting && <p className="mb-2 text-sm font-medium text-accent">{greeting} 👋</p>}
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance outline-none"
            >
              {question.title}
            </h1>
            {question.subtitle && <p className="mt-2 text-muted-foreground">{question.subtitle}</p>}

            <div
              role="radiogroup"
              aria-label={question.title}
              className={`mt-8 grid gap-3 ${question.columns === 2 ? "sm:grid-cols-2" : ""}`}
            >
              {question.choices.map((choice, i) => {
                const Icon = ICONS[choice.icon] ?? Sparkles;
                const isSelected = (picked ?? selected) === choice.value;
                return (
                  <button
                    key={choice.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => choose(choice)}
                    style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
                    className={`group animate-in fade-in slide-in-from-bottom-2 duration-300 flex items-center gap-4 rounded-xl border p-4 text-left transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-accent ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border bg-card hover:border-accent/50 hover:bg-secondary/60 hover:-translate-y-0.5"
                    }`}
                  >
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        isSelected ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {isSelected ? <Check className="size-5" /> : <Icon className="size-5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug">{choice.label}</span>
                      {choice.hint && <span className="block text-sm text-muted-foreground">{choice.hint}</span>}
                    </span>
                    <kbd className="hidden sm:block text-xs text-muted-foreground/70 tabular-nums">{i + 1}</kbd>
                  </button>
                );
              })}
            </div>

            {otherOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitOther();
                }}
                className="mt-4 flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                <input
                  autoFocus
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  maxLength={60}
                  placeholder="Tell us in a few words"
                  aria-label="Your field"
                  className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={!otherText.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                >
                  Continue <ArrowRight className="size-4" />
                </button>
              </form>
            )}

            {failed && (
              <p role="alert" className="mt-6 rounded-lg border border-border bg-secondary/60 p-3 text-sm">
                We couldn&apos;t save that just now. Pick your answer again to retry.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
