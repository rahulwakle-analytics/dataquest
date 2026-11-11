export function PageHeader({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">{lead}</p>
    </header>
  );
}

export function SectionNav({ label, links }: { label: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={label} className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}

export function Block({ id, title, lead, children }: { id: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-border py-12 first:border-t-0">
      <h2 id={`${id}-h`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {lead && <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-muted">{lead}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
