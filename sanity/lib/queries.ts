// ---------------------------------------------------------------------------
// Shared projection fragments
// ---------------------------------------------------------------------------

const seoProjection = `"seo": seo { title, description, "ogImage": ogImage.asset->url }`;

const heroImageProjection = `"heroImage": { "url": heroImage.asset->url, "alt": heroImage.alt }`;

// Portable text blocks including resolved image assets
const richText = (field: string) =>
  `"${field}": ${field}[] {
    ...,
    _type == "image" => {
      ...,
      "asset": asset->{ _id, url, metadata }
    }
  }`;

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
// Case study queries
// ---------------------------------------------------------------------------

export const allCaseStudiesQuery = `
  *[_type == "caseStudy"] | order(publishedAt desc) {
    title, slug, summary, industry, clientName, publishedAt,
    ${heroImageProjection},
    productRef->{ name, href }
  }`;

export const allCaseStudySlugsQuery = `
  *[_type == "caseStudy" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`;

export const caseStudyBySlugQuery = `
  *[_type == "caseStudy" && slug.current == $slug][0] {
    _id, title, slug, summary, headline, industry, clientName,
    publishedAt, readingTime, team, started, live,
    ${heroImageProjection},
    ${richText("problem")},
    ${richText("solution")},
    ${richText("outcomes")},
    ${richText("whatsNext")},
    "outcomeMetrics": outcomeMetrics[] { value, label },
    testimonialQuote, testimonialAuthor,
    productRef->{ name, slug, href },
    ${seoProjection}
  }`;

// ---------------------------------------------------------------------------
// Post queries
// ---------------------------------------------------------------------------

const postCard = `
  title, slug, excerpt, publishedAt, readingTime,
  "category": category->{ title, slug, color },
  "coverImage": coverImage.asset->url
`;

export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    ${postCard}
  }`;

export const latestPostsQuery = `
  *[_type == "post"] | order(publishedAt desc)[0...3] {
    ${postCard}
  }`;

export const allPostSlugsQuery = `
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, excerpt, author, publishedAt, updatedAt, tags, readingTime,
    "category": category->{ title, slug, color },
    "coverImage": { "url": coverImage.asset->url, "alt": coverImage.alt },
    ${richText("body")},
    ${seoProjection}
  }`;
