export type Difficulty = "Easy" | "Medium" | "Hard";
export const XP: Record<Difficulty, number> = { Easy: 10, Medium: 15, Hard: 20 };

export type Category = "Data Modelling" | "Relationships" | "DAX" | "Measures vs Columns" | "KPI Calculation" | "Dashboard Design" | "Report Interpretation";

export type PowerBiExercise = {
  slug: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  /** The business situation, including any numbers needed to answer. */
  scenario: string;
  prompt: string;
  options: string[];
  /** Index into options. */
  answer: number;
  explanation: string;
};

export const challengeId = (slug: string) => `practice-powerbi/${slug}`;

export const powerbiExercises: PowerBiExercise[] = [
  {
    slug: "star-schema-basics",
    title: "Choosing a model shape",
    category: "Data Modelling",
    difficulty: "Easy",
    scenario: "You're modelling Sales alongside Products, Customers and a Date table so reports can filter and slice freely.",
    prompt: "Which model shape lets filters flow correctly from small lookup tables into a large Sales fact table?",
    options: [
      "A star schema: one fact table connected to several dimension tables",
      "One snowflake where Sales sits in the centre and everything links through it twice",
      "A single flat table joining everything together in Power Query first",
      "Several small fact tables, one per report page",
    ],
    answer: 0,
    explanation: "A star schema — a fact table surrounded by dimension tables like Products, Customers and Date — is the standard Power BI shape. It keeps relationships simple and filters flow one way, from dimension to fact.",
  },
  {
    slug: "fact-vs-dimension",
    title: "Spotting the fact table",
    category: "Data Modelling",
    difficulty: "Easy",
    scenario: "One table lists every transaction with an amount and a date. Another lists each store with its region and manager.",
    prompt: "Which one is the fact table?",
    options: ["The transactions table", "The store table", "Both are fact tables", "Neither — they need a third table"],
    answer: 0,
    explanation: "Fact tables hold the events you measure (transactions, with numbers like amount). Dimension tables, like the store table, describe things you filter and group by.",
  },
  {
    slug: "orders-customers-relationship",
    title: "Linking orders to customers",
    category: "Relationships",
    difficulty: "Easy",
    scenario: "Orders (order_id, customer_id, amount) needs to connect to Customers (customer_id, name).",
    prompt: "What relationship should connect them?",
    options: [
      "One customer to many orders (1:*), joined on customer_id",
      "Many orders to many customers, joined on order_id",
      "One to one, joined on amount",
      "No relationship is needed — just use both tables separately",
    ],
    answer: 0,
    explanation: "Each customer can place many orders, but each order belongs to one customer — a one-to-many relationship on the shared key, customer_id.",
  },
  {
    slug: "many-to-many-bridge",
    title: "Products and promotions",
    category: "Relationships",
    difficulty: "Medium",
    scenario: "A product can appear in many promotions, and a promotion can include many products.",
    prompt: "What does this many-to-many situation need in the model?",
    options: [
      "A bridge (junction) table connecting Products and Promotions",
      "A direct many-to-many relationship with no extra table",
      "Copying all promotion details into the product table",
      "Nothing — Power BI resolves this automatically with no changes",
    ],
    answer: 0,
    explanation: "A bridge table with one row per product-promotion pairing turns the tricky many-to-many into two clean one-to-many relationships, which filter and aggregate correctly.",
  },
  {
    slug: "dax-total-sales-measure",
    title: "A measure that recalculates",
    category: "DAX",
    difficulty: "Easy",
    scenario: "You want a Total Sales figure that updates correctly as a user filters by region or date on the report.",
    prompt: "Which approach is closest to how this should actually work in Power BI?",
    options: [
      "A measure: Total Sales = SUM(Sales[Amount])",
      "Sales[Amount] + 1",
      "A calculated column that squares Sales[Amount]",
      "A static number typed directly into a card visual",
    ],
    answer: 0,
    explanation: "A measure written with SUM recalculates in whatever filter context the report applies — by region, by date, or both at once. A calculated column or a typed number would not respond to filters.",
  },
  {
    slug: "dax-time-intelligence",
    title: "Comparing to last year",
    category: "DAX",
    difficulty: "Medium",
    scenario: "You need to compare this year's sales with the same period last year, for a growth chart.",
    prompt: "Which DAX tool is built for this?",
    options: ["Time intelligence functions, like SAMEPERIODLASTYEAR", "VLOOKUP", "IF, used on its own", "CONCATENATE"],
    answer: 0,
    explanation: "DAX's time intelligence functions (SAMEPERIODLASTYEAR, DATEADD and similar) are built specifically to shift a date filter back a period, which is exactly what a year-over-year comparison needs.",
  },
  {
    slug: "measure-or-column-running-total",
    title: "A total that responds to slicers",
    category: "Measures vs Columns",
    difficulty: "Medium",
    scenario: "You want a Total Sales figure on a card visual that updates as users change slicers on region and date.",
    prompt: "Should this be a measure or a calculated column?",
    options: ["A measure", "A calculated column", "Either works identically", "Neither — this needs Power Query"],
    answer: 0,
    explanation: "Measures are calculated at query time, in the current filter context, so they respond to slicers. A calculated column is computed once per row when the data loads and would not update with slicers.",
  },
  {
    slug: "measure-or-column-vip-flag",
    title: "A fixed VIP label",
    category: "Measures vs Columns",
    difficulty: "Medium",
    scenario: "You want to label each customer as \"VIP\" or \"Regular\" once, so you can filter and group by it on a visual's axis.",
    prompt: "Should this be a measure or a calculated column?",
    options: ["A calculated column", "A measure", "Power Query only, nothing in the model", "It cannot be done in Power BI"],
    answer: 0,
    explanation: "This needs one fixed value per customer row that can sit on an axis or in a slicer — that's what a calculated column is for. Measures return a single aggregated number, not a per-row label.",
  },
  {
    slug: "kpi-growth-rate",
    title: "Month-over-month growth",
    category: "KPI Calculation",
    difficulty: "Easy",
    scenario: "Last month's revenue was $350,000. This month's revenue is $420,000.",
    prompt: "What is the month-over-month growth rate?",
    options: ["20%", "16.7%", "120%", "83%"],
    answer: 0,
    explanation: "Growth rate = (420,000 − 350,000) ÷ 350,000 = 70,000 ÷ 350,000 = 20%.",
  },
  {
    slug: "kpi-service-level",
    title: "Call centre service level",
    category: "KPI Calculation",
    difficulty: "Medium",
    scenario: "Target: 95% of calls answered within 30 seconds. Out of 2,000 calls this week, 1,870 were answered within 30 seconds.",
    prompt: "What is the actual service level, and does it meet target?",
    options: ["93.5%, below target", "95%, meets target exactly", "98.5%, exceeds target", "90%, below target"],
    answer: 0,
    explanation: "1,870 ÷ 2,000 = 93.5%, which is below the 95% target.",
  },
  {
    slug: "dashboard-executive-layout",
    title: "An executive at-a-glance view",
    category: "Dashboard Design",
    difficulty: "Medium",
    scenario: "An executive dashboard needs to show, in a few seconds, whether the business is on track.",
    prompt: "Which layout choice best supports that goal?",
    options: [
      "A handful of KPI cards with trend indicators at the top, with supporting detail below",
      "Twenty same-sized charts with no visual hierarchy",
      "One large table of raw transactions",
      "Only pie charts, for every metric on the page",
    ],
    answer: 0,
    explanation: "Executive dashboards work best with a small number of headline KPIs, sized and placed to draw the eye first, with detail available below for anyone who wants to dig in.",
  },
  {
    slug: "dashboard-slicers",
    title: "Reducing repeat requests",
    category: "Dashboard Design",
    difficulty: "Easy",
    scenario: "Users keep asking for the same revenue breakdown, just sliced by a different region, product or month each time.",
    prompt: "What should the report include to reduce these repeated requests?",
    options: [
      "Slicers for region, product and date that filter the existing visuals",
      "A separate static report for every possible combination",
      "Exporting to Excel and letting each user build their own view",
      "Removing the breakdown from the report entirely",
    ],
    answer: 0,
    explanation: "Slicers let users answer their own \"what about region X\" questions on the same report, instead of filing a new request each time.",
  },
  {
    slug: "report-underperforming-region",
    title: "Reading a regional breakdown",
    category: "Report Interpretation",
    difficulty: "Easy",
    scenario: "A report shows quarterly revenue by region: North $120k, South $95k, East $140k, West $80k.",
    prompt: "Which region most needs closer attention for underperformance?",
    options: ["West, at $80k — the lowest of the four", "East, at $140k — the highest", "North, at $120k", "South, at $95k"],
    answer: 0,
    explanation: "West has the lowest revenue of the four regions, which is the one worth investigating first.",
  },
  {
    slug: "report-monthly-trend-drop",
    title: "Reading a revenue trend",
    category: "Report Interpretation",
    difficulty: "Medium",
    scenario: "A line chart shows monthly revenue: January $100k, February $110k, March $90k, April $95k.",
    prompt: "What happened between February and March?",
    options: ["Revenue dropped by about 18%", "Revenue grew steadily", "Revenue stayed flat", "Revenue roughly doubled"],
    answer: 0,
    explanation: "(90,000 − 110,000) ÷ 110,000 ≈ −18%. February to March was the one clear drop in the series.",
  },
];
