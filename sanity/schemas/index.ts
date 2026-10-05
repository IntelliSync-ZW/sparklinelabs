import { seoObject } from "./objects/seo";
import { authorSchema } from "./author";
import { categorySchema } from "./category";
import { productSchema } from "./product";
import { caseStudySchema } from "./caseStudy";
import { postSchema } from "./post";
import { servicesPageSchema } from "./servicesPage";
import { legalPageSchema } from "./legalPage";
import { contactLeadSchema } from "./contactLead";
import { course } from "./course";
import { courseModule } from "./courseModule";
import { courseLesson } from "./courseLesson";
import { courseTask } from "./courseTask";
import { courseAssessment } from "./courseAssessment";
import { courseQuestion } from "./courseQuestion";
import { courseResource } from "./courseResource";
import { courseSource } from "./courseSource";
import { courseSession } from "./courseSession";

import { callout } from "./objects/callout";
import { promptBlock } from "./objects/promptBlock";
import { lessonTaskRef } from "./objects/lessonTaskRef";
import { assessmentQuestionRef } from "./objects/assessmentQuestionRef";

export const schemaTypes = [
  // Reusable objects first
  seoObject,
  callout,
  promptBlock,
  lessonTaskRef,
  assessmentQuestionRef,
  // Documents
  authorSchema,
  categorySchema,
  servicesPageSchema,
  legalPageSchema,
  contactLeadSchema,
  course,
  courseModule,
  courseLesson,
  courseTask,
  courseAssessment,
  courseQuestion,
  courseResource,
  courseSource,
  courseSession,
  productSchema,
  caseStudySchema,
  postSchema,
];
