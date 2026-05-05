import { getRequestUrl } from "@tanstack/react-start/server";
import { buildExcerpt, stripHtml } from "./utils/text";

type SeoRecord = {
  bodyHtml?: string | null;
  coverImagePath?: string | null;
  excerpt?: string | null;
  ogImagePath?: string | null;
  seoDescription?: string | null;
  seoTitle?: string | null;
  title: string;
};

const DEFAULT_OG_IMAGE_PATH = "/home-crayon.png";

function resolveOrigin(origin?: string | null) {
  if (origin) {
    return origin;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  try {
    return getRequestUrl({
      xForwardedHost: true,
      xForwardedProto: true,
    }).origin;
  } catch {
    return process.env.SITE_URL || "http://localhost:3000";
  }
}

function getSiteUrl(pathname = "/", origin?: string | null) {
  const resolvedOrigin = resolveOrigin(origin);
  return new URL(pathname, resolvedOrigin).toString();
}

function resolveAbsoluteUrl(urlOrPath: string, origin?: string | null) {
  return getSiteUrl(urlOrPath, origin);
}

export function resolveSeoTitle(record: SeoRecord, suffix = "Bipul") {
  return record.seoTitle?.trim() || `${record.title} — ${suffix}`;
}

export function resolveSeoDescription(record: SeoRecord) {
  return (
    record.seoDescription?.trim() ||
    record.excerpt?.trim() ||
    buildExcerpt(record.bodyHtml || "", 180) ||
    record.title
  );
}

export function resolveOgImage(record: SeoRecord) {
  const value = record.ogImagePath?.trim() || record.coverImagePath?.trim() || null;

  if (!value) {
    return null;
  }

  return value;
}

export function baseMeta({
  description,
  pathname,
  title,
  ogImage,
  origin,
}: {
  description: string;
  ogImage?: string | null;
  origin?: string | null;
  pathname: string;
  title: string;
}): any {
  const canonical = getSiteUrl(pathname, origin);
  const absoluteOgImage = resolveAbsoluteUrl(
    ogImage || DEFAULT_OG_IMAGE_PATH,
    origin,
  );

  return {
    canonical,
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index,follow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      {
        name: "twitter:card",
        content: absoluteOgImage ? "summary_large_image" : "summary",
      },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(absoluteOgImage
        ? [
            { property: "og:image", content: absoluteOgImage },
            { name: "twitter:image", content: absoluteOgImage },
          ]
        : []),
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

export function blogJsonLd({
  coverImagePath,
  description,
  pathname,
  publishedAt,
  title,
}: {
  coverImagePath?: string | null;
  description: string;
  pathname: string;
  publishedAt?: string | null;
  title: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: getSiteUrl(pathname),
    datePublished: publishedAt ?? undefined,
    image: coverImagePath ? getSiteUrl(coverImagePath) : undefined,
    author: {
      "@type": "Person",
      name: "Bipul",
    },
  };
}

export function projectJsonLd({
  bodyHtml,
  liveUrl,
  pathname,
  repoUrl,
  title,
}: {
  bodyHtml: string;
  liveUrl?: string | null;
  pathname: string;
  repoUrl?: string | null;
  title: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: title,
    description: buildExcerpt(stripHtml(bodyHtml), 180),
    url: getSiteUrl(pathname),
    codeRepository: repoUrl || undefined,
    sameAs: liveUrl || undefined,
    author: {
      "@type": "Person",
      name: "Bipul",
    },
  };
}
