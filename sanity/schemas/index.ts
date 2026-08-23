import { seoObject } from "./objects/seo";
import { authorSchema } from "./author";
import { categorySchema } from "./category";
import { productSchema } from "./product";
import { caseStudySchema } from "./caseStudy";
import { postSchema } from "./post";

export const schemaTypes = [
  // Reusable objects first
  seoObject,
  // Independent documents
  authorSchema,
  categorySchema,
  // Documents that reference others
  productSchema,
  caseStudySchema,
  postSchema,
];
