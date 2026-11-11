import type { MetadataRoute } from "next";
import { flatTopics, tools } from "@/content";
import { datasets } from "@/content/datasets";
import { sqlChallenges } from "@/content/sql-challenges";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ["", "/explore", "/roadmap", "/paths", "/practice", "/datasets", "/projects", "/career", "/pricing"].map((p) => ({ url: `${site.url}${p}`, priority: p ? 0.8 : 1 }));
  const toolPages = tools.map((t) => ({ url: `${site.url}/paths/${t.slug}`, priority: 0.9 }));
  // Only topics with a written lesson are listed; outline-only pages are noindex.
  const topicPages = tools.flatMap((t) =>
    flatTopics(t)
      .filter((x) => x.hasLesson)
      .map((x) => ({ url: `${site.url}/paths/${t.slug}/${x.slug}`, priority: 0.7 })),
  );
  const practicePages = sqlChallenges.map((c) => ({ url: `${site.url}/practice/sql/${c.slug}`, priority: 0.6 }));
  const datasetPages = datasets.map((d) => ({ url: `${site.url}/datasets/${d.slug}`, priority: 0.6 }));
  return [...practicePages, ...datasetPages, ...fixed, ...toolPages, ...topicPages];
}
