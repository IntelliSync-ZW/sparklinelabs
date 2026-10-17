import { defineField, defineType, defineArrayMember } from "sanity";
import { CommentIcon, DocumentTextIcon, LinkIcon } from "@sanity/icons";
import { REVIEW_COMMENT, countReviewComments } from "../../lib/member-posts/review-comments";
import { ReviewCommentAnnotation } from "../components/review-comment-annotation";

export const postSchema = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Short description shown in cards",
      type: "text",
      rows: 3,
      validation: (r) => r.max(700),
    }),

    // ── Authors ───────────────────────────────────────────────────────────────
    defineField({
      name: "authors",
      title: "Authors",
      description:
        "Add one or more authors and specify their role on this article",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "articleAuthor",
          fields: [
            defineField({
              name: "author",
              title: "Author",
              type: "reference",
              to: [{ type: "author" }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: "articleRole",
              title: "Role on this Article",
              description:
                "e.g. Lead Author, Editor, Contributor, Photographer",
              type: "string",
              options: {
                list: [
                  { title: "Author", value: "lead_author" },
                  { title: "Co-author", value: "co_author" },
                  { title: "Editor", value: "editor" },
                  { title: "Contributor", value: "contributor" },
                  { title: "Photographer", value: "photographer" },
                  { title: "Illustrator", value: "illustrator" },
                  { title: "Researcher", value: "researcher" },
                ],
              },
            }),
          ],
          preview: {
            select: {
              name: "author.name",
              role: "articleRole",
              media: "author.avatar",
            },
            prepare({ name, role, media }) {
              const roleLabel: Record<string, string> = {
                lead_author: "Author",
                co_author: "Co-author",
                editor: "Editor",
                contributor: "Contributor",
                photographer: "Photographer",
                illustrator: "Illustrator",
                researcher: "Researcher",
              };
              return {
                title: name ?? "Unknown Author",
                subtitle: role ? (roleLabel[role] ?? role) : undefined,
                media,
              };
            },
          },
        }),
      ],
    }),

    // ── Body ──────────────────────────────────────────────────────────────────
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      // Review comments are notes to the author, never part of a published post
      validation: (r) =>
        r.custom((blocks) => {
          const n = countReviewComments(blocks);
          return n === 0
            ? true
            : `Remove the ${n} review comment${n === 1 ? "" : "s"} in the body before publishing.`;
        }),
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            annotations: [
              // Sanity's default link, restated because listing annotations replaces the defaults
              {
                name: "link",
                type: "object",
                title: "Link",
                icon: LinkIcon,
                fields: [
                  defineField({
                    name: "href",
                    title: "Link",
                    type: "url",
                    validation: (r) =>
                      r.uri({ scheme: ["http", "https", "tel", "mailto"], allowRelative: true }),
                  }),
                ],
              },
              // Inline review notes for authors (Sanity's own comments need a paid plan)
              {
                name: REVIEW_COMMENT,
                type: "object",
                title: "Review comment",
                icon: CommentIcon,
                components: { annotation: ReviewCommentAnnotation },
                fields: [
                  defineField({
                    name: "comment",
                    title: "Comment for the author",
                    type: "text",
                    rows: 3,
                    validation: (r) => r.required().max(2000),
                  }),
                ],
              },
            ],
          },
        }),
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
        { type: "stlTableBlock" },
      ],
    }),

    defineField({
      name: "resourceGroups",
      title: "Article Resource Groups",
      description:
        "Optional groups of downloadable files shown below the article body.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "articleResourceGroup",
          fields: [
            defineField({
              name: "heading",
              title: "Group Heading",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "resources",
              title: "Files",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "articleResource",
                  fields: [
                    defineField({
                      name: "title",
                      title: "Link Label",
                      type: "string",
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: "file",
                      title: "File",
                      type: "file",
                      validation: (r) => r.required(),
                    }),
                  ],
                  preview: {
                    select: { title: "title", media: "file" },
                  },
                }),
              ],
              validation: (r) => r.min(1),
            }),
          ],
          preview: {
            select: { title: "heading" },
          },
        }),
      ],
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      description: "Additional keyword tags for filtering",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time (minutes)",
      type: "number",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),

    // ── Author review (only shown on posts started from the author dashboard) ──
    defineField({
      name: "reviewStatus",
      title: "Author review status",
      description:
        "Set to “Changes requested” (with a note) to hand the post back to its author.",
      type: "string",
      hidden: ({ document }) => !document?.reviewStatus,
      options: {
        list: [
          { title: "Author is editing", value: "editing" },
          { title: "Submitted for review", value: "submitted" },
          { title: "Changes requested", value: "changes_requested" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "reviewNote",
      title: "Note to author",
      description:
        "General feedback. To comment on specific text, select it in the body and use the comment button.",
      type: "text",
      rows: 3,
      hidden: ({ document }) => !document?.reviewStatus,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
      hidden: ({ document }) => !document?.submittedAt,
    }),

    // ── Analytics (Studio-only, not projected in frontend queries) ────────────
    defineField({
      name: "viewCount",
      title: "View Count",
      description:
        "Automatically incremented by the website. Do not edit manually.",
      type: "number",
      initialValue: 0,
      readOnly: true,
      group: undefined,
      options: {},
    }),
  ],
  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Most Viewed",
      name: "viewCountDesc",
      by: [{ field: "viewCount", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "excerpt",
      media: "coverImage",
      views: "viewCount",
    },
    prepare(selection) {
      const { title, subtitle, media, views } = selection as {
        title: string;
        subtitle?: string;
        media?: string | boolean | number;
        views?: number;
      };
      const count = views ?? 0;
      return {
        title,
        subtitle: `👁 ${count} view${count === 1 ? "" : "s"}${subtitle ? ` · ${subtitle}` : ""}`,
        media,
      };
    },
  },
});
