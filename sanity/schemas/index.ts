import { seoObject } from "./objects/seo";
import { authorSchema } from "./author";
import { categorySchema } from "./category";
import { productSchema } from "./product";
import { caseStudySchema } from "./caseStudy";
import { postSchema } from "./post";
import { servicesPageSchema } from "./servicesPage";
import { legalPageSchema } from "./legalPage";
import { contactLeadSchema } from "./contactLead";

export const schemaTypes = [
  // Reusable objects first
  seoObject,
  // Independent documents
  authorSchema,
  categorySchema,
  servicesPageSchema,
  legalPageSchema,
  contactLeadSchema,
  // Documents that reference others
  productSchema,
  caseStudySchema,
  postSchema,
];
