export const allProductsQuery = `*[_type == "product"] | order(order asc) {
  _id, name, slug, tagline, description, status, statusDate,
  href, features, "coverImage": coverImage.asset->url,
  "screenshot": screenshot.asset->url
}`;

export const liveProductsQuery = `*[_type == "product" && status == "live"] | order(order asc) {
  _id, name, slug, tagline, description, status, statusDate,
  href, features, "screenshot": screenshot.asset->url
}`;

export const inDevelopmentProductsQuery = `*[_type == "product" && status in ["private_beta", "in_design"]] | order(order asc) {
  _id, name, status, statusDate, description, tagline
}`;

export const caseStudyBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0] {
  ..., "heroImage": heroImage.asset->url, productRef->{name, slug, href}
}`;

export const allCaseStudiesQuery = `*[_type == "caseStudy"] | order(publishedAt desc) {
  title, slug, industry, clientName, "heroImage": heroImage.asset->url,
  publishedAt, productRef->{name, href}
}`;

export const allPostSlugsQuery = `*[_type == "post" && defined(slug.current)] {
  "slug": slug.current, _updatedAt
}`;

export const allCaseStudySlugsQuery = `*[_type == "caseStudy" && defined(slug.current)] {
  "slug": slug.current, _updatedAt
}`;

export const latestPostsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3] {
  title, slug, excerpt, publishedAt, "coverImage": coverImage.asset->url
}`;

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  ..., "ogImage": seo.ogImage.asset->url
}`;
