export const site = {
  name: "DataQuest",
  tagline: "Learn. Practise. Prove Your Skills.",
  description:
    "Master Excel, SQL, Power BI and Python through practical challenges, real-world datasets and hands-on projects.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /**
   * Pro price is deliberately unset. Set it (for example "$12") once billing is
   * configured; until then the UI says pricing is announced at launch.
   */
  proPrice: null as string | null,
  /** Add real profile URLs here; links render only when a URL is present. */
  social: [
    { label: "YouTube", href: "" },
    { label: "LinkedIn", href: "" },
    { label: "X", href: "" },
    { label: "GitHub", href: "" },
  ],
  nav: [
    { label: "Explore", href: "/explore" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Learning Paths", href: "/paths" },
    { label: "Projects", href: "/projects" },
    { label: "Career", href: "/career" },
    { label: "Dashboard", href: "/dashboard" },
  ],
};
