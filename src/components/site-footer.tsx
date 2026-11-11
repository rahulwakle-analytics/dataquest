import Link from "next/link";
import { Logo } from "@/components/logo";
import { tools } from "@/content/paths";
import { site } from "@/lib/site";

export function SiteFooter() {
  const social = site.social.filter((s) => s.href);
  const cols = [
    { title: "Learn", links: tools.map((t) => ({ label: t.name, href: `/paths/${t.slug}` })) },
    {
      title: "Platform",
      links: [
        { label: "Explore Data Analytics", href: "/explore" },
        { label: "Career Roadmap", href: "/roadmap" },
        { label: "Learning Paths", href: "/paths" },
        { label: "SQL Practice", href: "/practice" },
        { label: "Dataset Library", href: "/datasets" },
        { label: "Projects", href: "/projects" },
        { label: "Career Centre", href: "/career" },
        { label: "Pricing", href: "/pricing" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Start here",
      links: [
        { label: "First SQL lesson", href: "/paths/sql/select" },
        { label: "Excel formula practice", href: "/paths/excel/formulas-and-cell-references" },
        { label: "How it works", href: "/#how-it-works" },
        { label: "Featured challenges", href: "/#challenges" },
      ],
    },
  ];
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{site.tagline}</p>
          {social.length > 0 && (
            <ul className="flex flex-wrap gap-4 text-sm">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Excel, Power BI, Tableau and Python are trademarks of their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}
