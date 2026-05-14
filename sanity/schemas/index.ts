import { seoObject } from "./objects/seo";
import { categorySchema } from "./category";
import { productSchema } from "./product";
import { caseStudySchema } from "./caseStudy";
import { postSchema } from "./post";

export const schemaTypes = [
  // Reusable objects first
  seoObject,
  // Independent documents
  categorySchema,
  // Documents that reference others
  productSchema,
  caseStudySchema,
  postSchema,
];
