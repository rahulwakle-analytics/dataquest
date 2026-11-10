import type { MetadataRoute } from "next";
import { flatTopics, tools } from "@/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["", "/paths", "/projects", "/pricing"].map((p) => ({ url: `${site.url}${p}`, priority: p ? 0.8 : 1 }));
  const toolPages = tools.map((t) => ({ url: `${site.url}/paths/${t.slug}`, priority: 0.9 }));
  // Only topics with a written lesson are listed; outline-only pages are noindex.
  const topicPages = tools.flatMap((t) =>
    flatTopics(t)
      .filter((x) => x.hasLesson)
      .map((x) => ({ url: `${site.url}/paths/${t.slug}/${x.slug}`, priority: 0.7 })),
  );
  return [...fixed, ...toolPages, ...topicPages];
}
