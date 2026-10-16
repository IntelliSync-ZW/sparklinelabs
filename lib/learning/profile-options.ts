// ---------------------------------------------------------------------------
// Learner profile: what we ask at onboarding and how answers are validated.
// Pure data (safe for server and client). The server re-validates every answer
// against these lists, so the client can never store arbitrary values.
// ---------------------------------------------------------------------------

export type Choice = { value: string; label: string; hint?: string; icon: string };

export type StageValue = "school" | "college" | "professional" | "business" | "exploring";
export type QuestionKey = "stage" | "level" | "field" | "aiExperience";

export type LearnerProfile = {
  stage: StageValue;
  /** School form / study year / years of experience, depending on the stage. */
  level?: string;
  /** Field of study or industry. */
  field?: string;
  /** Free text when the learner picked "Something else". */
  fieldOther?: string;
  aiExperience: string;
  completedAt: string;
};

export const STAGES: Choice[] = [
  { value: "school", label: "School student", hint: "Primary or secondary school", icon: "backpack" },
  { value: "college", label: "College or university", hint: "Diploma, degree or postgraduate", icon: "graduation" },
  { value: "professional", label: "Working professional", hint: "Employed, freelancing or self-employed", icon: "briefcase" },
  { value: "business", label: "Business owner", hint: "Running or starting a business", icon: "store" },
  { value: "exploring", label: "Just exploring", hint: "Curious, between things, or changing path", icon: "compass" },
];

const SCHOOL_LEVELS: Choice[] = [
  { value: "primary", label: "Grade 5–7", hint: "Upper primary", icon: "sprout" },
  { value: "form-1-2", label: "Form 1–2", hint: "Lower secondary", icon: "book" },
  { value: "o-level", label: "Form 3–4", hint: "O Level", icon: "pencil" },
  { value: "a-level", label: "Form 5–6", hint: "A Level", icon: "flask" },
];

const COLLEGE_LEVELS: Choice[] = [
  { value: "certificate-diploma", label: "Certificate or diploma", icon: "scroll" },
  { value: "degree-early", label: "Degree, years 1–2", icon: "book" },
  { value: "degree-late", label: "Degree, year 3 and up", icon: "graduation" },
  { value: "postgraduate", label: "Postgraduate", hint: "Honours, Masters or PhD", icon: "microscope" },
];

const EXPERIENCE_LEVELS: Choice[] = [
  { value: "early", label: "Just starting out", hint: "0–2 years", icon: "sprout" },
  { value: "mid", label: "Established", hint: "3–9 years", icon: "trending" },
  { value: "senior", label: "Senior or leading teams", hint: "10+ years", icon: "crown" },
];

const STUDY_FIELDS: Choice[] = [
  { value: "computing", label: "Computing and IT", icon: "laptop" },
  { value: "engineering", label: "Engineering", icon: "wrench" },
  { value: "business", label: "Business and commerce", icon: "chart" },
  { value: "health", label: "Health sciences", icon: "heart" },
  { value: "education", label: "Education", icon: "chalkboard" },
  { value: "science", label: "Natural sciences", icon: "flask" },
  { value: "agriculture", label: "Agriculture", icon: "wheat" },
  { value: "law-humanities", label: "Law and humanities", icon: "scale" },
  { value: "arts-media", label: "Arts and media", icon: "palette" },
  { value: "other", label: "Something else", icon: "sparkles" },
];

const INDUSTRIES: Choice[] = [
  { value: "technology", label: "Technology and software", icon: "laptop" },
  { value: "finance", label: "Finance and accounting", icon: "chart" },
  { value: "sales-marketing", label: "Sales and marketing", icon: "megaphone" },
  { value: "education", label: "Education and training", icon: "chalkboard" },
  { value: "health", label: "Healthcare", icon: "heart" },
  { value: "real-estate", label: "Real estate and property", icon: "building" },
  { value: "engineering", label: "Engineering and construction", icon: "wrench" },
  { value: "agriculture", label: "Agriculture and mining", icon: "wheat" },
  { value: "government-ngo", label: "Government and NGOs", icon: "landmark" },
  { value: "legal", label: "Legal and compliance", icon: "scale" },
  { value: "media-creative", label: "Media and creative", icon: "palette" },
  { value: "retail-hospitality", label: "Retail and hospitality", icon: "store" },
  { value: "other", label: "Something else", icon: "sparkles" },
];

const AI_EXPERIENCE: Choice[] = [
  { value: "new", label: "Brand new to AI", hint: "I haven't really used it yet", icon: "sprout" },
  { value: "tried", label: "I've tried it a few times", hint: "ChatGPT, Gemini, Claude or similar", icon: "message" },
  { value: "regular", label: "I use it regularly", hint: "It's part of my week", icon: "zap" },
  { value: "advanced", label: "I build with it", hint: "Prompts, automations or code", icon: "cpu" },
];

export type Question = {
  key: QuestionKey;
  title: string;
  subtitle?: string;
  choices: Choice[];
  /** Two columns of choices is easier to scan than a long single list. */
  columns?: 1 | 2;
};

/**
 * The questions to ask, in order, given the answers so far. Later questions
 * depend on the stage, so the list is rebuilt after every answer.
 */
export function questionsFor(stage: StageValue | undefined): Question[] {
  const stageQ: Question = {
    key: "stage",
    title: "Which best describes you right now?",
    subtitle: "This helps us tailor examples and pace to where you are.",
    choices: STAGES,
  };
  const aiQ: Question = {
    key: "aiExperience",
    title: "How much have you used AI so far?",
    subtitle: "No wrong answer. We'll meet you where you are.",
    choices: AI_EXPERIENCE,
  };

  switch (stage) {
    case "school":
      return [
        stageQ,
        { key: "level", title: "Which level are you at?", choices: SCHOOL_LEVELS },
        aiQ,
      ];
    case "college":
      return [
        stageQ,
        { key: "level", title: "Where are you in your studies?", choices: COLLEGE_LEVELS },
        { key: "field", title: "What are you studying?", choices: STUDY_FIELDS, columns: 2 },
        aiQ,
      ];
    case "professional":
      return [
        stageQ,
        { key: "field", title: "Which field do you work in?", choices: INDUSTRIES, columns: 2 },
        { key: "level", title: "How long have you been at it?", choices: EXPERIENCE_LEVELS },
        aiQ,
      ];
    case "business":
      return [
        stageQ,
        { key: "field", title: "What industry is your business in?", choices: INDUSTRIES, columns: 2 },
        aiQ,
      ];
    case "exploring":
      return [stageQ, aiQ];
    default:
      return [stageQ];
  }
}

export type ProfileAnswers = Partial<Record<QuestionKey, string>> & { fieldOther?: string };

const MAX_OTHER = 60;

/** Returns a clean profile, or null if any answer is missing or not on the lists. */
export function validateProfile(input: unknown): Omit<LearnerProfile, "completedAt"> | null {
  if (!input || typeof input !== "object") return null;
  const answers = input as ProfileAnswers;
  const stage = answers.stage as StageValue | undefined;
  if (!stage || !STAGES.some((c) => c.value === stage)) return null;

  const clean: Omit<LearnerProfile, "completedAt"> = { stage, aiExperience: "" };
  for (const q of questionsFor(stage)) {
    const value = answers[q.key];
    if (typeof value !== "string" || !q.choices.some((c) => c.value === value)) return null;
    if (q.key === "level") clean.level = value;
    if (q.key === "field") clean.field = value;
    if (q.key === "aiExperience") clean.aiExperience = value;
  }

  if (clean.field === "other") {
    const other = typeof answers.fieldOther === "string" ? answers.fieldOther.trim().slice(0, MAX_OTHER) : "";
    if (!other) return null;
    clean.fieldOther = other;
  }
  return clean;
}
