import type { ContentItem } from "@/components/learn/blocks/types";
import type { PublicCheck } from "@/components/learn/assessments/knowledge-check";
import type { PublicTaskSlot } from "@/components/learn/tasks/types";

export type SectionContent = ContentItem[];

export type LessonSectionData = {
  _key: string;
  title: string;
  sectionId?: string | null;
  estimatedMinutes?: number | null;
  content?: SectionContent | null;
  practice?: PublicTaskSlot | null;
  check?: PublicCheck | null;
};

export type LessonResource = {
  _id: string;
  title: string;
  resourceType?: string | null;
  description?: string | null;
  url?: string | null;
  fileUrl?: string | null;
};

export type LessonSource = {
  _id: string;
  title: string;
  publisher?: string | null;
  url: string;
  publishedDate?: string | null;
};

export type LessonViewData = {
  _id: string;
  title: string;
  summary?: string | null;
  lessonType?: string | null;
  duration?: { value?: number; unit?: string } | null;
  learningOutcomes?: string[] | null;
  keyTakeaways?: string[] | null;
  videoUrl?: string | null;
  image?: { url?: string | null; alt?: string | null; caption?: string | null } | null;
  sections: LessonSectionData[];
  project?: PublicTaskSlot | null;
  resources?: LessonResource[] | null;
  sources?: LessonSource[] | null;
};

export type LessonLink = { href: string; title: string };
