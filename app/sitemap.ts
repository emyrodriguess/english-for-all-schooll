import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.isIndexable) {
    return [];
  }

  return [
    {
      url: siteConfig.siteUrl.toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
