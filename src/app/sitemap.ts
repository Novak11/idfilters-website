import type { MetadataRoute } from "next";

import { getAllPages } from "@/content/site";

const siteUrl = process.env.SITE_URL ?? "https://www.idfilters.rs";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return getAllPages().map((p) => ({
    url: `${siteUrl}${p.path}`,
    lastModified: now,
  }));
}

