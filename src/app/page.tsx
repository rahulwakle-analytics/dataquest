import Link from "next/link";
import { ArrowRight, BookOpen, Briefcase, Compass, Route, CheckCircle2, Code2, Database, FolderKanban, Gauge, ListChecks, Save, Sparkles, Table2 } from "lucide-react";
import { Faq } from "@/components/home/faq";
import { ProductPreview } from "@/components/home/product-preview";
import { PricingTable } from "@/components/pricing-table";
import { Section } from "@/components/section";
import { ToolIcon } from "@/components/tool-icon";
import { Badge, difficultyVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { featuredChallenges, toolStats, tools } from "@/content";
import { projects } from "@/content/projects";

const steps = [
  { icon: BookOpen, title: "Learn the concept", body: "Short lessons explain one idea at a time, with syntax, worked examples and the mistakes people usually make." },
  { icon: Code2, title: "Practise on a business problem", body: "Every topic ends with questions framed the way a manager would ask them, on a realistic retail database." },
  { icon: CheckCircle2, title: "Prove you understood", body: "Knowledge checks are validated on the spot. A topic counts as complete only when you get them right." },
];

const features = [
  { icon: ListChecks, title: "Structured learning paths", body: "Topics run from fundamentals to advanced in an order that builds on itself.", live: true },
  { icon: Sparkles, title: "Business scenarios in every lesson", body: "Each concept is tied to a question a real team would ask.", live: true },
  { icon: CheckCircle2, title: "Validated knowledge checks", body: "Answers are checked, not self-marked, and solutions stay hidden until you ask.", live: true },
  { icon: Save, title: "Progress that persists", body: "Completed topics are saved in your browser today, and to your account once sign-in launches.", live: true },
  { icon: Table2, title: "Interactive Excel practice", body: "Write formulas in a spreadsheet grid and sort and filter real tables. Answers are calculated and checked against test cases.", live: true },
  { icon: Database, title: "SQL practice engine", body: "Write queries in an editor and run them on DuckDB, a real SQL engine, in your browser. Answers are checked against test cases on two datasets.", live: true },
  { icon: FolderKanban, title: "Dataset library", body: "Eight sample datasets with column descriptions, previews and CSV downloads.", live: true },
  { icon: Gauge, title: "XP, streaks and leaderboards", body: "Earn XP for verified solutions and keep a daily streak going.", live: false },
  { icon: FolderKanban, title: "Guided projects with tracking", body: "Step-by-step projects with solution walkthroughs and milestone tracking.", live: false },
];

export default function HomePage() {
  const stats = tools.map((t) => ({ tool: t, ...toolStats(t) }));
  const sql = stats.find((s) => s.tool.slug === "sql")!;
  const excel = stats.find((s) => s.tool.slug === "excel")!;
  const totalLessons = stats.reduce((n, s) => n + s.lessons, 0);

  const faq = [
    {
      q: "Do I need an account to start?",
      a: "No. Lessons, practice exercises and knowledge checks are open, and your progress is saved in your browser and shown on your dashboard. Accounts, which will sync progress across devices, are in development.",
    },
    {
      q: "Is DataQuest free?",
      a: "Everything published today is free. A paid Pro plan is planned, but payments are not active and nothing can be purchased yet.",
    },
    {
      q: "Which tools can I learn?",
      a: `There are paths for Excel, SQL, Power BI, Python and Tableau. SQL has ${sql.lessons} of its ${sql.topics} topics written, and Excel has ${excel.lessons} of ${excel.topics}, including interactive spreadsheet exercises. Power BI, Python and Tableau each have a full topic outline and a first lesson. ${totalLessons} lessons are available in total.`,
    },
    {
      q: "How are my answers checked?",
      a: "Excel exercises are checked for real: your formula is calculated by DataQuest's own formula engine and compared with the expected results across several test cases, including after it is copied to other cells. Sort and filter exercises check the table you produce. Knowledge checks are validated as soon as you answer. SQL challenges run your query on DuckDB, a real SQL engine, in your browser and compare the result with the expected answer on two datasets. The practice questions inside SQL lessons still show hints and a model solution to compare against.",
    },
    {
      q: "Do I need to install anything?",
      a: "No. Excel exercises run on a built-in spreadsheet and SQL challenges run on a database engine inside your browser. The datasets can also be downloaded as CSV if you want to use your own tools.",
    },
    {
      q: "Who is DataQuest for?",
      a: "Students, job seekers and working professionals who want to get better at analysing data by doing it, not only by watching it done.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(60%_60%_at_50%_0%,rgb(var(--primary)/0.18),transparent_70%),radial-gradient(40%_40%_at_85%_10%,rgb(var(--violet)/0.14),transparent_70%)]"
        />
        <div className="container relative pb-12 pt-16 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="primary" className="mb-6">
              Learn. Practise. Prove Your Skills.
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
              Stop Watching Tutorials.{" "}
              <span className="bg-gradient-to-r from-primary to-violet bg-clip-text text-transparent">
                Start Solving Real Data Problems.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              Master Excel, SQL, Power BI and Python through practical challenges, real-world datasets and hands-on
              projects.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/paths/sql/select">
                  Start Practising Free <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link href="/paths">Explore Learning Paths</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted">No account needed to start.</p>
          </div>
          <div className="mx-auto mt-14 max-w-5xl">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* Career route */}
      <Section
        id="start"
        eyebrow="New to data analytics?"
        title="Learn the job, not just the tools"
        lead="DataQuest takes you from understanding what an analyst does to being ready for your first role."
      >
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            { href: "/explore", icon: Compass, step: "1. Explore", title: "Understand the profession", body: "What analysts do each day, the skills employers want, role types, career paths and salary ranges, with four worked workplace scenarios." },
            { href: "/roadmap", icon: Route, step: "2. Follow the roadmap", title: "Nine stages, in order", body: "Fundamentals, Excel, SQL, statistics, Power BI, Python, projects, interviews and job readiness, with your progress tracked." },
            { href: "/career", icon: Briefcase, step: "3. Get hired", title: "Career centre", body: "Resume, portfolio and LinkedIn checklists, an interview question bank, mock interviews and business case studies." },
          ].map((c) => (
            <li key={c.href}>
              <Link href={c.href} className="group block h-full focus-visible:outline-none">
                <Card className="flex h-full flex-col p-6 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <c.icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-sm font-medium text-primary">{c.step}</p>
                  <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.body}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      {/* Tools */}
      <Section id="tools" className="bg-surface/50" eyebrow="Learning paths" title="Five tools analysts are hired for" lead="Pick a path and work through it topic by topic.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map(({ tool, topics, lessons }) => (
            <Link key={tool.slug} href={`/paths/${tool.slug}`} className="group focus-visible:outline-none">
              <Card className="h-full p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                <ToolIcon tool={tool.slug} />
                <h3 className="mt-4 font-semibold">{tool.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{tool.tagline}</p>
                <p className="mt-4 text-xs text-muted">
                  {lessons} {lessons === 1 ? "lesson" : "lessons"}{topics > lessons ? ` · ${topics - lessons} more planned` : ""}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section id="how-it-works" eyebrow="How DataQuest works" title="Learn it, use it, prove it">
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Card className="h-full p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-muted">Step {i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      {/* Featured challenges */}
      <Section
        id="challenges"
        eyebrow="Featured challenges"
        title="Questions a manager would actually ask"
        lead="Each one opens in its lesson, with a hint and a model solution when you want them."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featuredChallenges.map((c) => (
            <Link key={c.href + c.title} href={c.href} className="group focus-visible:outline-none">
              <Card className="flex h-full flex-col p-5 transition-colors duration-200 group-hover:border-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="primary">
                    {c.tool.name} · {c.topic.title}
                  </Badge>
                  <Badge variant={difficultyVariant(c.difficulty)}>{c.difficulty}</Badge>
                </div>
                <h3 className="mt-4 font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.prompt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Try it <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section
        id="projects"
        eyebrow="Real-world projects"
        title="Briefs you can turn into portfolio pieces"
        lead="Each project starts from a business problem and ends with something you can show."
        className="bg-surface/50"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects#${p.slug}`} className="group focus-visible:outline-none">
              <Card className="flex h-full flex-col p-5 transition-colors duration-200 group-hover:border-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-primary">
                <div className="flex flex-wrap gap-2">
                  {p.tools.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.problem}</p>
                <span className="mt-4 text-sm text-muted">{p.tasks.length} tasks · {p.deliverables.length} deliverables</span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section id="features" eyebrow="Platform" title="Built for practice, not passive watching" lead="What works today, and what is being built next.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-violet/10 text-violet">
                  <f.icon className="size-5" aria-hidden="true" />
                </span>
                <Badge variant={f.live ? "success" : "neutral"}>{f.live ? "Available now" : "In development"}</Badge>
              </div>
              <h3 className="mt-5 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing" eyebrow="Pricing" title="Start free. Upgrade when Pro launches." className="bg-surface/50">
        <PricingTable />
      </Section>

      {/* FAQ */}
      <Section id="faq" eyebrow="FAQ" title="Questions, answered plainly">
        <Faq items={faq} />
      </Section>

      {/* Closing CTA */}
      <section className="pb-24">
        <div className="container">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-violet/15 p-10 text-center sm:p-14">
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">Your first query is one click away</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">Open the first SQL lesson and answer its knowledge checks. It takes about ten minutes.</p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/paths/sql/select">
                Start Practising Free <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
