// ---------------------------------------------------------------------------
// Shared projection fragments
// ---------------------------------------------------------------------------

const seoProjection = `"seo": seo { title, description, "ogImage": ogImage.asset->url }`;

const heroImageProjection = `"heroImage": { "url": heroImage.asset->url, "alt": heroImage.alt }`;

// Author card — reused in posts and case studies
const authorCard = `
  "authors": authors[] {
    articleRole,
    "author": author-> {
      _id, name, slug, role, company,
      "avatar": { "url": avatar.asset->url, "alt": avatar.alt },
      socials,
      email,
      website
    }
  }
`.trim();

// Portable text blocks including resolved image assets and STL table data
const richText = (field: string) =>
  `"${field}": ${field}[] {
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{ _id, url, metadata }
    },
    _type == "stlTableBlock" => {
      ...,
      stlParsed,
      stlString
    }
  }`;

// Category card projection — reused in multiple queries
const categoryCard = `
  _id, title, slug, description, color,
  "image": { "url": image.asset->url, "alt": image.alt }
`.trim();

// Post card used in list views
const postCard = `
  title, slug, excerpt, publishedAt, readingTime,
  "category": category->{ title, slug, color, "image": { "url": image.asset->url, "alt": image.alt } },
  "coverImage": { "url": coverImage.asset->url, "alt": coverImage.alt },
  ${authorCard}
`;

// ---------------------------------------------------------------------------
// Services queries
// ---------------------------------------------------------------------------

export const servicesPageQuery = `
  *[_type == "servicesPage"][0] {
    h1,
    intro,
    services[] {
      stepNumber,
      title,
      description,
      "imageUrl": image.asset->url
    },
    ${seoProjection}
  }
`;

// ---------------------------------------------------------------------------
// Product queries
// ---------------------------------------------------------------------------

export const allProductsQuery = `
  *[_type == "product"] | order(order asc) {
    _id, name, slug, tagline, description, status, statusDate,
    href, features,
    "coverImage": coverImage.asset->url,
    "screenshot": screenshot.asset->url
  }`;

export const liveProductsQuery = `
  *[_type == "product" && status == "live"] | order(order asc) {
    _id, name, slug, tagline, description, status, statusDate,
    href, features,
    "screenshot": screenshot.asset->url
  }`;

export const inDevelopmentProductsQuery = `
  *[_type == "product" && status in ["private_beta", "in_design"]] | order(order asc) {
    _id, name, status, statusDate, description, tagline
  }`;

// ---------------------------------------------------------------------------
// Category queries
// ---------------------------------------------------------------------------

export const allCategoriesQuery = `
  *[_type == "category"] | order(title asc) {
    ${categoryCard},
    "postCount": count(*[_type == "post" && references(^._id)])
  }`;

// ---------------------------------------------------------------------------
// Author queries
// ---------------------------------------------------------------------------

export const allAuthorsQuery = `
  *[_type == "author"] | order(name asc) {
    _id, name, slug, role, company, bio,
    "avatar": { "url": avatar.asset->url, "alt": avatar.alt },
    email, website, socials,
    "postCount": count(*[_type == "post" && references(^._id)])
  }`;

export const allAuthorSlugsQuery = `
  *[_type == "author" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`;

export const authorBySlugQuery = `
  *[_type == "author" && slug.current == $slug][0] {
    _id, name, slug, role, company, bio,
    "avatar": { "url": avatar.asset->url, "alt": avatar.alt },
    email, website, socials,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      ${postCard}
    }
  }`;

// ---------------------------------------------------------------------------
// Case study queries
// ---------------------------------------------------------------------------

export const allCaseStudiesQuery = `
  *[_type == "caseStudy"] | order(publishedAt desc) {
    title, slug, summary, industry, clientName, publishedAt,
    ${heroImageProjection},
    productRef->{ name, href },
    ${authorCard}
  }`;

export const allCaseStudySlugsQuery = `
  *[_type == "caseStudy" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`;

export const caseStudyBySlugQuery = `
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id, title, slug, summary, headline, industry, clientName,
    publishedAt, readingTime, started, live, team,
    ${heroImageProjection},
    ${richText("body")},
    ${richText("problem")},
    ${richText("solution")},
    ${richText("outcomes")},
    ${richText("whatsNext")},
    "outcomeMetrics": outcomeMetrics[] { value, label },
    testimonialQuote, testimonialAuthor,
    productRef->{ name, slug, href },
    ${authorCard},
    ${seoProjection}
  }`;

// ---------------------------------------------------------------------------
// Post queries
// ---------------------------------------------------------------------------

export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    ${postCard}
  }`;

export const paginatedPostsQuery = `
  {
    "posts": *[_type == "post"] | order(publishedAt desc)[$start...$end] {
      ${postCard}
    },
    "total": count(*[_type == "post"])
  }
`;

export const latestPostsQuery = `
  *[_type == "post"] | order(publishedAt desc)[0...3] {
    ${postCard}
  }`;

/** Used by /blog/[category] — filters to one category */
export const postsByCategoryQuery = `
  *[_type == "post" && category->slug.current == $category] | order(publishedAt desc) {
    ${postCard}
  }`;

export const paginatedPostsByCategoryQuery = `
  {
    "posts": *[_type == "post" && category->slug.current == $category] | order(publishedAt desc)[$start...$end] {
      ${postCard}
    },
    "total": count(*[_type == "post" && category->slug.current == $category])
  }
`;

/** Static params for the new /blog/[category]/[slug] detail route */
export const allPostSlugsWithCategoryQuery = `
  *[_type == "post" && defined(slug.current) && defined(category)] {
    "slug": slug.current,
    "category": category->slug.current,
    _updatedAt
  }`;

/** Legacy redirect: minimal fetch to resolve category from slug only */
export const postCategoryBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current,
    "category": category->slug.current
  }`;

/** Also keep the old slug-only query for backward compat (used by legacy redirect page) */
export const allPostSlugsQuery = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, excerpt, publishedAt, updatedAt, tags, readingTime,
    "category": category->{ title, slug, color, "image": { "url": image.asset->url, "alt": image.alt } },
    "coverImage": { "url": coverImage.asset->url, "alt": coverImage.alt },
    ${richText("body")},
    ${authorCard},
    ${seoProjection}
  }`;
